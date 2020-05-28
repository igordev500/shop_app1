import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import BaseContainer from "./BaseContainer";
import ProgressLoader from "../components/ProgressLoader";
import Assets from "../assets";
import { ETFonts } from "../assets/FontConstants";
import EDThemeButton from "../components/EDThemeButton";
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
import PlaidComponent from "../link/PlaidLink";

class PlaidConnect extends React.PureComponent {
  constructor(props) {
    super(props);
    this.checkoutDetail = this.props.checkoutDetail;
  }

  state = {
    isLoading: false,
    plaid_token : '',
    token : '',
    
  };

  componentDidMount(){
      
  }
  onMessage = (data) => {
    if( data.action === 'plaid_link-undefined::connected')
    {
        this.checkoutDetail.public_token = data.metadata.public_token;
        this.placeOrder();
    }
  }

  placeOrder(){
    netStatus(status => {
        if (status) {
          this.setState({ isLoading: true });
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
              this.setState({ isLoading: false });
            },
            error => {
              showValidationAlert(Messages.generalWebServiceError);
              this.setState({ isLoading: false });
            }
          );
        } else {
          showValidationAlert(Messages.internetConnnection);
        }
      });
  }
  render() {
    if( this.state.plaid_token === '')
    return (
        <BaseContainer
        title="Plaid Payment"
        left="Back"
        right={[]}
        onLeft={() => {
          this.props.navigation.goBack();
        }}
      >
      <PlaidComponent onMessage = {this.onMessage}  name={this.state.token}/>
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
)(PlaidConnect);

export const style = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%"
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
  }
});
