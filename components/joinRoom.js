import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Button, TouchableOpacity, TextInput } from 'react-native';
import { MapView } from 'expo';
import StackNavigator from '../App.js'
import hostIP from '../backend'

class JoinGameScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      gameName: '',
      gamePass: '',
      gameTime: '',
      createError: '',
      user: '',
    }
  }

  componentDidMount() {

    //If someone is logged in save their info else send to log in
    AsyncStorage.getItem('login')
    .then(parsedLogin => {
      if (parsedLogin) {
        this.setState({user: JSON.parse(parsedLogin)});
      } else {
        this.props.navigation.navigate('Login')
      }

      // Check if a game has already started
      AsyncStorage.getItem('room')
      .then(room => {
        //Checks if room returns an empty object
        if (room && Object.keys(JSON.parse(room)).length > 0) {
          let details = JSON.parse(room)
          //If there's more than one player in the game then go straight to game
          if(details && details.players.length > 1) {
            this.props.navigation.navigate('MainGame');
          } else {
            //Otherwise go to invite players screen
            this.props.navigation.navigate('GameRoom');
          }
        }
      })
      .catch(err => {
        console.log(err)
        this.setState({createError: err.message});
      })
    })
    .catch(err => {
      console.log(err)
      this.setState({createError: err.message});
    })
  }

  /*Creating a New Game
  1. Send game room name and password to backend
  2. If Post Successful go to gameroom (done)
  3. if not successful show error
*/
  joinGame() {
    //Send data from form
    fetch(hostIP+'/game/enter', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        gameName: this.state.gameName,
        password: this.state.gamePass,
        currUser: this.state.user,
      })
    })
    .then(resp => resp.json())
    .then(parsedResp => {
      //checking if successful
      if (parsedResp){
        // Save the current game for the user
        AsyncStorage.setItem('room', JSON.stringify({
          "id" : parsedResp._id,
          "time" : parsedResp.time,
          "name": parsedResp.gameName,
          "creator" : parsedResp.currUser,
          "players" : parsedResp.players,
          "state" : false,
        }))
        // If successful Move to GameRoom screen
        .then(this.props.navigation.navigate('GameRoom'));
      } else {
        // console.log(parsedResp)
        console.log('joinGame.js: 100 -',  parsedResp.error)
        this.setState({createError: 'That did not work'});
      }
    })
    .catch(err => {
      console.log('joinGame.js: 105 -', err);
      this.setState({createError: 'That did not work'});
    })
  }


  render(){
    // const styles = this.props.styles

    return (
      <View style={styles.container} enableEmptySections={true}>
        <Text style={{fontSize: 20}}>Enter the Name and Password of the game you want to join</Text>
        <TextInput style={styles.textInput} placeholder='Game Name' onChangeText={(text) => this.setState({gameName: text})} />
        <TextInput style={styles.textInput} placeholder='Game Password' onChangeText={(text) => this.setState({gamePass: text})} secureTextEntry={true}/>
        <Button style={styles.button} title='Join a Game' onPress={() => this.joinGame()} />
        <Text style={styles.error}>{this.state.createError}</Text>
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
    paddingLeft: 20,
    paddingRight: 20,
    flex: 1
  },
  error: {
    textAlign: 'center',
    color: 'red',
    fontSize: 40,
  }

});

export default JoinGameScreen;
