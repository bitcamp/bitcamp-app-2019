import React, { Component, Fragment } from 'react';
import { Alert, AsyncStorage, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import { Button, Heading, PadContainer, SubHeading } from '../components/Base';
import { colors } from '../components/Colors';
import KeyboardShift from '../components/KeyboardShift';

const APP_ID = '@com.technica.technica18:';
const USER_TOKEN = APP_ID + 'JWT';
const EVENT_FAVORITED_STORE = APP_ID + 'EVENT_FAVORITED_STORE';
const USER_DATA_STORE = 'USER_DATA_STORE';
const { State: TextInputState } = TextInput;


export default class Login extends Component<Props> {

  createInitialState() {
    return {
      savedEmail: '',
      savedCode: '',
      fieldValue: '',
      placeholder: '',
      greeting: 'Welcome to \nBitcamp 2019',
      instruction: 'Enter the email you used to sign up for Bitcamp.',
      nextPage: (
        <TouchableOpacity onPress={() => this.sendEmail(this.state.fieldValue)}>
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
  }

  static navigationOptions = {
    header: null,
  };

  validEmail(email){
    var emailRegex = RegExp('^.+@.+\..+$');
    if(emailRegex.test(email)){
      return email;
    }
    return null;
  }

  async sendEmail(email) {
    validEmail = this.validEmail(email);
    if(validEmail != null){
      let url = "https://api.bit.camp/auth/login/requestCode";
      try {
          let response = await fetch(url, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({'email': validEmail})
          });
          if(response.status == 200){
            this.setState({greeting: "Great!", instruction: "We've sent a verification code to your email. Please enter that code below to login.",
            nextPage: (
              <TouchableOpacity onPress={() => this.sendReceivedCode(this.state.fieldValue)}>
                  <Button
                      text='Submit'
                      size={22}
                      color='white'
                      style={styles.button}
                    />
                </TouchableOpacity>),
              savedEmail: validEmail, fieldValue: '', placeholder: 'xxxxxx'});
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
      } catch (error) {
          Alert.alert(
            "There was an error requesting a code.",
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

  processUserEvents(eventsArr) {
    userFavoritedEvents = {};
    for(i = 0; i < eventsArr.length; i++) {
      userFavoritedEvents[eventsArr[i]] = true;
    }
    return userFavoritedEvents;
  }

  async sendReceivedCode(code){

    let url = "https://api.bit.camp/auth/login/code";
    try {
        let email = this.state.savedEmail;
        let response = await fetch(url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({'email': email, 'code': code})
        });
        let responseJson = await response.json();
        if(response.status == 200){
          await AsyncStorage.setItem(USER_DATA_STORE, JSON.stringify(responseJson.user));
          await AsyncStorage.setItem(USER_TOKEN, responseJson.token);
          userFavoritedEvents = this.processUserEvents(responseJson.user.favoritedFirebaseEvents);
          await AsyncStorage.setItem(EVENT_FAVORITED_STORE, JSON.stringify(userFavoritedEvents));
          this.setState({savedCode: code, fieldValue: ''});
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
      console.log(error);
        Alert.alert(
          "There was an error confirming the pin.",
          "Try again.",
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          { cancelable: false }
        );
      }
  }

  render() {
    return (
        <KeyboardShift>
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
            keyboardType = 'email-address'
            autoCapitalize = 'none'
            style={{
              borderColor: colors.borderColor.normal,
              borderBottomWidth: 1,
              paddingBottom: 8,
              fontSize: 24,
              color: colors.textColor.normal,
            }}
          />
        
        {this.state.nextPage}
        </PadContainer>
      </KeyboardShift>
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
