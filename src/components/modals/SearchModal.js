import React, { Component } from 'react';
import { FlatList, View, Platform, ScrollView, TouchableOpacity, StyleSheet, Text, Keyboard } from 'react-native';
import FullScreenModal from './FullScreenModal';
import { SearchBar } from 'react-native-elements';
import { H3 } from "../Text";
import { colors } from '../Colors';
import PillBadge, { badgeStyles } from '../PillBadge';
import { scale } from '../../utils/scale';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { LinearGradient } from 'expo-linear-gradient';
import SearchBarTabView from '../SearchBarTabView';
import _ from 'lodash';
import { getDeviceHeight } from '../../utils/sizing';

export default class SearchModal extends Component {

  constructor(props) {
    super(props);
    this.filterEvents = this.filterEvents.bind(this);
    this.state = {
      search: '',
      newSchedule: [],
      height: {
        ModalHeader: 0,
        SearchBar: 0,
        TagViewParent: 0,
        TagScrollView: 0
      },
      offsetHeight: 0,
      keyboardHeight: 0
    }
    this.renderCount = 0;
  }

  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }

  componentDidMount() {
    this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
    this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
  }

  componentWillUnmount() {
    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();
  }

  handleKeyboardDidShow = (event) => {
    // this.setState({keyboardHeight: event.endCoordinates.height});
  }
  handleKeyboardDidHide = () => {
    // this.setState({keyboardHeight: 0});
  }

  measureView(event, view) {
    let newHeight = this.state.height;
    newHeight[view] = event.nativeEvent.layout.height;
    this.setState({
      height: newHeight,
      offsetHeight: Object.values(newHeight).reduce((acc, h) => acc + h, 0)
    })
  }

  filterEvents(query, args) {
    query = query.toLowerCase();
    let query_regex = this.escapeRegExp(query);
    let newSchedule = [];

    if (query !== "") {
      newSchedule = _.cloneDeep(this.props.eventDays);

      // Filter out any event that doesn't match the query
      newSchedule = newSchedule.map(eventDay => {
        eventDay.eventGroups = eventDay.eventGroups.map(eventGroup => {
          eventGroup.events = eventGroup.events.filter(event => {
            const category_search = (Array.isArray(event.category))
              ? event.category.some(category => category.toLowerCase().search(query_regex) >= 0)
              : event.category.toLowerCase().search(query_regex) >= 0;

            return event.title.toLowerCase().search(query_regex) >= 0 || category_search;
          })
          return eventGroup;
        }).filter(group => group.events.length > 0);
        return eventDay;
      });
    }

    this.setState({
      newSchedule: newSchedule,
      search: query
    });
  }

  renderBadges() {
    let badges = [];
    for (let obj in badgeStyles) {
      badges.push(
        <TouchableOpacity
          onPress={() => this.filterEvents(obj)}
          key={obj}>
          <PillBadge
            category={obj}
            from='Modal'
            margin={5}
          />
        </TouchableOpacity>);
    }
    return badges;
  }

  render() {
    console.log(`SEARCH MODAL RENDER ${++this.renderCount}: `, (this.state) ? this.state : "");
    const props = this.props;
    const newSchedule = this.state.newSchedule.filter(day => day.eventGroups.length > 0);
    return (
      <FullScreenModal
        isVisible={props.isModalVisible}
        backdropColor={'#f7f7f7'}
        onBackButtonPress={() => props.toggleModal()}
        contentStyle={{ padding: 0, justifyContent: 'flex-start' }}
      >
        <View style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: scale(15),
          paddingTop: Platform.OS === "ios" ? getStatusBarHeight() : 0,
        }}
          onLayout={(event) => this.measureView(event, 'SearchBar')}
        >
          <SearchBar
            placeholder="Search"
            platform="android"
            onChangeText={query => this.filterEvents(query)}
            onClear={query => this.filterEvents('')}
            value={this.state.search}
            autoFocus={true}
            autoCapitalize='none'
            containerStyle={{ flex: 1 }}
            inputContainerStyle={{ backgroundColor: colors.backgroundColor.dark, borderRadius: scale(10) }}
            leftIconContainerStyle={{ backgroundColor: colors.backgroundColor.dark }}
            rightIconContainerStyle={{ backgroundColor: colors.backgroundColor.dark }}
            returnKeyType="search"
          />
          <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity onPress={() => props.toggleModal()} style={{ flex: 0 }}>
              <H3 style={{
                color: colors.primaryColor,
                padding: scale(15),
                paddingRight: 0,
                flex: 0,
                fontWeight: '500'
              }}>
                Cancel
              </H3>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flex: 1 }} onLayout={(event, ...args) => this.measureView(event, 'TagViewParent')}>
          <View style={{ flex: 1, padding: 9, paddingTop: 10, paddingBottom: 10 }}>
            <ScrollView
              horizontal={true}
              onLayout={(event) => this.measureView(event, 'TagScrollView')}
              showsHorizontalScrollIndicator={false}>
              {this.renderBadges()}
            </ScrollView>
            <LinearGradient
              colors={['rgba(255,255,255,0.7)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0.7)']}
              locations={[0, 0.1, 0.8, 1]}
              start={[0, 0]}
              end={[1, 0]}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
              pointerEvents={'none'}
            />
          </View>
        </View>
        <SearchBarTabView
          screenHeight={getDeviceHeight()}
          offsetHeight={this.state.offsetHeight}
          keyboardHeight={this.state.keyboardHeight}
          schedule={newSchedule}
          eventManager={this.props.eventManager}
        />
      </FullScreenModal>
    );
  }
}
