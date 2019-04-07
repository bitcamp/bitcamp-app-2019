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
      floors: {},
    }
    this.setFloors();
  }

  async setFloors() {
    await RNFetchBlob.session('floorMaps').dispose().then(() => {console.log("Removed all files in cache.")});
    [1, 2, 3, 'Parking'].map(floorNumber => {
      RNFetchBlob
        .config({
          fileCache : false,
          // by adding this option, the temp files will have a file extension
          appendExt : 'png',
          session: 'floorMaps',
        })
        .fetch('GET', 'https://raw.githubusercontent.com/bitcamp/bitcamp-app-2019/master/assets/imgs/floor-maps/' + (floorNumber === 'Parking' ? '' : 'Floor_') + `${floorNumber}.png`, {
        })
        .then((res) => {
          currFloors = this.state.floors;
          currFloors[floorNumber] = 'https://raw.githubusercontent.com/bitcamp/bitcamp-app-2019/master/assets/imgs/floor-maps/' + (floorNumber === 'Parking' ? '' : 'Floor_') + `${floorNumber}.png`;
          this.setState({floors: currFloors});
        }).catch((error) => {
          console.log(error);
          currFloors = this.state.floors;
          currFloors[floorNumber] = null;
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
      if (this.state.floors[floorNumber] === null) {
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
          source={{uri : this.state.floors[floorNumber] }}
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
            prerenderingSiblingsNumber={Infinity}
          >
            {floors}
          </ScrollableTabView>
        </ModalContent>
      </Modal>
    );
  }
}
