import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import BaseContainer from "./BaseContainer";
import { EDColors } from "../assets/Colors";
import { ETFonts } from "../assets/FontConstants";

import { connect } from "react-redux";
import { saveCartCount } from "../redux/actions/Checkout";
import { apiPost } from "../api/APIManager";
import { ADD_ORDER, RESPONSE_SUCCESS, INR_SIGN } from "../utils/Constants";
import { showDialogue, showValidationAlert } from "../utils/CMAlert";
import NavigationService from "../../NavigationService";
import {
    clearCartData
  } from "../utils/AsyncStorageHelper";
import { netStatus } from "../utils/NetworkStatusConnection";

import stripe from 'tipsi-stripe';
import Button from '../components/Button'

stripe.setOptions({
    publishableKey : 'pk_test_uSbQF4aWa1XKtqpuDWMNX0Yn00kFVbKu2A'
})

class StripeConnect extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
        loading: false,
        token: null,
      };
    this.checkoutDetail = this.props.checkoutDetail;
  }

  componentDidMount(){
      
  }

  handleCardPayPress = async () => {
    try {
      this.setState({ loading: true, token: null })
      const token = await stripe.paymentRequestWithCardForm({
        // Only iOS support this options
        smsAutofillDisabled: true,
        requiredBillingAddressFields: 'full',
        prefilledInformation: {
          billingAddress: {
            name: 'Gunilla Haugeh',
            line1: 'Canary Place',
            line2: '3',
            city: 'Macon',
            state: 'Georgia',
            country: 'US',
            postalCode: '31217',
            email: 'ghaugeh0@printfriendly.com',
          },
        },
      })

      this.setState({ loading: false, token })
    } catch (error) {
        console.log(error)
      this.setState({ loading: false })
    }
  }
  onContinue(){
    this.checkoutDetail.public_token = this.state.token;
    this.placeOrder();
  }

  placeOrder(){
    netStatus(status => {
        if (status) {
          this.setState({ loading: true });
          apiPost(
            ADD_ORDER,
            this.checkoutDetail,
            response => {
              if (response.error != undefined) {
                showValidationAlert(
                  response.error.message != undefined
                    ? response.error.message
                    : Messages.generalWebServiceError
                );
              } else {
                if (response.status == RESPONSE_SUCCESS) {
                  clearCartData(
                    response => {
                      this.props.navigation.navigate("OrderConfirm");
                    },
                    error => {}
                  );
                } else {
                  showValidationAlert(response.message);
                }
              }
              this.setState({ loading: false });
            },
            error => {
              showValidationAlert(Messages.generalWebServiceError);
              this.setState({loading: false });
            }
          );
        } else {
          showValidationAlert(Messages.internetConnnection);
        }
      });
  }
  render() {
    const { loading, token} = this.state
    return (
        <BaseContainer
        title="Stripe Payment"
        left="Back"
        right={[]}
        onLeft={() => {
          this.props.navigation.goBack();
        }}
      >
          <View style={style.container}>
            <Text style={{marginBottom: 50, fontSize: 30}} >{this.checkoutDetail.total}</Text>
            <Text style={style.instruction}>
            Click button to show Card Form dialog.
            </Text>
            <Button
                text="Enter your card and pay"
                loading={loading}
                onPress={this.handleCardPayPress}
            />
            <View style={{height : 20}} ></View>
            {this.state.token && (
              <TouchableOpacity
              style={style.roundButton}
              onPress={() => this.onContinue() }
            >
              <Text style={style.button}>CONTINUE</Text>
            </TouchableOpacity>
          )}
        </View>
      </BaseContainer>
    );
  }
}

export default connect(
  state => {
    return {
        checkoutDetail: {...state.checkoutReducer.checkoutDetail},
        userID: state.userOperations.userIdInRedux,
        token: state.userOperations.phoneNumberInRedux,
        cartCount: state.checkoutReducer.cartCount
    };
  },
  dispatch => {
    return {
      saveCartCount: data => {
        dispatch(saveCartCount(data));
      }
    };
  }
)(StripeConnect);

export const style = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  thankyouText: {
    fontFamily: ETFonts.satisfy,
    fontSize: 20,
    color: "#000",
    marginTop: 20
  },
  subContainer: {
    flex: 1,
    justifyContent: "flex-end"
  },
  roundButton: {
    alignSelf: "center",
    margin: 10,
    backgroundColor: EDColors.primary,
    borderRadius: 4
  },
  button: {
    paddingTop: 10,
    paddingRight: 20,
    paddingLeft: 20,
    paddingBottom: 10,
    color: "#fff",
    fontFamily: ETFonts.regular
  },
 
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instruction: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  token: {
    height: 20,
  },
});
