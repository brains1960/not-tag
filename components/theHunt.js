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

//first think if fetched for a human
class Hunt extends React.Component {
  constructor() {
    super();
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
        console.log('login' ,parsedResult)
        this.setState({player: parsedResult});
        AsyncStorage.getItem('bitten')
        .then(resp => {
          console.log('bittne', resp)
          this.setState({bitten: JSON.parse(resp)})
        })
      }
    })
  }


zombified = (id) => {
  // this.props.navigation.navigate('notSurvived')
  fetch(hostIP+'/player/status/'+id, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(resp => resp.json())
  .then(parsedResp => {
    if(parsedResp) {
      AsyncStorage.mergeItem('login', JSON.stringify({
        "username": parsedResp.name,
        "zombie" : true,
        "latitude" : parsedResp.latitude,
        "longitude" : parsedResp.longitude,
      }))
      .then(() => {
        console.log('bite')
        this.props.navigation.navigate('notSurvived')
      })
      .catch(err => console.log(err))
    }})
    .catch(err => {

    });
  }

  render() {
    const whatToDo = () => {
      if(this.state.player.zombie){
        return <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor:"#e0b83e"
        }}>
        <Text style={{fontSize: 65, textAlign:'center'}} >Dinner Time?</Text>
        <View>
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
      return      (<View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:"#e0b83e"
      }}>
      <View>
        <Text></Text>
      </View>
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:"#e0b83e"
      }}>
      <View><Text style={{fontSize: 65, textAlign:'center'}}>You're bit!</Text></View>
      <View><Text style={{fontSize: 18, textAlign:'center'}}>Tap in time for the antidote! </Text></View>
      <View><Text style={{fontSize: 18, textAlign:'center'}}>  </Text></View>
      <Image
        source={{ uri: 'https://i0.wp.com/niddamour.lu/wp-content/uploads/2017/11/scroll-down-Niddamour.lu_.gif?ssl=1' }}
        style={{ height: 175, width: 110 }}
      />
      <View><Text style={{fontSize: 18, textAlign:'center'}}>  </Text></View>

      {/* <Button color="#e03e3e" style={{
        marginLeft: 5,
        marginRight: 5,
        borderRadius: 5,
        color: "#e03e3e"
      }} title = "Save Yourself!" onPress={() => this.saved}/> */}
    </View>
    <View>
      <CountDown
        until={10}
        onPress={() => this.props.navigation.navigate('Survived')}
        onFinish={() => this.zombified(this.state.bitten.player._id)}
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
  <View style={{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:"#e0b83e"
  }}>
    {whatToDo()}
</View>
)
}
}

export default Hunt;
