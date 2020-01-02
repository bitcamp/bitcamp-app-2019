import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { H3 } from '../Text';
import { colors } from '../Colors';

export default class EventStar extends Component {
  constructor(props) {
    super(props);
    this.handleHeartPress = this.handleHeartPress.bind(this);
  }


  handleHeartPress() {
    const { eventID, eventManager, hasArrow } = this.props;
    if (eventManager.isFavorited(eventID)) {
      eventManager.unfavoriteEvent(eventID);
    } else {
      eventManager.favoriteEvent(eventID);
    }
    if (this.props.origin === 'Event Description') {
      eventManager.updateEventComponents();
    }
  }

  render() {
    const { eventManager, eventID, discludeArrow } = this.props;

    return (
      <Fragment>
        <H3 style={{ marginRight: 8, marginTop: 5, fontSize: 17.5, color: '#b7b7bb'}}>
          {eventManager.getSavedCount(eventID)}
        </H3>
        <TouchableOpacity onPress={() => {
          this.handleHeartPress();
        }}>
          <Ionicons
            name={'ios-star'}
            size={30}
            color={(eventManager.isFavorited(eventID)) ? colors.starColor.selected : colors.starColor.unselected}
          />
        </TouchableOpacity>
        { !discludeArrow &&
          <Ionicons
            style={{ marginLeft: 12}}
            name={'ios-arrow-forward'}
            size={20}
            color={'#b7b7bb'}
          />
        }
      </Fragment>
    )
  }
}

EventStar.propTypes = {
  eventID: PropTypes.string,
  eventManager: PropTypes.object,
};
