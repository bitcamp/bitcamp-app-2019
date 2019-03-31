import React, { Component, Fragment } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import Images from '../../assets/imgs/index';
import { H1, H2, H3, H4, H6, P } from '../components/Text';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';
import { ModalContent, ModalHeader, HorizontalLine, Spacing, modalStyle } from './Base';
import { colors } from './Colors';
import moment from 'moment';
import PhotoView from 'react-native-photo-view';
import CustomScheduleTabBar from '../components/schedule/CustomScheduleTabBar';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import AltModalHeader from '../components/AltModalHeader';

export default class MapModal extends Component {

  componentDidCatch(error, info) {
    Toast.show("Unable to load floor maps. Sorry :(");
  }

  render() {
    const props = this.props;
    const dimensions = require('Dimensions').get('window');
    const screenWidth = dimensions.width;

    const floorPhotos = [1, 2, 3].map(floorNumber => {
      let photoData = '';
      const URL = `https://raw.githubusercontent.com/bitcamp/bitcamp-app-2019/rn-0.57.8/assets/imgs/floor-maps/Floor_${floorNumber}.png`;

      fetch(URL)
        .then(response => {photoData = response.blob(); console.log("Response: ", photoData)})
        .catch(error => Toast.show('Unable to display the floor maps. Sorry :('));

      console.log({photoData});

      return (
        <PhotoView
          key={floorNumber}
          tabLabel={`Floor ${floorNumber}`} 
          source={{uri: photoData}}
          minimumZoomScale={1}
          maximumZoomScale={8}
          androidScaleType="fitCenter"
          onLoad={() => console.log("Image loaded!")}
          style={{
            width: screenWidth,
            flex: 1,
            backgroundColor: colors.backgroundColor.dark,
          }}
        />
      );
      });

    return (
      <Modal
        isVisible={props.isModalVisible}
        backdropColor={colors.backgroundColor.dark}
        backdropOpacity={1}
        animationInTiming={250}
        animationIn="fadeInUp"
        animationOut="fadeOutDown"
        animationOutTiming={300}
        backdropTransitionInTiming={250}
        backdropTransitionOutTiming={300}
        avoidKeyboard={true}
        onBackButtonPress={() => props.toggleModal()}
        style={[modalStyle, {flex: 1}]}
      >
        <ModalContent style={{ padding: 0, flex: 1 }}> 
          <AltModalHeader
            title="Map"
            rightText="Done"
            rightFunc={props.toggleModal}
          />
          <ScrollableTabView
            renderTabBar={() => <CustomScheduleTabBar/> }
            style={{height: 530}}
          >
            {floorPhotos}
          </ScrollableTabView>
        </ModalContent>
      </Modal>
    );
  }
}
