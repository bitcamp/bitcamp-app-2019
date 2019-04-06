import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Fragment
} from "react-native";
import { H1, H2, H3, H4, P } from "../components/Text";
import {
  ViewContainer,
  Heading,
  SubHeading,
  PaperSheet,
  PadContainer,
  modalStyle,
  ModalHeader,
  ModalContent,
  CenteredActivityIndicator,
  Button,
  PlainViewContainer
} from "../components/Base";
import QRCodeScanner from "react-native-qrcode-scanner";
import QRCode from "react-native-qrcode";
import _ from "lodash";
import { colors } from "../components/Colors";
import Modal from "react-native-modal";
import MCI from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import FAIcon from "react-native-vector-icons/FontAwesome";
import RNRestart from 'react-native-restart'; // Import package from node modules
import { scale } from '../actions/scale';


const FORCE_NORMAL_USER = false; // NOTE dangerous debug mode setting

const APP_ID = '@com.technica.technica18:';
const USER_TOKEN = APP_ID + 'JWT';
const USER_DATA_STORE = "USER_DATA_STORE";
const SCHEDULE_STORAGE_KEY = APP_ID + 'schedule';

const styles = StyleSheet.create({
  actionButton: {
    marginBottom: scale(5),
    borderRadius: scale(15),
    padding: scale(15),
  },
  QRMarker: {
    width: '60%',
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.secondaryColor
  },
  QRCode: {
    marginTop: scale(15),
    backgroundColor: "white",
    borderRadius: 8,
    borderColor: 'transparent',
    borderWidth: 0,
    padding: scale(7)
  },
  username: {
    textAlign: "center",
    marginTop: scale(-15),
  }
});

