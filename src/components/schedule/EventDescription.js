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
import { normalizeTimeLabel } from "../../events/utils";
import EventStar from "../EventStar";
import PillBadge from "../PillBadge";

const styles = StyleSheet.create({
  column: {
    flexDirection: "column",
    paddingHorizontal: 0
  },
  row: {
    flexDirection: "row",
  },
  disabled: {
    opacity: 0.3
  },
  badge: {
    borderRadius: 4,
    marginTop: 5,
    height: 20
  },
  badgeTxt: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: -2
  },
  eventcard: {
    padding: 12.5,
    //marginTop: -5
    //padding: 15,
    //borderBottomColor: colors.textColor.light,
    //borderBottomWidth: 1,
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
  }

  toggleModal() {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }

  renderModal() {
    return (
      <EventModal
        isModalVisible={this.state.isModalVisible}
        toggleModal={this.toggleModal}
        origin={this.props.origin}
        {...this.props}
      />
    );
  }

  render() {
    const {
      event,
      eventManager
    } = this.props;
    return (
      <Fragment>
        {this.renderModal()}
        <TouchableOpacity
          style={this.props.style}
          onPress={() => this.toggleModal()}
        >
          <View style={[styles.row, styles.eventcard]}>
            <View style={[styles.col, { flex: 4 }]}>
              <H3 style={{ fontSize: 20 }}>{event.title}</H3>
              <H4 style={{ fontSize: 17.5, color: colors.textColor.light }}>{event.location}</H4>
              <View style={{ alignItems: 'flex-start', flexDirection:'row' }}>
                {event.category.map((category,index) =>
                  <View style={{marginRight: 5}} key={event.title + index.toString()}>
                    <PillBadge category={category} from={'Description'}/>
                  </View>
                )}
              </View>
            </View>
            <View style={[styles.row, { flex: 1, justifyContent: "flex-end", alignItems: 'center'}]}>
              <EventStar
                ref={myStar => {
                  this.myStar = myStar;
                  eventManager.registerHeartListener(myStar);
                }}
                eventID={event.eventID.toString()}
                eventManager={eventManager}
                origin={'Event Description'}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Fragment>
    );
  }

  componentWillUnmount() {
    this.props.eventManager.removeHeartListener(this.myStar);
  }
}
