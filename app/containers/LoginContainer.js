import React from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  Modal,
  ImageBackground,
  StatusBar
} from "react-native";
import Assets from "../assets";
import { Style } from "../stylesheet/StylesUtil";
import EDTextView from "../components/EDTextView";
import { EDColors } from "../assets/Colors";
import EditTextUnderLine from "../components/EditTextUnderLine";
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
import ETextErrorMessage from "../components/ETextErrorMessage";
import { netStatus } from "../utils/NetworkStatusConnection";
import { StyleSheet,TextInput } from "react-native";

import firebase from '@react-native-firebase/app';

import {
  LoginButton,
  AccessToken,
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';

import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-community/google-signin';


class LoginContainer extends React.Component {
  constructor(props) {
    super(props);
    try {
      this.isCheckout =
        this.props.navigation.state.params != undefined &&
          this.props.navigation.state.params.isCheckout != undefined
          ? this.props.navigation.state.params.isCheckout
          : false;
    } catch (error) {
      this.isCheckout = false;
    }
  }
//2059538441
//Aaa111@
  state = {
    phoneNumber: "2059538441",
    password: "Aaa111@",
    // phoneNumber: "",
    // password: "",
    forgotPwdPhoneNumber: "",
    username: "",
    isLoading: false,
    modelVisible: false,
    isForgotValidate: false,
    firebaseToken: "",
    usernameError: "",
    passwordError: "",
    forgotPwdMsg: "",
    bshow: false,
    profile_pic: ''
  };

  async componentDidMount() {
    this.checkPermission();
    GoogleSignin.configure({
      // scopes : ['https://www.googleapis.com/auth/drive.readonly'],
      // forceConsentPrompt : true,
      webClientId: '871575391839-k7oe440g8acapqutnkaa42uock7gs3pn.apps.googleusercontent.com',
      offlineAccess: false
      // androidClientId:'357803277757-n0e67tagrs64lajf1jeoqhbgf4qhrujr.apps.googleusercontent.com'
      //357803277757-n0e67tagrs64lajf1jeoqhbgf4qhrujr.apps.googleusercontent.com
    })
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

  onSignInClick() {
    if (this.validation()) {
      this.userLogin();
    }
  }

  onForgotPwdClick() {
    if (this.validationPhone()) {
      this.forgotPasswordApi();
    }
  }

  validationPhone() {
    if (this.state.forgotPwdPhoneNumber.trim() === "") {
      showValidationAlert(Messages.validationPhoneMsg);
      return false;
    } else if (this.state.forgotPwdPhoneNumber.trim().length < 9) {
      showValidationAlert(Messages.phoneValidationString);
      return false;
    } else {
      return true;
    }
  }

  validation() {
    if (this.state.phoneNumber.trim() === "") {
      this.setState({
        usernameError: Messages.validationPhoneMsg,
        passwordError: ""
      });
      return false;
    }
    // else if (this.state.phoneNumber.trim().length < 9) {
    //   this.setState({
    //     usernameError: Messages.phoneValidationString,
    //     passwordError: ""
    //   });
    //   return false;
    // }
    else if (this.state.password.trim() === "") {
      this.setState({
        usernameError: "",
        passwordError: Messages.validationPasswordMsg
      });
      return false;
    } else {
      this.setState({ usernameError: "", passwordError: "" });
      return true;
    }
  }

  userLogin() {
    netStatus(status => {
      if (status) {
        this.setState({ isLoading: true });
        apiPost(
          LOGIN_URL,
          {
            PhoneNumber: this.state.phoneNumber,
            Password: this.state.password,
            firebase_token: this.state.firebaseToken,
            phone_code: this.props.code
          },
          response => {
            this.setState({ isLoading: false });
            if (response.error != undefined) {
              showValidationAlert(
                response.error.message != undefined
                  ? response.error.message
                  : Messages.generalWebServiceError
              );
            } else if (response.status == RESPONSE_SUCCESS) {
              this.props.saveCredentials(response.login);
              saveUserLogin(response.login, success => { }, errAsyncStore => { });
              if (this.isCheckout) {
                this.props.navigation.goBack();
              } else {
                this.props.saveToken(this.state.firebaseToken)
                saveUserFCM(
                  this.state.firebaseToken, success => { }, failure => { }
                )
                this.props.navigation.dispatch(
                  StackActions.reset({
                    index: 0,
                    actions: [
                      NavigationActions.navigate({ routeName: "MainContainer" })
                    ]
                  })
                );
              }
            } else if (response.active == false) {
              this.props.navigation.navigate("OTPContainer", {
                phNo: this.state.phoneNumber,
                password: this.state.password
              });
            } else {
              showValidationAlert(response.message);
            }
          },
          error => {
            this.setState({ isLoading: false });
            showValidationAlert(
              error.response != undefined
                ? error.response
                : Messages.generalWebServiceError
            );
          }
        );
      } else {
        showValidationAlert(Messages.internetConnnection);
      }
    });
  }

  forgotPasswordApi() {
    netStatus(status => {
      if (status) {
        this.setState({ isLoading: true });
        apiPost(
          FORGOT_PASSWORD,
          {
            PhoneNumber: this.state.forgotPwdPhoneNumber,
            phone_code: this.props.code
          },
          resp => {
            if (resp != undefined) {
              if (resp.status == RESPONSE_SUCCESS) {
                this.setState({
                  isLoading: false,
                  isForgotValidate: true,
                  forgotPwdMsg: resp.password,
                  forgotPwdPhoneNumber: ""
                });
              } else {
                showValidationAlert(resp.message);
                this.setState({ isLoading: false });
              }
            } else {
              showValidationAlert(Messages.generalWebServiceError);
              this.setState({ isLoading: false });
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

  onGoogleLogin=async()=>{

    // GoogleSignin.signIn().then((data)=>{
    //   console.log(data);
    //   // const credential = firebase.auth().GoogleAuthProvider.credential(data.idToken, data.accessToken);
    //   // return firebase.auth().signInWithCredential(credential);
    // })
    // .then((currentUser)=>{
    //   console.log(currentUser, "========================")
    // })
    // .catch((error) => {
    //   console.log(error);
    // })
    try {
      await GoogleSignin.hasPlayServices({
        //Check if device has Google Play Services installed.
        //Always resolves to true on iOS.
        showPlayServicesUpdateDialog: true,
      });
      
      const userInfo = await GoogleSignin.signIn();

      console.log('User Info --> ', userInfo);
      this.setState({ userInfo: userInfo });
      this.props.navigation.navigate('MainStack')
    } catch (error) {
      console.log('Message', error.message);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signing In');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services Not Available or Outdated');
      } else {
        console.log('Some Other Error Happened');
      }
    }
  }

  _signOut = async () => {
    //Remove user session from the device.
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      this.setState({ userInfo: null }); // Remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };

  get_Response_Info = (error, result) => {
    if (error) {
      //Alert for the Error
      Alert.alert('Error fetching data: ' + error.toString());
    } else {
      //response alert
      alert(JSON.stringify(result));
      this.setState({ user_name: 'Welcome' + ' ' + result.name });
      this.setState({ token: 'User Token: ' + ' ' + result.id });
      this.setState({ profile_pic: result.picture.data.url });
    }
  };

  onLogout = () => {
    //Clear the state after logout
    this.setState({ user_name: null, token: null, profile_pic: null });
  };

  onFBLogin(){
    LoginManager.logInWithPermissions(["public_profile"]).then((result)=> {
        if (result.isCancelled) {
          console.log("Login cancelled");
        } else {
          AccessToken.getCurrentAccessToken().then((data) => {
            const { accessToken } = data
            fetch('https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=' + accessToken)
              .then((response) => response.json())
              .then((json) => {
                let login = {
                  FirstName: json.name, 
                  LastName: "", 
                  PhoneNumber: "",
                  UserID: json.id, 
                  image: "", 
                  notification: "1", 
                  phone_code: this.props.code, 
                  rating: ""
                }
                this.props.saveCredentials(login);
                saveUserLogin(login, success => { }, errAsyncStore => { });
                  if (this.isCheckout) {
                    this.props.navigation.goBack();
                  } else {
                    this.props.saveToken(this.state.firebaseToken)
                    saveUserFCM(
                      this.state.firebaseToken, success => { }, failure => { }
                    )
                    this.props.navigation.dispatch(
                      StackActions.reset({
                        index: 0,
                        actions: [
                          NavigationActions.navigate({ routeName: "MainContainer" })
                        ]
                      })
                    );    
                  }
              })
              .catch(() => {
                console.log('ERROR GETTING DATA FROM FACEBOOK')
              })
          })
          
        }
      },
      function(error) {
        console.log("Login fail with error: " + error);
      }
    );
  }

  render() {
    return (
      <>
      <StatusBar visible={false}/>
      <ImageBackground source={Assets.login_background} style={{ width: '100%', height: '100%', backgroundColor:EDColors.background }}>
        <KeyboardAvoidingView
          behavior="padding"
          enabled
          contentContainerStyle={{ flex: 1 }}
          style={{ flex: 1 }}
        >

          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            {this.state.isLoading ? <ProgressLoader /> : null}

            <Modal
              visible={this.state.modelVisible}
              animationType="slide"
              transparent={true}
              onRequestClose={() => {
                this.setState({
                  modelVisible: false,
                  isForgotValidate: false,
                  forgotPwdPhoneNumber: ""
                });
              }}
            >
              <View
                style={{
                  flex: 1,
                  alignContent:"flex-start",
                  //justifyContent: "center",
                  backgroundColor: "rgba(255,255,255,1)"
                }}
              >
                <View
                  style={{
                    backgroundColor: "#fff",
                    padding: 10,
                    marginLeft: 20,
                    marginRight: 20,
                    borderRadius: 4,
                    marginTop: 20,
                    alignContent:"flex-start",
                    //justifyContent: "center",
                    marginBottom: 20
                  }}
                >
                   <TouchableOpacity
                      style={{ padding: 5  , marginTop:20}}
                      onPress={() => {
                        this.setState({
                          modelVisible: false,
                          isForgotValidate: false,
                          forgotPwdPhoneNumber: ""
                        });
                      }}
                    >
                      <Image
                        style={{
                          alignContent: "flex-end",
                          height: 15,
                          width: 15
                        }}
                        source={Assets.ic_close}
                      />
                    </TouchableOpacity>
                  
                    
                  {this.state.isForgotValidate ? (
                    <View>
                      <Text
                        selectable={true}
                        style={{
                          color: EDColors.black,
                          fontSize: 16,
                          padding: 10,
                          fontFamily: ETFonts.regular,
                          marginLeft: 10
                        }}
                      >
                        {Messages.forgotPasswordValidMobileMsg +
                          " - " +
                          this.state.forgotPwdMsg}
                      </Text>
                    </View>
                  ) : (
                      <View style={{ marginLeft: 10, marginRight: 10, alignSelf:"center" }}>
                          <Text
                            style={{
                            color: EDColors.blue,
                            fontSize: 24,
                            fontFamily: ETFonts.bold,
                            marginLeft: 10,
                            marginTop:40,
                            alignSelf: "center",
                          }}
                          >
                          {"Forgot password"}
                         </Text>
                         <Text
                            style={{
                            marginTop:20,
                            color: EDColors.black,
                            fontSize: 16,
                            fontFamily: ETFonts.regular,
                            marginLeft: 10,
                            alignSelf: "center",
                          }}
                          >
                          {"Please enter your email address. You will receive a link to create a new password via email."}
                         </Text>
                          <TextInput
                          style={
                            styleLogin.TextInputStyle
                          }
                          keyboardType="email-address"
                          secureTextEntry={false}
                          maxLength={
                            15
                          }
                          value = {this.state.email}
                          onChangeText={text => {
                            this.setState({ email: text });
                          }}
                          placeholder="Your email"
                          //returnKeyType="done"
                          />
                          <TouchableOpacity style = {styleLogin.themeButton}
                              onPress = {() => {
                                this.onForgotPwdClick();
                              }}
                          >
                              <Text style = {styleLogin.themeButtonText}>{"Send"}</Text>
                          </TouchableOpacity>
                      </View>
                    )}
                </View>
              </View>
              {/* </TouchableOpacity> */}
            </Modal>


            {this.state.modelVisible ? null :
              <View
                style={{
                  flex:1,
                  // position: "absolute",
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                    alignItems:'center'
                }}
              >
                {/* <View
                  style={{
                    flex:5,
                    justifyContent: "center",
                    alignItems:'center'
                  }}
                > */}
                  <Image style={{ width: 80, height:50, marginTop: 10 }} resizeMode={'stretch'} source={Assets.login_thribby} />
                  <View style={{marginTop:10, justifyContent:'center', alignItems:'center'}}>
                    <Text
                      style={{
                        color: EDColors.activeColor,
                        fontFamily: ETFonts.satisfy,
                        fontWeight:'bold',
                        fontSize: 30,
                        marginTop: 10,
                        // alignSelf: "center"
                      }}
                    >
                      {Messages.login1}
                    </Text>
                    <Text
                      style={{
                        color: EDColors.activeColor,
                        fontFamily: ETFonts.satisfy,
                        fontSize: 30,
                        paddingTop:0,
                        fontWeight:'bold',
                        // alignSelf: "center"
                      }}
                    >
                      {Messages.login2}
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: "#333",
                      fontFamily: ETFonts.satisfy,
                      fontSize: 18,
                      fontWeight:'bold',
                      marginTop: 15,
                      // alignSelf: "center"
                    }}
                  />
                  <Text style={styleLogin.logoText}>
                    Log in to your {"\n"}
                    Account
                  </Text>
                  <View style={{flexDirection:'row', marginTop:10}}>
                  
                  <TouchableOpacity style={{width: 50, height:50, borderRadius:15, backgroundColor:'#FFF', justifyContent:'center', alignItems:'center',
                    padding:10,                    
                    shadowColor: 'rgba(47, 47, 47, 1)',
                    shadowOffset: { width: 6, height: 6 },
                    shadowRadius: 5,
                    elevation: 3
                  }} 
                  onPress = {()=>this.onFBLogin()}
                  >
                    <Image source={Assets.facebook_icon} style={{width:18, height:28}}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width: 50, height:50, borderRadius:15, backgroundColor:'#FFF', justifyContent:'center', alignItems:'center',
                    marginLeft:20,
                    padding:5,
                    shadowColor: 'rgba(47, 47, 47, 1)',
                    shadowOffset: { width: 6, height: 6 },
                    shadowRadius: 5,
                    elevation: 3
                  }}
                  onPress={()=>this.onGoogleLogin()}
                  >
                    <Image source={Assets.google_icon} style={{width:28, height:28}}/>
                    </TouchableOpacity>
                  
                  </View>
                  <Text
                    style={{
                      color: "#333",
                      fontFamily: ETFonts.satisfy,
                      fontSize: 18,
                      fontWeight:'bold',
                      marginTop: 15,
                      // alignSelf: "center"
                    }}
                  >Or
                  </Text>
                {/* </View> */}

                {/* <View style={{flex:5 }}> */}
                  <View style={[Style.loginView, {width:'100%', padding:25}]}>
                    {/* <EDTextView text="Username" /> */}
                    <EditTextUnderLine
                      keyboardType="default"
                      secureTextEntry={false}
                      hint = "Username"
                      // isCode={true}
                      // codeLabel={this.props.code}
                      value={this.state.phoneNumber}
                      onChangeText={text => {
                        this.setState({ phoneNumber: text });
                      }}
                    />

                    <ETextErrorMessage
                      errorStyle={{ marginTop: 3 }}
                      errorMsg={this.state.usernameError}
                    />

                    {/* <EDTextView text="Password" /> */}
                    <EditTextUnderLine
                      hint="Password"
                      keyboardType="default"
                      secureTextEntry={this.state.bshow ? false : true}
                      maxLength={15}
                      onChangeText={text => {
                        this.state.password = text;
                      }}
                    />
                    <ETextErrorMessage
                      errorStyle={{ marginTop: 3 }}
                      errorMsg={this.state.passwordError}
                    />
                    <TouchableOpacity style={{alignSelf:'flex-end', marginTop: -50, marginLeft:-30}} onPress={()=>this.setState({bshow:!this.state.bshow})}>
                      {!this.state.bshow ? <Image source={Assets.unshow} style={{width:30, height:20}} />:
                      <Image source={Assets.show} style={{width:30, height:20}} resizeMode="stretch"/>}
                    </TouchableOpacity>
                    <View style={{ alignSelf: "flex-end" }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({ modelVisible: true });
                          //this.props.navigation.navigate("ForgotPassword");
                        }}
                      >
                        <Text style={{color:EDColors.activeColor, marginTop:15, fontWeight:'bold'}}>FORGOT PASSWORD?</Text>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        alignSelf: "center",
                        marginTop: 30,
                        width:'100%'
                        // borderWidth:1,
                        // borderColor: EDColors.white
                      }}
                    >
                      <TouchableOpacity
                        style={{ alignSelf: 'center', backgroundColor:EDColors.activeColor, width:'100%', height:50, justifyContent:'center'
                      , alignItems:'center', borderRadius:10 }}
                        onPress={() => {
                          this.onSignInClick();
                        }}
                      >
                        <Text style={{fontSize:20, color:'#FFF', fontWeight:'bold'}}>Log In</Text>
                      </TouchableOpacity>
                      <View
                        style={{
                          alignSelf: "center",
                          marginTop: 5
                        }}
                      >
                        <TouchableOpacity
                          style={{ flexDirection: 'row' }}
                          onPress={() => {
                            this.props.navigation.navigate("SignupContainer");

                          }}
                        >
                          <Text
                            style={{ color: "#999", fontSize: 16, marginTop: 10, fontFamily: ETFonts.regular }}>
                            {"Don't have an account?"}
                          </Text>
                          <Text style={{color:EDColors.activeColor, marginTop:10, fontSize:16, fontWeight:'bold', marginLeft:10}}>SIGN UP</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              // </View>
            }</View>


        </KeyboardAvoidingView>
      </ImageBackground>
      </>
    );
  }
}
import { Form } from "native-base";
import EDSkipButton from "../components/EDSkipButton";

export default connect(
  state => {
    console.log("State Value :::::: ", state)
    return {
      code: state.userOperations.code,
    };
  },
  dispatch => {
    return {
      saveCredentials: detailsToSave => {
        dispatch(saveUserDetailsInRedux(detailsToSave));
      },
      saveToken: token => {
        dispatch(saveUserFCMInRedux(token))
      }
    };
  }
)(LoginContainer);

const styleLogin = StyleSheet.create({
  logoText: {
    color: EDColors.primary1,
    textAlign: "center",
    fontFamily: ETFonts.bold,
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 40,
    alignSelf: "center"
  },
  TextInputStyle:{
    marginTop: 20,
    paddingTop: 20,
    paddingBottom: 0,
    paddingLeft:20,
    height : 40,
    width : 300,
    borderWidth: 1,
    borderColor: 'rgba(220,220,220,0.3)',
    backgroundColor:'rgba(220,220,220,0.3)',
    borderRadius: 18,
    fontSize: 14,
  },

  smallText: {
    color: EDColors.black,
    textAlign: "center",
    fontFamily: ETFonts.regular,
    fontSize: 15,
    marginTop: 30,
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
  },
  themeButton: {
    marginTop: 20,
    paddingTop: 10,
    paddingBottom: 10,
    height : 40,
    width : 300,
    borderWidth: 1,
    borderColor: EDColors.primary1,
    backgroundColor:EDColors.primary1,
    borderRadius: 18
  },
  themeButtonText: {
    color: EDColors.white,
    textAlign: "center",
    fontFamily: ETFonts.regular,
    fontSize: 16
  }

});
