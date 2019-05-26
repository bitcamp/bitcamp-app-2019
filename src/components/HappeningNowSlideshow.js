import PropTypes from 'prop-types';
import React from 'react';
import Swiper from 'react-native-swiper';
import { colors } from "./Colors";
import Images from '../../assets/imgs/index';
import EventsManager from '../events/EventsManager';
import EventBanner from './events/EventBanner';
import Banner from './Banner';

/**
 * A slideshow that displays the events that are currently happening
 */
const HappeningNowSlideshow = ({ dataSource, eventManager }) => {
  // If there are now events happening now, display a default banner
  if (dataSource.length === 0) {
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

  const slideshow_content = dataSource.map((event, i) => 
    <EventBanner
      key={i}
      event={event}
      eventManager={eventManager}
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
};

HappeningNowSlideshow.propTypes = {
    dataSource: PropTypes.array.isRequired,
    eventManager: PropTypes.instanceOf(EventsManager)
};

export default HappeningNowSlideshow;