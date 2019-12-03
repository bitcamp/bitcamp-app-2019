import moment from 'moment';
import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import Images from '../../../assets/imgs/index';
import { scale } from '../../utils/scale';
import { getDeviceWidth, getImageHeight } from '../../utils/sizing';
import { ModalHeader } from '../Base';
import { colors } from '../Colors';
import FullScreenModal from '../modals/FullScreenModal';
import PillBadge from "../PillBadge";
import { H2, H3, H4, P } from '../Text';

const EventModal = props => (
  <FullScreenModal
    isVisible={props.isModalVisible}
    animationIn="fadeInRight"
    animationOut="fadeOutRight"
    onBackButtonPress={() => props.toggleModal()}
    onModalHide={() => props.eventManager.updateEventComponents()}
    header={
      <ModalHeader
        onBackButtonPress={() => props.toggleModal()}
        eventID={props.event.eventID.toString()}
        eventManager={props.eventManager}
        origin={props.origin}
        isModalVisible={props.isModalVisible}
        heart
        noArrow
      />
    }
  >
    <Image
      style={styles.banner}
      source={Images[props.event.img]}
    />
    <ScrollView>
      <View style={styles.viewWithSpacing}>
        <View>
          <H2>{props.event.title}</H2>
          <H3 style={styles.location}>{props.event.location}</H3>

          <View style={styles.badges}>
            { // Handle events with single and multiple categories
              [].concat(props.event.category).map((category,index) =>
                <View 
                  style={styles.badge} 
                  key={props.event.title + index.toString()}
                >
                  <PillBadge category={category} from={'Modal'}/>
                </View>
              )
            }
          </View>
        </View>
      </View>

      <View style={styles.viewWithSpacing}>
        <View>
          <H3 style={styles.date}>
            {moment(props.event.startTime).format('dddd, MMMM D, YYYY')}
          </H3>
          <H3 style={styles.date}>
            {props.event.timeRangeString}
          </H3>
        </View>
      </View>

      {props.event.featured && (
        <View style={styles.viewWithSpacing}>
          <H4 style={{ color: colors.secondaryColor }}>FEATURED EVENT</H4>
        </View>
      )}
      <P style={styles.viewWithSpacing}>
        {props.event.description ? props.event.description : props.event.caption}
      </P>
    </ScrollView>
  </FullScreenModal>
);

const styles = StyleSheet.create({
  date: {
    color: colors.textColor.light,
  },
  banner: {
    marginLeft: -scale(15), // Used to offset the padding on everything else in the modal
    width: getDeviceWidth(),
    height: getImageHeight()
  },
  badges: { 
    alignItems: 'flex-start', 
    flexDirection:'row', 
    paddingTop: 5, 
    paddingBottom: 5 
  },
  badge: {
    marginRight: 5,
  },
  viewWithSpacing: {
    marginTop: scale(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  location: {
    color: colors.primaryColor,
    marginVertical: 3,
  },
  eventTitle: {
    fontSize: 25,
  }
});

export default EventModal;