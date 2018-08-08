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
  TimerCountdown,
  RefreshControl,
  Image,

} from 'react-native';
import StackNavigator from '../App';
import { Location, Permissions, MapView } from 'expo';
import Swiper from 'react-native-swiper'
import CountDown from 'react-native-countdown-component';
import hostIP from '../backend'

class Survived extends React.Component {
  constructor(props){
    super(props)
    this.state ={
      zombie: null,
      player: {},
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('login')
    .then(result => {
      if(result){
        var parsedResult = JSON.parse(result);
        this.setState({player: parsedResult});
        fetch(hostIP+'/player/antidote', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            id: parsedResult._id
          })
        })
        .catch(err => console.log('survived.js: 47 - ', err));
      }
    }
  ).catch(err => {
    this.setState({
    })
  })
}

  render() {
    const resultHunt = () => { if(this.state.player.zombie){
      return  <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        enableEmptySections={true}>
        <View enableEmptySections={true}>
          <Image
            source={{uri: 'https://i.imgur.com/JfIvNX1.gif?1'}}
            style={{ height: 140, width: 200, alignItems: 'center',
            justifyContent: 'center'}}
          />
        </View>
        <View enableEmptySections={true}><Text style={{fontSize: 65, textAlign:'center'}}>Alas, you go hungry</Text></View>

      </View>
    } else {
      return (
        <View
          style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        enableEmptySections={true}>
        <Image
          source={{uri: 'https://i.imgur.com/JfIvNX1.gif?1'}}
          style={{ height: 140, width: 200, alignItems: 'center',
          justifyContent: 'center'}}
        />
        <View enableEmptySections={true}><Text style={{fontSize: 50, textAlign:'center'}}>You survive another day!</Text></View>
      </View>
    )}
  }
  return (
    <View
      enableEmptySections={true}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      >
      {resultHunt()}
      <Button color="#e03e3e" style={{
        marginLeft: 5,
        marginRight: 5,
        borderRadius: 5,
        color: "#e03e3e"
      }} title='Back to Play Screen' onPress={()=>this.props.navigation.navigate("MainGame")}/>
    </View>
  )}
}

export default Survived
