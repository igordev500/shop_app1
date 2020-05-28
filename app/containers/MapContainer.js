import React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  ScrollView,
  Platform,
  AppState,
  PermissionsAndroid,
  KeyboardAvoidingView,
  Linking,
  Keyboard,
  Image,
  Animated,
  TouchableOpacity
} from "react-native";
import BaseContainer from "./BaseContainer";
import MainBaseContainer from "./MainBaseContainer";
import {
  RESPONSE_SUCCESS,
  GOOGLE_API_KEY,
  GET_ADDRESS,
  DELETE_ADDRESS,
  REGISTRATION_HOME
} from "../utils/Constants";
import { getUserToken } from "../utils/AsyncStorageHelper";
import ProgressLoader from "../components/ProgressLoader";
import { showValidationAlert, showDialogue } from "../utils/CMAlert";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import EditText from "../components/EditText";
let { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE = 40.726012237816;
const LONGITUDE = -73.98270405829;
const LATITUDE_DELTA = 0;
// const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const LONGITUDE_DELTA = 0;
import Geocoder from "react-native-geocoding";
import EDThemeButton from "../components/EDThemeButton";
import { EDColors } from "../assets/Colors";
import { Messages } from "../utils/Messages";
import { apiPost } from "../api/ServiceManager";
import { netStatus } from "../utils/NetworkStatusConnection";
import { isLocationEnable } from "../utils/LocationCheck";
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import Geolocation from "@react-native-community/geolocation";

import MainBottomMenu from './../utils/MainBottomMenu'
import MainTopMenu from './../utils/MainTopMenu'
import { StackActions, NavigationActions } from "react-navigation";
import Assets from "../assets";
import NavBar from "./NavBar";

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = width - 50;



export default class MapContainer extends React.Component {
  state = {
    isLoading: false,
    strAddress: "",
    addressLine1: "",
    latitude: 0.0,
    longitude: 0.0,
    city: "",
    zipCode: "",
    region: {
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    },
    // item: this.props.navigation.state.params.getDataAll,
    // getData: this.props.navigation.state.params.getData,
    isRefresh: false,
    appState: AppState.currentState,
  };

  constructor(props) {
    super(props);
    headerPhoneNum = "";
    this.foodType = "";
    this.distance = "";
  }


  componentDidMount() {
    console.log("--------------");
    this.loadData();
    getUserToken(
      success => {
        userObj = success;
        headerPhoneNum = success.PhoneNumber;
        this.loadData();
      },
      failure => {
        showValidationAlert(Messages.loginValidation);
      }
    );

    this.animation.addListener(({ value }) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
      if (index >= this.arrayAddress.length) {
        index = this.arrayAddress.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }
      clearTimeout(this.regionTimeout);
      this.regionTimeout = setTimeout(() => {
        if (this.index !== index) {
          this.index = index;
          const { latitude, longitude } = this.arrayAddress[index];
          this.map.animateToRegion(
            {
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: this.state.region.latitudeDelta,
              longitudeDelta: this.state.region.longitudeDelta,
            },
            350
          );
        }
      }, 10);
    });
  }

  componentWillMount() {
    // AppState.removeEventListener("change", this._handleAppStateChange);
    // if (Platform.OS == "android") {
    //   LocationServicesDialogBox.stopListener(); // Stop the "locationProviderStatusChange" listener.
    // }
    this.index = 0;
    this.animation = new Animated.Value(0);
  }

  loadData() {
    netStatus(status => {
      if (status) {
        this.setState({ isLoading: true });
        apiPost(
          GET_ADDRESS,
          {
            user_id: parseInt(userObj.UserID) || 0,
            token: "" + userObj.PhoneNumber
          },
          resp => {
            console.log("Response:",resp);
            if (resp != undefined) {

              if (resp.status == RESPONSE_SUCCESS) {
                console.log("Address======",resp);
                this.arrayAddress = resp.address;
                this.setState({ isLoading: false });
              } else {
                // showValidationAlert(resp.message);
                this.setState({ isLoading: false });
              }
            } else {
              showValidationAlert(Messages.generalWebServiceError);
              this.setState({ isLoading: false });
            }
          },
          err => {
            console.log("NetError+++++",err);
            this.setState({ isLoading: false });
            showValidationAlert(Messages.internetConnnection);
          }
        );
      } else {
        console.log("NetError====");
        showValidationAlert(Messages.internetConnnection);
      }
    });
  }

  GetRestaurant(lat, long, searchText) {

    let param = {
      latitude: lat,
      longitude: long,
      itemSearch: searchText,
      token: headerPhoneNum,
      food: "" + this.foodType,
      distance: "" + this.distance
    }

    console.log("HOME PARAMETER :::::::::::: ", param)
    netStatus(status => {
      if (status) {
        apiPost(
          REGISTRATION_HOME,
          param,
          resp => {
            if (resp != undefined) {
              console.log("PPPPP===", resp);
              if (resp.status == RESPONSE_SUCCESS) {
                this.arrayRestaurants = resp.restaurant;
              } else {
                showValidationAlert(resp.message);
              }
            } else {
              showValidationAlert(Messages.generalWebServiceError);
            }
          },
          err => {
            showValidationAlert(err.message || Messages.generalWebServiceError);
          }
        );
      } else {
        showValidationAlert(Messages.internetConnnection);
      }
    });
  }

  refreshScreen = () => {
    this.GetRestaurant(this.state.latitude, this.state.longitude, "");
  };

  fetchMarkerData() {
    fetch('https://feeds.citibikenyc.com/stations/stations.json')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ 
          isLoading: false,
          markers: responseJson.stationBeanList, 
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onTopMenuSelected = (select_index) => {
    // if(select_index === 0) return;
    
    switch(select_index){
        case 0:
          this.props.navigation.dispatch(
            StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({ routeName: "ProfileContainer" })
              ]
            })
          );
          break;
        case 1:
          
          break;
        case 2:
          this.props.navigation.dispatch(
            StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({ routeName: "SearchListContainer" })
              ]
            })
          );
          break;
    }
  };

  onBottomMenuSelected = (select_index) => {
    if(select_index === 1) return;
    
    switch(select_index){
        case 0:
          this.props.navigation.dispatch(
            StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({ routeName: "MainContainer" })
              ]
            })
          );
          break;
        case 1:
          this.props.navigation.dispatch(
            StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({ routeName: "MapContainer" })
              ]
            })
          );
          break;
        case 2:
          this.props.navigation.dispatch(
            StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({ routeName: "MyBookingContainer" })
              ]
            })
          );
          break;
    }
  };

  render() {
    
    return (
      <MainBaseContainer
        loading={this.state.isLoading}
      >
        <View>
          <View style={styles.statusBar} />
          <MainTopMenu selectedIndex={0} onItemSelected={this.onTopMenuSelected} />
        </View>

        <View style={{ flex: 1 }}>
          <View
            style={{
              margin: 10,
              flex: 1
            }}
          >
            <KeyboardAvoidingView
              behavior="padding"
              enabled
              style={{ flex: 1, backgroundColor: "#fff" }}
            >
              <View
                style={{
                  flex: 1,
                  padding: 2,
                  backgroundColor: EDColors.primary,
                  marginTop: 5
                }}
              >
                <MapView
                  provider={Platform.OS == "ios" ? null : PROVIDER_GOOGLE}
                  ref={map => this.map = map}
                  zoomControlEnabled={true}
                  zoomEnabled={true}
                  showsUserLocation={true}
                  zoom={100}
                  style={{
                    flex: 1,
                    justifyContent: "flex-end",
                    alignItems: "center",

                  }}
                  region={this.state.region}
                  onRegionChangeComplete={region => this.setState({ region })}
                >
                  {this.arrayAddress != undefined &&
                  this.arrayAddress != null &&
                  this.arrayAddress.length > 0 && (

                    this.arrayAddress.map((item, index) => {
                      return (
                        <Marker 
                          key={index}
                          coordinate={{
                                    latitude: parseFloat(item.latitude),
                                    longitude: parseFloat(item.longitude)
                                }}
                          // title={item.landmark}
                          image={Assets.address}
                          
                          onPress={() => {
                            console.log("ITEM===",item)
                            this.GetRestaurant(item.latitude,item.longitude,"");
                            restObjModel=this.arrayRestaurants;
                            if (restObjModel){
                              this.props.navigation.navigate(
                                "RestaurantContainer",
                                {
                                  refresh: this.refreshScreen,
                                  restId: restObjModel[0].restuarant_id
                                  // restId: 1
                                }
                              );
                            }
                          }}
                        >
                          <Animated.View style={[styles.markerWrap]}>
                            <Animated.View style={[styles.ring]} />
                            <View style={styles.marker} />
                          </Animated.View>
                        </Marker>
                      )
                    })
                  )}
                  
                </MapView>
                <Animated.ScrollView
                  horizontal
                  scrollEventThrottle={1}
                  showsHorizontalScrollIndicator={false}
                  snapToInterval={CARD_WIDTH+27.5}
                  onScroll={Animated.event(
                    [
                      {
                        nativeEvent: {
                          contentOffset: {
                            x: this.animation,
                          },
                        },
                      },
                    ],
                    { useNativeDriver: true }
                  )}
                  style={styles.scrollView}
                  contentContainerStyle={styles.endPadding}
                >
                  {this.arrayAddress != undefined &&
                  this.arrayAddress != null &&
                  this.arrayAddress.length > 0 && (

                    this.arrayAddress.map((item, index) => (
                      <View style={[styles.cardView, {width: width * 0.9}]}>
                        <View style={styles.body}>
                            <View style={styles.header}>
                              <View style={styles.titleContainer}>
                                <Text style={styles.titleText}>The Royal Dinner</Text>
                                <View style={styles.locationContainer} opacity={.8}>
                                  <Image style={{height: 15, width: 15, borderRadius: 5, margin: 5}} source={Assets.ic_location_grey}/>
                                  <Text style={{color:"#979797", flexShrink: 1}}>{`785, Prime Street, \nnear Grand Junction, \nWashington`}</Text>
                                </View>
                              </View>
                              <View style={styles.spacerWidth}/>
                              <View style={styles.imageContainer}>
                              <Image source={{
                                uri:"https://images.pexels.com/photos/733100/pexels-photo-733100.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260"
                              }}
                                resizeMode="cover"
                                style={{height: 75, width: 100, borderRadius: 10}}
                              />
                              </View>
                            </View>
                            <View style={styles.devider}/>
                            <View style={styles.footer}>
                                <Text style={styles.titleInformText}>Open New <Text style={styles.titleTimeText}> . 9am-11pm</Text></Text>
                                <View style={styles.spacerWidth}/>
                                <TouchableOpacity style={styles.button} activeOpacity={.6}>
                                  <Text style={styles.titleButtonText}>See More</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                      </View>
                    ))
                  )}
                </Animated.ScrollView>
              </View>


            </KeyboardAvoidingView>


          </View>
          <MainBottomMenu selectedIndex={1} onItemSelected={this.onBottomMenuSelected} style={styles.bottomMenu}/>
        </View>
      </MainBaseContainer>
    );
  }
}

