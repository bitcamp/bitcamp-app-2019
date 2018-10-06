import React, { Fragment, Component } from "react";

import {
  Platform,
  TouchableOpacity,
  StyleSheet,
  Text,
  View
} from "react-native";

import {
  GradientBackground,
  ViewContainer,
  PadContainer,
  Heading
} from "../Base";

import { H1, H2, H3, H4, P } from "../Text";
import { colors } from "../Colors";
import Icon from "react-native-vector-icons/FontAwesome";
import EventModal from "../EventModal";
import { normalizeTimeLabel } from "../../actions/util.js";
import EventHeart from "../EventHeart";

const styles = StyleSheet.create({
  column: {
    flexDirection: "column"
  },
  row: {
    flexDirection: "row"
  },
  disabled: {
    opacity: 0.4
  }
});

export default class EventDescription extends Component<Props> {
  constructor(props) {
    super(props);
    this.toggleModal = this.toggleModal.bind(this);
    this.state = {
      favorited: false,
      isModalVisible: false
    };

    // this.customizeNotification = this.props.customizeNotification;
    // this.scheduleNotification = this.props.scheduleNotification;

    // AsyncStorage.getItem(EVENT_FAVORITED_KEY_PREFIX + this.props.eventID.toString(), (err, results) => {
    //   //retrieve whether the event was favorited and update state to reflect change
    //   if(results != null && results != 'null'){
    //     console.log("myId: " + this.props.eventID.toString() + " isFavorited: " + results)
    //     this.setState((prevState, props) => {return {favorited : JSON.parse(results)}});
    //   } else {
    //     this.setState((prevState, props) => {return {favorited : false}});
    //
    //     //update status to not favorited
    //     AsyncStorage.setItem(EVENT_FAVORITED_KEY_PREFIX + this.props.eventID.toString(), JSON.stringify(false), function(error){
    //       if(error){
    //         console.log(error);
    //       }
    //     });
    //   }
    // });
  }

  toggleModal() {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }

  renderModal() {
    return (
      <EventModal
        isModalVisible={this.state.isModalVisible}
        toggleModal={this.toggleModal}
        {...this.props}
      />
    );
  }

  render() {
    const {
      disabled,
      event,
      eventManager
    } = this.props;

    return (
      <Fragment>
        {this.renderModal()}
        <TouchableOpacity
          disabled={disabled}
          style={event.hasPassed ? [this.props.style, styles.disabled] : this.props.style}
          onPress={() => this.toggleModal()}
        >
          <View style={[styles.row]}>
            <View style={[styles.col, { flex: 4 }]}>
              <H3>{event.title}</H3>
              <H4 style={{ color: colors.fontGrey }}>
                {event.startTime == event.endTime
                  ? `${event.startTimeFormatted}`
                  : `${event.startTimeFormatted} - ${event.endTimeFormatted}`}
              </H4>
              <H4 style={{ color: colors.fontGrey }}>{event.location}</H4>
            </View>
            <View style={[styles.row, { flex: 1, justifyContent: "flex-end" }]}>
              <EventHeart
                ref={myHeart => {
                  this.myHeart = myHeart;
                  eventManager.registerHeartListener(myHeart);
                }}
                eventID={event.eventID}
                eventManager={eventManager}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Fragment>
    );
  }

  componentWillUnmount() {
    this.props.eventManager.removeHeartListener(this.myHeart);
  }
}
