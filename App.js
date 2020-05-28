/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from "react";
// import { BASE_STACK_NAVIGATOR } from "./app/components/RootNavigator";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import { userOperations } from "./app/redux/reducers/UserReducer";
import { navigationOperation } from "./app/redux/reducers/NavigationReducer";
import { checkoutDetailOperation } from "./app/redux/reducers/CheckoutReducer";
// import firebase from "react-native-firebase";
import { View } from "react-native";
import { showDialogue } from "./app/utils/CMAlert";
import AsyncStorage from "@react-native-community/async-storage";
import messaging from '@react-native-firebase/messaging';

import NavigationService from "./NavigationService";
import {
  NOTIFICATION_TYPE,
  DEFAULT_TYPE,
  ORDER_TYPE
} from "./app/utils/Constants";

import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer';
import SplashContainer from "./app/containers/SplashConainer";
import LoginContainer from "./app/containers/LoginContainer";
import SignupContainer from "./app/containers/SignupContainer";
import MainContainer from "./app/containers/MainContainer";
import OTPContainer from "./app/containers/OTPContainer";
import RecipeContainer from "./app/containers/RecipeContainer";
import SideBar from "./app/components/SideBar";
import Restaurant from "./app/containers/Restaurant";
import BookingAvailabilityContainer from "./app/containers/BookingAvailabilityContainer";
import EventBookContainer from "./app/containers/EventBookContainer";
import MyBookingContainer from "./app/containers/MyBookingContainer";
import BookingSuccessContainer from "./app/containers/BookingSuccessContainer";
import AddressMapContainer from "./app/containers/AddressMapContainer";
import AddressListContainer from "./app/containers/AddressListContainer";
import ProfileContainer from "./app/containers/ProfileContainer";
import ChangePasswordContainer from "./app/containers/ChangePasswordContainer";
import FilterContainer from "./app/containers/FilterContainer";
import RestaurantDetail from "./app/containers/RestaurantDetail";
import CartContainer from "./app/containers/CartContainer";
import PromoCode from "./app/containers/PromoCode";
import CMSContainer from "./app/containers/CMSContainer";
import PrivacyPolicy from "./app/containers/PrivacyPolicy";
import PaymentContainer from "./app/containers/PaymentContainer";
import OrderConfirm from "./app/containers/OrderConfirm";
import InitialContainer from "./app/containers/InitialContainer";
import MyOrderContainer from "./app/containers/MyOrderContainer";
import RecipeDetail from "./app/containers/RecipeDetail";
import NotificationList from "./app/containers/NotificationList";
import OrderDetailContainer from "./app/containers/OrderDetailContainer";
import TrackOrderContainer from "./app/containers/TrackOrderContainer";
import MapContainer from "./app/containers/MapContainer";
import PlaidContainer from './app/containers/PlaidContainer';
import StripeContainer from './app/containers/StripeContainer';

console.disableYellowBox = true;
export const HOME_SCREEN_DRAWER = createDrawerNavigator(
  {
    Home: {
      screen: MainContainer
    },
    Recipe: {
      screen: RecipeContainer
    },
    Event: {
      screen: BookingAvailabilityContainer
    },
    MyBooking: {
      screen: MyBookingContainer
    },
    Notification: {
      screen: NotificationList
    },
    Order: {
      screen: MyOrderContainer
    },
    CMSContainer: {
      screen: CMSContainer
    }
  },
  {
    initialRouteName: "Home",
    initialRouteParams: "Home",
    drawerLockMode: "locked-closed",
    // backBehavior: "none",
    contentComponent: props => <SideBar {...props} />
  }
);

export const BASE_STACK_NAVIGATOR = createStackNavigator(
  {
    InitialContainer: {
      screen: InitialContainer
    },
    SplashContainer: {
      screen: SplashContainer
    },
    LoginContainer: {
      screen: LoginContainer
    },
    SignupContainer: {
      screen: SignupContainer
    },
    MainContainer: {
      screen: HOME_SCREEN_DRAWER
    },
    OTPContainer: {
      screen: OTPContainer
    },
    MY_ORDER_NAVIGATOR: {
      screen: MyOrderContainer
    },
    RestaurantContainer: {
      screen: Restaurant
    },
    ProfileContainer: {
      screen: ProfileContainer
    },
    ChangePasswordContainer: {
      screen: ChangePasswordContainer
    },
    CategoryContainer: {
      screen: RestaurantDetail
    },
    Filter: {
      screen: FilterContainer
    },
    CartContainer: {
      screen: CartContainer
    },
    PromoCodeContainer: {
      screen: PromoCode
    },
    AddressListContainer: {
      screen: AddressListContainer
    },
    CMSContainer: {
      screen: CMSContainer
    },
    PrivacyPolicy: {
      screen: PrivacyPolicy
    },
    AddressMapContainer: {
      screen: AddressMapContainer
    },
    PaymentContainer: {
      screen: PaymentContainer
    },
    PlaidContainer: {
      screen: PlaidContainer
    },
    StripeContainer: {
      screen: StripeContainer
    },
    OrderConfirm: {
      screen: OrderConfirm
    },
    InitialContainer: {
      screen: InitialContainer
    },
    SplashContainer: {
      screen: SplashContainer
    },
    LoginContainer: {
      screen: LoginContainer
    },
    MyBookingContainer: {
      screen: MyBookingContainer
    },
    MapContainer: {
      screen: MapContainer
    },
    TrackOrderContainer: {
      screen: TrackOrderContainer
    },

    RecipeContainer: {
      screen: RecipeContainer
    },
    FilterContainer: {
      screen: Restaurant
    },
    RecipeDetail: {
      screen: RecipeDetail
    },
    Filter: {
      screen: FilterContainer
    },
    NotificationContainer: {
      screen: NotificationList
    },
    EventContainer: BookingAvailabilityContainer,
    EventBookContainer: EventBookContainer,
    BookingSuccess: BookingSuccessContainer,
    MyBookingContainer: MyBookingContainer,

    MyOrderContainer: {
      screen: MyOrderContainer
    },
    TrackOrderContainer: {
      screen: TrackOrderContainer
    },
    ProfileContainer: {
      screen: ProfileContainer
    },
    AddressListContainer: {
      screen: AddressListContainer
    },
    PrivacyPolicy: {
      screen: PrivacyPolicy
    },
    AddressMapContainer: {
      screen: AddressMapContainer
    },
    OrderDetailContainer: {
      screen: OrderDetailContainer
    },
    NotificationContainer: {
      screen: NotificationList
    },
    CMSContainer: {
      screen: CMSContainer
    }
  },
  {
    initialRouteName: "InitialContainer",
    headerMode: "none"
  }
);


