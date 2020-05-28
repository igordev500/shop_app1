import React from 'react';
import PropTypes from 'prop-types';
import {
    Dimensions,
    StyleSheet,
    View,
    Image,
    Text,
    StatusBar,
    TouchableOpacity,
} from 'react-native';
import { EDColors } from "../assets/Colors";
// Text.defaultProps.allowFontScaling=false;
const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
    menu: {
        // alignSelf: 'stretch',
        height: 50,
        flexDirection: 'row', // row
        alignItems: 'center',
        justifyContent: 'space-between', // center, space-around
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor:EDColors.backgroundLight
    },
    itemContainer: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
    },
    tab: {
        // flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        // alignSelf: 'center',
    },
    icon: {
        // flexGrow: 1,
        // marginTop: 2,
        width:20,
        height:20,
        // resizeMode:'center',
    },
    icon1: {
        // flexGrow: 1,
        // marginTop: 2,
        width:50,
        height:35,
        // resizeMode:'center',
    }
});

export default function MainTopMenu({ selectedIndex, onItemSelected, identy, onRight, item }) {
    let menuData = [
        {label: ''},
        {label: ''},
        {label: ''},
        ];
    if( identy !== "order")
    return (
        <>
        <StatusBar barStyle={"dark-content"} backgroundColor={EDColors.backgroundLight}/>
        <View style={styles.menu}>
        
            {menuData.map((item, index)=> {
                let labelColor = '#2699FB';
                let image = item.image;
                if (index === selectedIndex){
                    labelColor = '#3986ff';
                    switch(selectedIndex) {
                        case 0:
                            image = require('./../assets/image/top_menu/user-blue.png');
                            break;
                        case 1:
                            image = require('./../assets/image/top_menu/Thribby.png');
                            break;
                        case 2:
                            image = require('./../assets/image/top_menu/search_icon.png');
                            break;
                        default:
                            break;
                    }
                } else {
                    switch(index) {
                        case 0:
                            image = require('./../assets/image/top_menu/user-blue.png');
                            break;
                        case 1:
                            image = require('./../assets/image/top_menu/Thribby.png');
                            break;
                        case 2:
                            image = require('./../assets/image/top_menu/search_icon.png');
                            break;
                    }
                }
                return(
                <TouchableOpacity style={styles.tab} onPress={()=> {onItemSelected(index)}} key={'btm_' + index}>
                    <Image style={index == 1 ? styles.icon1: styles.icon} source={image} />
                    {/* <Text style={[styles.label, {color:labelColor}]}>{item.label}</Text> */}
                </TouchableOpacity>
                )
            })}
        </View>
        </>
    );
    if( identy === "order")
    return (
        <View style={styles.menu}>
            <StatusBar barStyle={"dark-content"} backgroundColor={EDColors.backgroundLight}/>
            <TouchableOpacity style={styles.tab} onPress={()=> {onItemSelected(0)}} key={'btm_' + 0}>
                <Image style={styles.icon} source={require('./../assets/image/top_menu/user-blue.png')} />
                {/* <Text style={[styles.label, {color:labelColor}]}>{item.label}</Text> */}
            </TouchableOpacity>
            <TouchableOpacity
                key={1}
                style={{
                width: 40
                }}
                onPress={() => {
                onRight(0);
                }}
            >
                <View style={{ flex: 1, justifyContent:'center' }}>
                <Image
                    source={item.url}
                    style={{
                    height: 25,
                    width: 25
                    }}
                    resizeMode="contain"
                />
                </View>
                {item.value != undefined &&
                item.value != null &&
                item.value > 0 && (
                    <View style={{
                        borderRadius: 10,
                        height: 18,
                        width: 18,
                        backgroundColor: "#2699FB",
                        marginLeft: 17,
                        marginBottom: 27,
                        alignItems: "center",
                        textAlign: "center",
                        textAlignVertical: "center",
                        fontSize: 10,
                        position: "absolute"
                    }}>
                    <Text
                        style={{
                        color: "#FFF",
                        }}
                    >
                        {item.value}
                    </Text>
                    </View>
                ) }
            </TouchableOpacity>
        </View>
    );
}

MainTopMenu.propTypes = {
    selectedIndex: PropTypes.number.isRequired,
    onItemSelected: PropTypes.func.isRequired,
};