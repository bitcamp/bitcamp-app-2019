import React, { Component } from "react";
import { DefaultTheme, BottomNavigation } from "react-native-paper";
import Home from "./Home";
import Mentors from "./Mentors";
import Profile from "./Profile";
import Saved from "./Saved";
import Schedule from "./Schedule";
import Login from "./Login";
import CustomTabBar from "../components/CustomTabBar";
import { H5 } from "../components/Text";
import { colors } from "../components/Colors";
import Icon from "react-native-vector-icons/SimpleLineIcons";
import ScrollableTabView from "react-native-scrollable-tab-view";
import { PushNotificationIOS, View, TouchableOpacity } from "react-native";
import { AsyncStorage, SafeAreaView, BackHandler } from "react-native";
import { Heading, PadContainer, ViewContainer } from "../components/Base";
import MapModal from "../components/MapModal";

import firebase from "react-native-firebase";

const channelId = "technica-push-notifications";
const channelName = "Technica Announcements";

export default class AppContainer extends Component<Props> {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <View style={{flex: 1}}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Heading
            style={{
              paddingLeft: 20,
              paddingTop: 20
            }}
            logo
          >
            {navigation.state.params
              ? navigation.state.params.title
              : "Bitcamp 2019"}
          </Heading>

          {navigation.state.params && navigation.state.params.showMapIcon ? (
            <TouchableOpacity
              onPress={() => navigation.state.params.toggleMapModal()}
              style={{marginRight: 20}}
            >
              <Icon
                name="map"
                size={30}
                color={colors.primaryColor}
                style={{
                  paddingTop: 34,
                  opacity: 0.8
                }}
              />
            </TouchableOpacity>
          ) : null}
        </View>
        <MapModal
          isModalVisible={
            navigation.state.params
              ? navigation.state.params.isMapModalVisible
              : false
          }
          toggleModal={() => navigation.state.params.toggleMapModal()}
        />
      </View>
    ),
    headerStyle: {
      elevation: 0,
      shadowOpacity: 0,
      backgroundColor: colors.backgroundColor.normal
    },
    headerLeft: null
  });

  constructor(props) {
    super(props);
    this.state = {
      page: 0
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    this.toggleMapModal = this.toggleMapModal.bind(this);
    this.props.navigation.setParams({
      title: "Bitcamp 2019",
      isMapModalVisible: false,
      toggleMapModal: this.toggleMapModal,
      showMapIcon: true
    });
  }

  toggleMapModal = () => {
    this.props.navigation.setParams({
      isMapModalVisible: !this.props.navigation.state.params.isMapModalVisible
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
        <ScrollableTabView
          tabBarPosition="bottom"
          locked
          style={{ backgroundColor: colors.backgroundColor.normal, paddingTop: 40 }}
          renderTabBar={() => <CustomTabBar />}
          onChangeTab={tab => {
            const tabIndex = tab.i;
            const tabNames = [
              "Bitcamp 2019",
              "Schedule",
              "Saved",
              "Mentors",
              "Profile"
            ];
            this.props.navigation.setParams({ title: tabNames[tabIndex] });
            if (tabIndex == 0) {
              this.props.navigation.setParams({ showMapIcon: true });
            } else {
              this.props.navigation.setParams({ showMapIcon: false });
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
            tabLabel="calendar"
            eventManager={this.props.screenProps.eventManager}
          />
          <Saved
            ref={mySaved => {
              this.mySaved = mySaved;
              eventManager.registerEventChangeListener(mySaved);
            }}
            tabLabel="heart"
            eventManager={this.props.screenProps.eventManager}
          />
          <Mentors tabLabel="people" />
          <Profile tabLabel="user" navigation={navigate} />
        </ScrollableTabView>
      </SafeAreaView>
    );
  }

  componentWillMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
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
      "Technica notification channel for delivering important announcements"
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
