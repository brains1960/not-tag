import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ListView,
  Alert,
  Button,
  AsyncStorage,
  RefreshControl,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Location, Permissions, MapView } from 'expo';
import Swiper from 'react-native-swiper'

//Screens
import LoginScreen from './components/loginScreen'
import CreateGameScreen from './components/createGame'

class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <LoginScreen styles={styles} naivgator={this.props.navigation.navigate}/>
      </View>
    );
  }
}

//Navigator
export default createStackNavigator({
  Home:{
    screen: App,
  },
  Login: {
    screen: LoginScreen,
  },
  CreateGame: {
    screen: CreateGameScreen,
  },
}, {initialRouteName: 'Home'});


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

});
