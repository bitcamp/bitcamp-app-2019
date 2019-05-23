import React, { Component, Fragment } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { scale } from '../utils/scale';
import { BaseText } from './Text';

const badgeColors = {
  red: '255, 59, 48',
  yellow: '255, 149, 0',
  green: '79, 217, 100',
  blue: '0, 122, 255',
  turquoise: '0, 212, 255',
  purple: '208, 40, 255'
};

const opacity = ', 0.2';

const badgeStyle = {
  red: { bgColor: 'rgba(' + badgeColors.red + opacity + ')', text: 'rgb(' + badgeColors.red + ')' },
  yellow: { bgColor: 'rgba(' + badgeColors.yellow + opacity + ')', text: 'rgb(' + badgeColors.yellow + ')' },
  green: { bgColor: 'rgba(' + badgeColors.green + opacity + ')', text: 'rgb(' + badgeColors.green + ')' },
  turquoise: { bgColor: 'rgba(' + badgeColors.turquoise + opacity + ')', text: 'rgb(' + badgeColors.turquoise + ')' },
  blue: { bgColor: 'rgba(' + badgeColors.blue + opacity + ')', text: 'rgb(' + badgeColors.blue + ')' },
  purple: { bgColor: 'rgba(' + badgeColors.purple + opacity + ')', text: 'rgb(' + badgeColors.purple + ')' }
};

export const badgeStyles = {
  'Main': badgeStyle.green,
  'Food': badgeStyle.red,
  'Mini': badgeStyle.yellow,
  'Workshop': badgeStyle.purple,
  'Sponsor': badgeStyle.blue,
  'Mentor': badgeStyle.turquoise,
};

const styles = StyleSheet.create({
  width: {
    alignSelf: 'flex-start',
    borderRadius: 3
  },
  modal: {
    marginTop: 3,
    paddingHorizontal: scale(3),
  },
  description: {
    marginTop: 5
  },
  text: {
    fontWeight: 'bold',
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 1,
    paddingBottom: 1,
  },
  modalText: {
    fontSize: scale(12)
  }
});

export default class PillBadge extends Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={[
        (this.props.from === 'Modal' ? styles.modal : styles.description),
        styles.width,
        {backgroundColor: badgeStyles[this.props.category].bgColor, marginLeft: (this.props.margin !== null ? this.props.margin : 0), marginRight: (this.props.isLast ? 30 : 0)}
      ]}>
        <BaseText style={[
          styles.width,
          styles.text,
          {color: badgeStyles[this.props.category].text},
          this.props.from === 'Modal' ? styles.modalText : {}
        ]}>
            {(this.props.category === 'Main' || this.props.category === 'Mini' ? this.props.category + '-Event' : this.props.category).toUpperCase()}
        </BaseText>
      </View>
    );
  }
}
