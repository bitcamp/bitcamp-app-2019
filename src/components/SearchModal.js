import React, { Component, Fragment } from 'react';
import { FlatList, View, Platform, ScrollView, TouchableOpacity, StyleSheet, Text, Keyboard } from 'react-native';
import Modal from 'react-native-modal';
import { SearchBar } from 'react-native-elements';
import { H3 } from "./Text";
import EventGroupComponent from '../components/schedule/EventGroupComponent';
import EventDay from '../events/EventDay';
import EventGroup from '../events/EventGroup';
import { ModalContent, ModalHeader, modalStyle } from './Base';
import { colors } from './Colors';
import PillBadge from './PillBadge';
import {badgeStyles} from './PillBadge.js';
import CustomScheduleTabBar from './schedule/CustomScheduleTabBar';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import { scale } from '../actions/scale';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import LinearGradient from 'react-native-linear-gradient';

export default class SearchModal extends Component {

  constructor(props) {
    super(props);
    this.renderScheduleForDay = this.renderScheduleForDay.bind(this);
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
    this.setState({keyboardHeight: event.endCoordinates.height});
  }
  handleKeyboardDidHide = () => {
    this.setState({keyboardHeight: 0});
  }

  measureView(event, view) {
    let newHeight = this.state.height;
    newHeight[view] = event.nativeEvent.layout.height;
    this.setState({
      height: newHeight,
      offsetHeight: Object.values(newHeight).reduce((acc,h) => acc + h, 0)
    })
    console.log(this.state.height);
    console.log(this.state.offsetHeight);
  }

  filterEvents(query) {
    query = query.toLowerCase();
    query_regex = this.escapeRegExp(query);
    eventDays = this.props.eventDays;
    newSchedule = []

    // We apologize for this mess :(
    if(query !== "") {
      for (ed in eventDays) {
        day = eventDays[ed];
        newEventDay = new EventDay(day.label, [])
        for (eventGroupIndex in day.eventGroups) {
          eventGroup = day.eventGroups[eventGroupIndex];
          newEventGroup = new EventGroup(eventGroup.label, [])
          for (eventIndex in eventGroup.events) {
            event = eventGroup.events[eventIndex];
            /* TODO: Change this when all categories switched to list */
            let category_search = (Array.isArray(event.category) ? event.category.map(category => category.toLowerCase().search(query_regex) >= 0) : event.category.toLowerCase().search(query_regex) >= 0)
            if (event.title.toLowerCase().search(query_regex) >= 0 || (Array.isArray(category_search) ? category_search.includes(true) : category_search)
          /*event.category.toLowerCase().search(query) >= 0*/) {
              console.log("HERE");
              newEventGroup.events.push(event);
            }
          }
          if (newEventGroup.events.length > 0) {
            newEventDay.eventGroups.push(newEventGroup);
          }
        }
        newSchedule.push(newEventDay);
      }
    }

    this.setState({
      newSchedule: newSchedule,
      search: query
    });    
  }

  renderScheduleForDay(eventDayObj) {
    eventDay = eventDayObj.item;
    return (
      <FlatList
        key={eventDay.label}
        data={eventDay.eventGroups}
        renderItem={this.renderEventCard.bind(this)}
        keyExtractor={(item, index) => index.toString()}
        scrollEnabled={false}
      />
    );
  }

  renderEventCard(eventGroupObj) {
    eventGroup = eventGroupObj.item;
    return (
      <EventGroupComponent
        header={eventGroup.label}
        events={eventGroup.events}
        eventManager={this.props.eventManager}
        origin={'Search'}
      />
    );
  }


  renderSearchResults(schedule) {
    return schedule.map((eventDay,index) =>
      <ScrollView key={eventDay.label} tabLabel={eventDay.label} style={[styles.tabView]}>
        <FlatList
          data={[eventDay]}
          renderItem={this.renderScheduleForDay}
          keyExtractor={(event, index) => `${eventDay.label} list`}
        />
      </ScrollView>);
  }

  render() {
    const props = this.props;
    const dimensions = require('Dimensions').get('window');
    const imageWidth = dimensions.width - 42;
    const imageHeight = Math.round((imageWidth * 38) / 67);
    const styles = {width: window.width, height: window.height, overflow:'visible'};
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
            isLast={obj === 'Mentor' ? true : false}
          />
        </TouchableOpacity>);
    }
    let newSchedule = this.state.newSchedule.filter(event => event.eventGroups.length > 0);
    return (
      <Modal
        isVisible={props.isModalVisible}
        backdropColor={'#f7f7f7'}
        backdropOpacity={1}
        animationInTiming={250}
        animationIn="fadeInUp"
        animationOut="fadeOutDown"
        animationOutTiming={300}
        backdropTransitionInTiming={250}
        backdropTransitionOutTiming={300}
        avoidKeyboard={true}
        onBackButtonPress={() => props.toggleModal()}
        style={[modalStyle]}
      >
      <ModalContent style={{padding:0}}>
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
              containerStyle={{flex: 1}}
              inputContainerStyle={{backgroundColor: colors.backgroundColor.dark, borderRadius: scale(10)}}
              leftIconContainerStyle={{backgroundColor: colors.backgroundColor.dark}}
              rightIconContainerStyle={{backgroundColor: colors.backgroundColor.dark}}
            />
            <View style={{flex: 0,flexDirection: 'row', justifyContent: 'flex-end'}}>
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
          <View style={{flex: 1}} onLayout={(event) => this.measureView(event, 'TagViewParent')}>
            <View style={{flex: 1, padding: 9, paddingTop: 10, paddingBottom: 10}}>
              <ScrollView
                horizontal={true}
                onLayout={(event) => this.measureView(event, 'TagScrollView')}
                showsHorizontalScrollIndicator={false}>
                {badges}
              </ScrollView>
              <LinearGradient
                  colors={['rgba(255,255,255,0.7)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0.7)']}
                  locations={[0, 0.1, 0.8, 1]}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}
                  pointerEvents={'none'}
                />
            </View>
          </View>
          <ScrollableTabView
            renderTabBar={() => <CustomScheduleTabBar /> }
            style={{height: (dimensions.height - (this.state.offsetHeight + 2 + this.state.keyboardHeight))}}
            page={0}
          >
            {newSchedule.length > 0 && 
              this.renderSearchResults(newSchedule)
            }
          </ScrollableTabView>
        </ModalContent>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    paddingLeft: 15,
    paddingBottom: 3,
    paddingTop: 3,
    color: 'white',
    backgroundColor: colors.primaryColor,
    fontWeight: '500',
    fontSize: 25,
    //borderBottomWidth: 5,
    //borderTopWidth: 0.5,
    //borderBottomColor: colors.primaryColor,
    //borderTopColor: 'black',
    //textAlign: 'center'
  },
  tabView: {
    flex: 1,
    //padding: 10,
    backgroundColor: 'rgba(0,0,0,0.01)'
  },
});
