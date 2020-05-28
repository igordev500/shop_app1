import React from "react";
import {
  View,
  Text,
  Animated,
  Image,
  StyleSheet,
  TextInput,Platform
} from "react-native";
import { EDColors } from "../assets/Colors";
import { Card } from "native-base";


export default class EditText extends React.Component {
  render() {
    return (
      
        <View style={[style.editText, this.props.styles]}>
        {/* {this.props.isCode ?
          <View style={{ justifyContent: 'center', marginRight : 10 }}>
            <Text style={{ alignSelf: 'center' }}>
              {this.props.codeLabel}
            </Text>
          </View>
          : null} */}
        <TextInput
          style={
            { flex: 1,marginVertical: Platform.OS == 'ios' ? 10 : 0,fontSize: 16, paddingVertical:5}
          }
          keyboardType={this.props.keyboardType}
          secureTextEntry={this.props.secureTextEntry}
          editable={this.props.editable}
          maxLength={
            this.props.maxLength != undefined ? this.props.maxLength : 30
          }
        //   multiline={
        //     this.props.multiline != undefined ? this.props.multiline : false
        //   }
          onChangeText={userText => {
            if (this.props.onChangeText != undefined) {
              this.props.onChangeText(userText);
            }
          }}

          value={this.props.value}
          placeholder={this.props.hint}
          returnKeyType="done"
        />
        </View>
        
    );
  }
}

export const style = StyleSheet.create({
  editText: {
    flexDirection:'row',
    borderBottomColor: '#ddd',
    borderBottomWidth: 2,
  }
});
