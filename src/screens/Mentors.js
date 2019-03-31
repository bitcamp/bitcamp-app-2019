import React, { Component } from "react";
import {
  View,
  ScrollView,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  AppState,
  Text,
} from "react-native";
import {
  ViewContainer,
  modalStyle,
  Button,
  PadContainer,
} from "../components/Base";
import Modal from "react-native-modal";
import { colors } from "../components/Colors";
import KeyboardShift from "../components/KeyboardShift";
import firebase from "react-native-firebase";
import QuestionCard from "../components/QuestionCard";
import { AsyncStorage } from "react-native";
import { H1, H2, H3, H4, H6, P } from "../components/Text";
import Toast from "react-native-simple-toast";
import moment from "moment";
import { StyleSheet, StatusBar, Switch } from "react-native";
import { red100 } from "react-native-paper/src/styles/colors";
import { scale, verticalScale } from "../actions/scale";
import AltModalHeader from '../components/AltModalHeader';

const serverURL = "http://35.174.30.108:4000";

export default class Mentors extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      question: "",
      location: "",
      needsInPersonAssistance: false,
      slackUsername: "",
      newQuestionScreen: false,
      listData: []
    };
    this.sendQuestion = this.sendQuestion.bind(this);
    this.showToast = this.showToast.bind(this);
    this._handleAppStateChange = this._handleAppStateChange.bind(this);
  }

  async grabQuestionsFromDB(email) {
    fetch(`${serverURL}/getquestions/${email}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(async responseJson => {
        console.log("questions found");
        console.log(responseJson);
        this.setState({ listData: responseJson });
      })
      .catch(err => {
        console.log("ERROR GRABBING QUESTIONS");
        console.log(err);
      });
  }

  // initially loads question data from server
  async componentDidMount() {
    AppState.addEventListener("change", this._handleAppStateChange);
    const user_data = await AsyncStorage.getItem("USER_DATA_STORE");
    const user_data_json = JSON.parse(user_data);
    this.grabQuestionsFromDB(user_data_json.email);
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  async _handleAppStateChange(nextAppState) {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!");
      const user_data = await AsyncStorage.getItem("USER_DATA_STORE");
      const user_data_json = JSON.parse(user_data);
      this.grabQuestionsFromDB(user_data_json.email);
    }
    this.setState({ appState: nextAppState });
  }

  clearInputs() {
    this.setState({ question: "", location: "" });
  }
  cancelQuestion() {
    this.setState({
      question: "",
      newQuestionScreen: !this.state.newQuestionScreen
    });
  }
  toggleModal() {
    const newQuestionScreen = this.state.newQuestionScreen
    this.setState({ newQuestionScreen: !newQuestionScreen });
  }

  showToast() {
    // Show toast after 600ms
    // This 600ms delay ensures the toast loads after the modal animation close
    // happens. There is a weird iOS issue where toast will vanish the moment
    // modal closes. This is the best workaround I could make for now.
    setTimeout(() => {
      Toast.show(
        "Question sent! Our next available mentor will come assist you.",
        Toast.LONG
      );
    }, 400);
  }

  async sendQuestion() {
    if (this.state.question === "" || this.state.location === "") {
      Alert.alert(
        "Try Again",
        "Your question or location was empty.",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
    } else {
      const fcmToken = await AsyncStorage.getItem("FCMToken");
      const user_data = await AsyncStorage.getItem("USER_DATA_STORE");
      const user_data_json = JSON.parse(user_data);
      const name =
        user_data_json.profile.firstName +
        " " +
        user_data_json.profile.lastName;
      var questionObject = {
        question: this.state.question,
        location: this.state.location,
        slackUsername: this.state.slackUsername,
        needsInPersonAssistance: this.state.needsInPersonAssistance,
        status: "Awaiting available mentors",
        key: moment().format(),
        name: name,
        email: user_data_json.email
      };
      if (fcmToken != null) {
        questionObject.fcmToken = fcmToken;
      }

      var questionString = JSON.stringify(questionObject);
      fetch(`${serverURL}/question`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: questionString
      }).catch(error => {
        console.log(error);
      });
      this.clearInputs();
      this.showToast();
      this.toggleModal();
      // make new question show up immediately at top of list
      this.setState({ listData: [questionObject].concat(this.state.listData) });
    }
  }
  renderHeading() {
    return (
      <React.Fragment>
        <H2 style={{ marginTop: 20, marginBottom: 5 }}>Get help from a mentor</H2>
        <P style={{ marginBottom: 20 }}>Bitcamp mentors are experts in helping you with your hack or answering any additional questions you might have.</P>
      </React.Fragment>
    );
  }

  renderNewQuestionModal() {
    const { question, location, newQuestionScreen, slackUsername, needsInPersonAssistance } = this.state;

    return (
      <Modal
        isVisible={newQuestionScreen}
        backdropColor={colors.backgroundColor.dark}
        backdropOpacity={1}
        animationInTiming={250}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationOutTiming={300}
        backdropTransitionInTiming={250}
        backdropTransitionOutTiming={300}
        avoidKeyboard={true}
        onBackButtonPress={() => this.toggleModal()}
        style={modalStyle}
      >
        <KeyboardShift style={modalStyles.stretchyContainer}>
          <AltModalHeader
            title="Request Help"
            leftText="Cancel"
            leftFunc={this.cancelQuestion.bind(this)}
            rightText="Submit"
            rightFunc={this.sendQuestion.bind(this)}
          />
          <View style={modalStyles.stretchyContainer}>
            <View style={modalStyles.inputGroup}>
              <H3 style={modalStyles.inputGroupTitle}>
                QUESTION
              </H3>
              <TextInput
                style={[ modalStyles.input, modalStyles.textArea ]}
                multiline={true}
                numberOfLines={10}
                onChangeText={text => this.setState({ question: text })}
                value={question}
                underlineColorAndroid="transparent"
                placeholder="How do I make X using Y?"
                placeholderTextColor={colors.textColor.light}
              />
            </View>
            <View style={modalStyles.inputGroup} marginTop={10}>
              <H3 style={modalStyles.inputGroupTitle}>
                TABLE INFO
              </H3>
              <TouchableOpacity 
                style={[
                  modalStyles.input,
                  {
                    borderBottomColor: colors.borderColor.light,
                    borderBottomWidth: 1,
                  }
                ]}
                onPress={() => this.setState({ needsInPersonAssistance: !needsInPersonAssistance})}
                activeOpacity={1}
              >
                <Switch
                  trackColor={colors.primaryColor}
                  value={needsInPersonAssistance}
                  onValueChange={() => this.setState({ needsInPersonAssistance: !needsInPersonAssistance})}
                  style={{ marginRight: 10, }}
                />
                <P>I'd like in person assistance please</P>
              </TouchableOpacity>
              <TextInput
                style={modalStyles.input}
                onChangeText={text => this.setState({ location: text })}
                value={location}
                underlineColorAndroid="transparent"
                placeholder="Table B5"
                placeholderTextColor={colors.textColor.light}
              />
            </View>
            <View style={modalStyles.inputGroup} marginTop={10}>
              <H3 style={modalStyles.inputGroupTitle}>
                SLACK USERNAME
              </H3>
              <TextInput
                style={modalStyles.input}
                onChangeText={text => this.setState({ slackUsername: text })}
                value={slackUsername}
                underlineColorAndroid="transparent"
                placeholder="bitcamper123"
                placeholderTextColor={colors.textColor.light}
                autoCapitalize="none"
              />
              <P style={modalStyles.inputDescription}>
                A Bitcamp mentor will respond to your message over Slack and may approach your table to assist if needed
              </P>
            </View>
          </View>
        </KeyboardShift>
      </Modal>
    );
  }

  async createNotificationListener() {
    // updates when app is in foreground
    this.notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        this.grabQuestionsFromDB(notification.data.email);
      });

    // updates when app is in the background
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        this.grabQuestionsFromDB(notificationOpen.notification.data.email);
      });
  }

  async updateQuestionStatus(notification) {
    console.log("notification received", notification.body);
    console.log(notification.data);

    const key = notification.data.key;
    const mentorName = notification.data.mentor_name;

    const questions = await AsyncStorage.getItem("questions");
    const qList = JSON.parse(questions);

    // update status of question
    qList.forEach((element, index) => {
      if (element.key == key) {
        console.log("found!");
        element.status = `${mentorName} has claimed your question!`;
        qList[index] = element;
      }
    });
    // store update in local storage
    await AsyncStorage.setItem("questions", JSON.stringify(qList));
    this.setState({ listData: qList });
  }

  render() {
    {
      this.createNotificationListener();
    }

    return (
      <ViewContainer>
        <PadContainer>
          {this.renderHeading()}
          {this.renderNewQuestionModal()}
        </PadContainer>
        <TouchableOpacity
          onPress={() => {
            this.toggleModal();
          }}
          style={{ marginBottom: 40 }}
        >
          <Button style={{ 
            padding: 16, 
            borderRadius: 8,
            fontWeight: 'bold'
          }} text="Ask a Question" />
        </TouchableOpacity>
        <PadContainer>
          {this.state.listData && this.state.listData.length > 0 && (
            <H2 style={{ marginBottom: 20 }}>Your Questions</H2>
          )}
          <FlatList
            data={this.state.listData}
            renderItem={({ item }) => (
              <QuestionCard
                question={item.question}
                status={item.status}
                location={item.location}
                time={item.key}
              />
            )}
          />
        </PadContainer>
      </ViewContainer>
    );
  }
}

const modalStyles = StyleSheet.create({
  input: {
    backgroundColor: colors.backgroundColor.normal,
    fontSize: scale(14),
    color: colors.textColor.normal,
    padding: 15,
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center'
  },
  textArea: {
    textAlignVertical: 'top',
    minHeight: verticalScale(225),
  },
  inputGroupTitle: {
    color: '#6d6d72', 
    marginBottom: 5,
    paddingLeft: 15,
    fontSize: 14,
    fontWeight: '400'
  },
  inputGroup: {
    marginTop: verticalScale(20),
    marginBottom: 5,
  },
  inputDescription: {
    padding: 15,
    paddingTop: 8,
    fontSize: scale(12),
    color: '#6d6d72'
  },
  stretchyContainer: {
    flex: 1,
    backgroundColor: colors.backgroundColor.dark,
  }
});