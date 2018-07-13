import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Button, TouchableOpacity, TextInput } from 'react-native';
import { MapView } from 'expo';

class LoginScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
    }
  }

  login() {
    fetch('http://localhost:1337/player/create', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: this.state.username,
      })
    })
    .then(resp => resp.json())
    .then(parsedResp => {
      if(parsedResp.success) {
        AsyncStorage.setItem('login', JSON.stringify({
          "username" : username,
        }))
        .then(this.props.navigator('CreateGame'));
      }})
      .catch(err => {

      });
  }

  render(){
    const styles = this.props.styles
    return (
      <View style={styles.container}>
        <TextInput style={styles.textInput} placeholder='Pick a Screen Name'></TextInput>
        <Button title="Login" onPress={() => this.login()}> </Button>
      </View>
    )
  }
}

export default LoginScreen;
