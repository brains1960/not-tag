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
import GameRoomScreen from './components/gameRoom'
import MainGameScreen from './components/mainGame'
import GameTransitionScreen from './components/gameTransition'
import HuntingScreen from './components/theHunt'
import SurvivedScreen from './components/notSurvived'
import NotSurvivedScreen from './components/survived'
import JoinGameScreen from './components/joinRoom'

class App extends React.Component {


  render() {
    return (
      <View style={styles.container}>
        <LoginScreen styles={styles} naivgator={(screen) => this.props.navigation.navigate(screen)}/>
      </View>
    );
  }
}

//Navigator
export default StackNavigator({
  Home:{
    screen: App,
  },
  Login: {
    screen: LoginScreen,
  },
  CreateGame: {
    screen: CreateGameScreen,
  },

  GameRoom: {
    screen: GameRoomScreen,
  },

  MainGame: {
    screen: MainGameScreen,
  },

  GameTransition: {
    screen: GameTransitionScreen,
  },
  Hunt : {
    screen: HuntingScreen,
  },

  NotSurvived: {
    screen: NotSurvivedScreen,
  },
  Survived: {
    screen: SurvivedScreen,
  },
  JoinRoom: {
    screen: JoinGameScreen,
  }

}, {initialRouteName: 'Login'});


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
