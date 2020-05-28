import React from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  SectionList,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Dimensions,
  ToastAndroid
} from "react-native";
import BaseContainer from "./BaseContainer";
import ImageViewRadius from "../components/ImageViewRadius";
import ReviewContainer from "../components/ReviewContainer";
import RestaurantOverview from "../components/RestaurantOverview";
import { ETFonts } from "../assets/FontConstants";
import ImageGrid from "../components/ImageGrid";
import Assets from "../assets";
import { apiPost } from "../api/APIManager";
import {
  GET_RESTAURANT_DETAIL,
  RESPONSE_SUCCESS,
  RESPONSE_FAIL,
  ADD_REVIEW,
  INR_SIGN
} from "../utils/Constants";
import { showDialogue, showValidationAlert } from "../utils/CMAlert";
import ProgressLoader from "../components/ProgressLoader";
import { EDColors } from "../assets/Colors";
import { Rating } from "react-native-ratings";
import ETextViewNormalLable from "../components/ETextViewNormalLable";
import { connect } from "react-redux";
import { saveCartCount } from "../redux/actions/Checkout";
import { netStatus } from "../utils/NetworkStatusConnection";
import EditText from "../components/EditText";
import MainBottomMenu from './../utils/MainBottomMenu'
import MainTopMenu from './../utils/MainTopMenu'
import {
  saveCartData,
  getCartList,
  getUserToken
} from "../utils/AsyncStorageHelper";

import { StackActions, NavigationActions } from "react-navigation";
import NavBar from "./NavBar";
import MainBaseContainer from "./MainBaseContainer";

import BottomDrawer from 'rn-bottom-drawer';
 
const TAB_BAR_HEIGHT = 49;
const {w, h} = Dimensions.get('window');

export class Restaurant extends React.Component {
  constructor(props) {
    super(props);

    (this.restaurantArray = []),
      (this.popularItems = []),
      (this.menuItem = [])
      // (this.reviews = []);
    //   (this.reviewStar = 0);
    // this.reviewText = "";
  }

  state = {
    isLoading: false,
    restaurant_id: this.props.navigation.state.params.restId,
    refresh: this.props.navigation.state.params.refresh,
    isReview: false,
    isPhotoClick: false,
    selectedPhotoUrl: "",
    reviewStar:0,
    reviewText: "",
    // reviews: []
    reviews: undefined,
    ball:false,
    serchtext:'',
    curItem : 0,
    currentTab : '',
    renderCartArray:[]
  };

  addReview() {
    netStatus(status => {
      if (status) {
        this.setState({ isLoading: true });
        apiPost(
          ADD_REVIEW,
          {
            restaurant_id: this.state.restaurant_id,
            user_id: this.props.userID,
            rating: this.state.reviewStar,
            review: this.state.reviewText
          },
          response => {
            if (response.error != undefined) {
              showValidationAlert(
                response.error.message != undefined
                  ? response.error.message
                  : Messages.generalWebServiceError
              );
              this.setState({ isLoading: false });
            } else {
              if (response.status == RESPONSE_SUCCESS) {
                this.getRestaurantDetails();
                this.setState({ isLoading: false });
              } else {
                showValidationAlert(response.message);
                this.setState({ isLoading: false });
              }
            }
          },
          error => {}
        );
      } else {
        showValidationAlert(Messages.internetConnnection);
      }
    });
  }

