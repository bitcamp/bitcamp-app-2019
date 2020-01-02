import React, { Component } from 'react';
import { YellowBox, AsyncStorage } from 'react-native';
import Login from './screens/Login';
import AppContainer from './screens/AppContainer';
import { createStackNavigator} from 'react-navigation-stack';
import { CenteredActivityIndicator } from './components/Base';
import { createAppContainer } from 'react-navigation';
import * as firebase from 'firebase';
import { firebaseConfig } from '../config';

// TODO: add in react-native-screens optimization

// NOTE dangerously ignore deprecated warning for now
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader', 'Setting a timer', "Warning: Can't"]);

console.reportErrorsAsExceptions = false;

XMLHttpRequest = GLOBAL.originalXMLHttpRequest ?
    GLOBAL.originalXMLHttpRequest :
    GLOBAL.XMLHttpRequest;

// fetch logger
global._fetch = fetch;
global.fetch = function (uri, options, ...args) {
  return global._fetch(uri, options, ...args).then((response) => {
    console.log('Fetch', { request: { uri, options, ...args }, response });
    return response;
  });
};

// Firebase initialization
if(firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: undefined,
    }
  }

  componentDidMount() {
    this.loadUserInfo();
  }

  async loadUserInfo() {
    try {
      const userInfo = await AsyncStorage.getItem("USER_DATA_STORE");
      this.setState({
        isLoggedIn: (userInfo !== null)
      });
    } catch (error) {
       console.log(error);
    }
  }

  render() {
    if (this.state.isLoggedIn === undefined) {
      return (
        <CenteredActivityIndicator/>
      );
    } else {

      // TODO: strip out of render
      const AppNavigator = createStackNavigator({
        Login: { screen: Login },
        AppContainer: { screen: AppContainer },
      }, {
        initialRouteName: (this.state.isLoggedIn === false) 
          ? 'Login' 
          : 'AppContainer'
      });
      const NavContainer = createAppContainer(AppNavigator);

      return <NavContainer screenProps={this.props}/>;
    }
  }
}
