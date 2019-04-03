import React, { Component, Fragment } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { H3, H4, H6 } from "./Text";
import moment from "moment";
import { colors } from "./Colors";
import Icon from "react-native-vector-icons/FontAwesome";
import AnimatedEllipsis from "react-native-animated-ellipsis";

const styles = StyleSheet.create({
  question: {
    paddingVertical: 10,
    borderBottomWidth: 0.25,
    borderBottomColor: colors.borderColor.normal,
  },
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  questionText: {
    flex: 1,
  },
  collapseIcon: {
    marginHorizontal: 10,
  },
  statusText: {
    color: colors.secondaryColor, 
    marginTop: 5
  },
  claimedText: { 
    color: '#32D74B' 
  },
  animatedEllipsis: { 
    fontSize: 12, 
    marginLeft: -4 
  }
});

export default class QuestionCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      questionIsExpanded: false,
    };
    
    this.toggleQuestion = this.toggleQuestion.bind(this);
  }

  toggleQuestion() {
    this.setState({questionIsExpanded: !this.state.questionIsExpanded});
  }

  renderStatus() {
    const { status, question } = this.props;
    if (status.includes("claimed")) {
      return <H6 style={[styles.statusText, styles.claimedText]}>{status}</H6>;
    } else {
      return (
        <Fragment>
          <H6 style={styles.statusText}>
            {status}
            <AnimatedEllipsis style={styles.animatedEllipsis} />
          </H6>
        </Fragment>
      );
    }
  }
  render() {
    const { question, location, time } = this.props;
    const questionIsExpanded = this.state.questionIsExpanded;
    return (
      <TouchableOpacity 
        style={styles.question}
        onPress={this.toggleQuestion}
      >
        <View style={styles.questionContainer}>
          <H3 
            numberOfLines={!questionIsExpanded ? 1 : null}
            style={styles.questionText}
          >
            {question}
          </H3>
          <Icon
            name={questionIsExpanded ? "minus" : "plus"}
            style={styles.collapseIcon}
            size={18}
            color='#8e8e92'
          />
        </View>
        {questionIsExpanded && this.renderStatus()}
      </TouchableOpacity>
    );
  }
}