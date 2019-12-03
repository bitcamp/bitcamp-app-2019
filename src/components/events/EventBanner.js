import React from 'react';
import ClickableEvent from './ClickableEvent';
import Banner from '../Banner';

/**
 * A full-width banner for an event that can be clicked to reveal a modal
 */
const EventBanner = props => {
    <ClickableEvent
        event={props.event}
        origin={props.origin}
        props={props.eventManager}
    >
        <Banner
            title={props.event.titleClipped}
            description="HAPPENING NOW"
            imageSource={Images[props.event.img]}
        />
    </ClickableEvent>
};

// Assume that the event banner is coming from the home page
EventBanner.defaultProps = {
    origin: 'Home'
};

// The event banner has the same propTypes as ClickableEvents
EventBanner.propTypes = ClickableEvent.propTypes;

export default EventBanner;