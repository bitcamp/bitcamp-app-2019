import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import Swiper from 'react-native-swiper';
import { StyleSheet } from 'react-native';
import { PadContainer } from "../components/Base";
import EventCard from "./EventCard";
import { H2, H3 } from '../components/Text';
import { colors } from "./Colors";

const styles = StyleSheet.create({
    textIfNoEvents: {
      marginBottom: 10,
    },
    dotContainer: {
      bottom: 18,
    }
});

export default class HappeningNowSlideshow extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.dataSource.length == 0) {
        return (
          <PadContainer>
            <H2 style={styles.textIfNoEvents}>Happening Now</H2>
            <H3>No events at this time.</H3>
          </PadContainer>
        );
    }

    slideshow_content = this.props.dataSource.map((event, i) => 
      <EventCard
        key={i}
        event={event}
        eventManager={this.props.eventManager}
        origin={'Home'}
        inSlideshow
      />
    );

    let width = require('Dimensions').get('window').width;

    return (
      <Swiper
        height={Math.round((width * 38) / 67)}
        dotColor={'rgba(255,255,255,.6)'}
        activeDotColor={colors.textColor.primary}
        paginationStyle={styles.dotContainer}
        autoplay={true}
        autoplayTimeout={5}
        loop
      >
        {slideshow_content}
      </Swiper>
    );
  }
}

HappeningNowSlideshow.propTypes = {
    dataSource: PropTypes.array.isRequired,
};
