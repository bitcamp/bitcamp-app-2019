import React, { Component } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Images from '../../../assets/imgs/index';
import { scale } from '../../utils/scale';
import { getDeviceWidth, getImageHeight } from '../../utils/sizing';
import { colors } from '../Colors';
import { BaseText } from '../Text';
import ClickableEvent from './ClickableEvent';

export default class EventCard extends Component {
  constructor(props) {
    super(props);
  }

  getColor() {
    const overlayColor = {
      Main: '#5996B3',
      Food: '#AB622A',
      Workshop: '#A53C32',
      Mini: '#496B7D',
      Sponsor: '#544941',
      Mentor: '#595049',
      Demo: '#645D54',
      Ceremony: '#BBB35D',
      Colorwar: '#405962',
      Campfire: '#81581F'
    };
    const { event } = this.props;

    let color = overlayColor[event.category[0]];
    if (event.title === 'Opening Ceremony' || event.title === 'Closing Ceremony') {
      color = overlayColor.Ceremony;
    } else if (event.title === 'Expo A' || event.title === 'Expo B') {
      color = overlayColor.Demo;
    } else if (event.title === 'COLORWAR') {
      color = overlayColor.Colorwar;
    }

    return color;
  }

  render() {
    const { event, eventManager, origin } = this.props;

    return (
      <ClickableEvent
        eventManager={eventManager}
        event={event}
        origin={origin}
      >
        <View>
          <ImageBackground
            style={styles.imgBg}
            source={Images[event.img]}
            imageStyle={{ borderRadius: 13 }}
          >
            <View style={styles.favoriteBar}>
              <View style={[
                { backgroundColor: this.getColor() },
                styles.favoriteInfo,
              ]}>
                <Ionicons name="ios-star" size={scale(15)} color={'white'} />
                <BaseText style={styles.favoriteCount}>
                  {eventManager.getSavedCount(event.eventID)}
                </BaseText>
              </View>
            </View>

            <View style={[
              { backgroundColor: this.getColor() },
              styles.titleContainer
            ]}>
              <BaseText numberOfLines={1} style={styles.eventTitle}>
                {event.title}
              </BaseText>
            </View>
          </ImageBackground>
          <BaseText style={styles.caption} numberOfLines={1}>
              {event.caption}
          </BaseText>
        </View>
      </ClickableEvent>
    );
  }
}

const imageWidth = (getDeviceWidth() / 2) + 10;
const imageHeight = getImageHeight(imageWidth);

const styles = StyleSheet.create({
  imgBg: {
    marginBottom: 5,
    width: imageWidth,
    height: imageHeight
  },
  favoriteBar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  favoriteInfo: {
    marginTop: 6,
    marginRight: 6,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: scale(23),
    flexDirection: 'row',
    alignItems: 'center'
  },
  favoriteCount: {
    color: 'white',
    fontSize: scale(13),
    marginLeft: 5,
  },
  caption: {
    color: colors.textColor.light, 
    width: imageWidth
  },
  eventTitle: {
    color: 'white', 
    fontWeight: 'bold', 
    paddingLeft: 13, 
    paddingTop: 5, 
    paddingBottom: 5, 
    fontSize: 15,
    width: imageWidth - 10
  },
  titleContainer: {
    borderBottomLeftRadius: 13, 
    borderBottomRightRadius: 13,
    marginTop: imageHeight - 60,
  }
});