  getRestaurantDetails() {
    netStatus(status => {
      if (status) {
        this.setState({ isLoading: true });
        apiPost(
          GET_RESTAURANT_DETAIL,
          {
            restaurant_id: this.state.restaurant_id
          },
          response => {
            if (response.error != undefined) {
              showValidationAlert(
                response.error.message != undefined
                  ? response.error.message
                  : Messages.generalWebServiceError
              );
              this.setState({ isLoading: false });
            } else if (response.status == RESPONSE_SUCCESS) {
              this.restaurantArray = response.restaurant;
              this.popularItems = response.popular_item;
              this.menuItem = response.menu_item;
              this.setState({ reviews: response.review, isLoading: false, currentTab: this.menuItem[0].category_name });
            } else if (response.status == RESPONSE_FAIL) {
              this.state.reviews = [];
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

  componentDidMount() {
    this.getRestaurantDetails();
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
      <MainBaseContainer
        loading={this.state.isLoading}
      >
        <View style={{}}>
          <MainTopMenu selectedIndex={0} onItemSelected={this.onTopMenuSelected} />
        </View>
        <Modal
          visible={this.state.isPhotoClick}
          animationType="slide"
          transparent={true}
          style={{backgroundColor:'red'}}
          onRequestClose={() => {
            this.setState({ isPhotoClick: false });
          }}
        >
          <View style={style.modalContainerImage}>
            <TouchableOpacity
              style={{
                alignSelf: "flex-end",
                padding: 20,
                marginTop:10,
               
              }}
              onPress={() => {
                this.setState({ isPhotoClick: false });
              }}
            >
              <Image
                style={{ alignContent: "flex-end", height: 25, width: 25,marginTop:10 }}
                source={Assets.delete_White}
              />
            </TouchableOpacity>
            <Image
              style={{
                flex: 1,
                borderRadius: 4,
                margin: 20
              }}
              resizeMode="contain"
              source={{ uri: this.state.selectedPhotoUrl }}
            />
          </View>
        </Modal>

        <Modal
          visible={this.state.isReview}
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            this.setState({ isReview: false });
          }}
        >
          <View style={style.modalContainer}>
            <View style={style.modalSubContainer}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    fontSize: 20,
                    flex: 1,
                    color: EDColors.primary,
                    alignSelf: "center",
                    textAlign: "center",
                    fontFamily: ETFonts.satisfy
                  }}
                >
                  Give Your Review
                </Text>
                <TouchableOpacity
                  style={{ alignSelf: "center" }}
                  onPress={() => {
                    this.setState({ isReview: false,reviewStar: 0, reviewText:"" });
                  }}
                >
                  <Image
                    style={{ alignSelf: "center", height: 15, width: 15 }}
                    source={Assets.ic_close}
                  />
                </TouchableOpacity>
              </View>

              <Rating
                style={{ alignSelf: "center", marginTop: 10 }}
                imageSize={25}
                ratingCount={5}
                minValue={1}
                fractions={10}
                startingValue={this.props.rating !== undefined && this.props.rating !== null && this.props.rating !== "" ? parseInt(this.props.rating) : 0}
                onFinishRating={star => {
                  this.setState({
                    reviewStar : star
                  })
                  
                }}
              />

              <View
                style={{
                  borderColor: "#000",
                  marginTop: 15,
                  marginLeft: 20,
                  marginRight: 20,
                 // borderBottomWidth:1
                }}
              >
                <EditText
                
                  placeholder="Write your comment"
                  style={{
                    color: "#000",
                    textAlignVertical: "top",
                    fontFamily: ETFonts.regular,
                    fontSize: 15
                  }}
                  onChangeText={newText => {
                    this.setState({
                      reviewText: newText
                    })
                  }}
                  maxLength={250}
                />
              </View>

              <Text
                style={{
                  alignSelf: "center",
                  fontFamily: ETFonts.bold,
                  paddingLeft: 30,
                  paddingRight: 30,
                  paddingTop: 10,
                  paddingBottom: 10,
                  borderRadius: 6,
                  marginTop: 20,
                  color: "#fff",
                  backgroundColor: this.state.reviewStar !== 0 && this.state.reviewText !== "" ? EDColors.primary : EDColors.buttonUnreserve
                }}
                onPress={() => {
                    if(this.state.reviewStar !== 0 && this.state.reviewText !== ""){
                      this.addReview();
                      this.setState({ isReview: false });
                    }
                  
                }}
              >
                SUBMIT
              </Text>
            </View>
          </View>
        </Modal>

        <View style={{ backgroundColor: EDColors.background }}>
          <SectionList
            showsVerticalScrollIndicator={false}
            extraData={this.state}
            renderSectionHeader={({ section: { title, data, index } }) => {
              return title != "" &&
                data[0] != undefined &&
                data[0].length > 0 ? (
                  
                index == 2 ? <View style={{flexDirection:'row', justifyContent:'space-between', backgroundColor:EDColors.background, marginLeft:25, marginRight:25 }}>
                  <TouchableOpacity onPress={()=>this.onViewAll()}>
                    <Text style={this.state.ball ? {color:'grey',fontWeight:'bold', fontSize:18}:{color:EDColors.activeColor,fontWeight:'bold', fontSize:18}}>{title}</Text>
                  </TouchableOpacity> 
                  <TouchableOpacity onPress={() =>this.onViewAll()}>
                    <Text style={{fontWeight:'bold'}, !this.state.ball ? {color:'grey',fontWeight:'bold', fontSize:18}:{color:EDColors.activeColor, fontSize:18, fontWeight:'bold',}} >See All</Text>
                  </TouchableOpacity>
                </View>
                : <View style={{ backgroundColor:EDColors.background, marginLeft:15, marginRight:15, marginBottom:10 }}>
                    {this.menuSetionHeader(data)}
                  </View>
              ) : null;
              
              
            }}
            sections={[
              { title: "", data: this.restaurantArray, index: 0 },
              { title: "", data: ["Check in", "Reserve", "Search"], index: 1 },
              // { title: "Photos", data: [this.popularItems], index: 2 },
              { title: "Popular", data: [this.popularItems], index: 2 },
              {
                title: "Reviews",
                data: [this.menuItem],
                index: 3
              }
            ]}
            renderItem={({ item, index, section }) => {
              if (section.index == 0) {
                return (
                  <View>
                    <Image
                      source={{ uri: item.image }}
                      style={{ width: "100%", height: 180 }}
                    />
                    <View
                      style={{
                        position: "relative",
                        marginTop: -100
                      }}
                    >
                      <RestaurantOverview
                        resName={item.name}
                        categoryName={["Brunch", "American", "Alcohol", "Casual"]}
                        review={item.rating}
                        reviewCnt = {this.state.reviews.length}
                        isShow={true}
                        timing={
                          item.timings.open != "" && item.timings.close != ""
                            ? item.timings.open + "-" + item.timings.close
                            : ""
                        }
                        address={item.address}
                        buttonText={item.timings.off}
                        onButtonClick={str => {
                          this.props.navigation.navigate("CategoryContainer", {
                            resName: item.name,
                            resid: item.restuarant_id,
                            menuItem: this.menuItem,
                            image: item.image
                          });
                        }}
                      />
                    </View>
                  </View>
                );
              } else if (section.index == 1) {
                return this.buttonAndsearch(item);
              }
              // else if (section.index == 2) {
              //   return this.photosList(item);
              // }
               else if (section.index == 2) {
                return this.popularList(item);
              } else if (section.index == 3) {
                return this.menuBodyRender(item);
              } else {
                return <Text>{}</Text>;
              }
            }}
            keyExtractor={(item, index) => item + index}
          />
        </View>
        
      
        </MainBaseContainer>
        <MainBottomMenu selectedIndex={0} onItemSelected={(index)=>this.onBottomMenuSelected(index)} style={style.bottomMenu}/>
        <BottomDrawer
          containerHeight={500}
          offset = {-130}
          startUp={false}
          downDisplay={0}
          roundedEdges={true}
        >
          {this.renderContent()}
        </BottomDrawer>
        </>  
    );
  }

  onViewAll(){
    this.setState({ball: !this.state.ball});

  }

  buttonAndsearch(data){
    if( data == "Search" && !this.state.isLoading )
    return (
      <>
        <View style={{ flexDirection:'row', justifyContent:'space-between', marginLeft:25, marginRight:25,}}>
          <TouchableOpacity style={style.middleAct}>
            <Image source={Assets.map_vector} style={{width:15, height:22}}/>
            <Text style={{color:'#FFF', fontWeight:'bold', marginLeft:10, fontSize:18}}>Check in</Text>
          </TouchableOpacity>
          <TouchableOpacity style={style.middleInAct}>
            <Image source={Assets.reserve} style={{width: 18, height: 22}}/>
            <Text style={{color:EDColors.activeColor, fontWeight:'bold', marginLeft:10, fontSize:18}}>Reserve</Text>
          </TouchableOpacity>
        </View>
        <View  style={style.search}>
            <Image source={Assets.search_green} style={{width:20, height:20}}/>
            <TextInput 
              style={{color:'#000', marginLeft:10 }}
              placeholder = 'Search order history'
              value={this.state.serchtext}
              onChange = {()=>this.setState({serchtext})}
            />
        </View>
      </>
    )
    else return null;
  }

  photosList(data) {
    return (
      <FlatList
        horizontal={true}
        data={data}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => {
          return (
            <ImageViewRadius
              imageUrl={item.image}
              onButtonClick={() => {
                this.setState({
                  isPhotoClick: true,
                  selectedPhotoUrl: item.image
                });
              }}
            />
          );
        }}
        keyExtractor={(item, index) => item + index}
      />
    );
  }

  popularList(data) {
    return (
      <>
        <FlatList
          horizontal={true}
          data={data}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => {
            return (
              <ImageGrid
                imageUrl={item.image}
                title={item.name}
                price={item.price}
              />
            );
          }}
          keyExtractor={(item, index) =>item + index}
        />
      </>
    );
  }