const AppCon =  createAppContainer(BASE_STACK_NAVIGATOR);

const rootReducer = combineReducers({
  userOperations: userOperations,
  navigationReducer: navigationOperation,
  checkoutReducer: checkoutDetailOperation
});

const eatanceGlobalStore = createStore(rootReducer);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.isNotification = undefined;
  }

  state = {
    isRefresh: false
  };

  //1
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

  UNSAFE_componentWillUnmount=async() => {
    try {
      this.notificationListener();
      this.notificationOpenedListener();
    } catch (error) { }
  }

  async createNotificationListeners() {
    /*
     * Triggered when a particular notification has been received in foreground
     * */
    this.notificationListener = messaging().onMessage(notification => {
        const { title, body, data } = notification;

        console.log("NOTIFICATION TYPE :::::::::::::::: ", notification)

          showDialogue(body, [], "",
          () => {
            
            if (data.screenType === "order") {
              // this.setState({ isRefresh: !this.state.isRefresh },NavigationService.navigate("Order"));
              NavigationService.navigateToSpecificRoute("Order")

              // NavigationService.navigate("Order",NavigationActions.navigate({ routeName: 'Home' }))
            }
            else if (data.screenType === "noti") {
              NavigationService.navigateToSpecificRoute("NotificationContainer");
            }else if(data.screenType === "delivery"){
              NavigationService.navigateToSpecificRoute("Order")
            }

          })
        // }
        

      });

    /*
     * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
     * */
    
    this.notificationOpenedListener = messaging()
      .onNotificationOpenedApp(notificationOpen => {
        const { title, body, data } = notificationOpen.notification;
        console.log("NOTIFICATION OPEN TYPE :::::::::::::::: ", notificationOpen.notification)
        // if(data.screenType === "delivery"){
        //   showDialogue(body, [
        //     {
        //       text: "Cancel",
        //       onPress: () => {
        //         // this.isNotification = "isDelivered"
        //         // this.setState({ isRefresh: this.state.isRefresh ? false : true });
        //         NavigationService.navigateToSpecificRoute("Order")
        //       }
        //     }
        //   ],
        //   () => {
        //     // this.isNotification = "isDelivered"
        //     // this.setState({ isRefresh: this.state.isRefresh ? false : true });
        //     NavigationService.navigateToSpecificRoute("Order")
        //   })
        // }else{
          // showDialogue(body, [], "",
          // () => {
            
            if (data.screenType === "order") {
              
              NavigationService.navigateToSpecificRoute("Order")
              // this.setState({ isRefresh: !this.state.isRefresh },NavigationService.navigate("Order"));
              
            }
            else if (data.screenType === "noti") {

              // this.props.navigation.dispatch(
              //   StackActions.reset({
              //     index: 0,
              //     key: null,
              //     actions: [NavigationActions.navigate({ routeName: "Order" })]
              //   })
              // );
              // this.props.navigation.navigate("Order");
              // NavigationService.navigate("NotificationContainer");
              NavigationService.navigateToSpecificRoute("NotificationContainer")
            }else if(data.screenType === "delivery"){
              NavigationService.navigateToSpecificRoute("Order")
            }

      });

    /*
     * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
     * */
    const notificationOpen = await messaging()
      .getInitialNotification();
    if (notificationOpen) {
      const {
        title,
        body,
        data,
        notificationId
      } = notificationOpen.notification;

      const lastNotification = await AsyncStorage.getItem("lastNotification");
      console.log("NOTIFICATION DATA :::::::::::::::: ", data)
      if (lastNotification !== notificationId) {
        if (data.screenType === "order") {
          this.isNotification = ORDER_TYPE;
          this.setState({ isRefresh: this.state.isRefresh ? false : true });
        } else if (data.screenType === "noti") {
          this.isNotification = NOTIFICATION_TYPE;
          this.setState({ isRefresh: this.state.isRefresh ? false : true });
        }
        await AsyncStorage.setItem("lastNotification", notificationId);
      }
    }
    /*
     * Triggered for data only payload in foreground
     * */
    this.messageListener =messaging().onMessage(message => {
      //process data message
    });

    if (this.isNotification == undefined) {
      this.isNotification = DEFAULT_TYPE;
      this.setState({ isRefresh: this.state.isRefresh ? false : true });
    }
  }

  async componentDidMount() {
    this.checkPermission();
    this.createNotificationListeners();
  }

  render() {
    // console.log("ISNOTIFICATION :::::::::::::: ", this.isNotification)
    return (
      <Provider store={eatanceGlobalStore}>
        {/* {this.isNotification != undefined ? ( */}
          <AppCon
            ref={navigatorRef => {
              NavigationService.setTopLevelNavigator(navigatorRef);
            }}
            
            screenProps={this.isNotification}
          />
        {/* ) : (
            <View />
          )} */}
      </Provider>
    );
  }
}

