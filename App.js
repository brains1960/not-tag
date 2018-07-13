import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Button, TouchableOpacity } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { MapView } from 'expo';
import Swiper from 'react-native-swiper'

//Screens
import LoginScreen  from './components/loginScreen'

class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <LoginScreen />
      </View>
    );
  }
}

// //Swiper
// class SwiperScreen extends React.Component {
//   static navigationOptions = {
//     title: 'HoHoHo!'
//   };
//
//   render() {
//     return (
//       <Swiper>
//         <HomeScreen />
//         <CreateGameScreen />
//       </Swiper>
//     );
//   }
// }

//Navigator
export default StackNavigator({
  Login: {
    screen: LoginScreen,
  },
  Register: {
    screen: RegisterScreen,
  },
  Users: {
    screen: UsersScreen,
  },
  Messages: {
    screen: MessagesScreen,
  },
  Swiper: {
    screen: SwiperScreen,
  }
}, {initialRouteName: 'Login'});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
