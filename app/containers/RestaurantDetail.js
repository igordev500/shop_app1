import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SectionList,
  ScrollView,
  Modal,
  Dimensions,
  TouchableOpacity,
  Platform
} from "react-native";
import BaseContainer from "./BaseContainer";
import Assets from "../assets";
import ProgressLoader from "../components/ProgressLoader";
import { ETFonts } from "../assets/FontConstants";
import { EDColors } from "../assets/Colors";
import {
  saveCartData,
  getCartList,
  getUserToken
} from "../utils/AsyncStorageHelper";
import {
  GET_RESTAURANT_DETAIL,
  RESPONSE_SUCCESS,
  RESPONSE_FAIL,
  INR_SIGN,
  CART_PENDING_ITEMS
} from "../utils/Constants";
import { Messages } from "../utils/Messages";
import { showValidationAlert } from "../utils/CMAlert";
import { apiPostFormData } from "../api/APIManager";
import { connect } from "react-redux";
import { saveCartCount } from "../redux/actions/Checkout";
import { netStatus } from "../utils/NetworkStatusConnection";
import {WebView} from "react-native-webview";
import Toast, { DURATION } from "react-native-easy-toast";
import MainBaseContainer from "./MainBaseContainer";
import MainBottomMenu from './../utils/MainBottomMenu'
import MainTopMenu from './../utils/MainTopMenu';
import MiddleNav from './MiddleNavContainer';
import { StackActions, NavigationActions } from "react-navigation";
import { FlatList } from "react-native-gesture-handler";
import ShadowView from 'react-native-simple-shadow-view';

class RestaurantDetail extends React.PureComponent {
  constructor(props) {
    super(props);

    this.isClose = ""
    getUserToken(
      success => {
        user = success;
      },
      fail => { }
    );
    this.resId = this.props.navigation.state.params.resid;
    this.menuItem = [];
    this.foodType = "";
    this.priceType = "";
    this.cartCount = 0;
    
    this.fontSize = Platform.OS == "ios" ? "18px" : "18px";
    this.meta =
      '<head><meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0"></head>';

    this.customStyle =
      this.meta +
      "<style>* {max-width: 100%;} body {font-size:" +
      this.fontSize +
      ";}</style>";
  }

  componentDidMount() {
    this.getRestaurantDetails();
  }

  getRestaurantDetails() {
    netStatus(status => {
      if (status) {
        this.setState({ isLoading: true });
        const formData = new FormData();
        formData.append("restaurant_id", parseInt(this.resId));
        formData.append("food", this.foodType);
        formData.append("price", this.priceType);

        // {
        //   restaurant_id: parseInt(this.resId),
        //   food: this.foodType,
        //   price: this.priceType
        // }

        apiPostFormData(
          GET_RESTAURANT_DETAIL,
          formData,
          response => {
            if (response.error != undefined) {
              showValidationAlert(
                response.error.message != undefined
                  ? response.error.message
                  : Messages.generalWebServiceError
              );
            } else if (response.status == RESPONSE_SUCCESS) {
              this.menuItem = [
                {
                  title: "",
                  data: [{ uri: this.props.navigation.state.params.image }],
                  isShow: false,
                  index: 0
                }
              ];

              if (response.menu_item.length > 0) {
                response.menu_item.map((item, index) => {
                  this.menuItem[index + 1] = {
                    title: item.category_name,
                    data: item.items,
                    isShow: index == 0 ? true : false,
                    index: index + 1
                  };
                });
              }

              // this.isClose = response.restaurant[0].timings.closing
              this.setState({ isLoading: false, isClose: response.restaurant[0].timings.closing, renderData: this.menuItem.length >1 ?this.menuItem[1]["data"] : [] });
            } else if (response.status == RESPONSE_FAIL) {
              this.setState({ isLoading: false });
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

  state = {
    isLoading: false,
    isEnable: false,
    visible: false,
    selectedMDindex : 1,
    isClose: "",
    data: "",
    itemTitle: "",
    menuItem: [
      {
        title: "",
        data: [{ uri: this.props.navigation.state.params.image }],
        isShow: false,
        index: 0
      }
    ],
    renderData : [],
  };

  openSideDrawer = () => {
    this.props.navigation.goBack();
  };

  testFunction = data => {
    this.foodType = data.food;
    this.priceType = data.price;

    this.getRestaurantDetails();
  };

  rightClick = index => {
    if (index == 0) {
      if (this.props.cartCount > 0) {
        this.props.navigation.navigate("CartContainer");
      } else {
        showValidationAlert(Messages.cartItemNotAvailable);
      }
    } else if (index == 1) {
      this.props.navigation.navigate("Filter", {
        getFilterDetails: this.testFunction,
        filterType: "menu",
        food: this.foodType,
        price: this.priceType
      });
    }
  };

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
                NavigationActions.navigate({ routeName: "MyBookingContainer" })
              ]
            })
          );
          break;
    }
  };

  onBottomMenuSelected = (select_index) => {
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

  onSearch(){

  }

  onMiddleSelect(item,index){
      this.setState({selectedMDindex:index, renderData:item.data})
  }
  render() {
    this.props.navigation.addListener("didFocus", payload => {
      getCartList(
        success => {
          if (success != undefined) {
            cartData = success.items;
            if (cartData.length > 0) {
              var count = 0;
              cartData.map((item, index) => {
                count = count + item.quantity;
              });

              this.props.saveCartCount(count);
            } else if (cartData.length == 0) {
              this.props.saveCartCount(0);
            }
          } else {
          }
        },
        onCartNotFound => { },
        error => { }
      );
    });

    
  
    return (
      <>
      <MainBaseContainer>
        <Toast ref="toast" position="center" fadeInDuration={0} />
        <MainTopMenu selectedIndex={0} onItemSelected={this.onTopMenuSelected} identy = {"order"} onRight={this.rightClick}
         item={{url: Assets.ic_cart_blue, name: "Cart", value: this.props.cartCount}}
         />
        <View style={{ flex: 1 }}>
          {this.state.isLoading ? <ProgressLoader /> : null}
          <Modal
            visible={this.state.visible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => {
              this.setState({ visible: false });
            }}
          >
            <View style={style.modalContainer}>
              <View style={style.modalSubContainer}>
                <View style={{ flexDirection: "row", height: 20 }}>
                  <Text
                    style={{
                      flex: 1,
                      alignSelf: "center",
                      textAlign: "center",
                      fontFamily: ETFonts.bold,
                      color: "#000",
                      fontSize: 15
                    }}
                    html={this.state.data}
                  >
                    {this.state.data.name}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ visible: false });
                    }}
                  >
                    <Image
                      style={{ alignSelf: "center", height: 15, width: 15 }}
                      source={Assets.ic_close}
                    />
                  </TouchableOpacity>
                </View>

