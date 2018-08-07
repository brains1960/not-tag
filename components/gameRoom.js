import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Button, TouchableOpacity, TextInput, ListView, RefreshControl, Modal } from 'react-native';
import { MapView } from 'expo';
import StackNavigator from '../App.js'
import GameTransition from './gameTransition'
import hostIP from '../backend'
// import Communications from 'react-native-communications';
// import SendSMS from 'react-native-sms'
// import SmsAndroid from 'react-native-sms-android';


class GameRoomScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      players : [],
      name: '',
      currUser: {},
      roomError: '',
      refreshing: false,
      inviteVisible: false,
      invited: '',
      invitationName: '',
      password: '',
      id: '',

    }
  }

  componentDidMount() {

    //Get the information for the logged in player
    AsyncStorage.getItem('login')
    .then(parsedLogin => {
      // console.log('gameroom mount',parsedLogin)
      let player = JSON.parse(parsedLogin)
      //If there is a logged in player
      if (player && Object.keys(player).length > 0) {
        this.setState({currUser: player})
      } else {
        //If no logged in player head back to login
        this.props.navigation.navigate('Login')
      }

      //Get Information about current room
      AsyncStorage.getItem('room')
      .then(room => {
        let game = JSON.parse(room)
        //If there is a game the user belongs to
        // console.log('game', game)
        if(game && game.state === false) {
          fetch(hostIP+'/game/'+game.id)
          .then(resp => resp.json())
          .then(fetchedGame => {
            this.setState({players: fetchedGame.players,
                          name: fetchedGame.gameName,
                          password: fetchedGame.password,
                          id: fetchedGame._id})
            AsyncStorage.mergeItem('room', JSON.stringify({
              "time" : fetchedGame.time,
              "players" : fetchedGame.players,
              "state" : fetchedGame.state,
            }))
          })
        } else {
          if (game.state === true){
          //If the game has already started go to the main game page
          this.props.navigation.navigate('MainGame');
        } else {
          //Send the player to join or create a game
          this.props.navigation.navigate('CreateGame')
        }}
      })
      .catch(err => console.log('gameRoom.js:49 - ',err));
    })
    .catch(err => {
      console.log('gameRoom.js:52 - ', err)
      this.setState({roomError: err.message});
    })
  }

  getPlayer(id){
    // console.log('gameroom getplayer', id)
    fetch(hostIP+'/player/'+id)
    .then(result => result.json())
    .then(playerDetails => playerDetails)
  }


  invite() {
    //Send data from form
    // Communications.text(this.state.invited,
      // 'Hey You have been invited to play a Game of Humans vs zombies by '+this.state.invitationName+
      // '.\nJoin the game with the below details: \nGame Name: '+
      // this.state.name+'\n Password :'+this.state.password

    //React Native SMS
    // SendSMS.send({
  	// 	body: 'Hey You have been invited to play a Game of Humans vs zombies by '+this.state.invitationName+
    //   '.\nJoin the game with the below details: \nGame Name: '+
    //   this.state.name+'\n Password :'+this.state.password,
  	// 	recipients: [this.state.invited],
  	// 	successTypes: ['sent', 'queued', 'failed']
  	// }, (completed, cancelled, error) => {
    //
  	// 	console.log('SMS Callback: completed: ' + completed + ' cancelled: ' + cancelled + 'error: ' + error);
    //
  	// })
    // .catch(err => console.log('SMS erro', err));

    let iname = this.state.invitationName
    let gname = this.state.name
    let pass = this.state.password

    // //Twilio
    // fetch(hostIP+'/invite', {
    //   method: 'POST',
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({
    //     body: 'Hey You have been invited to play a Game of Humans vs zombies by '+iname+
    //     '.\nJoin the game with the details below: \nGame Name: '+
    //     gname+'\n Password :'+pass,
    //     to: this.state.invited,
    //   })
    // })
    // .then(resp => resp.json())
    // .catch(err => console.log(err))

    //SMS android
    // SmsAndroid.sms(
    //   this.state.invited, // phone number to send sms to
    //   'Hey You have been invited to play a Game of Humans vs zombies by '+iname+
    //   '.\nJoin the game with the details below: \nGame Name: '+
    //   gname+'\n Password :'+pass, // sms body
    //   'sendDirect', // sendDirect or sendIndirect
    //   (err, message) => {
    //     if (err){
    //       console.log("error");
    //     } else {
    //       console.log(message); // callback message
    //     }
    //   }
    // );

      this.setState({inviteVisible : false})

  }

  fetchData(){
    AsyncStorage.getItem('room')
    .then(room => {
      let game = JSON.parse(room);
      fetch(hostIP+'/game/'+game.id)
      .then(resp => resp.json())
      .then(fetchedGame => {
        this.setState({players: fetchedGame.players,
                      name: fetchedGame.gameName,
                      password: fetchedGame.password,
                      id: fetchedGame._id})
        AsyncStorage.mergeItem('room', JSON.stringify({
          "time" : fetchedGame.time,
          "players" : fetchedGame.players,
          "state" : fetchedGame.state,
        }))
      })
    })
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.fetchData()
    this.setState({refreshing: false});
  }

  startGame(){
    //If there's up to two players
    if(this.state.players.length > 1) {
      //Select one player Randomly to be a zombie
      let zombie = this.state.players[Math.floor(Math.random() * this.state.players.length)]

      //Backend to update players status to zombie
      fetch(hostIP+'/player/zombify',{
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: zombie.id
        })
      })
      .then(result => result.json())
      .then(player => {
        // Check if logged in user is the selected Zombie
        fetch(hostIP+'/game/start/'+this.state.id)
        .then(resp => resp.json())
        .then(room => {
          AsyncStorage.mergeItem('room', JSON.stringify({
            "state" : room.state,
          }))
        })
        .catch(err => console.log('Game Start', err))
        if (zombie.id === this.state.currUser._id) {
          //Set user to zombie
          AsyncStorage.mergeItem('login',JSON.stringify({
            "zombie" : player.zombie,
          }))
          //On successful save go to transition
          .then(this.props.navigation.navigate('GameTransition'))
        } else {
          this.props.navigation.navigate('GameTransition')
        }

      })
      .catch(err => {
        console.log('gameRoom.js:121 - ' ,err)
      })
    } else {
      this.setState({roomError:'You need at least two players to start a game'})
    }
  }

  render(){

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    let dataSource = ds.cloneWithRows(this.state.players)

    return (
      <View style={styles.container} enableEmptySections={true}>
        <Text style={styles.h2}>GameRoom: {this.state.name}</Text>
        <Text style={{fontSize: 35}}>Players in the room: {this.state.players.length}</Text>
        <ListView
          enableEmptySections={true}
          style={{flex: 1, height: 700}}
          renderRow={(player) => {
              return (<View enableEmptySections={true}>
                        {/* Display you for the player  */}
                        <Text style={{fontSize: 25, flex: 1}}>{(player.id === this.state.currUser.id) ? 'You' : player.name}</Text>
                        <MapView
                          enableEmptySections={true}
                          style={{flex: 2, height: 200, width: 400}}
                          region={{
                            latitude: Number(player.latitude),
                            longitude: Number(player.longitude),
                            latitudeDelta: 0.04,
                            longitudeDelta: 0.04
                          }}
                          >
                          <MapView.Marker
                            coordinate={{
                              latitude: Number(player.latitude),
                              longitude: Number(player.longitude)
                            }}
                            title={(player.id === this.state.currUser.id) ? 'You' : player.name}
                          />
                        </MapView>
                      </View>
                    )
          }}
          dataSource={dataSource}
          refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
        />
        <TouchableOpacity title="Invite Others" onPress={() => this.setState({inviteVisible: true})} style={styles.button}></TouchableOpacity>
        <TouchableOpacity title="Start Game" onPress={() => this.startGame()} style={styles.button}></TouchableOpacity>
        <Text>{this.state.roomError}</Text>

        {/* Invite Modal */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.inviteVisible}
          onRequestClose={() => this.setState({inviteVisible: false})}>
          <View style={{marginTop: 22}} enableEmptySections={true}>
            <View enableEmptySections={true}>
              <TextInput style={styles.textInput} placeholder='Enter your name' onChangeText={(text) => this.setState({invitationName: text})}></TextInput>
              <TextInput style={styles.textInput} placeholder='Enter Phone number to invite' onChangeText={(text) => this.setState({invited: text})}></TextInput>

              <Button
                title="Invite"
                onPress={() => {
                  this.invite();
                }} />
              <Button title='Cancel' onPress={() => this.setState({inviteVisible: false})}></Button>
            </View>
          </View>
        </Modal>
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
  textInput: {
    width: 250,
    padding: 5,

  },
  button: {
    padding: 40,
    marginBottom: -50,
  },
  error: {
    textAlign: 'center',
    color: 'red',
    fontSize: 40,
  },
  h2:  {
    fontSize: 60,
    fontWeight: 'bold',
  }

});

export default GameRoomScreen;
