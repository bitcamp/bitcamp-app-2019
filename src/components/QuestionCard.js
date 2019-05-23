import React from "react";
import { StyleSheet, View } from "react-native";
import { H3, H4, H6 } from "./Text";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AnimatedEllipsis from "react-native-animated-ellipsis";
import { scale } from '../utils/scale';

export default function QuestionCard(props) {
  const { question, status } = props;
  const iconSize = scale(13);
  const isClaimed = status.includes("claimed");

  return (
    <View style={styles.questionContainer}>
      <H3 style={styles.questionText}>
        {question}
      </H3>
      <View style={styles.statusContainer}>
        <FontAwesome5
          name={isClaimed ? "check-circle" : "sync-alt"}
          color={isClaimed ? questionColors.claimed : questionColors.unclaimed}
          size={iconSize}
          style={styles.icon}
          solid={isClaimed}
        />
        <H6 style={[
            styles.statusText, 
            isClaimed && styles.claimedText
          ]}
        >
          {status}
        </H6>
        {!isClaimed && <AnimatedEllipsis style={styles.animatedEllipsis} />}
      </View>
    </View>
  );
}

const questionColors = {
  claimed: '#4CD964',
  unclaimed: '#FF9500'
};

const styles = StyleSheet.create({
  questionContainer: {
    backgroundColor: '#EFEFF4',
    padding: scale(10),
    marginVertical: scale(5),
    borderRadius: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scale(5),
  },
  questionText: {
    fontWeight: 'bold',
  },
  statusText: {
    color: questionColors.unclaimed,
    flex: 1,
    flexWrap: 'wrap'
  },
  claimedText: { 
    color: questionColors.claimed 
  },
  animatedEllipsis: { 
    fontSize: 15, 
    fontWeight: 'bold',
    color: questionColors.unclaimed,
  },
  icon: {
    marginRight: scale(5),
  }
});
