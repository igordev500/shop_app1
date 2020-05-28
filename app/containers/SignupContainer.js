import React from "react";
import {
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { connect } from "react-redux";
import Assets from "../assets";
import EDThemeButton from "../components/EDThemeButton";
//import EDSkipButton from "../components/EDSkipButton";
import { showValidationAlert } from "../utils/CMAlert";
import EditText from "../components/EditText";
import EDTextView from "../components/EDTextView";
import { apiPost } from "../api/ServiceManager";
// import firebase from "react-native-firebase";
import { REGISTRATION_URL, RESPONSE_SUCCESS } from "../utils/Constants";
import ProgressLoader from "../components/ProgressLoader";
import { Messages } from "../utils/Messages";
import ETextErrorMessage from "../components/ETextErrorMessage";
import { ETFonts } from "../assets/FontConstants";
import { NativeModules } from "react-native";
import { netStatus } from "../utils/NetworkStatusConnection";
import metrics from "../utils/metrics";
import { ImageBackground, StyleSheet, TouchableOpacity } from "react-native";
import { EDColors } from "../assets/Colors";
import EDTextViewNormal from "../components/EDTextViewNormal";
import messaging from '@react-native-firebase/messaging';

class SignupContainer extends React.Component {
  state = {
    isFullNameCorrect: true,
    isPhoneCorrect: true,
    isPasswordCorrect: true,
    strFullName: "testuser",
    strPhone: "2059538441",
    strPassword: "Aaa111@",
    isLoading: false,
    firebaseToken: "",
    fullNameError: "",
    phoneError: "",
    passwordError: ""
  };

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    this.checkPermission();
  }

  authenticateUser() {
    netStatus(status => {
      if (status) {
        this.setState({ isLoading: true });
        apiPost(
          REGISTRATION_URL,
          {
            FirstName: this.state.strFullName,
            PhoneNumber: this.state.strPhone,
            Password: this.state.strPassword,
            firebase_token: this.state.firebaseToken,
            phone_code: this.props.code
          },
          resp => {
            this.setState({ isLoading: false });
            if (resp != undefined) {
              console.log(resp.message)
              if (resp.status == RESPONSE_SUCCESS) {
                /*this.props.navigation.navigate("OTPContainer", {
                  phNo: this.state.strPhone,
                  password: this.state.strPassword
                });
                */
              } else {
                showValidationAlert(resp.message);
              }
            } else {
              showValidationAlert(Messages.generalWebServiceError);
            }
          },
          err => {
            this.setState({ isLoading: false });
            showValidationAlert(Messages.internetConnnection);
          }
        );
      } else {
        showValidationAlert(Messages.internetConnnection);
      }
    });
  }

  async checkPermission() {
    const enabled = await messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  //3
  async getToken() {
    fcmToken = await messaging().getToken();
    this.setState({ firebaseToken: fcmToken });
  }

  //2
  async requestPermission() {
    try {
      await messaging().requestPermission();

      this.getToken();
    } catch (error) {
      // User has rejected permissions
    }
  }

  render() {
    return (
      //behavior="padding" enabled
      <ImageBackground source={Assets.bgSplash} style={{ width: '100%', height: '100%' }}>
        <KeyboardAvoidingView
          behavior="padding"
         // enabled
         // contentContainerStyle={{ flex: 2 }}
          style={{ flex: 1 }}
        >

          {this.state.isLoading ? <ProgressLoader /> : null}
          <View
            style={{
              flex: 1,
              position: "absolute",
              width: "100%",
              height: "100%"
            }}
          >
            <View
              style={{
                marginTop: 10,
                flex: 3,
                justifyContent: "center",
                marginTop: metrics.statusbarHeight,
                alignItems: "center",
              }}
            >
              <Image
                source={Assets.logo}
                style={{
                  resizeMode: 'contain',
                  alignSelf: "center",
                  justifyContent: "center",
                  width: "20%",
                  height: "20%",
                  marginTop: 20
                }}
              />
              <Text style={styleLogin.logoText}>
                Create Your {"\n"}
                    Account
                  </Text>
              <Text style={styleLogin.smallText}>
                Sign Up with,
                  </Text>
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <TouchableOpacity style={styleLogin.FacebookStyle} activeOpacity={0.5}>
                  <Image
                    source={Assets.facebookIcon}
                    style={styleLogin.ImageIconStyle}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styleLogin.FacebookStyle} activeOpacity={0.5}>
                  <Image
                    source={Assets.googleIcon}
                    style={styleLogin.ImageIconStyle}
                  />
                </TouchableOpacity>

              </View>
            </View>
            <View
              style={{
                flex: 5,
                marginLeft: 25,
                marginRight: 25,
                marginBottom: 30
              }}
            >
              <EDTextViewNormal style={{ fontSize: 14 }} text="First Name" />
              <EditText
                styles={{ elevation: this.state.isLoading ? 0 : 8 }}
                hint = "Full Name"
                keyboardType="default"
                value = {this.state.strFullName}
                onChangeText={newText => {
                  this.state.strFullName = newText;
                }}
              />
              {this.state.fullNameError ? 
              <ETextErrorMessage
                errorStyle={{ marginTop: 3 }}
                errorMsg={this.state.fullNameError}
              />: null}
              <EditText
                styles={{ elevation: this.state.isLoading ? 0 : 8 }}
                hint = "Last Name"
                keyboardType="default"
                onChangeText={newText => {
                  this.state.strLastName = newText;
                }}
              />
              {this.state.LasNameError ? 
              <ETextErrorMessage
                errorStyle={{ marginTop: 3 }}
                errorMsg={this.state.LasNameError}
              />: null}
              <EditText
                styles={{ elevation: this.state.isLoading ? 0 : 8 }}
              hint = "Username(Optional)"
                keyboardType="default"
                onChangeText={newText => {
                  this.state.strLastName = newText;
                }}
              />
              {this.state.UserNameError ? 
              <ETextErrorMessage
                errorStyle={{ marginTop: 3 }}
                errorMsg={this.state.UserNameError}
              />: null}
              <EditText
                styles={{ elevation: this.state.isLoading ? 0 : 8 }}
                hint = "Phone Number"
                keyboardType="phone-pad"
                secureTextEntry={false}
                // isCode={true}
                // codeLabel={this.props.code}
                maxLength={15}
                value={this.state.strPhone}
                onChangeText={text => {
                  var newText = text.replace(/[^0-9]/g, "");
                  this.setState({ strPhone: newText });
                }}
              />
              {this.state.phoneError ? 
              <ETextErrorMessage
                errorStyle={{ marginTop: 3 }}
                errorMsg={this.state.phoneError}
              />: null}

              <EditText
                styles={{ elevation: this.state.isLoading ? 0 : 8 }}
              hint = "Location"
                keyboardType="default"
                onChangeText={newText => {
                  this.state.strLastName = newText;
                }}
              />
              {this.state.LocationError ? 
              <ETextErrorMessage
                errorStyle={{ marginTop: 3 }}
                errorMsg={this.state.LocationError}
              />: null}

              <EditText
                styles={{ elevation: this.state.isLoading ? 0 : 8 }}
                keyboardType="default"
                value = {this.state.strPassword}
                secureTextEntry={true}
                hint = "Password"
                onChangeText={newText => {
                  this.state.strPassword = newText;
                }}
              />
             

              {this.state.passwordError?
              <ETextErrorMessage
                errorStyle={{ marginTop: 3 }}
                errorMsg={this.state.passwordError}
              />
              :null}
              <View style={{ alignItems: "center", marginTop: 5 }}>
                <EDSkipButton
                  onPress={() => {
                   // this.props.navigation.goBack();
                    this.props.navigation.navigate("AddCartContainer");
                    //this._onPressAddCart();
                  }}
                  label="Add your Card"
                />
                <EDThemeButton
                  style = {{ marginTop:10}}
                  onPress={() => {
                    this._onPressSignUp();
                  }}
                  label="SIGN UP"
                />
                <TouchableOpacity
                  style={{ flexDirection: 'row' }}
                  onPress={() => {
                    this._onPressLogIn()

                  }}
                >
                  <Text
                    style={{ color: EDColors.gray, fontSize: 14, marginTop: 10, fontFamily: ETFonts.regular }}>
                    {"Already have an account?"}
                  </Text>
                  <EDTextViewNormal style={{ fontSize: 14 }} text=" LOG IN" />
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
  _onPressAddCart(){
    this.props.navigation.navigate("AddCartContainer", {
    });
  }
  _onPressSignUp() {
    this.props.navigation.navigate("HowtoContainer", {
    });
    //if (this.validate()) {
      ///this.authenticateUser();
    //}
  }

  validate() {
    let reg = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[#?!@$%^&*-]).{6,15}$/;
    if (this.state.strFullName.trim().length == 0) {
      this.setState({
        fullNameError: Messages.emptyName,
        phoneError: "",
        passwordError: ""
      });
      return false;
    } else if (this.state.strPhone.trim().length == 0) {
      this.setState({
        fullNameError: "",
        phoneError: Messages.emptyPhone,
        passwordError: ""
      });
      return false;
    } else if (this.state.strPhone.trim().indexOf(0) == 0) {
      this.setState({
        fullNameError: "",
        phoneError: Messages.phoneValidationIssueString,
        passwordError: ""
      });
      return false;
    } else if (this.state.strPhone.trim().length < 9) {
      this.setState({
        fullNameError: "",
        phoneError: Messages.phoneValidationString,
        passwordError: ""
      });
      return false;
    } else if (this.state.strPassword.trim().length == 0) {
      this.setState({
        fullNameError: "",
        phoneError: "",
        passwordError: Messages.emptyPassword
      });
      return false;
    } else if (reg.test(this.state.strPassword.trim()) === false) {
      this.setState({
        fullNameError: "",
        phoneError: "",
        passwordError: Messages.passwordValidationString
      });
      return false;
    }
    this.setState({
      fullNameError: "",
      phoneError: "",
      passwordError: ""
    });
    return true;
  }

  _onPressLogIn() {
    this.props.navigation.goBack();
  }
}
import { Form } from "native-base";
import EDSkipButton from "../components/EDSkipButton";

export default connect(
  state => {
    return {
      code: state.userOperations.code,
    };
  },
  dispatch => {
    return {};
  }
)(SignupContainer);

const styleLogin = StyleSheet.create({
  logoText: {
    color: EDColors.primary1,
    textAlign: "center",
    fontFamily: ETFonts.bold,
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 30,
    alignSelf: "center"
  },
  smallText: {
    color: EDColors.black,
    textAlign: "center",
    fontFamily: ETFonts.regular,
    fontSize: 15,
    marginTop: 20,
    alignSelf: "center"
  },
  FacebookStyle: {
    justifyContent: "center",
    backgroundColor: EDColors.white,
    borderRadius: 15,
    width: 50,
    height: 45,
    shadowColor: EDColors.gray,
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 0,
      height: 1,

    },
    alignSelf: "center",
    marginLeft: 10,
    marginTop: 20
  },
  ImageIconStyle: {
    alignSelf: "center",
    resizeMode: "contain",
    width: 30,
    height: 30
  }
});
