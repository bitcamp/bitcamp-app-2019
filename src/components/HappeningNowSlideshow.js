import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Swiper from 'react-native-swiper';
import EventCard from "./events/EventCard";
import { colors } from "./Colors";
import Images from '../../assets/imgs/index';
import EventsManager from '../events/EventsManager';

export default class HappeningNowSlideshow extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // If there are now events happening now...
    if (this.props.dataSource.length === 0) {
        return (
          <Banner
            imageSource={Images['banner_campfire']}
            title={EventsManager.hackingIsOver()
              ? 'Thanks for Hacking!'
              : 'No events at this time'
            }
            description={EventsManager.hackingIsOver()
              ? 'Bitcamp 2019'
              : 'HAPPENING NOW'
            }
          />
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
        paginationStyle={{ bottom: 18 }}
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
