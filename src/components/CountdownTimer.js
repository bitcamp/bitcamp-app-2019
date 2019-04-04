import React, { Component } from 'react';
import moment from 'moment';
import { H3, BaseText } from './Text';
import { StyleSheet, Text } from 'react-native';
import { colors } from './Colors';

// when hacking begins
const START_TIME = moment("2019-04-12 21:00");
// when hacking ends
const END_TIME = moment("2019-04-14 09:00");

export default class CountdownTimer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: moment(),
    };
  };

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({
        time: moment(),
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const startTime = START_TIME;
    const endTime = END_TIME;

    let remain;

    let days;
    let hours;
    let minutes;
    let seconds;

    // If hacking hasn't begun
    if (this.state.time < startTime) {
      return (
        <H3 style={styles.countdownText}>
          Bitcamp is April 12-14
        </H3>
      );

    // If hacking is over
    } else if (this.state.time > endTime) {
      return <React.Fragment></React.Fragment>

    // If hacking is currently happening
    } else {
      remain  = moment.duration(moment(endTime).diff(moment(this.state.time)));
      days    = remain.days();
      hours   = remain.hours();
      minutes = remain.minutes();
      seconds = remain.seconds();
    }

    let daysText = (days > 0) ? `${days}d ` : ``;
    let hoursText = `${hours}h `
    let minutesText = `${minutes}m `;
    let secondsText = `${seconds}s `;

    return (
      <H3 style={styles.countdownText}>
        {daysText + hoursText + minutesText + secondsText}
        <BaseText>left to hack</BaseText>
      </H3>
    );
  }
}

const styles = StyleSheet.create({
  countdownText: {
    paddingVertical: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    flex: 1,
  }
});