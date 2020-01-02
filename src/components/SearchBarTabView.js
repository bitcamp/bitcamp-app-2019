import CustomScheduleTabBar from './schedule/CustomScheduleTabBar';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import React from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet
} from 'react-native';
import EventGroupComponent from '../components/schedule/EventGroupComponent';
import PropTypes from 'prop-types';

export default class SearchBarTabView extends React.Component {  
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
  
  renderScheduleForDay(eventDayObj) {
    eventDay = eventDayObj.item;
    return (
      <FlatList
        key={eventDay.label}
        data={eventDay.eventGroups}
        renderItem={this.renderEventCard.bind(this)}
        keyExtractor={(eventGroup) => `${eventDay.label} ${eventGroup.label}`}
        scrollEnabled={false}
      />
    );
  }

  renderSearchResults(schedule) {
    return schedule.map((eventDay) =>
        <FlatList
          data={[eventDay]}
          renderItem={this.renderScheduleForDay.bind(this)}
          keyExtractor={(eventDayObj) => `${eventDayObj.label} list`}
          key={eventDay.label}
          tabLabel={eventDay.label}
          style={[styles.tabView]}
        />
      );
  }

  render() {
    return (
      <ScrollableTabView
        renderTabBar={() => <CustomScheduleTabBar/>}
        style={{height: (this.props.screenHeight - (this.props.offsetHeight + 2 + this.props.keyboardHeight))}}
        initialPage={0}
      >
        {this.props.schedule.length > 0 &&
          this.renderSearchResults(this.props.schedule)
        }
      </ScrollableTabView>
    );
  }
}

const styles = StyleSheet.create({
  tabView: {
    flex: 1,
  },
});

SearchBarTabView.propTypes = {
  screenHeight: PropTypes.number.isRequired,
  offsetHeight: PropTypes.number.isRequired,
  keyboardHeight: PropTypes.number.isRequired,
  schedule: PropTypes.array.isRequired,
  eventManager: PropTypes.object.isRequired
};
