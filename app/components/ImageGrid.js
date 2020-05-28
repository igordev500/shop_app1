import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { ETFonts } from "../assets/FontConstants";
import { capiString, INR_SIGN } from "../utils/Constants";
import { EDColors } from "../assets/Colors";

export default class ImageGrid extends React.PureComponent {
  render() {
    return (
      <View style={style.container}>
        <Image style={style.image} source={{ uri: this.props.imageUrl }} />
        {/* <Text ellipsizeMode={"tail"} numberOfLines={1} style={style.title}>
          { capiString(this.props.title)}
        </Text> */}
        <View  style={style.priceCon}>
          <Text style={style.price}>{INR_SIGN+" "+ this.props.price}</Text>
        </View>
      </View>
    );
  }
}

export const style = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#000",
    width: 150,
    height:150,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    margin: 10,
    alignSelf: "flex-start"
  },
  image: {
    width: 150,
    height: 150,
    borderRadius:15
  },
  title: {
    flex: 1,
    fontFamily: ETFonts.regular,
    fontSize: 16,
    marginLeft: 5,
    marginTop: 5,
    marginRight: 5,
    color: "#000"
  },
  price: {
    fontFamily: ETFonts.regular,
    color:'#FFF',
    fontWeight:'bold'
  },
  priceCon:{
    marginTop:-40,
    marginRight: 10,
    alignSelf:'flex-end',
    paddingLeft:10,
    paddingRight:10,
    paddingTop:5,
    paddingBottom:5,
    borderRadius:15,
    backgroundColor:EDColors.activeColor,
    justifyContent:'center',
    alignItems:'center',
  }
});
