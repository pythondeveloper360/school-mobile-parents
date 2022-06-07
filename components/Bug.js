import AsyncStorage from "@react-native-async-storage/async-storage";
import { Component } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "../styles";
export default class Bug extends Component {
  constructor() {
    super();
    this.state = {
      gr: "",
      bug: "",
    };
    this.style = StyleSheet.create(styles);
  }
  componentDidMount() {
    this.loadGr();
  }
  async loadGr() {
    const gr = await AsyncStorage.getItem("@gr");
    this.setState({ gr: gr });
  }
  render() {
    return (
      <View>
        <Text style = {{margin:30,fontSize:30}}>Describe the bug</Text>
        <TextInput
          style={this.style.bugText}
          value={this.state.bug}
          onChangeText={(text) => {
            this.setState({ bug: text });
          }}
          multiline
        ></TextInput>
        <TouchableOpacity style = {{flexDirection:"row",justifyContent:'flex-end',margin:30}}>
          <Text style = {{backgroundColor:'#73a4ff',padding:10}}>Report</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
