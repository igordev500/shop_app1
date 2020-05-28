import React from 'react';
import PropTypes from 'prop-types';
import {
    Dimensions,
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity,
} from 'react-native';

// Text.defaultProps.allowFontScaling=false;
const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
    menu: {
        width: width,
        height: 80,
        backgroundColor: '#ffffff',
        borderTopWidth:0.5,
        borderTopColor:'#dedede',
        flexDirection:'row'
    },
    itemContainer: {
        height: 70,
        flexDirection: 'row',
        borderTopWidth: 0.5,
        borderTopColor: '#dedede',
        backgroundColor: '#ffffff',
    },
    tab: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'center',
    },
    label: {
        textAlign: 'center',
        fontSize: 12,
        marginBottom: 15,
        marginTop: 0,
        backgroundColor: 'transparent',
    },
    icon: {
        flexGrow: 1,
        marginTop: 2,
        width:30,
        height:30,
        resizeMode:'center',
    },
    topBar: {
        height:3,
        width:width/4 - 24
    },
});

export default function MainBottomMenu({ selectedIndex, onItemSelected }) {

    let menuData = [
        {label: 'Community'},
        {label: ''},
        {label: 'Tools'}];

    return (
        <View style={styles.menu}>
            {menuData.map((item, index)=> {

                let labelColor = '#bbbbbb';
                let image = item.image;
                if (index === selectedIndex){
                    labelColor = '#3986ff';
                    switch(selectedIndex) {
                        case 0:
                            image = require('./../assets/image/bottom_menu/layers.png');
                            break;
                        case 1:
                            image = require('./../assets/image/bottom_menu/location-pin.png');
                            break;
                        case 2:
                            image = require('./../assets/image/bottom_menu/tools.png');
                            break;
                        default:
                            break;
                    }
                } else {
                    switch(index) {
                        case 0:
                            image = require('./../assets/image/bottom_menu/layers.png');
                            break;
                        case 1:
                            image = require('./../assets/image/bottom_menu/location-pin.png');
                            break;
                        case 2:
                            image = require('./../assets/image/bottom_menu/tools.png');
                            break;
                        default:
                            break;
                    }
                }

                return (
                    <TouchableOpacity style={styles.tab} onPress={()=> {onItemSelected(index)}} key={'btm_' + index}>
                        {index === selectedIndex ? <View style={[styles.topBar, {backgroundColor:'#3986ff'}]} />
                            :<View style={[styles.topBar, {backgroundColor:'#ffffff'}]} />}
                        <Image style={styles.icon} source={image} />
                        <Text style={[styles.label, {color:labelColor}]}>{item.label}</Text>
                    </TouchableOpacity>
                )
            })}
        </View>
    );
}

MainBottomMenu.propTypes = {
    selectedIndex: PropTypes.number.isRequired,
    onItemSelected: PropTypes.func.isRequired,
};