import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform
} from "react-native";
import Assets from "../assets";
import EDThemeButton from "../components/EDThemeButton";
import { showNotImplementedAlert } from "../utils/CMAlert";
import EDSkipButton from "../components/EDSkipButton";
import LoginContainer from "./LoginContainer";
import { PermissionsAndroid } from "react-native";
import { getUserToken } from "../utils/AsyncStorageHelper";
import { StackActions, NavigationActions } from "react-navigation";
import { Messages } from "../utils/Messages";

export default class SplashContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

    getUserToken(success => {}, failure => {});
  }

  
  async UNSAFE_componentWillMount() {
    if(Platform.OS == "ios") {
      return
    }
    await requestLocationPermission();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Image
          source={Assets.bgSplash}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%"
          }}
        />
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%"
          }}
        >
          <View 
            style={{
              flex:3,
              alignContent:"center",
              justifyContent:"center"
            }}
          >
            <Image
              source={Assets.logo}
              style={{
                alignSelf:"center",
                justifyContent:"center",
                width:"30%",
                height:"30%"
              }}
            />
          </View>
          <View style={{ flex: 4 }} />
          <View
            style={{
              flex: 3,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <EDThemeButton
              onPress={() => {
                this._onPressSignIn();
              }}
              label="Log IN"
            />
            <EDSkipButton
              onPress={() => {
                this._onPressSignUp();
              }}
              label="Sign Up"
            />
          </View>
        </View>
      </View>
    );
  }

  _onPressSignIn = () => {
    this.props.navigation.navigate("LoginContainer");
  }
  _onPressSkip() {
    // this.props.navigation.navigate("MainContainer");

    this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        routeName: "MainContainer",
        actions: [NavigationActions.navigate({ routeName: "MainContainer" })]
      })
    );
  }
  _onPressSignUp(){
    this.props.navigation.navigate("SignupContainer");
  }
}

export async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Eatance",
        message: "Eatance App access to your location "
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    } else {
    }
  } catch (err) {
    console.warn(err);
  }
}
