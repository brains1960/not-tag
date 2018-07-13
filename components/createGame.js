import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Button, TouchableOpacity, TextInput } from 'react-native';
import { MapView } from 'expo';

class CreateGameScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      gameName: '',
      gamePass: '',
      gameTime: 0,
      createError: ''
    }
  }

  //Only take time values that are numbers
  updateGameTime(time){
    if (!isNaN(Number(time)){
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
    fetch('/game/create', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        gameName: this.state.username,
        time: this.state.gameTime,
        password: this.state.gamePass,
      })
    })
    .then(resp => resp.json())
    .then(parsedResp => {
      //checking if successful
      if (parsedResp.success){
        //Move to GameRoom screen
        this.props.navigation.navigate('GameRoom');
      } else {
        this.setState({createError: parsedResp.error});
      }
    })
    .catch(err => {
      this.setState({createError: error.message});
    })
  }


  render(){
    return (
      <View style={styles.container}>
        <TextInput placeholder='Game Name' onChangeText={(text) => this.setState({gameName: text})} />
        <TextInput onChangeText={(text) => this.updateGameTime(text))} value={this.state.gameTime}> <Text>Hours</Text></TextInput>
        <TextInput placeholder='Game Password' onChangeText={(text) => this.setState({gamePass: text})} secureTextEntry={true}/>
        <Button onPress={() => this.createGame()}>Create Game</Button>
        <Text>{this.state.createError}</Text>
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
});

export default CreateGameScreen;
