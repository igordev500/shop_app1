import React, { useRef } from 'react';
import { 
    Text, 
    View, 
    TextInput, 
    StyleSheet, 
    Platform, 
    Dimensions, 
    ScrollView, 
    TouchableOpacity,
    Image,
    Keyboard,
    SectionList,
    StatusBar
} from 'react-native';


const isIos = Platform.OS == "ios";

const fakeData = [
    {
      title: "",
      data: [
        { 
            titleName: "Title 1",
            description: "Description is long and short"
        },
        { 
            titleName: "Title 2",
            description: "Description is long and short"
        }
      ]
    },
    {
        title: "Recent",
        data: [
          { 
              titleName: "Title 3 recent",
              description: "Description is long and short"
          },
          { 
              titleName: "Title 4 recent",
              description: "Description is long and short"
          }
        ]
      },
  ];
export default function SearchScreen(props) { 

    const _renderHeader = ({ section: { title }}) => { 
        return( 
            <View style={{flexDirection: "row"}}>
                <Text style={{fontWeight:'bold', fontSize: 16}}>{title}</Text>
                <View style={{flex: 1}}/>
                { 
                    !!title && 
                    <Text style={{paddingHorizontal: 10, color: "#4D89BA"}}>See all</Text> 
                }
            </View>
        )
    }


    const _renderItem = ({item, index}) => { 
        return( 
            <TouchableOpacity
                activeOpacity={.6}
                style={styles.itemContainer}
            >
                <Image 
                    source={require('./../assets/image/original.jpg')}
                    style={{width: 40, height:40, borderRadius: 20}}
                    resizeMode="cover"
                />
                <View style={styles.textContainer}>
                    <View style={{flexDirection: 'row', alignItems:"center"}}> 
                        <Text style={{fontWeight: "bold", fontSize: 13}}>{item.titleName}</Text>
                        <Image 
                            source={require('./../assets/image/check.png')}
                            style={{width: 15, height:15, borderRadius: 8, paddingHorizontal: 10}}
                            resizeMode="cover"
                        />
                    </View>
                    <Text style={{color: "#ACAEAD"}}>{item.description}</Text>
                </View>
                <View style={{flex: 1}}/>
                <View style={{padding: 10}}>
                    <Image 
                        source={require("./../assets/image/x.png")}
                        style={{width: 20, height: 20, opacity:.4}}
                    />
                </View>
            </TouchableOpacity>
        )
    }

    const inputRef = useRef(null);
    return( 
        <View style={styles.container}>
            <View style={styles.searchBoxContainer}>
                <View style={styles.inputContainer}>
                    <TouchableOpacity
                        style={{padding: 5, justifyContent:"center", alignItems:"center"}}
                    >
                        <Image source={require("./../assets/image/search.png")} 
                            style={{width: 20, height:20, padding: 5, alignItems:"center"}}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={{padding:10, width: "100%"}}
                        onPress={() => inputRef.current.focus()}
                    >
                        <TextInput 
                            ref={inputRef}
                            placeholder={"Search"}
                        />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={{paddingHorizontal: 10}}
                    onPress={() => Keyboard.dismiss()}
                >
                    <Text style={{fontSize: 18}}>Cancel</Text>
                </TouchableOpacity>
            </View>
            <View style={{width: "90%", flex: 1}}>
            <SectionList 
                sections={fakeData}
                keyExtractor={(item, index) => `list_item_${index}`}
                renderItem={_renderItem}
                renderSectionHeader={_renderHeader}
                contentContainerStyle={{width: "100%", flex: 1}}
            />
            </View>
        </View>
    )
}


const styles = StyleSheet.create({ 
    container:{ 
        flex: 1,
        paddingTop: isIos ? 35 : 10,
        alignItems:"center",
        width: "100%"
    },
    searchBoxContainer: { 
        height: 60,
        backgroundColor: "#F7F9FB",
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center"
    }, 

    inputContainer: { 
       // marginHorizontal: 20, 
        marginVertical: 10,
        marginLeft: 20,
        flex: 1,
        backgroundColor:"#EAEBEE",
        borderRadius: 10,
        flexDirection: "row",

    }, 
    sectionContainer: { 
        width: "100%",
    }, 
    itemContainer: { 
        height: 60,
        width: "100%",
        flexDirection: "row",
        alignItems:"center",
    },
    textContainer: { 
        paddingHorizontal: 10
    }
}) 