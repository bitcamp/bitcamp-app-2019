import React, { Component } from 'react';
import { FlatList, ScrollView, StyleSheet } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import { CenteredActivityIndicator, PlainViewContainer } from '../components/Base';
import CustomScheduleTabBar from '../components/schedule/CustomScheduleTabBar';
import EventGroupComponent from '../components/schedule/EventGroupComponent';
import Saved from './Saved';

export default class Schedule extends Component<Props> {
  constructor(props) {
    super(props);

    this.renderScheduleForDay = this.renderScheduleForDay.bind(this);
  }

  componentDidMount() {}

  renderScheduleForDay(eventDayObj) {
    eventDay = eventDayObj.item;
    //console.log(eventDayObj);
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
        origin={'Schedule'}
      />
    );
  }

  render() {
    let eventDays = this.props.eventManager.getEventDays();
    let tabNames = eventDays.map(eventDay => eventDay.label);
    if(eventDays.length == 0) {
      return (
        <CenteredActivityIndicator/>
      )
    } else {
      return (
        <PlainViewContainer>
          <ScrollableTabView
            renderTabBar={() => <CustomScheduleTabBar/> }
          >
            {eventDays.map((eventDay,index) =>
              <FlatList
                data={[eventDay]}
                renderItem={this.renderScheduleForDay}
                keyExtractor={(event, index) => index.toString()}
                tabLabel={eventDay.label}
                key={index}
                style={styles.tabView}
              />
            )}
            <ScrollView tabLabel="ios-star" style={styles.tabView}>
            <Saved
              ref={mySaved => {
                this.mySaved = mySaved;
                this.props.eventManager.registerEventChangeListener(mySaved);
              }}
              eventManager={this.props.eventManager}
            />
            </ScrollView>
          </ScrollableTabView>
        </PlainViewContainer>
      );
    }
  }
}

const styles = StyleSheet.create({
  tabView: {
    flex: 1,
    //padding: 10,
    backgroundColor: 'rgba(0,0,0,0.01)'
  },
  card: {
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: 'black',
    borderBottomWidth: 2,
    height: 150,
    paddingLeft: 15,
    paddingRight: 15,
    //shadowColor: '#ccc',
    //shadowOffset: {width: 2, height: 2},
    //shadowOpacity: 0.5,
    //shadowRadius: 3
  }
})
