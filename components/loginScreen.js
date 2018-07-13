import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Button, TouchableOpacity, TextInput } from 'react-native';
import { MapView } from 'expo';

class LoginScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      username: '';
    }
  }

  login() {

    fetch("/player/create", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: this.state.username,
      })
    })
    .then(resp => resp.json())
    .then(parsedResp =>
      if(parsedResp.success){
        AsyncStorage.setItem('login', JSON.stringify({
          "username" : username,
        }))
        .then(this.props.navigation.navigate('Swiper'));
      })
      .catch(err => {

      });

  }
  render(){
    return (
      <View style={style.container}>
        <TextInput placeholder='Pick a Screen Name'></TextInput>
        <Button onPress={() => this.login()}>Login</Button>
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


export default LoginScreen;