  menuSetionHeader(data){
    return(
    <FlatList 
      style = {{margin:10}}
      data = {data[0]}
      horizontal = {true}
      showsHorizontalScrollIndicator = {false}
      keyExtractor = {(item, index)=> item.categry_id +"_"+index.toString()}
      renderItem = {({item, index}) =>{
        return (<>
          <TouchableOpacity style = {this.state.curItem === index ? style.menuItemAct : style.menuItemInAct} onPress={()=>this.onMenuSelected(item, index)}>
            <Text style = {this.state.curItem === index ?{color:'#FFF', fontWeight:'bold'} :{color:'#333', } }>{item.category_name}</Text>
          </TouchableOpacity>
        </>)
      }}
    />);
  }

  onMenuSelected(item, index){
    this.setState({curItem: index, currentTab: item.category_name});
  }
  menuBodyRender(data){
    if( data.length === 0 ) return null;
    return(
    <FlatList 
      style = {{margin:10, marginBottom:70}}
      data = {data[this.state.curItem].items}
      keyExtractor = {(item, index)=> "detail-"+index.toString()}
      renderItem = {({item, index}) =>{
        return (<>
        <View style = {{flexDirection:'row', marginLeft:25, marginRight:25, justifyContent:'space-between'}}>
          <View style={{width:80, height:80, borderRadius:10,}}>
            <Image style={{width:80, height:80, borderRadius:10,}} source={{uri:item.image}} ></Image>
          </View>
          <View style={{marginLeft:5, width:'60%', justifyContent:'space-between'}}>
            <Text style={{fontSize:14, fontWeight:'bold', color:'#000'}} >{item.name}</Text>
            <Text style={{color:'#555', fontSize:12}}>{item.menu_detail}</Text>
            <Text style={{color:EDColors.activeColor, fontSize:14, fontWeight:'bold'}}>{INR_SIGN + item.price}</Text>
          </View>
          <TouchableOpacity style={{justifyContent:'flex-end'}} onPress={()=>this.storeData(item)}>
            <Image source={Assets.add_button} style={{width:25, height:20}} resizeMode='stretch'/>
          </TouchableOpacity>
        </View>
        <View style={{height:20}}></View>
        </>)
      }}
    />);
  }
  storeData(data){
    var cartArray = [];
    let renderArr = [];
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
              renderArr.push({cate_name:this.state.currentTab, items:cartArray});

              cartData = {
                resId: this.resId,
                items: cartArray,
                coupon_name:
                  success.coupon_name.length > 0 ? success.coupon_name : "",
                cart_id: success.cart_id
              };
              //console.log("CART DATA :::::::: ", cartData)
              this.setState({renderCartArray: cartData.items});
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
            renderArr.push({cate_name:this.state.currentTab, items:[data]});
            this.setState({renderCartArray: cartData.items});
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
          renderArr.push({cate_name:this.state.currentTab, items:[data]});
          this.setState({renderCartArray: cartData.items});
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
        renderArr.push({cate_name:this.state.currentTab, items:[data]});
        this.setState({renderCartArray: cartData.items});
        this.updateCount(cartData.items);
        this.saveData(cartData);
      },
      error => {
        console.log("onCartNotFound", error);
      }
    );
  }

  updateCount(data) {
    ToastAndroid.show("Item added successfully!", ToastAndroid.SHORT);
    var count = 0;
    data.map((item, index) => {
      count = count + item.quantity;
    });

    this.props.saveCartCount(count);
  }

  saveData(data) {
    saveCartData(data, success => { }, fail => { });
  }

  reviewList(data) {
    return data.length > 0 && this.state.reviews != undefined ? (
      <FlatList
       style = {{margin:10}}
        data={data}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => {
          return (
            <ReviewContainer
              userImage={item.image}
              name={item.first_name + " " + item.last_name}
              review={item.review}
              size={15}
              rating={item.rating}
              date="Jun 15"
              onReview={count => {}}
              readonly={true}
            />
          );
        }}
        keyExtractor={(item, index) => item + index}
      />
    ) : this.props.userID != undefined &&
      this.props.userID != null &&
      this.state.reviews != undefined ? (
      <Text
        style={style.footer}
        onPress={() => {
          this.setState({ isReview: true });
        }}
      >
        ADD REVIEW
      </Text>
    ) : null;
  }

  renderContent(){
    return (
      <View style={{flex:1, alignItems:'center', marginTop:5}}>
        <View style={{width:60, height:4, backgroundColor:'grey'}}></View>
        <Text style={{color:'grey', fontSize: 16, fontWeight:'bold'}}>{this.state.currentTab}</Text>
      </View>
    )
  }
}

