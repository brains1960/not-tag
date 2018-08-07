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

class notSurvived extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      player: {} ,
    }
  }

  componentDidMount() {
    this.backToGame = setInterval(() => {
      AsyncStorage.getItem('login')
      .then(result => {
        if(result){
          var parsedResult = JSON.parse(result);
          this.setState({player: parsedResult}, () => {
            if (!this.state.player.zombie){
              clearInterval(this.backToGame);
              this.props.navigation.navigate("MainGame");
            }
          });
        }
      })
      .catch(err => {
        this.setState({
        })
      })
    }, 1000);
  }

  componentWillUnMount() {
    clearInterval(this.backToGame);
  }

  render() {
    if (this.state.player.zombie) {
      return (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          enableEmptySections={true}>
          <Image
            source={{uri: 'https://vignette.wikia.nocookie.net/animal-jam-clans-1/images/2/2e/Skull_pixel_art_gif_by_enter1220-d9izg5e.gif/revision/latest?cb=20170915235304'}}
            style={{ height: 140, width: 200}}
          />
          <View enableEmptySections={true}><Text style={{fontSize: 50, textAlign:'center'}}>The herd grows....</Text></View>
          <Button color="#e03e3e" style={{
            marginLeft: 5,
            marginRight: 5,
            borderRadius: 5,
            color: "#e03e3e"
          }} title='Back to Play Screen' onPress={() => this.props.navigation.navigate("MainGame")}/>
        </View>
      )
    } else {
      return null
    }
  }
}

export default notSurvived;
