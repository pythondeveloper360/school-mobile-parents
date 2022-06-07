import AsyncStorage from "@react-native-async-storage/async-storage";
import { Component } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import styles from "../styles";
export default class AllWorks extends Component {
  constructor() {
    super();
    this.state = {
      phone: "",
      works: [],
      openDisplay: false,
      selectedWork: { id: "", date: "", work: [] },
      loadingWorks: false,
    };
    this.style = StyleSheet.create(styles);
  }
  loadWorks() {
    this.setState({ loadingWorks: true });
    fetch("https://school-server.herokuapp.com/works", {
      headers: {
        phone: this.state.phone,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log();
        if (data.status) {
          this.setState({ works: data.works });
        }
      })
      .finally(() => {
        this.setState({ loadingWorks: false });
      });
  }
  async loadPhoneNo() {
    const phone = await AsyncStorage.getItem("@phone");
    this.setState({ phone: phone });
  }
  componentDidMount() {
    this.loadPhoneNo().then(() => {
      this.loadWorks();
    });
  }
  loadWorkBId(id) {
    this.setState({loadingWorks:true})
    fetch("https://school-server.herokuapp.com/workById", {
      headers: { id: id },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          this.state.selectedWork = {
            id: data.work.id,
            date: data.work.date,
            work: data.work.work,
          };
          this.setState({ ...this.state, openDisplay: true });
        }
      }).finally(()=>{
        this.setState({loadingWorks:false})
      })
  }
  render() {
    return (
      <View>
        {this.state.loadingWorks ? (
          <Text style={this.style.loadingBanner}>Loading Works</Text>
        ) : null}
        <ScrollView style={this.style.scrollView}>
          {this.state.works.map((work) => (
            <TouchableOpacity
              style={this.style.workName}
              onPress={() => {
                this.loadWorkBId(work.id);
              }}
              key={work.id}
            >
              <Text>{new Date(work.date).toDateString()}</Text>
              <Text>{`${work.class}-${work.section}`}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {this.state.openDisplay ? (
          <View style={this.style.ViewBanner}>
            <TouchableOpacity
              onPress={() => {
                this.setState({ openDisplay: false });
              }}
              style={{ flexDirection: "row", justifyContent: "flex-end" }}
            >
              <Icon name="close" size={25} />
            </TouchableOpacity>
            <Text style={this.style.ViewBannerDisplayDate}>
              {new Date(this.state.selectedWork.date).toDateString()}
            </Text>
            <View
              style={{ borderBottomColor: "black", borderBottomWidth: 1 }}
            ></View>
            {this.state.selectedWork.work.map((work) => (
              <View
                style={this.style.ViewBannerDisplay}
                key={`${work.name}-${
                  this.state.selectedWork.id
                }-${Math.random()}`}
              >
                <Text style={this.style.ViewBannerDisplayText}>
                  Subject: {work.name}
                </Text>
                <Text style={this.style.ViewBannerDisplayText}>
                  CW: {work.cw || "No Work"}
                </Text>
                <Text style={this.style.ViewBannerDisplayText}>
                  HW: {work.hw || "No Work"}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    );
  }
}
