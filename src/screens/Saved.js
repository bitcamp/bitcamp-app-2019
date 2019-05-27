import React, { Component, Fragment } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, PadContainer, SubHeading } from '../components/Base';
import LargeEventCard from '../components/events/LargeEventCard';

export default class Saved extends Component {

  constructor(props) {
    super(props);
    this.state = {
      refresh: false,
      showPastEvents: false,
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
          {/*<View style={styles.headingRow}>
            <TouchableOpacity onPress={() => {this.setState({ refresh: !this.state.refresh })}}>
              <Icon
                name="refresh"
                size={30}
                color="black"
                style={{
                  paddingTop: 34,
                  marginBottom: 20,
                  opacity: .8,
                }}
              />
            </TouchableOpacity>
          </View>*/}
          <SubHeading style={styles.subSectionHeading}>
            {events.length} events saved
          </SubHeading>
          {
            (pastEvents.length > 0) &&
              <Fragment>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ showPastEvents: !this.state.showPastEvents});
                  }}
                >
                  <Button
                    text={`${this.state.showPastEvents ? 'Hide' : 'Show'} ${pastEvents.length} past event${pastEvents.length > 1 ? 's' : ''}`}
                    style={styles.showPastEventsButton}
                  />
                </TouchableOpacity>
              </Fragment>
          }
          {
            (pastEvents.length > 0) && (this.state.showPastEvents) &&
            <Fragment>
              <EventsList
                events={pastEvents}
                eventManager={eventManager}
              />
            </Fragment>
          }
          {
            (upcomingEvents.length > 0) &&
            <Fragment>
              <EventsList
                events={upcomingEvents}
                eventManager={eventManager}
              />
            </Fragment>
          }
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
    const { events, eventManager } = this.props;
    return (
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
    )
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
