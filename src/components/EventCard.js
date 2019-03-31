import React, { Component, Fragment } from 'react';
import { Text, Image, ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';
import { H2, H3, H6 } from '../components/Text';
import { PadContainer } from './Base';
import { colors } from './Colors';
import EventModal from './EventModal';
import EventDescription from './schedule/EventDescription';
import Images from '../../assets/imgs/index';
import LinearGradient from 'react-native-linear-gradient';
import { scale } from '../actions/scale';

const styles = StyleSheet.create({
  darkImageMask: {
    flex: 1,
  },
  textGroup: {
    marginBottom: 40,
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageBg: {
    position: 'relative',
  },
  happeningTitle: {
    fontWeight: 'bold',
    color: colors.textColor.primary,
  },
  eventTitle: {
    color: colors.textColor.primary,
    fontSize: 26,
  }
});

export default class EventCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false
    };
    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }

  renderModal() {
    return <EventModal
      isModalVisible={this.state.isModalVisible}
      toggleModal={this.toggleModal}
      eventManager={this.props.eventManager}
      event={this.props.event}
      origin={this.props.origin}
    />
  }

  render() {
    const { big, event, eventManager, inSlideshow } = this.props;
    const dimensions = require('Dimensions').get('window');
    let imageWidth = big ? dimensions.width - 40 : (dimensions.width / 2) + 10;
    imageWidth = inSlideshow ? dimensions.width : imageWidth;
    const imageHeight = Math.round((imageWidth * 38) / 67);

    let titleClipped = event.title;
    let titleLimit = 30;
    if (titleClipped && titleClipped.length > titleLimit) {
      titleClipped = titleClipped.substring(0, titleLimit) + "…";
    }

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

    let color = overlayColor[event.category[0]];
    if (event.title === 'Opening Ceremony' || event.title === 'Closing Ceremony') {
      color = overlayColor.Ceremony;
    } else if (event.title === 'Expo A' || event.title === 'Expo B') {
      color = overlayColor.Demo;
    } else if (event.title === 'COLORWAR') {
      color = overlayColor.Colorwar;
    }

    return (
      <View>
        {this.renderModal()}
        <TouchableOpacity
          onPress={() => this.toggleModal()}
          activeOpacity={0.7}
        >
          <View>
            {!inSlideshow ?
              (<React.Fragment>
                <ImageBackground
                  style={[
                    {
                      width: imageWidth,
                      height: big ? imageHeight / 2 : imageHeight,
                      marginBottom: 5,
                    },
                    this.props.imageStyle,
                  ]}
                  source={Images[event.img]}
                  imageStyle={{ borderRadius: 13 }}
                >
                {!big &&
                <React.Fragment>
                  <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'flex-end'
                  }}
                  >
                    <View style={{
                      marginTop: 6,
                      marginRight: 6,
                      borderRadius: 6, 
                      padding: 5,
                      height: scale(20),
                      backgroundColor: color,
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                    >
                      <Icon name="star" size={scale(15)} color={'white'} />
                      <Text style={{ 
                          color: 'white', 
                          fontSize: scale(13),
                          marginLeft: 5,
                        }}
                      >
                        {eventManager.getSavedCount(event.eventID)}
                      </Text>
                    </View>
                  </View>
                <View style={{backgroundColor: color, borderBottomLeftRadius: 13, borderBottomRightRadius: 13, marginTop: (imageHeight - 60)}}>
                  <Text numberOfLines={1} style={{width: (imageWidth - 10), color: 'white', fontWeight: 'bold', paddingLeft: 13, paddingTop: 5, paddingBottom: 5, fontSize: 15}}>{event.title}</Text>
                </View></React.Fragment>}
                </ImageBackground>
                {/*!big &&
                  <View>
                    <H3 style={{width: imageWidth}} numberOfLines={1}>{titleClipped}</H3>
                    <H6 style={{ opacity: .8 }}>
                      <Icon name="star" size={12} color={colors.starColor.selected} />{' '}
                      {eventManager.getSavedCount(event.eventID)}
                    </H6>
                  </View>
                */}
              </React.Fragment>)
              : (
              <ImageBackground
                style={[
                  styles.imageBg,
                  { width: imageWidth, height: imageHeight }
                ]}
                source={Images[event.img]}
                >
                <LinearGradient 
                  style={styles.darkImageMask}
                  colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.65)']}
                  locations={[0.3, 1]}
                >
                  <PadContainer style={styles.textGroup}>
                    <H3 style={styles.happeningTitle}>HAPPENING NOW</H3>
                    <H2 style={styles.eventTitle}>{titleClipped}</H2>
                  </PadContainer>
                </LinearGradient>
              </ImageBackground>
            )}
          </View>
          {big &&
            <EventDescription
              {...this.props}
              disabled
            />
          }
        </TouchableOpacity>
      </View>
    );
  }
}