export default connect(
  state => {
    return {
      userID: state.userOperations.userIdInRedux,
      token: state.userOperations.phoneNumberInRedux
    };
  },
  dispatch => {
    return {
      saveNavigationSelection: dataToSave => {
        dispatch(saveNavigationSelection(dataToSave));
      },
      saveCartCount: data => {
        dispatch(saveCartCount(data));
      }
    };
  }
)(Restaurant);

export const style = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10
  },
  title: {
    fontSize: 20,
    fontFamily: ETFonts.regular,
    marginLeft: 5,
    color: "#000",
    paddingLeft: 10,
    paddingRight: 10
  },
  image: {
    width: 20,
    height: 20
  },
  footer: {
    borderRadius: 6,
    backgroundColor: EDColors.primary,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 30,
    paddingRight: 30,
    marginBottom: 20,
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 10,
    color: "#fff",
    fontSize: 16,
    fontFamily: ETFonts.regular,
    alignItems: "center"
  },
  NewFooter: {
    borderRadius: 6,
    backgroundColor: EDColors.primary,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 10,
    marginBottom: 5,
    marginTop:10,

    color: "#fff",
    fontSize: 14,
    fontFamily: ETFonts.regular,
    alignItems: "center"
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.50)"
  },
  modalContainerImage: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.90)"
  },
  modalSubContainer: {
    backgroundColor: "#fff",
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 4,
    marginTop: 20,
    marginBottom: 20
  },
  statusBar: {
    height: 50
  },
  bottomMenu:{
    position:'absolute',
    bottom:0
  },
  middleAct:{flexDirection:'row', justifyContent:'center', alignItems:'center', backgroundColor:EDColors.activeColor, width: '45%',
  shadowColor: "#000",
  height: 50,
  borderRadius:10,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.8,
  shadowRadius: 2,
  elevation: 3,},
  middleInAct:{flexDirection:'row', justifyContent:'center', alignItems:'center', backgroundColor:'white', width: '45%',
  shadowColor: "#000",
  height: 50,
  borderRadius:10,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.8,
  shadowRadius: 2,
  elevation: 3,
},
  search:{
    flexDirection:'row',
    paddingLeft:20,
    paddingRight:20,
    margin:25,
    alignItems:'center',
    height: 50,
    borderRadius:25,
    backgroundColor:'#FFF',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  menuItemAct:{
    margin:5,
    paddingLeft:10,
    paddingRight:10,
    paddingTop:5,
    paddingBottom:5,
    borderRadius:15,
    backgroundColor:EDColors.activeColor,
    justifyContent:'center',
    alignItems:'center',
  },
  menuItemInAct:{
    margin:5,
    paddingLeft:10,
    paddingRight:10,
    paddingTop:5,
    paddingBottom:5,
    borderRadius:15,
    justifyContent:'center',
    alignItems:'center',
  }
});
