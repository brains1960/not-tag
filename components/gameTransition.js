import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Button, TouchableOpacity, TextInput, ListView,Image } from 'react-native';
import { MapView } from 'expo';
import StackNavigator from '../App.js'
import hostIP from '../backend'

class GameTransitionScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {}
  }

  componentDidMount() {
    AsyncStorage.getItem('login')
    .then(parsedLogin => {
      //Get the information for the logged in player
      let player = JSON.parse(parsedLogin)
      //Tell room if player is zombie
      this.setState({isZombie: player.zombie})
      console.log('Right after' ,this.state.isZombie);
    })
    .catch(err => {
      console.log('gameTransition.js:21 - ' ,err)
    })
  }

  render(){

    const display = () => {
      console.log('IN Render', this.state.isZombie)
      if(this.state.isZombie){
      return (<View style={styles.container} enableEmptySections={true}>
              <Text style={{fontSize: 45, textAlign:'center', justifyContent: 'center'}}>You are a</Text>
               <View enableEmptySections={true}><Text style={{fontSize: 65, textAlign:'center', justifyContent: 'center'}}>ZOMBIE</Text></View>
               <Image
                 source={{ uri:'https://media.giphy.com/media/xsgLUTNd1qDgA/giphy.gif'}}
                 style={{ height: 140, width: 200 }}
               />
               <Text style={{fontSize: 25, textAlign:'center', justifyContent: 'center'}}>Go make some friends...nom nom</Text>
               <Button style={styles.button} title='Sweet, time for noms' onPress={() =>this.props.navigation.navigate('MainGame')}></Button>
             </View>)
      } else if (!this.state.isZombie) {
      return ( <View style={styles.container} enableEmptySections={true}>
              <Text style={{fontSize: 45, textAlign:'center', justifyContent: 'center'}}>You are a</Text>
              <Text style={{fontSize: 65, textAlign:'center', justifyContent: 'center'}}>HUMAN</Text>

                <Image
                  source={{ uri: 'http://pixeljoint.com/files/icons/full/run_freddie.gif' }}
                  style={{ height: 200, width: 200 }}
                />
                <Text style={{fontSize: 25, textAlign:'center', justifyContent: 'center'}}>RUN FOR YOUR LIFE!!!</Text>
                <Button style={styles.button} title='Ahhhhh' onPress={() =>this.props.navigation.navigate('MainGame')}></Button>
              </View>)
      } else {
        return ( <View style={styles.container} enableEmptySections={true}>
                  <Image
                    source={{ uri: 'https://stanfy.com/wp-content/uploads/2015/09/1-V3h-VWthi5lL0QySF6qZPw.gif' }}
                    style={{ height: 200, width: 200 }}
                  />
                </View>)
      }
    }

  return(
      <View style={styles.container} enableEmptySections={true}>
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
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 150,
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
    fontSize: 35,
    fontWeight: 'bold',
  }

});

export default GameTransitionScreen;
