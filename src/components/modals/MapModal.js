import React, { Component } from 'react';
import FullScreenModal from './FullScreenModal';
import PhotoView from 'react-native-photo-view';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import AltModalHeader from '../components/AltModalHeader';
import CustomScheduleTabBar from '../schedule/CustomScheduleTabBar';
import { colors } from '../Colors';
import RNFetchBlob from 'rn-fetch-blob';
import Images from '../../../assets/imgs';
import { getDeviceWidth } from '../../utils/sizing';

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
            source={Images.not_found}
            minimumZoomScale={1}
            maximumZoomScale={8}
            androidScaleType="fitCenter"
            onLoad={() => console.log("Image loaded!")}
            style={{
              width: getDeviceWidth(),
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
            width: getDeviceWidth(),
            flex: 1,
            backgroundColor: colors.backgroundColor.dark,
          }}
        />  
      );
    });

    return (
      <FullScreenModal
        isVisible={props.isModalVisible}
        backdropColor={colors.backgroundColor.dark}
        onBackButtonPress={() => props.toggleModal()}
        contentStyle={{ padding: 0 }}
        header={
          <AltModalHeader
            title="Map"
            rightText="Done"
            rightAction={props.toggleModal}
          />
        }
      >
          <ScrollableTabView
            renderTabBar={() => <CustomScheduleTabBar/> }
            style={{height: 530}}
          >
            {floors}
          </ScrollableTabView>
      </FullScreenModal>
    );
  }
}
