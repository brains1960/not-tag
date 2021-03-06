import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Button, TouchableOpacity, TextInput, ListView, RefreshControl,
Image } from 'react-native';
import { Location, MapView } from 'expo';
import StackNavigator from '../App.js'
import hostIP from '../backend'
import BackgroundTimer from 'react-native-background-timer';

class MainGameScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      game: {},
      roomZombies : [],
      roomHumans: [],
      players:[],
      currUser: {},
      dataSource: [],
      nearby: [],
      refreshing: false,
      timer: null,
    }

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

  }

  componentDidMount() {
    this.location = setInterval(() => this.updateLocation(), 30000);
    AsyncStorage.getItem('login')
    .then(parsedLogin => {
      //Get the information for the logged in player
      let player = JSON.parse(parsedLogin)
      fetch(hostIP+'/player/'+player.id)
      .then(resp => resp.json())
      .then(fetched => {
        this.setState({currUser: fetched})
      })
      AsyncStorage.getItem('room')
      .then(result => {
        let game = JSON.parse(result);
        game.time = game.time*3600
        if (!game.state) {
          this.props.navigation.navigate('GameRoom');
        }
        //If in a room
        if (Object.keys(game).length > 0) {
          this.setState({game: game});
          //Sort players into zombies n humans
          this.sortPlayers(game.players)

        } else {
          this.props.navigation.navigate("CreateGame")
        }
        let timer = setInterval(() => {
          let game = this.state.game
          if(game.time === 0) {
            BackgroundTimer.stopBackgroundTimer();
          } else {
            game.time = game.time - 1
            this.setState({game: game})
          }}, 1000);
        this.setState({timer});
      })
      .catch(err => {
        console.log('mainGame.js:69 -', err)
      })
    })
    .catch(err => {
      console.log('mainGame.js:73 -', err)
    })
  }

  componentWillUnMount() {
    clearInterval(this.location);
  }

  sortPlayers(players){
    let zPlayers = []
    players.map((item) =>  {
      fetch(hostIP+'/player/'+item.id)
      .then(resp => resp.json())
      .then(player => {
        if (player.zombie) {
          zPlayers = this.state.roomZombies.slice()
          zPlayers.push(player)
          this.setState({roomZombies: zPlayers})
        } else {
          zPlayers = this.state.roomHumans.slice()
          zPlayers.push(player)
          this.setState({roomHumans: zPlayers}, () => this.nearbyPlayers(this.state.roomHumans))
        }
      })
      .catch(err => {
        console.log('mainGame.js:95 -', err)
      })
    });
  }

  distanceCalc(lat1, lon1, lat2, lon2){
    let dlon = (lon2 - lon1) * (Math.PI / 180)
    let dlat = (lat2 - lat1) * (Math.PI / 180)
    lat1 = lat1 * (Math.PI / 180)
    lat2 = lat2 * (Math.PI / 180)
    let a = (Math.sin(dlat/2))^2 + Math.cos(lat1) * Math.cos(lat2) * (Math.sin(dlon/2))^2
    let c = 2 * Math.atan(Math.sqrt(a), Math.sqrt(1-a) )
    let R = 6373000
    let d = R * c
    console.log('Distant', d/1000)
    return d/1000
  }

  nearbyPlayers(players) {
    let currUser = this.state.currUser;
    let nearby = players.filter(player => {
      return this.distanceCalc(Number(currUser.latitude), Number(currUser.longitude), Number(player.latitude), Number(player.longitude)) < 100000
    });
    this.setState({nearby});
  }


  getPlayerDetails(id){
    fetch(hostIP+'/player/'+id)
    .then(playerDetails => {
      return playerDetails;
    })
    .catch(err => {
      console.log('Main Game, get player details',err.message)
    })
  }

  bite(player) {
    AsyncStorage.setItem('bitten', JSON.stringify({
      "player" : player,
    }))
    .then(this.props.navigation.navigate('Hunt'));
  }

  updateLocation = async () => {
    console.log('Update positions');
    let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
    fetch(hostIP+'/player/location/'+this.state.currUser.id, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      })
    })
    .catch(err => console.log('MainGame 147 - ', err));
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.sortPlayers(this.state.players)
    this.setState({refreshing: false});
  }

  render(){
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    let dataSource = ds.cloneWithRows(this.state.nearby);
    const display = () => {

      if(this.state.currUser.zombie) {
        return (
                <View enableEmptySections={true}>
                  <Text style={styles.h3}>You're a Zombie</Text>
                  <Text style={styles.h4}>Nearby Snacks:</Text>
                  <ListView
                    style={{ display: 'flex' }}
                    enableEmptySections={true}
                    renderRow={(item) => {
                      return (
                        <TouchableOpacity style={{marginTop: 30, padding: 30, flex: 1 }} onPress={() => this.bite(item)}>
                          <Image
                            style={{ width: 70, height: 70, borderRadius: 10 }}
                            source={{uri: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_640.png' }}
                          />
                          <Text style={{fontSize: 24}}>{item.name}</Text>
                        </TouchableOpacity>
                      )
                    }}
                    dataSource={dataSource}
                    refreshControl={
                        <RefreshControl
                          refreshing={this.state.refreshing}
                          onRefresh={this._onRefresh}
                        />
                      }/>
                  </View>)
      } else {
        return (<View enableEmptySections={true}><Text style={styles.h3}>You're Still Human....for now</Text>
                <Text style={styles.h4}>Human's Left: {this.state.roomHumans.length}</Text>
                <Text style={styles.h4}>Total Players: {this.state.roomHumans.length + this.state.roomZombies.length}</Text>
                <TouchableOpacity style={{width: 1000, height:100}} onPress={() => this.fakeDying()}></TouchableOpacity></View>)
      }
    }


    return (
      <View style={styles.gameStats} enableEmptySections={true}>
        <Text style={styles.h2}>GameRoom: {this.state.game.name}</Text>
        <Text style={styles.h4}>Game Time Left: {Math.floor(this.state.game.time/3600)}:{Math.floor((this.state.game.time%3600)/60)}:{this.state.game.time%60}</Text>
        {display()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameStats: {
    flex: 1,
    backgroundColor: '#fff',
  paddingLeft: 60,
    justifyContent: 'center',
  },
  textInput: {
    width: 250,
    padding: 5,

  },
  button: {
    padding: 40,
  },
  error: {
    textAlign: 'center',
    color: 'red',
    fontSize: 40,
  },
  h2:  {
    fontSize: 60,
    fontWeight: 'bold',
  },
  h3: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  h4: {
    fontSize: 30,
    fontWeight: 'bold',
  }

});

export default MainGameScreen;
