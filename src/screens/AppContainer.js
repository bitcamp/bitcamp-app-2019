import React, { Component } from 'react';
import { AsyncStorage, BackHandler, Image, SafeAreaView, StatusBar, Text, TouchableHighlight, View } from 'react-native';
import firebase from 'react-native-firebase';
import { Colors } from 'react-native-paper';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { colors } from '../components/Colors';
import CustomTabBar from '../components/CustomTabBar';
import MapModal from '../components/MapModal';
import SearchModal from '../components/SearchModal';
import Home from './Home';
import Mentors from './Mentors';
import Profile from './Profile';
import Schedule from './Schedule';
import Expo from './Expo';
import moment from 'moment';
import { scale } from '../actions/scale';

const channelId = "bitcamp-push-notifications";
const channelName = "Bitcamp Announcements";
const hackingIsOver = moment().isAfter(moment("2019-04-14 09:00"));

export default class AppContainer extends Component<Props> {
  static navigationOptions = ({navigation}) => ({
    headerStyle: {
      elevation: 0,
      shadowOpacity: 0,
      shadowColor: 'transparent',
      borderBottomWidth: 0.5,
      backgroundColor: colors.backgroundColor.light,
      borderColor: colors.borderColor.normal,
      height: scale(75),
    },
    headerLayoutPreset: 'center',
    headerTintColor: colors.primaryColor,
    headerRight:
    navigation.getParam("showMapIcon") ?
    (
      <View>
        <View style={{flexDirection:"row", paddingRight: 15}}>
          <View style={{flex:1}}>
            <TouchableHighlight
            onPress={navigation.getParam("toggleMapModal")}
            underlayColor={Colors.white}
            >
              <FontAwesome
                name="map"
                size={30}
                color={colors.primaryColor}
              />
            </TouchableHighlight>
          </View>
        </View>
        <MapModal
          isModalVisible={
            navigation.state.params
              ? navigation.getParam("isMapModalVisible")
              : false
          }
          toggleModal={() => navigation.state.params.toggleMapModal()}
        />
      </View>
    )
    :
    navigation.getParam("showSearchIcon") ? (
      <View>
        <View style={{flexDirection:"row", paddingRight: 15}}>
          <View style={{flex:1}}>
          <TouchableHighlight
            onPress={navigation.getParam("toggleSearchModal")}
            underlayColor={Colors.white}
            >
              <Icon
                name="magnifier"
                size={30}
                color={colors.primaryColor}
              />
            </TouchableHighlight>
          </View>
        </View>
        <SearchModal
          isModalVisible={
            navigation.state.params
              ? navigation.getParam("isSearchModalVisible")
              : false
          }
          toggleModal={() => navigation.state.params.toggleSearchModal()}
          eventDays={navigation.getParam("eventDays")}
          eventManager={navigation.getParam("eventManager")}
        />
      </View>
    )
    :
    (<View>
    </View>),
    headerLeft: (
      <View style={{flexDirection:"row", paddingLeft: 15}}>
        <View style={{flex:1}}>
          <Image
            source={require('../../assets/imgs/bitcamp-logo-icon.png')}
            style={{width: 50, height: 50}}
          />
        </View>
        <View style={{flex:1, paddingLeft: 20, paddingTop: 5}}>
          <Text style={{
            textAlign: 'left',
            fontFamily: 'Aleo-Bold',
            fontSize: 40,
            color: colors.primaryColor,
          }}>
            {navigation.getParam("title")}
          </Text>
        </View>
      </View>
    ),
  });

  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      isMapModalVisible: false
    };

    this.toggleMapModal = this.toggleMapModal.bind(this);
    this.toggleSearchModal = this.toggleSearchModal.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.props.navigation.setParams({
      title: "bitcamp",
      showMapIcon: true,
      isMapModalVisible: false,
      isSearchModalVisible: false,
      toggleMapModal: this.toggleMapModal,
      toggleSearchModal: this.toggleSearchModal,
      eventDays: this.props.screenProps.eventManager.getEventDays(),
      eventManager: this.props.screenProps.eventManager,
      showSearchIcon: false,
    });
  }

  toggleMapModal = () => {
    this.props.navigation.setParams({
      isMapModalVisible: !(this.props.navigation.getParam("isMapModalVisible"))
    });
  };

  toggleSearchModal = () => {
    this.props.navigation.setParams({
      isSearchModalVisible: !(this.props.navigation.getParam("isSearchModalVisible"))
    });
  };

  render() {
    this.configureNotificationSettings();
    const eventManager = this.props.screenProps.eventManager;
    const { navigate } = this.props.navigation;
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.backgroundColor.normal }}
      >
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors.backgroundColor.light}
        />
        <ScrollableTabView
          tabBarPosition="bottom"
          locked
          style={{ backgroundColor: colors.backgroundColor.normal/*, paddingTop: 40*/ }}
          renderTabBar={() => <CustomTabBar />}
          onChangeTab={tab => {
            const tabIndex = tab.i;
            const tabNames = [
              "bitcamp",
              "Schedule"
            ];
            // if (hackingIsOver) {
            //   tabNames.push("Expo");
            // }
            tabNames.push("Mentors", "Profile");
            this.props.navigation.setParams({ title: tabNames[tabIndex] });
            if (tabIndex == 1 || (hackingIsOver && tabIndex == 2)) {
              this.props.navigation.setParams({ showMapIcon: false, showSearchIcon: true, eventDays: eventManager.getEventDays() });
            } else if (tabIndex == 0) {
              this.props.navigation.setParams({ showMapIcon: true, showSearchIcon: false });
            } else {
              this.props.navigation.setParams({ showMapIcon: false, showSearchIcon: false });
            }
          }}
        >
          <Home
            ref={myHome => {
              this.myHome = myHome;
              eventManager.registerEventChangeListener(myHome);
              eventManager.registerUpdatesListener(myHome);
            }}
            eventManager={this.props.screenProps.eventManager}
            tabLabel="home"
          />
          <Schedule
            ref={mySchedule => {
              this.mySchedule = mySchedule;
              eventManager.registerEventChangeListener(mySchedule);
            }}
            tabLabel="schedule"
            eventManager={this.props.screenProps.eventManager}
            navigation={this.props.navigation}
          />
          { hackingIsOver &&
          <Expo
            tabLabel="expo"
            eventManager={this.props.screenProps.eventManager}
            navigation={this.props.navigation}
          />
          }
          <Mentors tabLabel="mentors" />
          <Profile tabLabel="profile" navigation={navigate} />
        </ScrollableTabView>
      </SafeAreaView>
    );
  }

  componentWillMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
    const eventManager = this.props.screenProps.eventManager;
  }

  componentWillUnmount() {
    const eventManager = this.props.screenProps.eventManager;
    eventManager.removeEventChangeListener(this.myHome);
    eventManager.removeEventChangeListener(this.mySchedule);
    eventManager.removeEventChangeListener(this.mySaved);

    eventManager.removeUpdatesListener(this.myHome);
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  handleBackButtonClick() {
    //BackHandler.exitApp();
    return true;
  }

  configureNotificationSettings() {
    //create notifications channel
    const channel = new firebase.notifications.Android.Channel(
      channelId,
      channelName,
      firebase.notifications.Android.Importance.Max
    ).setDescription(
      "Bitcamp notification channel for delivering important announcements"
    );

    firebase.notifications().android.createChannel(channel);

    firebase
      .messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
          console.log("Permission enabled");
        } else {
          try {
            firebase.messaging().requestPermission();
          } catch (error) {
            console.log("Error authenticating", error);
          }
        }
      });

    firebase
      .messaging()
      .getToken()
      .then(fcmToken => {
        if (fcmToken) {
          console.log("fcm token: ", fcmToken);
          // store FCMToken for use with mentorship notifications
          AsyncStorage.setItem("FCMToken", fcmToken);
        } else {
          console.log("no token");
        }
      });

    firebase.messaging().subscribeToTopic("announcements");

    this.notificationDisplayedListener = firebase
      .notifications()
      .onNotificationDisplayed((notification: Notification) => {
        // Process your notification as required
        // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
        console.log("notification displayed", notification);
      });

    this.notificationListener = firebase
      .notifications()
      .onNotification((notification: Notification) => {
        console.log("notification received", notification);
        notification.android.setChannelId(channelId);
        firebase.notifications().displayNotification(notification);
      });
  }
}
