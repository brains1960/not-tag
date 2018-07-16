import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Button, TouchableOpacity, TextInput } from 'react-native';
import { MapView } from 'expo';
import StackNavigator from '../App.js'
import hostIP from '../backend'

class CreateGameScreen extends React.Component {
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
        console.log('Create Game Room', room)
        if (room && Object.keys(JSON.parse(room)).length > 0) {
          let details = JSON.parse(room)
          //If there's more than one player in the game then go straight to game
          if(details && details.players.length > 1 && details.state) {
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

  //Only take time values that are numbers
  updateGameTime(time){
    if (!isNaN(Number(time))){
      this.setState({gameTime: time})
    }
  }

  /*Creating a New Game
  1. Post the name, time and passowrd to the game/create endpoint (done)
  2. If Post Successful go to gameroom (done)
  3. if not successful show error
*/
  createGame() {
    //Send data from form
    fetch(hostIP+'/game/create', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        gameName: this.state.gameName,
        time: this.state.gameTime,
        password: this.state.gamePass,
        currUser: this.state.user.id,
        players: [{name: this.state.user.username, id: this.state.user.id,
           latitude: this.state.user.latitude, longitude: this.state.user.longitude}]
      })
    })
    .then(resp => resp.json())
    .then(parsedResp => {
      //checking if successful
      if (parsedResp){
        // Save the current game for the user
        AsyncStorage.setItem('room', JSON.stringify({
          "id" : parsedResp.id,
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
        console.log('createGame.js: 100 -',  parsedResp.error)
        this.setState({createError: parsedResp.error});
      }
    })
    .catch(err => {
      console.log('createGame.js: 105 -', err);
      this.setState({createError: err.message});
    })
  }


  render(){
    // const styles = this.props.styles

    return (
      <View style={styles.container}>
        <TextInput style={styles.textInput} placeholder='Game Name' onChangeText={(text) => this.setState({gameName: text})} />
        <TextInput style={styles.textInput} placeholder='Hours' onChangeText={(text) => this.updateGameTime(text)} value={this.state.gameTime}></TextInput>
        <TextInput style={styles.textInput} placeholder='Game Password' onChangeText={(text) => this.setState({gamePass: text})} secureTextEntry={true}/>
        <Button style={styles.button} title='Create Game' onPress={() => this.createGame()} />
        <Button style={styles.button} title='Join a Game' onPress={() => this.props.navigation.navigate('JoinRoom')} />
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

export default CreateGameScreen;
