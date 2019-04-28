import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Swiper from 'react-native-swiper';
import { StyleSheet } from 'react-native';
import { PadContainer } from "../components/Base";
import EventCard from "./EventCard";
import { H2, H3 } from '../components/Text';
import { colors } from "./Colors";
import Images from '../../assets/imgs/index';
import moment from 'moment';

const styles = StyleSheet.create({
    textIfNoEvents: {
      marginBottom: 10,
    },
    dotContainer: {
      bottom: 18,
    },
    imageBg: {
      position: 'relative'
    },
    darkImageMask: {
      flex: 1,
    },
    happeningTitle: {
      fontWeight: 'bold',
      color: colors.textColor.primary,
    },
    eventTitle: {
      color: colors.textColor.primary,
      fontSize: 26,
    },
    textGroup: {
      marginBottom: 40,
      flex: 1,
      justifyContent: 'flex-end',
    },
});
const HACKING_IS_OVER = moment().isAfter(moment("2019-04-14 09:00"));

export default class HappeningNowSlideshow extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // TODO: componetize the special happening now slideshow event card
    const windowWidth = require('Dimensions').get('window').width;
    const imageWidth = windowWidth;
    const imageHeight = Math.round((imageWidth * 38) / 67);

    if (this.props.dataSource.length == 0) {
        return (
          <ImageBackground
            style={[
              styles.imageBg,
              { width: imageWidth, height: imageHeight }
            ]}
            source={Images['banner_campfire']}
            >
            <LinearGradient
              style={styles.darkImageMask}
              colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.65)']}
              locations={[0.3, 1]}
            >
              <PadContainer style={styles.textGroup}>
                <H3 style={styles.happeningTitle}>HAPPENING NOW</H3>
                <H2 style={styles.eventTitle}>
                  {HACKING_IS_OVER
                    ? 'Thanks for Hacking!'
                    : 'No events at this time'}
                </H2>
              </PadContainer>
            </LinearGradient>
          </ImageBackground>
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

    return (
      <Swiper
        height={Math.round((windowWidth * 38) / 67)}
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
