import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import TextViewLeftImage from "./TextViewLeftImage";
import Assets from "../assets";
import { ETFonts } from "../assets/FontConstants";
import { EDColors } from "../assets/Colors";
import { capitalize } from "../utils/Constants";

export default class RestaurantOverview extends React.PureComponent {
  render() {
    return (
      <View style={style.container}>
        <Text
          style={{
            fontFamily: ETFonts.regular,
            fontWeight:'bold',
            color: "#000",
            fontSize: 20
          }}
        >
          {this.props.resName}
        </Text>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          {this.props.categoryName.map((item, index)=>{
            return (
              <>
                <Text style={{color:EDColors.activeColor, fontSize:12, fontFamily:ETFonts.regular}}>{item}</Text>
                {index < this.props.categoryName.length - 1 && (<View style={{width:4, height:4,  borderRadius:2, marginTop:5, backgroundColor:EDColors.activeColor}}></View>)}
              </>
            )
          })}
        </View>

        {/* <View
          style={{
            flex: 1,
            marginTop: 5,
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        > */}
          {this.props.review != null && this.props.review.length > 0 ? (
            <TextViewLeftImage
              image={Assets.rating}
              boldtext={this.props.review}
              text = {"("+this.props.reviewCnt+" ratings)"}
              lines={0}
            />
          ) : null}
        <TextViewLeftImage
          image={Assets.address}
          text={this.props.address}
          lines={0}
        />
          <View style={{ flexDirection:'row', alignItems:'center', marginTop: 10 }}>
            {/* {this.props.timing != "" ? ( */}
              <Text style={{color:EDColors.activeColor}}>Open Now</Text>
              <View style={{width:4, height:4,  borderRadius:2, marginTop:5, backgroundColor:'grey', margin:5, marginBottom:0}}></View>
              <TouchableOpacity onPress={this.props.onButtonClick} style={{height: 30, borderRadius:15, justifyContent:'center', paddingLeft:10, paddingRight:10, alignItems:'center', backgroundColor:EDColors.activeColor}}>
              <Text style={{color:'#FFF'}}>{this.props.timing != "" && this.props.timing != "-" ? this.props.timing : "Close for the day"}</Text>
              </TouchableOpacity>
            {/* ) : null} */}
          </View>
{/* 
          {this.props.isShow ? (
            <TouchableOpacity
              activeOpacity={1.0}
              onPress={() => {
                this.props.onButtonClick("");
              }}
              style={{ flex: 1 }}
            >
              <TextViewLeftImage
                image={Assets.restMenu}
                text="Menu"
                lines={0}
              />
            </TouchableOpacity>
          ) : null} */}
        
      </View>
    );
  }
}

export const style = StyleSheet.create({
  container: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 8,
    paddingRight: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems:'center',
    justifyContent:'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
    margin: 25
  },
  button: {
    borderRadius: 6,
    backgroundColor: EDColors.primary,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 20,
    paddingRight: 20,
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 10,
    alignItems: "center"
  }
});
