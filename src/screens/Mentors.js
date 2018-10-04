import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  ViewContainer,
  Heading,
  SubHeading,
  Button,
  PadContainer,
} from '../components/Base';
import Modal from "react-native-modal";
import { colors } from '../components/Colors';
import firebase from 'react-native-firebase';
import QuestionCard from '../components/QuestionCard'
import { AsyncStorage } from "react-native"

export default class Mentors extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = { question: '', tableNumber: "", newQuestionScreen:false, listData: [] };
    this.sendQuestion = this.sendQuestion.bind(this);
  }
  // initially loads question data
  async componentDidMount() {
    const listData = [];
    const question = await AsyncStorage.getItem("questions");
    const qList = JSON.parse(question)
    this.setState({listData: qList})
  }
  clearInputs() {
    this.setState({ question: '', tableNumber: ''});
  }
  cancelQuestion() {
    this.setState({ question: '', newQuestionScreen: !this.state.newQuestionScreen });
  }
  toggleModal() {
    this.setState({ newQuestionScreen: !this.state.newQuestionScreen });
  }
  storeQuestion = async (questionObject) => {
    try {
      let questions = await AsyncStorage.getItem("questions")
      var qList
      if (questions != null) {
        qList = JSON.parse(questions)
        qList.unshift(questionObject)
      } else {
        qList = [questionObject]
      }
      await AsyncStorage.setItem("questions", JSON.stringify(qList))
      this.setState({listData: qList})
      this.clearInputs()
    } catch (error) {
      // Error saving data
      console.log(error)
    }
  }

  async sendQuestion() {
    const fcmToken = await AsyncStorage.getItem("FCMToken");
    var questionObject = {
      question: this.state.question,
      tableNumber: this.state.tableNumber,
      status: "Awaiting Response",
      key: this.state.question,
    }
    if (fcmToken != null) {
      questionObject.fcmToken = fcmToken
    }
    var questionString = JSON.stringify(questionObject)
    fetch('https://technicamentorshipservertest.herokuapp.com/question', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: questionString,
    }).catch(error => {
      console.log(error)
    })
    this.storeQuestion(questionObject)

    // TODO: show popup with feedback
    this.toggleModal()
  }
  renderHeading() {
    return (
      <React.Fragment>
        <Heading>
          Mentors
        </Heading>
        <SubHeading>
          Ask our mentors for help
        </SubHeading>
      </React.Fragment>
      )
  }

  renderNewQuestionModal() {
    const { question, tableNumber, newQuestionScreen  } = this.state;
    return (
      <Modal
        isVisible={newQuestionScreen}
        backdropColor={colors.black}
        backdropOpacity={1}
        animationInTiming={250}
        animationIn="fadeInUp"
        animationOut="fadeOutDown"
        animationOutTiming={300}
        backdropTransitionInTiming={250}
        backdropTransitionOutTiming={300}
        avoidKeyboard={true}
        onBackButtonPress={() => this.toggleModal()}
        style={{ margin: 0 }}
      >
        <View style={{ padding: 20 }}>
          <Text style={{color: 'white'}}>Question</Text>
          <TextInput
                style={{height: 40, borderBottomColor: '#B6A1C4', borderBottomWidth: 1, color: 'white'}}
                onChangeText={(text) => this.setState({question: text})}
                value={question}
                underlineColorAndroid='transparent'
          />
          <View marginTop = {10}>
            <Text style={{color: 'white'}}>Table Number</Text>
            <TextInput
              style={{height: 40, borderBottomColor: '#B6A1C4', borderBottomWidth: 1, color: 'white'}}
              onChangeText={(text) => this.setState({tableNumber: text})}
              value={tableNumber}
              underlineColorAndroid='transparent'
            />
          </View>
        </View>
        <View marginTop = {10}>
        <TouchableOpacity onPress={() => this.sendQuestion()}>
          <Button
            text="Submit Question"
          />
        </TouchableOpacity>
        </View>
        <View marginTop = {10}>
          <TouchableOpacity onPress={() => this.cancelQuestion()}>
            <Button
              text="Cancel"
            />
          </TouchableOpacity>
        </View>
      </Modal>
    )
  }

  render() {
    const dimensions = require('Dimensions').get('window');
    const buttonWidth = (dimensions.width / 2) - 30;

    this.notificationListener = firebase
    .notifications()
    .onNotification(async (notification: Notification) => {
      console.log('notification received', notification.body);
      var msg = notification.body;
      // checking that the message is for a question being claimed
      if (msg.indexOf("Your question: ") != -1) {
        var question = msg.substring(msg.indexOf("Your question: ") + 15, msg.indexOf("has been claimed!")-1)
        console.log(question)
        let questions = await AsyncStorage.getItem("questions")
        var qList = JSON.parse(questions)
        // update status of question
        qList.forEach(element => {
          if (element.question == question){
            console.log("found!")
            element.status = "Responded!"
          }
        })
        // store update in local storage
        await AsyncStorage.setItem("questions", JSON.stringify(qList))
        this.setState({listData: qList})
      }
    });

      return (
      <ViewContainer>
      <PadContainer>
        {this.renderHeading()}
        {this.renderNewQuestionModal()}
      </PadContainer>
      <TouchableOpacity
        onPress={() => {
          this.toggleModal()
        }}
      >
        <Button text="Ask a Question" />
      </TouchableOpacity>
      <PadContainer>
        <View marginTop = {10}>
        <FlatList
            data = {this.state.listData}
            renderItem={({item}) => <QuestionCard question = {item.question} status = {item.status}/>}
          />
        </View>
      </PadContainer>
    </ViewContainer>
    )
    }
  }
