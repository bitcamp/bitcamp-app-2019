import React, { Component, Fragment } from 'react';
import Modal from 'react-native-modal';
import PhotoView from 'react-native-photo-view';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import AltModalHeader from '../components/AltModalHeader';
import CustomScheduleTabBar from '../components/schedule/CustomScheduleTabBar';
import { ModalContent, modalStyle } from './Base';
import { colors } from './Colors';
import RNFetchBlob from 'rn-fetch-blob';
import { Platform } from 'react-native';

const dimensions = require('Dimensions').get('window');
const screenWidth = dimensions.width;

export default class MapModal extends Component {

  constructor() {
    super();
    this.state = {
      floors: [],
    }
    this.setFloors();
  }

  setFloors() {
    RNFetchBlob.session('floorMaps').dispose().then(() => {console.log("Removed all files in cache.")});
    const floorPhotos = [1, 2, 3, 'Parking'].map(floorNumber => {
      console.log('https://raw.githubusercontent.com/bitcamp/bitcamp-app-2019/master/assets/imgs/floor-maps/' + (floorNumber === 'Parking' ? '' : 'Floor_') + `${floorNumber}.png`);
      let dirs = RNFetchBlob.fs.dirs;
      RNFetchBlob
        .config({
          fileCache : true,
          // by adding this option, the temp files will have a file extension
          appendExt : 'png',
          session: 'floorMaps',
        })
        .fetch('GET', 'https://raw.githubusercontent.com/bitcamp/bitcamp-app-2019/master/assets/imgs/floor-maps/' + (floorNumber === 'Parking' ? '' : 'Floor_') + `${floorNumber}.png`, {
        })
        .then((res) => {
          // the temp file path with file extension `png`
          console.log(this.state);
          currFloors = this.state.floors;
          currFloors.push('file://' + res.path())
          // Beware that when using a file path as Image source on Android,
          // you must prepend "file://"" before the file path
          this.setState({floors: currFloors})
        }).catch((error) => {
          console.log(error);
          currFloors = this.state.floors;
          currFloors.push(null);
          this.setState({floors: currFloors});
          });
      });
  }

  componentDidMount() {
  }

  render() {
    console.log(this.state.floors);
    const props = this.props;
    const floors = [1, 2, 3, 'Parking'].map(floorNumber => {
      if (this.state.floors[(floorNumber === 'Parking' ? floorNumber : floorNumber - 1)] === null) {
        return (
          <PhotoView
            key={floorNumber}
            tabLabel={(floorNumber === 'Parking' ? '' : 'Floor ')  + `${floorNumber}`}
            source={require('../../assets/imgs/floor-maps/not_found.png')}
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
      }
      return (
        <PhotoView
          key={floorNumber}
          tabLabel={(floorNumber === 'Parking' ? '' : 'Floor ')  + `${floorNumber}`}
          source={{uri : this.state.floors[(floorNumber === 'Parking' ? floorNumber : floorNumber - 1)] }}
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
            {floors}
          </ScrollableTabView>
        </ModalContent>
      </Modal>
    );
  }
}
