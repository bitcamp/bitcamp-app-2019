import React, {Component} from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native'
import { colors } from '../Colors';
import Icon from 'react-native-vector-icons/Ionicons'
import { scale } from '../../actions/scale';

export default class CustomScheduleTabBar extends Component {

  constructor(props) {
    super(props)
    this.setAnimationValue = this.setAnimationValue.bind(this)
  }

  componentDidMount() {
    this._listener = this.props.scrollValue.addListener(this.setAnimationValue)
  }

  setAnimationValue({value}) {
  }

  render() {
    return (
    <View style={[styles.tabs, this.props.style]}>
      {this.props.tabs.map((tab, i) => {
        return (
        <TouchableOpacity
          key={tab}
          onPress={() => this.props.goToPage(i)}
          style={[
            styles.tab,
            (this.props.activeTab === i ? styles.activetab : styles.inactivetab),
            (tab == 'ios-star' ? styles.star : styles.weekdays)
          ]}>
          { tab != 'ios-star' ?
          <Text style={[(this.props.activeTab === i) && styles.textActive, styles.text]}>
            {tab}
          </Text>
          :
          <Icon
            name={tab}
            size={27.5}
            color={this.props.activeTab === i ? colors.primaryColor : colors.textColor.light}
          />}
        </TouchableOpacity>)
      })}
    </View>)
  }
}

const styles = StyleSheet.create({
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(8),
    borderBottomWidth: 5,
  },
  weekdays: {
    flex: 1,
  },
  star: {
    width: 70,
  },
  inactivetab: {
    borderBottomColor: 'transparent',
  },
  activetab: {
    borderBottomColor: colors.primaryColor,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)'
  },
  text: {
    fontSize: scale(15),
  },
  textActive: {
    color: colors.primaryColor,
    fontWeight: 'bold',
  }
})