const styles = StyleSheet.create({
  statusBar: {
    height: 50
  },
  bottomMenu:{
    position:'absolute',
    bottom:0
  },
  scrollView: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  cardView: { 
    flex: 1,
    // width: "50%",
    height: 160,
    paddingHorizontal: 5,
    marginHorizontal: 10,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"white",
    //borderWidth: 1,
    borderRadius: 10,
    borderColor:'white',
    elevation: 5,
  },
  body: { 
    flex: 1,
    paddingVertical: 10,
    width: "92%",
    height:"90%",
    justifyContent:'center',
    alignItems:"center",
    alignSelf:"center",
    //borderWidth: 1,
  },
  header: { 
    //flex: 3,
    justifyContent:'flex-start',
    flexDirection: "row",
    paddingBottom: 15,
    // borderWidth: 1
  },
  titleContainer:{ 
    alignSelf:"flex-start", 
    justifyContent:'flex-start', 
    marginTop: 10,
    //borderWidth: 1
  },
  locationContainer: { 
    flexDirection: "row",
    color: "gray",
    flex: 1, 
  },
  imageContainer: { 
    alignSelf: "flex-start", 
    marginTop: 10
  },
  footer: { 
    flexDirection: "row",
    alignItems:"center",
    justifyContent:"flex-start",
    paddingVertical:6
  },
  button: { 
    backgroundColor: "#86ce82",
    padding: 5, 
    paddingHorizontal:10, 
    borderRadius: 20
  },
  titleText: { 
    fontWeight:"bold", 
    color:"#393939"
  }, 
  titleInformText: { 
    flexDirection: "row", 
    paddingRight: 20, 
    color: "#86ce82",
    fontWeight:"bold"
  },
  titleTimeText: { 
    color: "#393939", 
    fontWeight: "bold"
  }, 
  titleButtonText: { 
    fontWeight: "bold", 
    color:"white"
  },
  devider: { 
    height: 1,
    borderBottomWidth: 1,
    borderColor: "#F5F4F1",
    width:"100%"
  },
  spacerWidth: { 
    flex: 1, 
    width: "100%"
  }
});

export async function requestLocationPermission(prop) {
  if (Platform.OS == "ios") {
    // _checkData(prop);
    return;
  }
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Eatance",
        message: "Allow Eatance to access your location "
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      // _checkData(prop);
    } else {
    }
  } catch (err) {
    console.warn(err);
  }
}