export default class Profile extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      scanner: false,
      modalVisible: true,
      userModal: false,
      modalContent: "",

      scannedUser: false,
      scannedUserData: {},

      // For fun...
      devoolooperMode: false,
      namePresses: 0,
      nameColor: colors.textColor.normal,
      timeInterval: null
    };
    this.onNamePress = this.onNamePress.bind(this);
  }

  async logout() {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "OK",
          onPress: () => {
            AsyncStorage.removeItem(USER_DATA_STORE).then(() => {
              RNRestart.Restart();
            });
          }
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        }
      ],
      { cancelable: true }
    );
  }

  toggleScanner() {
    this.setState({ scanner: !this.state.scanner });
  }

  async onScanSuccess(e) {
    try {
      const userId = e.data;
      const url =`https://api.bit.camp/api/users/${userId}/checkIn`;
      const token = await AsyncStorage.getItem(USER_TOKEN);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "x-access-token": token,
        }
      });

      const responseJSON = await response.json();
      if (response.status == 200) {
        const userProfile = responseJSON.profile;
        // Set state for SUCCESS modal
        this.setState({
          scannedUserData: {
            displayName: this.getDisplayName(responseJSON),
            minorStatus: !userProfile.adult,
            dietaryRestrictions: userProfile.dietaryRestrictions
          },
          scannedUser: true
        });
      } else {
        // Set state for NOT FOUND modal
        this.setState({
          scannedUserData: null,
          scannedUser: true
        });
      }
    } catch (error) {
      console.log(error);
      Alert.alert(
        "No internet connection.",
        "Try again.",
        [
          {
            text: "OK",
            onPress: () => {
              this.scanner.reactivate();
            }
          }
        ],
        { cancelable: false }
      );
    }

    // this.scanner.reactivate();
  }

  async verifyHacker() {
    return true;
  }

  async componentDidMount() {
    var loggedInUser = JSON.parse(await AsyncStorage.getItem(USER_DATA_STORE));
    console.log(loggedInUser);
    if (FORCE_NORMAL_USER) {
      loggedInUser.admin = false;
    }
    this.setState({ user: loggedInUser });
    if (!this.state.user.profile) {
      keys = [USER_DATA_STORE, USER_TOKEN];
      AsyncStorage.multiRemove(keys).then(() => {
        const navigate = this.props.navigation;
        RNRestart.Restart();
      });
    }
  }

  getDisplayName(user) {
    const {email, profile: {firstName, lastName}} = user;
    return (firstName && lastName) 
      ? `${firstName} ${lastName}`
      : email;
  }

  toggleModal() {
    this.setState({ modalVisible: !this.state.modalVisible });
  }

  onNamePress() {
    this.setState({ namePresses: this.state.namePresses + 1 });

    if (this.state.namePresses > 3) {
      // If turning on devoolooperMode
      if (!this.state.devoolooperMode) {
        Alert.alert(
          "Congratulations!",
          "You have found the easter egg!",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );

        let intervalID = setInterval(() => {
          // Your logic here
          this.setState({
            nameColor:
              this.state.nameColor !== colors.primaryColor
                ? colors.primaryColor
                : colors.secondaryColor
          });
          if(!this.state.devoolooperMode) {
            clearInterval(intervalID);
            this.setState({
              nameColor: colors.textColor.normal
            });
          }
        }, 250);
      } else {
        Alert.alert(
          "Okay :(",
          "You can be a normal person again.",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
      }

      this.setState({
        devoolooperMode: !this.state.devoolooperMode,
        namePresses: 0
      });
    }
  }

  getDevoolooperName(name) {
    // A, E, I, O, U
    let vowels = new Set();
    vowels.add("A");
    vowels.add("E");
    vowels.add("I");
    vowels.add("O");
    vowels.add("U");

    name = name.toUpperCase();

    let newName = "";
    for (let i = 0; i < name.length; i++) {
      if (vowels.has(name.charAt(i))) {
        newName += "oo";
      } else {
        newName += name.charAt(i);
      }
    }

    // Turn to title case
    return newName.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  render() {

    const scannerView = (() => {
      return (
        <Modal
          isVisible={this.state.scanner}
          backdropColor={colors.backgroundColor.normal}
          backdropOpacity={1}
          animationInTiming={250}
          animationIn="fadeInUp"
          animationOut="fadeOutDown"
          animationOutTiming={300}
          backdropTransitionInTiming={250}
          backdropTransitionOutTiming={300}
          avoidKeyboard={true}
          onBackButtonPress={() => this.toggleScanner()}
          style={modalStyle}
        >
          <ModalContent style={{ padding: 0 }}>
            <View style={{ padding: 20, paddingBottom: 0 }}>
              <ModalHeader
                heading="QR Scanner"
                onBackButtonPress={() => this.toggleScanner()}
              />
            </View>
            <ViewContainer>
              <QRCodeScanner
                ref={node => {
                  this.scanner = node;
                }}
                onRead={this.onScanSuccess.bind(this)}
                showMarker
                reactivate={false}
                customMarker={
                  <View style={styles.QRMarker}/>
                }
              />
              <ScanResponseModal
                isVisible={this.state.scannedUser}
                scannedUserData={this.state.scannedUserData}
                onBack={() => {
                  this.setState({ scannedUser: false });
                  this.scanner.reactivate();
                }}
              />
            </ViewContainer>
          </ModalContent>
        </Modal>
      );
    })();

    const defaultView = (() => {
      if (this.state.user.profile) {
        const displayName = this.getDisplayName(this.state.user);
        const phone_number = this.state.user.profile.phoneNumber
          ? this.state.user.profile.phoneNumber
          : "";

        const id = this.state.user.id
          ? this.state.user.id
          : "";

        console.log(id);

        const isOrganizer = this.state.user.admin || this.state.user.organizer;

        return (
          <ViewContainer>
            {isOrganizer &&
              scannerView}
            <View style={{ alignItems: "center" }}>
              <View style={styles.QRCode}>
                {this.state.user.profile && (
                  <QRCode
                    value={id}
                    size={scale(175)}
                    bgColor="black"
                    fgColor="white"
                  />
                )}
              </View>
              <H3 style={{ color: colors.textColor.light }}>
                {isOrganizer
                  ? "Use this code for testing"
                  : "Scan this code at check-in"
                }
              </H3>
            </View>
            <PadContainer>
              {this.state.user.profile &&
                <View style={{ alignItems: "center" }}>
                  <TouchableOpacity onPress={this.onNamePress}>
                    <Heading style={[styles.username, {color: this.state.nameColor}]}>
                      {this.state.devoolooperMode
                        ? this.getDevoolooperName(displayName)
                        : displayName}
                    </Heading>
                  </TouchableOpacity>
                  <SubHeading style={{ textAlign: "center", marginTop: -10 }}>
                    {this.state.user.email}
                  </SubHeading>
                </View>
              }
            </PadContainer>
            <View style={{ justifyContent: 'space-evenly', flexDirection: "row", marginTop: -15}}>
              {isOrganizer && (
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <TouchableOpacity
                    style={[styles.actionButton, {backgroundColor: "#d2d1d7"}]}
                    onPress={() => this.toggleScanner()}
                  >
                    <MCI
                      name="qrcode-scan"
                      size={50}
                      color="black"
                    />
                  </TouchableOpacity>
                  <H3 style={{ fontWeight: 'bold' }}>Scanner</H3>
                </View>
              )}
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity
                  style={[styles.actionButton, {backgroundColor: 'red'}]}
                  onPress={() => this.logout()}
                >
                  <AntDesign
                    name="logout"
                    size={45}
                    color="white"
                  />
                </TouchableOpacity>
                <H3 style={{fontWeight: "bold" }}>Sign Out</H3>
              </View>
            </View>
          </ViewContainer>
        );

      } else {
        return <CenteredActivityIndicator />;
      }
    })();

    return defaultView;
  }
}

// TODO make this code less redundant
const ScanResponseModal = props => {
  return (
    <Modal
      isVisible={props.isVisible}
      backdropColor={colors.backgroundColor.light}
      backdropOpacity={0.6}
      animationInTiming={200}
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      animationOutTiming={200}
      backdropTransitionInTiming={200}
      backdropTransitionOutTiming={200}
      avoidKeyboard={true}
      onBackdropPress={props.onBack}
      onBackButtonPress={props.onBack}
      style={{ margin: 40 }}
    >
      <View
        style={{
          backgroundColor: colors.backgroundColor.normal,
          padding: 40,
          borderRadius: 8,
          alignItems: "center"
        }}
      >
        {
          !props.scannedUserData
          ? <React.Fragment>
              <FAIcon
                name="times"
                size={48}
                color={colors.iconColor}
                style={{ marginBottom: 10 }}
              />
              <H2 style={{ color: colors.textColor.normal, marginBottom: 20 }}>NOT FOUND</H2>
              <H3 style={{ color: colors.textColor.light }}>Send to check-in table.</H3>
            </React.Fragment>
          : <React.Fragment>
              <FAIcon
                name="check"
                size={48}
                color={colors.secondaryColor}
                style={{ marginBottom: 10 }}
              />
              <H2 style={{ color: colors.secondaryColor, marginBottom: 20 }}>SUCCESS</H2>
              <H1 style={{ marginBottom: 20 }}>{props.scannedUserData.displayName}</H1>
              {props.scannedUserData.minorStatus && (
                <H3 style={{ color: colors.primaryColor }}>+ Minor</H3>
              )}
              {props.scannedUserData.dietaryRestrictions != null &&
                props.scannedUserData.dietaryRestrictions.length > 0 &&
                props.scannedUserData.dietaryRestrictions[0] !==
                  "I Have No Food Restrictions" && (
                  <H3 style={{ color: colors.primaryColor }}>+ Dietary Restrictions</H3>
                )}
            </React.Fragment>
        }
      </View>
    </Modal>
  );
};