                <Image
                  source={{ uri: this.state.data.image }}
                  style={{
                    width: "100%",
                    height: 180,
                    marginTop: 10,
                    borderRadius: 6
                  }}
                />
                <WebView
                  source={{
                    html: this.customStyle + this.state.data.receipe_detail
                  }}
                  width="100%"
                  startInLoadingState={true}
                  style={{
                    flex: 1,
                    alignSelf: "flex-start",
                    paddingBottom: Platform.OS == "ios" ? 0 : 15
                    // width: "100%"
                  }}
                  scrollEnabled={true}
                />
              </View>
            </View>
          </Modal>
          {this.menuItem.length > 1 ? (
            <View >
            <ScrollView  >
                <View style={{flex:1}}>
                 <Image
                      source={{
                        uri: this.menuItem[0]["data"][0].uri
                      }}
                      style={{ width: "100%", height: 220 }}
                    />
                  <MiddleNav 
                    left="Back"
                    right={[
                      { url: Assets.search_blue, name: "Search", value: this.props.cartCount },
                    ]}
                    onLeft={this.openSideDrawer}
                    onSearch={this.onSearch}
                  />
                  <View style={{padding:5}}>
                    {this.state.isClose.toLowerCase() !== "open" ?
                    <Text style={{flex:1, color:'red', alignSelf:'center', fontFamily: ETFonts.bold}}>{"Currently not accepting orders....!!!"}</Text>
                    : null}
                  </View>
                </View>
                <ShadowView style={style.middelCon}>
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    data={this.menuItem}
                    horizontal={true}
                    renderItem={({item, index})=>{
                      return (
                        <>
                        {item.title !== "" && (<TouchableOpacity
                         style={this.state.selectedMDindex === index ? style.selmenuCon:style.menuCon} 
                         onPress={()=>this.onMiddleSelect(item,index)}>
                            <Text >{item.title}</Text>
                        </TouchableOpacity>)}
                        </>
                      )
                    }}
                    keyExtractor = {({index})=>index.toString()}
                  />
                </ShadowView>
                <View style={{height:2, marginTop:2, width:'100%', backgroundColor:'#ddd'}}></View>
                {this.menuItem.length > 1 && (this.nestedItem(this.state.renderData))}
            </ScrollView>
                  

            </View>
            // <SectionList
            //   showsVerticalScrollIndicator={false}
            //   extraData={this.state}
            //   renderSectionHeader={({ section: { title, index, isShow } }) => {
            //     return title != "" ? (
            //       this.itemHeader(title, index, isShow)
            //     ) : (
            //         <View />
            //       );
            //   }}
            //   sections={this.menuItem}
            //   renderItem={({ item, index, section }) => {
            //     if (section.index == 0) {
            //       return (
            //         <View style={{flex:1}}>
            //         <Image
            //           source={{
            //             uri: item.uri
            //           }}
            //           style={{ width: "100%", height: 220 }}
            //         />
            //         <MiddleNav 
            //           left="Back"
            //           right={[
            //             { url: Assets.search_blue, name: "Search", value: this.props.cartCount },
            //           ]}
            //           onLeft={this.openSideDrawer}
            //           onSearch={this.onSearch}
            //         />
            //         <View style={{padding:5}}>
            //           {this.state.isClose.toLowerCase() !== "open" ?
            //           <Text style={{flex:1, color:'red', alignSelf:'center', fontFamily: ETFonts.bold}}>{"Currently not accepting orders....!!!"}</Text>
            //           : null}
            //         </View>
            //         </View>
            //       );
            //     } else {
            //       if (section.isShow) {
            //         return this.nestedItem(item);
            //       } else {
            //         return null;
            //       }
            //     }
            //   }}
            //   keyExtractor={(item, index) => item + index}
            // />
          ) : this.menuItem.length > 0 ? (
            <View style={{ flex: 1 }}>
              <Image
                source={{
                  uri: this.props.navigation.state.params.image
                }}
                style={{ width: "100%", height: 200 }}
              />
              {this.emptyView()}
            </View>
          ) : null}
        </View>
      </MainBaseContainer>
        <MainBottomMenu selectedIndex={0} onItemSelected={(index)=>this.onBottomMenuSelected(index)} style={style.bottomMenu}/>
      </>
    );
  }

  emptyView() {
    return <Text style={style.emptyView}>No Data Found</Text>;
  }

  itemHeader(data, index, isShow) {
    console.log(data)

    return (
      <TouchableOpacity
        activeOpacity={1.0}
        style={style.itemContainer}
        onPress={() => {
          if (isShow) {
            this.menuItem[index].isShow = false;
            this.setState({ isEnable: this.state.isEnable ? false : true });
          } else {
            this.menuItem[index].isShow = true;
            this.setState({ isEnable: this.state.isEnable ? false : true });
          }
        }}
      >
        <Text style={style.itemTitle}>{data}</Text>
        <Image
          style={style.rightImage}
          source={isShow ? Assets.ic_down_arrow : Assets.ic_up_arrow}
        />
      </TouchableOpacity>
    );
  }

  nestedItem(data1) {
    return data1.map((data)=> {
      return (
        <TouchableOpacity
          onPress={() => {
            this.setState({
              visible: true,
              data: data
            });
          }}
        >
          <View style={style.nestedContainer}>
            
            <View style={{ flex: 4, marginLeft: 10, marginRight: 10 }}>
              <View style={{ flexDirection: "row" }}>
                {/* <View
                  style={{
                    borderWidth: 1,
                    borderColor: data.is_veg == "1" ? "#239957" : "#A52A2A",
                    alignSelf: "center"
                  }}
                >
                  <View
                    style={{
                      width: 7,
                      height: 7,
                      margin: 2,
                      borderRadius: 6,
                      backgroundColor: data.is_veg == "1" ? "#239957" : "#A52A2A"
                    }}
                  />
                </View> */}
                <Text style={style.nestedTitle}>{data.name}</Text>
              </View>
              <Text style={style.nestedDesc}>{data.menu_detail}</Text>
  
              <Text style={style.nestedPrice}>{INR_SIGN + " " + data.price}</Text>
            </View>
  
            {/* <View style={{ alignSelf: "center" }}>
                    {this.state.isClose.toLowerCase() === "open" ? 
              <TouchableOpacity
                onPress={() => {
                  this.storeData(data);
                }}
              >
                <View style={style.nestedRoundView}>
                  <Image
                    source={Assets.ic_plus_yellow}
                    style={{
                      width: 10,
                      height: 10
                    }}
                  />
                </View>
              </TouchableOpacity>
              :
              null}
            </View> */}
          
            <Image
              source={{ uri: data.image }}
              style={{ height: 60, width: 60, borderRadius: 0 }}
            />
          </View>
        </TouchableOpacity>
      );
    })
  }

  storeData(data) {
    var cartArray = [];
    var cartData = {};
    //demo changes
    getCartList(
      success => {
        if (success != undefined) {
          cartArray = success.items;

          if (cartArray.length > 0) {
            if (success.resId == this.resId) {
              //cart has already data
              var repeatArray = cartArray.filter(item => {
                return item.menu_id == data.menu_id;
              });

              if (repeatArray.length > 0) {
                repeatArray[0].quantity = repeatArray[0].quantity + 1;
              } else {
                data.quantity = 1;
                cartArray.push(data);
              }

              cartData = {
                resId: this.resId,
                items: cartArray,
                coupon_name:
                  success.coupon_name.length > 0 ? success.coupon_name : "",
                cart_id: success.cart_id
              };
              console.log("CART DATA :::::::: ", cartData)
              this.updateCount(cartData.items);
              this.saveData(cartData);
            } else {
              showValidationAlert(CART_PENDING_ITEMS);
            }
          } else if (cartArray.length == 0) {
            //cart empty
            data.quantity = 1;
            cartData = {
              resId: this.resId,
              items: [data],
              coupon_name: "",
              cart_id: 0
            };
            this.updateCount(cartData.items);
            this.saveData(cartData);
          }
        } else {
          //cart has no data
          data.quantity = 1;
          cartData = {
            resId: this.resId,
            items: [data],
            coupon_name: "",
            cart_id: 0
          };

          this.updateCount(cartData.items);
          this.saveData(cartData);
        }
      },
      onCartNotFound => {
        //first time insert data
        console.log("onCartNotFound", onCartNotFound);
        data.quantity = 1;
        cartData = {
          resId: this.resId,
          items: [data],
          coupon_name: "",
          cart_id: 0
        };

        this.updateCount(cartData.items);
        this.saveData(cartData);
      },
      error => {
        console.log("onCartNotFound", error);
      }
    );
  }

  updateCount(data) {
    console.log("toast call");
    this.refs.toast.show("Item added successfully!", DURATION.LENGTH_SHORT);
    var count = 0;
    data.map((item, index) => {
      count = count + item.quantity;
    });

    this.props.saveCartCount(count);
    console.log("saveCartCount", saveCartCount);
  }

  saveData(data) {
    saveCartData(data, success => { }, fail => { });
  }
}

