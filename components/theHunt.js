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
import StackNavigator from '../App.js';
import { Location, Permissions, MapView } from 'expo';
import Swiper from 'react-native-swiper'
import CountDown from 'react-native-countdown-component';
import hostIP from '../backend'

//first think if fetched for a human
class Hunt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      player:{},
      bitten: {}
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('login')
    .then(result => {
      if(result){
        var parsedResult = JSON.parse(result);
        console.log('login', parsedResult)
        if (!parsedResult.zombie) {
          this.setState({bitten: parsedResult});
        } else {
          AsyncStorage.getItem('bitten')
          .then(resp => this.setState({bitten: JSON.parse(resp)}))
          .catch(err => console.log('Hunt.js: 43 -', err))
        }
        this.setState({player: parsedResult});
      }
    })
  }


zombified = (id) => {
  // this.props.navigation.navigate('notSurvived')
  fetch(hostIP+'/player/zombify', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id
    })
  })
  .then(resp => resp.json())
  .then(parsedResp => {
    if(parsedResp && parsedResp._id === this.state.player._id) {
      AsyncStorage.mergeItem('login', JSON.stringify({
        "zombie" : true,
      }))
      .then(() => {
        console.log('bite')
        this.props.navigation.navigate('NotSurvived');
      })
    } else {
      console.log('bite')
      this.props.navigation.navigate('NotSurvived')
    }
  })
  .catch(err => console.log('Hunt.js - 75', err))
  }

  render() {
    const whatToDo = () => {
      if(this.state.player.zombie){
        return <View
          style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor:"#e0b83e"
        }}
        enableEmptySections={true}>
        <Text style={{fontSize: 65, textAlign:'center'}} >Dinner Time?</Text>
        <View enableEmptySections={true}>
          <CountDown
            until={10}
            onFinish={() => this.zombified(this.state.bitten.player._id)}
            size={30}
            timeToShow={['S']}
            digitBgColor    = {'#A09A9A'}
            label={""}
          />
        </View>
      </View>
    } else {
      return (
        <View
          style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor:"#e0b83e"
        }}
        enableEmptySections={true}>
      <View enableEmptySections={true}>
        <Text></Text>
      </View>
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:"#e0b83e"
      }}
      enableEmptySections={true}>
      <View enableEmptySections={true}><Text style={{fontSize: 65}}>You're bit!</Text></View>
      <View enableEmptySections={true}><Text style={{fontSize: 18}}>Tap in time for the antidote! </Text></View>
      <View enableEmptySections={true}><Text style={{fontSize: 18}}>  </Text></View>
      <Image
        source={{ uri: 'https://i0.wp.com/niddamour.lu/wp-content/uploads/2017/11/scroll-down-Niddamour.lu_.gif?ssl=1' }}
        style={{ height: 175, width: 110 }}
      />
      <View enableEmptySections={true}><Text style={{fontSize: 18, textAlign:'center'}}>  </Text></View>

      {/* <Button color="#e03e3e" style={{
        marginLeft: 5,
        marginRight: 5,
        borderRadius: 5,
        color: "#e03e3e"
      }} title = "Save Yourself!" onPress={() => this.saved}/> */}
    </View>
    <View enableEmptySections={true}>
      <CountDown
        until={10}
        onPress={() => this.props.navigation.navigate('Survived')}
        onFinish={() => this.zombified(this.state.bitten.id)}
        size={30}
        timeToShow={['S']}
        digitBgColor    = {'#A09A9A'}
        label={""}
      />
    </View>
  </View>)

}
  }
    return (
      <View
        style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:"#e0b83e"
      }}
      enableEmptySections={true}>
        {whatToDo()}
    </View>)
  }
}

export default Hunt;
