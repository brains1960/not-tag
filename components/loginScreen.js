import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Button, TouchableOpacity, TextInput } from 'react-native';
import { Location, Permissions, MapView } from 'expo';
import StackNavigator from '../App.js'
import hostIP from '../backend'

class LoginScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      loginError: '',
    }
  }

  componentDidMount(){
    // AsyncStorage.removeItem('login')
    // AsyncStorage.removeItem('room')
    AsyncStorage.getItem('login')
    .then(user => {
      // console.log('Login User', user)
      if (user && Object.keys(JSON.parse(user)).length >  0) {
        this.props.navigation.navigate('CreateGame');
      }
    })
    .catch(err => {
      console.log('loginScreen.js: 27 -', err);
      this.setState({loginError: err.message});
    });
  }

  login = async() => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      //handle failure
      Alert.alert('Permission Required', 'To tag we gotta know where you at');
    }
    let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});

    if (this.state.username) {
      fetch(hostIP+'/player/create', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: this.state.username,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          zombie: false,
        })
      })
      .then(resp => resp.json())
      .then(parsedResp => {
        if(parsedResp) {
          AsyncStorage.setItem('login', JSON.stringify({
            "username": parsedResp.name,
            "id": parsedResp.id,
            "zombie" : false,
            "latitude" : parsedResp.latitude,
            "longitude" : parsedResp.longitude,
          }))
          .then(this.props.navigation.navigate('CreateGame'))
          .catch(err => {
            console.log('loginScreen.js: 65 -', err);
            this.setState({loginError: err.message});
          });
        }})
        .catch(err => {
          console.log('loginScreen.js: 70 -', err);
          this.setState({loginError: err.message});
        });
      } else {
        this.setState({loginError: 'Username cannot be empty'});
      }
  }

  render(){
    return (
      <View style={styles.container} enableEmptySections={true}>
        <TextInput style={styles.textInput} placeholder='Pick a Screen Name' onChangeText={(text) => this.setState({username: text})}></TextInput>
        <Button title="Login" onPress={() => this.login()} style={styles.button}> </Button>
        <Text style={styles.error}>{this.state.loginError}</Text>
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

export default LoginScreen;
