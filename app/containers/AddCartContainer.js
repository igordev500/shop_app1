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
import { StyleSheet } from "react-native";

class AddCartContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    phoneNumber: "",
    forgotPwdPhoneNumber: "",
    password: "",
    isLoading: false,
    modelVisible: false,
    isForgotValidate: false,
    firebaseToken: "",
    usernameError: "",
    passwordError: "",
    forgotPwdMsg: ""
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
    if (this.validation()) {
      this.addCart();
    }
  }

  validation() {
      /*
    if (this.state.phoneNumber.trim() === "") {
      this.setState({
        usernameError: Messages.validationPhoneMsg,
        passwordError: ""
      });
      return false;
    }
    else if (this.state.phoneNumber.trim().length < 9) {
      this.setState({
        usernameError: Messages.phoneValidationString,
        passwordError: ""
      });
      return false;
    }
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
    */
    return true;
  }

  addCart() {
    netStatus(status => {
      if (status) {
        /*console.log("Firebase Token :::::::::: ", this.state.firebaseToken)
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
        */
      } else {
        showValidationAlert(Messages.internetConnnection);
      }
    });
  }

  render() {
    return (

      <ImageBackground source={Assets.bgSplash} style={{ width: '100%', height: '100%' }}>
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
            {this.state.modelVisible ? null :
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
                    flex: 3,
                    justifyContent: "flex-start"
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
                      marginTop: 30
                    }}
                  />
                  <Text style={styleAddCart.logoText}>
                    Add Your Credit {"\n"}
                    Card
                  </Text>
                </View>

                <View style={{ flex: 4 }}>
                  <View style={Style.loginView}>
                    <EDTextViewNormal text="Card Number" />
                    <EditText
                      keyboardType="default"
                      secureTextEntry={false}
                      hint="Card Number"
                      // isCode={true}
                      // codeLabel={this.props.code}
                      maxLength={20}
                      value={this.state.cardNumber}
                      onChangeText={text => {
                        //var newText = text.replace(/[^0-9]/g, "");
                        this.setState({ cardNumber: text });
                      }}
                    />
                    {this.state.cardNumError ? 
                    <ETextErrorMessage
                      errorStyle={{ marginTop: 3 }}
                      errorMsg={this.state.cardNumError}
                    />
                    : null}

                    <View style={{flexDirection:"row"}}>
                      <View style={{flex:1,marginBottom:10}}>
                        <TextInput
                          style={
                            styleAddCart.TextInputStyle
                          }
                          keyboardType="default"
                          secureTextEntry={true}
                          maxLength={
                            15
                          }
                          onChangeText={text => {
                            this.state.expirationDate = text;
                          }}
                          placeholder="Expiration Date"
                          returnKeyType="done"
                        />
                      </View>
                      <View style={{flex:1,marginBottom:10}}>
                      <TextInput
                        style={
                          styleAddCart.TextInputStyle1
                        }
                        keyboardType="default"
                        secureTextEntry={true}
                        maxLength={
                          15
                        }
                        onChangeText={text => {
                          this.state.expirationDate = text;
                        }}
                        placeholder="CVV"
                        returnKeyType="done"
                      />
                      </View>
                    </View>
                    {this.state.expriationDateError?
                    <ETextErrorMessage
                      errorStyle={{ marginTop: 3 }}
                      errorMsg={this.state.passwordError}
                    />:null}

                    <EditText
                      keyboardType="default"
                      secureTextEntry={false}
                      hint="Cardholder Name"
                      // isCode={true}
                      // codeLabel={this.props.code}
                      maxLength={20}
                      value={this.state.cardHolderName}
                      onChangeText={text => {
                        //var newText = text.replace(/[^0-9]/g, "");
                        this.setState({ cardHolderName: text });
                      }}
                    />
                    {this.state.cardNumError ? 
                    <ETextErrorMessage
                      errorStyle={{ marginTop: 3 }}
                      errorMsg={this.state.cardNumError}
                    />
                    : null}
                    <View
                      style={{
                        alignSelf: "center",
                        marginTop: 10,
                        // borderWidth:1,
                        // borderColor: EDColors.white
                      }}
                    >
                      <EDSkipButton
                        // label="SIGN IN"
                        label="Add your Card"
                        style={{ alignSelf: 'center' }}
                        onPress={() => {
                          this.props.navigation.goBack();
                        }}
                      />
                      <View
                        style={{
                          alignSelf: "center",
                          marginTop: 5
                        }}
                      >
                        <TouchableOpacity
                          style={{ flexDirection: 'row' }}
                          onPress={() => {
                            this.props.navigation.goBack();

                          }}
                        >
                          <Text
                            style={{ color: EDColors.gray, fontSize: 14, marginTop: 10, fontFamily: ETFonts.regular }}>
                            {"Want to add another card?"}
                          </Text>
                          <EDTextViewNormal style={{ fontSize: 14 }} text=" HERE" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            }</View>


        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}
import { Form } from "native-base";
import EDSkipButton from "../components/EDSkipButton";


export default connect(
  /*
  state => {
    //console.log("State Value :::::: ", state)
   / return {
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
  */
)(AddCartContainer);


const styleAddCart = StyleSheet.create({
  
  margin10:{
   marginLeft:10
  },
  logoText: {
    color: EDColors.primary1,
    textAlign: "center",
    fontFamily: ETFonts.bold,
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 40,
    alignSelf: "center"
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
  TextInputStyle:{
    fontSize: 14,
    borderBottomColor: 'rgb(200,200,200)',
    borderBottomWidth: 1,
    marginTop: 10,
    paddingBottom:10
  },
  TextInputStyle1:{
    fontSize: 14,
    borderBottomColor: 'rgb(200,200,200)',
    borderBottomWidth: 1,
    marginTop: 10,
    paddingBottom:10,
    marginLeft:10
  },
  ImageIconStyle: {
    alignSelf: "center",
    resizeMode: "contain",
    width: 30,
    height: 30
  }
});