export default connect(
  state => {
    console.log("redux ", state);
    return {
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
)(RestaurantDetail);

export const style = StyleSheet.create({
  container: {
    flex: 1
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.50)"
  },
  emptyView: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
    alignContent: "center",
    color: "#000",
    fontSize: 15,
    fontFamily: ETFonts.regular
  },
  modalSubContainer: {
    backgroundColor: "#fff",
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 6,
    width: Dimensions.get("window").width - 40,
    height: Dimensions.get("window").height - 80,
    marginTop: 20,
    marginBottom: 20
  },
  itemContainer: {
    alignSelf: "flex-start",
    flexDirection: "row",
    margin: 5,
    padding: 4,
    borderRadius: 4,
    backgroundColor: "#fff"
  },
  itemTitle: {
    flex: 3,
    color: "#000",
    padding: 10,
    fontFamily: ETFonts.regular,
    fontSize: 18
  },
  rightImage: {
    alignSelf: "center",
    marginEnd: 10
  },
  nestedContainer: {
    alignSelf: "flex-start",
    alignItems:'center',
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    borderColor:'#ddd',
    borderWidth:1
  },
  nestedTitle: {
    fontFamily: ETFonts.bold,
    color: "#000",
    fontSize: 16,
    marginLeft: -5
  },
  nestedDesc: {
    fontFamily: ETFonts.regular,
    fontSize: 10,
    marginTop: 2,
    marginLeft:10,
  },
  nestedPrice: {
    fontFamily: ETFonts.regular,
    marginTop: 10,
    color: "#000",
    fontSize: 15,
    marginLeft:20
  },
  nestedRoundView: {
    borderWidth: 1,
    borderColor: EDColors.activeTabColor,
    borderRadius: 16,
    alignSelf: "center",
    padding: 5
  },
  menuCon:{
    height:30,
    padding:5,
    marginLeft:5,
    marginRight:5,
    backgroundColor:EDColors.backgroundDark,
    justifyContent:'center',
    alignItems:'center',
    
  },
  selmenuCon:{
    height:30,
    padding:5,
    marginLeft:5,
    marginRight:5,
    backgroundColor:EDColors.backgroundDark,
    justifyContent:'center',
    alignItems:'center',
    borderBottomColor:'#999',
    borderBottomWidth: 2
  },
  middelCon:{
    height: 30,
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    backgroundColor: EDColors.backgroundLight,
  }
});
