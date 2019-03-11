import moment from 'moment';
import React, { Component, Fragment } from 'react';
import { Image, ScrollView, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

import { H2, H3, H4, P } from '../components/Text';
import { HorizontalLine, ModalContent, ModalHeader, modalStyle, Spacing } from './Base';
import { colors } from './Colors';

// TODO TECH DEBT: Replace <Spacing /> with proper margins

export default class EventModal extends Component {
  render() {
    const props = this.props;
    const dimensions = require('Dimensions').get('window');
    const imageWidth = dimensions.width - 42;
    const imageHeight = Math.round((imageWidth * 38) / 67);
    const img = props.event.img + "_big";
    return (
      <Modal
        isVisible={props.isModalVisible}
        backdropColor={colors.backgroundColor.normal}
        backdropOpacity={1}
        animationInTiming={250}
        animationIn="fadeInUp"
        animationOut="fadeOutDown"
        animationOutTiming={300}
        backdropTransitionInTiming={250}
        backdropTransitionOutTiming={300}
        avoidKeyboard={true}
        onBackButtonPress={() => props.toggleModal()}
        style={modalStyle}
      >
        <ModalContent>
          <ModalHeader
            onBackButtonPress={() => props.toggleModal()}
            eventID={props.event.eventID.toString()}
            eventManager={props.eventManager}
            heart
            small
          />
          <Image
            style={{
              width: imageWidth,
              height: imageHeight,
              marginTop: 20,
              borderRadius: 4,
              marginBottom: 20
            }}
            // source={Image[img]}
            source={require('../../assets/imgs/filler.png')}
          />
          <ScrollView>
            <Spacing />
            <H2>{props.event.title}</H2>
            <Spacing />
            <H3>
              {
                props.event.startTimeFormatted === props.event.endTimeFormatted ?
                  `${props.event.startTimeFormatted}`
                  :
                  `${props.event.startTimeFormatted} - ${props.event.endTimeFormatted}`
              }
            </H3>
            <H3 style={styles.subtext}>{moment(props.event.endTime).format('dddd')}</H3>
            <Spacing />
            <H3>{props.event.location}</H3>
            <Spacing />
            <Spacing />
            <HorizontalLine />
            <Spacing />
            <Spacing />
            {props.event.beginnerFriendly ? (
              <Fragment>
                <H4 style={{ color: colors.secondaryColor }}>BEST FOR BEGINNERS</H4>
                <Spacing />
              </Fragment>
            ) : null}
            <P>{props.event.description}</P>
          </ScrollView>
        </ModalContent>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  subtext: {
    color: colors.textColor.light,
  },
});
