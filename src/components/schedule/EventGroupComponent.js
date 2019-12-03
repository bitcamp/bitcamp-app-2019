import React, { Component, Fragment } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { BaseText } from '../Text';
import EventDescription from './EventDescription';

export default class EventGroupComponent extends Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    let headerWithoutAM_PM = this.props.header.substring(0, this.props.header.length - 2);
    let AM_or_PM = ( this.props.header.endsWith('am') ? ' AM' : ' PM');
    return (
      <Fragment>
      <BaseText style={styles.header}>{headerWithoutAM_PM + AM_or_PM}</BaseText>
        <FlatList
          data={this.props.events}
          renderItem={ (eventObj) => {
            event = eventObj.item;
            return (
              <EventDescription
                event = {event}
                eventManager={this.props.eventManager}
                origin={this.props.origin}
              />
            );
          }}
          ItemSeparatorComponent={() => {
            return <View style={{height: 1.5, backgroundColor: '#e3e3e8'}}></View>;
          }}
          keyExtractor={(event, index) => event.eventID.toString()}
        />
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    paddingLeft: 15,
    paddingBottom: 5,
    paddingTop: 5,
    color: 'black',
    backgroundColor: '#f7f7f7',
    fontWeight: '500',
    fontSize: 20
  }
});
