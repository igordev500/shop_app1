import React from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  Modal,
  ImageBackground,
  TextInput
} from "react-native";
import Assets from "../assets";
import { Style } from "../stylesheet/StylesUtil";
import EDTextView from "../components/EDTextView";
import { EDColors } from "../assets/Colors";
import EditText from "../components/EditText";
import EDTextViewNormal from "../components/EDTextViewNormal";
import EDThemeButton from "../components/EDThemeButton";
import { showValidationAlert } from "../utils/CMAlert";
import { apiPost } from "../api/APIManager";
import {
  LOGIN_URL,
  RESPONSE_SUCCESS,
  FORGOT_PASSWORD
} from "../utils/Constants";
import { Messages } from "../utils/Messages";
import ProgressLoader from "../components/ProgressLoader";
import { saveUserLogin, saveUserFCM } from "../utils/AsyncStorageHelper";
import { connect } from "react-redux";
import { saveUserDetailsInRedux, saveUserFCMInRedux } from "../redux/actions/User";
import { StackActions, NavigationActions } from "react-navigation";
import { ETFonts } from "../assets/FontConstants";
// import firebase from "react-native-firebase";
import ETextErrorMessage from "../components/ETextErrorMessage";
import { netStatus } from "../utils/NetworkStatusConnection";
import { StyleSheet,Dimensions } from "react-native";
import ViewSlider from 'react-native-view-slider'

const { width, height } = Dimensions.get('window');

class AddCartContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
  };

  async componentDidMount() {
    this.checkPermission();
  }

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  //3
  async getToken() {
    fcmToken = await firebase.messaging().getToken();
    this.setState({ firebaseToken: fcmToken });
  }

  //2
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();

      this.getToken();
    } catch (error) { }
  }

  onAddCartClick() {
      this.goToMain();
  }
  goToMain() {
    /*netStatus(status => {
      if (status) {
      } else {
        showValidationAlert(Messages.internetConnnection);
      }
    });
    */
  }

  render() {
    return (
        <>
        <ViewSlider 
          renderSlides = {
            <>
              <View style={stylesHowto.viewBox}>
                <ImageBackground source={Assets.how1} style={{ width: '100%', height: '100%' }}>
                </ImageBackground>
              </View>
              <View style={stylesHowto.viewBox}>
                <ImageBackground source={Assets.how2} style={{ width: '100%', height: '100%' }}>
                </ImageBackground>
              </View>
              <View style={stylesHowto.viewBox}>
                <ImageBackground source={Assets.how3} style={{ width: '100%', height: '100%' }}>
                </ImageBackground>
              </View>
              <View style={stylesHowto.viewBox}>
                <ImageBackground source={Assets.how4} style={{ width: '100%', height: '100%' }}>
                </ImageBackground>
              </View>
           </>
        }
        style={stylesHowto.slider}     //Main slider container style
        height = {'100%'}    //Height of your slider
        slideCount = {4}    //How many views you are adding to slide
        dots = {true}     // Pagination dots visibility true for visibile 
        dotActiveColor = 'red'     //Pagination dot active color
        dotInactiveColor = 'gray'    // Pagination do inactive color
        dotsContainerStyle={stylesHowto.dotContainer}     // Container style of the pagination dots
        autoSlide = {false}    //The views will slide automatically
        slideInterval = {1000}    //In Miliseconds
       />
      </>
    );
  }
}
import { Form } from "native-base";
import EDSkipButton from "../components/EDSkipButton";


export default connect(
)(AddCartContainer);


const stylesHowto = StyleSheet.create({
    viewBox: {
        paddingHorizontal: 0,
        justifyContent: 'center',
        width: width,
        padding: 10,
        alignItems: 'center',
        height: height
    },
    slider: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'pink'
    },
    dotContainer: {
      backgroundColor: 'transparent',
      position: 'absolute',
      bottom:55
    }
  });