import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { ETFonts } from "../assets/FontConstants";
import Assets from "../assets";

export default class TextViewLeftImage extends React.PureComponent {
  render() {
    return (
      <View style={style.container}>
        <Image
          style={style.image}
          source={this.props.image}
          resizeMode="contain"
        />
          {this.props.boldtext && (<Text style={[style.text, {fontWeight:'bold'}]} numberOfLines={this.props.lines} >{this.props.boldtext}</Text>)}
          <Text style={style.text} numberOfLines={this.props.lines}>
            {this.props.text}
          </Text>
      </View>
    );
  }
}

export const style = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:'center',
    marginTop: 10,
    marginLeft: 5
  },
  text: {
    color:'#000',
    fontSize: 12,
    fontFamily: ETFonts.regular,
    marginLeft: 2
  },
  image: {
    width: 23,
    height: 15
  }
});
