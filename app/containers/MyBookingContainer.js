import React from "react";
import { View, ScrollView, StyleSheet, FlatList } from "react-native";
import BaseContainer from "./BaseContainer";
import MainBaseContainer from "./MainBaseContainer";
import { EDColors } from "../assets/Colors";
import {
  RESPONSE_SUCCESS,
  BOOKING_HISTORY,
  DELETE_EVENT
} from "../utils/Constants";
import SegmentedControlTab from "react-native-segmented-control-tab";
import { getUserToken } from "../utils/AsyncStorageHelper";
import { apiPost } from "../api/ServiceManager";
import BookedEventCard from "../components/BookedEventCard";
import ProgressLoader from "../components/ProgressLoader";
import { showValidationAlert, showDialogue } from "../utils/CMAlert";
import { Messages } from "../utils/Messages";
import DataNotAvailableContainer from "../components/DataNotAvailableContainer";
import { netStatus } from "../utils/NetworkStatusConnection";
import MainBottomMenu from './../utils/MainBottomMenu'
import MainTopMenu from './../utils/MainTopMenu'
import { StackActions, NavigationActions } from "react-navigation";
import NavBar from "./NavBar";

export default class MyBookingContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      selectedIndex: 0
    };
  }

  handleIndexChange = index => {
    this.setState({
      selectedIndex: index
    });
  };

  componentDidMount() {
    this.checkUser();
  }
  checkUser() {
    getUserToken(
      success => {
        userObj = success;

        this.loadData(success);
      },
      failure => {
        showValidationAlert(Messages.loginValidation);
      }
    );
  }

  loadData(userObj) {
    netStatus(status => {
      if (status) {
        this.setState({ isLoading: true });
        apiPost(
          BOOKING_HISTORY,
          {
            user_id: parseInt(userObj.UserID) || 0,
            token: "" + userObj.PhoneNumber
          },
          resp => {
            if (resp != undefined) {
              if (resp.status == RESPONSE_SUCCESS) {
                this.arrayUpcoming = resp.upcoming_booking;
                this.arrayPast = resp.past_booking;
                this.setState({ isLoading: false });
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

  deleteEvent(userObj, eventId) {
    netStatus(status => {
      if (status) {
        this.setState({ isLoading: true });
        apiPost(
          DELETE_EVENT,
          {
            user_id: parseInt(userObj.UserID) || 0,
            token: "" + userObj.PhoneNumber,
            event_id: eventId
          },
          resp => {
            if (resp != undefined) {
              if (resp.status == RESPONSE_SUCCESS) {
                this.loadData(userObj);
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
    if(select_index === 2) return;
    
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
        
        <NavBar
          title="My Booking"
          left="Menu"
          onLeft={() => {
            this.props.navigation.openDrawer();
          }}
          right={[]}
          onRight={index => {
          }}
        />
        <View style={{borderBottomColor:"orange", borderBottomWidth:2}}>
          {/* <View style={styles.statusBar} /> */}
          <MainTopMenu selectedIndex={0} onItemSelected={this.onTopMenuSelected} />
        </View>
        <View style={{ flex: 1 }}>
          <ScrollView style={{ flex: 1 }}>
            <View
              style={{
                margin: 10
              }}
            >
              <SegmentedControlTab
                values={["Upcoming", "Past"]}
                selectedIndex={this.state.selectedIndex}
                onTabPress={this.handleIndexChange}
                backgroundColor={EDColors.primary}
                tabStyle={styles.tabStyle}
                tabTextStyle={styles.tabTextStyle}
                activeTabStyle={styles.activeTabStyle}
                activeTabTextStyle={styles.activeTabTextStyle}
                allowFontScaling={false}
                borderColor={EDColors.primary}
              />
              {this.state.selectedIndex == 0 ? (
                <View style={{ flex: 1 }}>
                  {this.arrayUpcoming != undefined &&
                  this.arrayUpcoming != null &&
                  this.arrayUpcoming.length > 0 ? (
                    <FlatList
                      data={this.arrayUpcoming}
                      showsHorizontalScrollIndicator={false}
                      renderItem={({ item, index }) => {
                        return (
                          <BookedEventCard
                            pkgImage={item.image}
                            RestaurantName={item.name}
                            address={item.address}
                            pos={index}
                            rating={item.rating}
                            timing={item.booking_date}
                            people={item.no_of_people}
                            onPress={pos => {
                              showDialogue(Messages.deleteEvent, [
                                {
                                  text: "cancel"
                                }
                              ],"" ,
                              () =>
                                    this.deleteEvent(userObj, item.entity_id)
                                );
                            }}
                            isSelected={true}
                            onReview={count => {}}
                          />
                        );
                      }}
                      keyExtractor={(item, index) => item + index}
                    />
                  ) : (
                   this.state.isLoading ? <View></View>  : <DataNotAvailableContainer />
                  )}
                </View>
              ) : (
                <View style={{ flex: 1 }}>
                  {this.arrayPast != undefined &&
                  this.arrayPast != null &&
                  this.arrayPast.length > 0 ? (
                    <FlatList
                      data={this.arrayPast}
                      renderItem={({ item, index }) => {
                        return (
                          <BookedEventCard
                            pkgImage={item.image}
                            RestaurantName={item.name}
                            address={item.address}
                            pos={index}
                            rating={item.rating}
                            timing={item.booking_date}
                            people={item.no_of_people}
                            onPress={pos => {}}
                            isSelected={false}
                            onReview={count => {}}
                          />
                        );
                      }}
                      keyExtractor={(item, index) => item + index}
                    />
                  ) : (
                    <DataNotAvailableContainer />
                  )}
                </View>
              )}
            </View>
          </ScrollView>
          <MainBottomMenu selectedIndex={2} onItemSelected={this.onBottomMenuSelected} style={styles.bottomMenu}/>
        </View>
      </MainBaseContainer>
    );
  }
}

const styles = StyleSheet.create({
  tabsContainerStyle: {
    //custom styles
    backgroundColor: EDColors.primary,
    alignSelf: "flex-start"
  },
  tabStyle: {
    //custom styles
    backgroundColor: EDColors.white,
    borderColor: EDColors.primary,
    alignSelf: "flex-start"
  },
  tabTextStyle: {
    //custom styles
    color: EDColors.primary,
    marginLeft: 5,
    marginRight: 5,
    alignSelf: "flex-start"
  },
  activeTabStyle: {
    //custom styles
    backgroundColor: EDColors.primary
  },
  activeTabTextStyle: {
    color: "#fff"
  },
  tabBadgeContainerStyle: {
    //custom styles
  },
  activeTabBadgeContainerStyle: {
    //custom styles
  },
  tabBadgeStyle: {
    //custom styles
  },
  activeTabBadgeStyle: {
    //custom styles
  },
  statusBar: {
    height: 50
  },
  bottomMenu:{
    position:'absolute',
    bottom:0
  }
});
