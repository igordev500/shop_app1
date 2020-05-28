import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import { Header, Left, Title, Right } from "native-base";
import Assets from "../assets";
import Metrics from "../utils/metrics";
import { ETFonts } from "../assets/FontConstants";
import { EDColors } from "../assets/Colors";

export default class MiddleBar extends React.Component {
  render() {
    return (
      <Header
        // androidStatusBarColor={EDColors.primary}
        style={{ backgroundColor: '#FFF', height:40 }}
      >
          <StatusBar barStyle={"dark-content"} backgroundColor={EDColors.backgroundDark}/>
          <Left style={{ flex: 3, marginLeft: 10 }}>
            <TouchableOpacity
              hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
              style={{ flexDirection: "row", alignItems: "center", width: 40 }}
              onPress={this.props.onLeft}
            >
              <Image
                source={Assets.back_black}
                style={styles.leftImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </Left>
        <Right style={{ flex: 3, marginLeft: 10 }}>
          <View style={{ flexDirection: "row" }}>
            {this.props.right.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={{
                      width: 40
                    }}
                    onPress={() => {
                      this.props.onSearch(index);
                    }}
                  >
                      <Image
                        source={item.url}
                        style={{
                          height: 25,
                          width: 25
                        }}
                        resizeMode="contain"
                      />
                  </TouchableOpacity>
                );
            })}
          </View>
        </Right>
      </Header>
    );
  }
}

const styles = StyleSheet.create({
  topbar: {
    width: "100%",
    flex: 0,
    height: Metrics.navbarHeight + Metrics.statusbarHeight,
    backgroundColor: EDColors.primary
  },
  navbar: {
    backgroundColor: EDColors.primary,
    flex: 0,
    width: "100%",
    height: Metrics.navbarHeight,
    borderBottomColor: EDColors.primary,
    marginTop: Metrics.statusbarHeight + 10,
    borderBottomWidth: 0.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 5,
    paddingRight: 5
  },
  content: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center"
  },
  left: {
    color: EDColors.primary,
    height: 23,
    width: 23,
    resizeMode: "stretch"
  },
  leftImage: {
    height: 23,
    width: 23,
    resizeMode: "stretch",
    alignSelf: "flex-start"
  }
});
