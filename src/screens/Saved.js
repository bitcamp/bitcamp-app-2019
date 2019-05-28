import React, { Component, Fragment } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, PadContainer, SubHeading } from '../components/Base';
import LargeEventCard from '../components/events/LargeEventCard';

export default class Saved extends Component {

  constructor(props) {
    super(props);
    this.state = {
      refresh: false,
      isShowingPastEvents: false,
    };
  }

  render() {
    const { eventManager } = this.props;
    const events = eventManager.getSavedEventsArray();

    const pastEvents = events.filter(event => event.hasPassed);
    const upcomingEvents = events.filter(event => !event.hasPassed);

    return (
      <ScrollView>
        <PadContainer>
          <SubHeading style={styles.subSectionHeading}>
            {events.length} events saved
          </SubHeading>

          { // Show the past events button if there are past events
            (pastEvents.length > 0) &&
            <Button
              text={`${this.state.isShowingPastEvents ? 'Hide' : 'Show'} ${pastEvents.length} past event${pastEvents.length > 1 ? 's' : ''}`}
              style={styles.showPastEventsButton}
              onPress={() => (
                this.setState({ isShowingPastEvents: !this.state.isShowingPastEvents})
              )}
              accessibilityLabel='Toggle Past Events'
            />
          }

          <EventsList
            events={pastEvents}
            eventManager={eventManager}
            shouldDisplay={pastEvents.length > 0 && this.state.isShowingPastEvents}
          />

         <EventsList
            events={upcomingEvents}
            eventManager={eventManager}
            shouldDisplay={upcomingEvents.length > 0}
          />
        </PadContainer>
      </ScrollView>
    );
  }
}

class EventsList extends Component {
  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
		this.props.eventManager.removeUpdatesListener(this.myEventsList);
  }

  render() {
    const { events, eventManager, shouldDisplay } = this.props;
    return shouldDisplay && (
      <View
        ref={myEventsList => {
          this.myEventsList = myEventsList;
          eventManager.registerUpdatesListener(myEventsList);
        }}
      >
        {
          events.map((event) => (
            <LargeEventCard
              key={event.eventID}
              event={event}
              eventManager={eventManager}
              origin='Saved'
            />
          ))
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  eventImgPassed: {
    opacity: .3,
  },
  subSectionHeading: {
    marginBottom: 0,
    paddingVertical: 25,
    textAlign: 'center'
  },
  showPastEventsButton: { 
    marginHorizontal: 0,
    marginBottom: 20 
  },
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
