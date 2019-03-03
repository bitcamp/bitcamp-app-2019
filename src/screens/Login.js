import React, { Component, Fragment } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  Alert,
  AsyncStorage,
  TextInput,
  Animated,
  Dimensions,
  Keyboard,
  UIManager,
  KeyboardAvoidingView
} from 'react-native';
import { H1, H2, H3, H4, H6, P } from '../components/Text';
import {
  ViewContainer,
  Heading,
  SubHeading,
  PaperSheet,
  PadContainer,
  HorizontalLine,
  ModalContent,
  ModalHeader,
  Spacing,
  Button,
} from '../components/Base';
import Modal from "react-native-modal";
import EventCard from '../components/EventCard';
import EventColumns from '../components/EventColumns';
import { colors } from '../components/Colors';
import CountdownTimer from '../components/CountdownTimer';
import Icon from 'react-native-vector-icons/FontAwesome';

const APP_ID = '@com.technica.technica18:';
const EVENT_FAVORITED_STORE = APP_ID + 'EVENT_FAVORITED_STORE';
const USER_DATA_STORE = 'USER_DATA_STORE';
const { State: TextInputState } = TextInput;


export default class Login extends Component<Props> {

  createInitialState() {
    return {
      savedPhone: '',
      savedSMS: '',
      fieldValue: '',
      placeholder: '',
      greeting: 'Welcome to \nBitcamp 2019',
      instruction: 'Enter the email you used to sign up for Bitcamp.',
      keyboardShown: false,
      nextPage: (
        <TouchableOpacity onPress={() => this.sendPhoneNumber(this.state.fieldValue)}>
          <Button
              text="Next"
              style={{...styles.button}}
            />
        </TouchableOpacity>),
    };
  }
  constructor(props) {
    super(props);

    this.state = this.createInitialState();
    this._keyboardDidShow = this._keyboardDidShow.bind(this);
    this._keyboardDidHide = this._keyboardDidHide.bind(this);
  }
//
//   async componentDidMount() {
// /*
//     await AsyncStorage.removeItem(USER_DATA_STORE);
//     this.setState({loadPage: true});*/
//
//     try {
//       const value = await AsyncStorage.getItem(USER_DATA_STORE);
//       if (value !== null) {
//         const { navigate } = this.props.navigation;
//         navigate('AppContainer');
//       }
//       this.setState({loadPage: true});
//     } catch (error) {
//        console.log(error);
//     }
//
//   }

  static navigationOptions = {
    header: null,
  };

  validPhoneNumber(phoneNumber){
    // Clean spaces, dashes, and parenthesis from phone numbers
    phoneNumber = phoneNumber.replace(/-| |\(|\)/gm,"");

    var phoneRegex = RegExp('^\\d{11,}$');
    if(phoneRegex.test(phoneNumber)){
      return "+" + phoneNumber;
    }
    phoneRegex = RegExp('^\\d{10}$');
    if(phoneRegex.test(phoneNumber)){
      return "+1" + phoneNumber;
    }
    return null;
  }

  async sendPhoneNumber(phoneNumber) {
    validNumber = this.validPhoneNumber(phoneNumber);
    if(validNumber != null){
      let url = "https://obq8mmlhg9.execute-api.us-east-1.amazonaws.com/beta/login/check-status";
      try {
          let response = await fetch(url, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({'phone': validNumber})
          });
          let responseJson = await response.json();
          console.log("response json is", responseJson)
          if(responseJson.statusCode == 200){
            this.setState({greeting: "Great!", instruction: "We're sent a verification code to your email. Please enter that code below to login.",
            nextPage: (
              <TouchableOpacity onPress={() => this.sendReceivedText(this.state.fieldValue)}>
                  <Button
                      text='Submit'
                      size={22}
                      color='white'
                      style={styles.button}
                    />
                </TouchableOpacity>),
              savedPhone: validNumber, fieldValue: '', placeholder: 'xxxxxx'});
          } else{
            Alert.alert(
              "Your email was not found.",
              "If you recently registered for Bitcamp, please try again in 24 hrs.",
              [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
              ],
              { cancelable: false }
            );
          }
          console.log("RESPONSE: " + JSON.stringify(responseJson));
      } catch (error) {
          Alert.alert(
            "No internet connection.",
            "Try again.",
            [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: false }
          );
        }
    }else{
      Alert.alert(
        "Invalid Email.",
        "Please enter a valid email.",
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        { cancelable: false }
        );
    }

  }

  async sendReceivedText(sms){

    let url = "https://obq8mmlhg9.execute-api.us-east-1.amazonaws.com/beta/login/confirm-pin";
    try {
        let phoneNumber = this.state.savedPhone;
        let response = await fetch(url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({'phone': phoneNumber, 'pin': sms})
        });
        let responseJson = await response.json();
        if(responseJson.statusCode == 200){
          await AsyncStorage.setItem(USER_DATA_STORE, JSON.stringify(responseJson.body));
          this.setState({savedSMS: sms, fieldValue: ''});
          const { navigate } = this.props.navigation;
          navigate('AppContainer');

          // this might happen after component is unmounted,
          // however without a delay it will change back as it animates
          // FYI this is kind of a hack since when the user navigates back we want to reset to the
          // phone, not SMS if it does not unmount for some reason
          setTimeout(() => {this.setState(this.createInitialState());}, 3000);

        } else{
          Alert.alert(
            "Failed to confirm pin.",
            "Please try again.",
            [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: false }
          );
        }
    } catch (error) {
        Alert.alert(
          "No internet connection.",
          "Try again.",
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          { cancelable: false }
        );
      }
  }

  componentWillMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow () {
    if (this.state.keyboardShown == false) {
      this.setState({keyboardShown: true});
    }
    console.log("keyboard opened");
  }

  _keyboardDidHide () {
    if (this.state.keyboardShown == true) {
      this.setState({keyboardShown: false});
    }
  }

  render() {
    return (
      
        <PadContainer style={this.state.keyboardShown ? styles.subSection2 : styles.subSection}>
          <Heading style={{ paddingBottom: 20 }}>
            {this.state.greeting}
          </Heading>
          <SubHeading>
            {this.state.instruction}
          </SubHeading>
          <TextInput
            placeholder={this.state.placeholder}
            value={this.state.fieldValue}
            underlineColorAndroid='rgba(0,0,0,0)'
            onChangeText={field => this.setState({ fieldValue: field })}
            placeholderTextColor={colors.textColor.light}
            keyboardType = 'numeric'
            style={{
              borderColor: colors.borderColor.normal,
              borderBottomWidth: 1,
              paddingBottom: 8,
              fontFamily: "DINPro-Medium",
              fontSize: 24,
              color: colors.textColor.normal,
            }}
          />
        
        {this.state.nextPage}
        </KeyboardAvoidingView>
        </PadContainer>
        
    );
  }
}

const styles = StyleSheet.create({
  bottomContainer: {
    // paddingBottom: 20,
    backgroundColor: 'white',
  },
  heading: {
    marginBottom: 20,
  },
  subSection: {
    paddingTop: '30%',
    backgroundColor: colors.backgroundColor.normal
  },
  subSection2: {
    backgroundColor: colors.backgroundColor.normal
  },
  columnContainer: {
    flex: 1, flexDirection: 'row'
  },
  button: {
    marginTop: 20,
    backgroundColor: colors.primaryColor,
  },
  column: {
    flex: 5,
    flexDirection: 'column',
  },
  event: {
    // backgroundColor: 'black',
    marginBottom: 15,
  },
});
