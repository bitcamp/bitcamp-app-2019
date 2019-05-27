import React from 'react';
import ClickableEvent from './ClickableEvent';
import { getDeviceWidth, getImageHeight } from '../../utils/sizing';
import { Image, StyleSheet } from 'react-native';
import EventDescription from '../schedule/EventDescription';
import Images from '../../../assets/imgs/index';

const LargeEventCard = props => (
    <ClickableEvent
        eventManager={props.eventManager}
        event={props.event}
        origin={props.origin}
        style={styles.event}
    >
        <Image
            style={styles.image}
<<<<<<< HEAD
            source={Images[props.event.img]}
=======
            source={console.log(props.event.img) || Images[props.event.img]}
>>>>>>> dfab5f21ca98ab8f0853ac046d8f9003d7f34cdc
            imageStyle={{ borderRadius: 13 }}
        />
        <EventDescription
            {...props}
            disabled
        />
    </ClickableEvent>
);

const imageWidth = getDeviceWidth() - 40;
const imageHeight = getImageHeight(imageWidth) / 2;
const styles = StyleSheet.create({
    image: {
        width: imageWidth,
        height: imageHeight,
        borderRadius: 13
    },
    event: {
        marginBottom: 25
    }
});

export default LargeEventCard;