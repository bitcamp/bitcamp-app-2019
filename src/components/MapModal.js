import React, { Component, Fragment } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  SafeAreaView
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
  render() {
    const props = this.props;
    const dimensions = require('Dimensions').get('window');
    const imageWidth = dimensions.width - 42;
    const imageHeight = Math.round((imageWidth * 38) / 67);
    const styles = {width: window.width, height: window.height, overflow:'visible'};

    return (
      <Modal
        isVisible={props.isModalVisible}
        backdropColor={colors.backgroundColor.dark}
        backdropOpacity={1}
        animationInTiming={250}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationOutTiming={300}
        backdropTransitionInTiming={250}
        backdropTransitionOutTiming={300}
        avoidKeyboard={true}
        onBackButtonPress={() => props.toggleModal()}
        style={modalStyle}
      >
        <ModalContent style={{ padding: 0 }}>
          <AltModalHeader
            title="Map"
            rightText="Done"
            rightFunc={props.toggleModal}
          />
          <ScrollableTabView
            renderTabBar={() => <CustomScheduleTabBar/> }
            style={{height: 530}}
          >
          <PhotoView
            tabLabel="Floor 1"
            source={require('./images/Floor_1.png')}
            minimumZoomScale={1}
            maximumZoomScale={8}
            androidScaleType="fitCenter"
            onLoad={() => console.log("Image loaded!")}
            style={{
              width: window.width,
              height: 530,
            }}
          />
          <PhotoView
            tabLabel="Floor 2"
            source={require('./images/Floor_1.png')}
            minimumZoomScale={1}
            maximumZoomScale={8}
            androidScaleType="fitCenter"
            onLoad={() => console.log("Image loaded!")}
            style={{
              width: window.width,
              height: 530,
            }}
          />
          <PhotoView
            tabLabel="Floor 3"
            source={require('./images/Floor_1.png')}
            minimumZoomScale={1}
            maximumZoomScale={8}
            androidScaleType="fitCenter"
            onLoad={() => console.log("Image loaded!")}
            style={{
              width: window.width,
              height: 530,
            }}
          />
          </ScrollableTabView>
        </ModalContent>
      </Modal>
    );
  }
}
