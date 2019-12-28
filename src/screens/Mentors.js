import moment from "moment";
import React, { Component } from "react";
import { Alert, AppState, AsyncStorage, FlatList, StyleSheet, TextInput, TouchableOpacity, View, ToastAndroid as Toast } from "react-native";
import firebase from "firebase";
import AltModalHeader from '../components/modals/AltModalHeader';
import { Button, PadContainer, ViewContainer } from "../components/Base";
import { colors } from "../components/Colors";
import ExternalLink from "../components/ExternalLink";
import FullScreenModal from "../components/modals/FullScreenModal";
import QuestionCard from "../components/QuestionCard";
import SwitchInput from '../components/SwitchInput';
import { H2, H3, P } from "../components/Text";
import { scale, verticalScale } from "../utils/scale";
import { mockFetch } from "../mockData/mockFetch";

const serverURL = "https://guarded-brook-59345.herokuapp.com";

export default class Mentors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      question: "",
      location: "",
      needsInPersonAssistance: false,
      slackUsername: "",
      newQuestionScreen: false,
      listData: [],
      needsDesignMentor: false
    };
    this.showToast = this.showToast.bind(this);
    this._handleAppStateChange = this._handleAppStateChange.bind(this);
  }

  async grabQuestionsFromDB(email) {
    mockFetch(`${serverURL}/getquestions/${email}`, {
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
    this.setState({ 
      question: "",
      needsDesignMentor: false, 
      needsInPersonAssistance: false 
    });
  }
  cancelQuestion() {
    this.clearInputs();
    this.setState({
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
    const hasNoQuestion = this.state.question === "";
    const hasNoLocation = this.state.location === "" && this.state.needsInPersonAssistance;
    const hasNoUsername = this.state.slackUsername === "" && !this.state.needsInPersonAssistance;

    let errorMessage;
    if(hasNoQuestion) {
      errorMessage = "Your question was empty";
    } else if(hasNoLocation) {
      errorMessage = "Your location was empty";
    } else if(hasNoUsername) {
      errorMessage = "Your slack username was empty";
    }

    if (hasNoQuestion || hasNoLocation || hasNoUsername) {
      Alert.alert(
        "Try Again",
        errorMessage,
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
        needsDesignMentor: this.state.needsDesignMentor,
        status: "Awaiting available mentors",
        key: moment().format(),
        name: name,
        email: user_data_json.email
      };
      if (fcmToken != null) {
        questionObject.fcmToken = fcmToken;
      }

      var questionString = JSON.stringify(questionObject);
      mockFetch(`${serverURL}/question`, {
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
      <View>
        <H2 style={[modalStyles.bigTitle, { marginTop: 20, marginBottom: 5 }]}>Get help from a mentor</H2>
        <P style={{ marginBottom: 20 }}>Bitcamp mentors are experts in helping you with your hack or answering any additional questions you might have.</P>
      </View>
    );
  }

  renderNewQuestionModal() {
    const { 
      question, 
      location, 
      newQuestionScreen, 
      slackUsername, 
      needsInPersonAssistance, 
      needsDesignMentor } = this.state;

    return (
      <FullScreenModal
        isVisible={newQuestionScreen}
        backdropColor={colors.backgroundColor.dark}
        onBackButtonPress={() => this.toggleModal()}
        contentStyle={modalStyles.stretchyContainer}
        header={
          <AltModalHeader
            title="Request Help"
            leftText="Cancel"
            leftAction={this.cancelQuestion.bind(this)}
            rightText="Submit"
            rightAction={this.sendQuestion.bind(this)}
          />
        }
      >
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
            autoFocus
          />
        </View>
        <View style={modalStyles.inputGroup}>
          <H3 style={modalStyles.inputGroupTitle}>
            I WOULD LIKE
          </H3>
          <SwitchInput
            style={[modalStyles.input, modalStyles.topInput]}
            onPress={() => this.setState({ needsInPersonAssistance: !needsInPersonAssistance})}
            text="In-person assistance"
            value={needsInPersonAssistance}
            isDisabled={needsDesignMentor}
          />
          <SwitchInput
            style={modalStyles.input}
            onPress={() => this.setState({ 
              needsDesignMentor: !needsDesignMentor,
              needsInPersonAssistance: !needsDesignMentor || needsInPersonAssistance
            })}
            text="A Design Den mentor"
            value={needsDesignMentor}
          />
          <View style={modalStyles.inputDescriptionContainer}>
            {"Design Den mentors can help your team create effective visual design for your project."
              .split(' ').map((word, index) => <P key={index} style={modalStyles.inputDescription}>{word+' '}</P>)
            }
            <ExternalLink text="Learn More..." url="https://medium.com/@bitcmp/design-den-907a6f40c3a9"/>
          </View>
        </View>
        <View style={modalStyles.inputGroup}>
          <H3 style={modalStyles.inputGroupTitle}>
            ABOUT YOU
          </H3>
          <TextInput
            style={[modalStyles.input, modalStyles.topInput]}
            onChangeText={text => this.setState({ location: text })}
            value={location}
            underlineColorAndroid="transparent"
            placeholder="Table Number (B5)"
            placeholderTextColor={colors.textColor.light}
          />
          <TextInput
            style={modalStyles.input}
            onChangeText={text => this.setState({ slackUsername: text })}
            value={slackUsername}
            underlineColorAndroid="transparent"
            placeholder="Slack Username (bitcamper)"
            placeholderTextColor={colors.textColor.light}
            autoCapitalize="none"
          />
          <View style={modalStyles.inputDescriptionContainer}>
            { // In order for the link and the rest of the paragraph to display on one block, 
              // we split the message into words and make each word its own text element
              "A Bitcamp mentor will respond to your message over Slack and may approach your table to assist if needed. Make sure that you"
                .split(' ')
                .map((word, index) => 
                  <P key={index} style={modalStyles.inputDescription}>{word+' '}</P>
                )
            }
            <ExternalLink text="join Bitcamp's Slack workspace." url="https://bit.camp/slack"/>
          </View>
        </View>
      </FullScreenModal>
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
          
        >
          <Button 
            style={{ 
              padding: 16, 
              borderRadius: 8,
              fontWeight: 'bold',
              marginBottom: 40
            }} 
            text="Ask a Question"
            onPress={() => (
              this.toggleModal()
            )}
          />
        </TouchableOpacity>
        <PadContainer>
          {this.state.listData && this.state.listData.length > 0 && (
            <H2 style={modalStyles.bigTitle}>Your Questions</H2>
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
  bigTitle: {
    fontSize: scale(22),
    marginBottom: scale(10),
  },
  input: {
    backgroundColor: colors.backgroundColor.normal,
    fontSize: scale(14),
    color: colors.textColor.normal,
    padding: 15,
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center'
  },
  topInput: {
    borderBottomColor: colors.borderColor.light,
    borderBottomWidth: 1,
  },
  textArea: {
    textAlignVertical: 'top',
    minHeight: verticalScale(200),
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
  inputDescriptionContainer: {
    padding: 15,
    paddingTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  inputDescription: {
    fontSize: scale(12),
    color: '#6d6d72'
  },
  stretchyContainer: {
    flex: 1,
    backgroundColor: colors.backgroundColor.dark,
    paddingHorizontal: 0,
  },
  externalLink: {
    color: colors.primaryColor,
  }
});