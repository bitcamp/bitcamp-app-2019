import React, { Component } from 'react';
import { Animated, Keyboard, StyleSheet, TextInput, UIManager } from 'react-native';
import { getDeviceDimensions } from '../utils/sizing';
const { State: TextInputState } = TextInput;

/** Class adapted from https://gist.github.com/larkintuckerllc/15644c314207df00c212ecb14b981439#file-keyboardshift-js
    See this article for usage information: https://codeburst.io/react-native-keyboard-covering-inputs-72a9d3072689 */
export default class KeyboardShift extends Component {

  constructor(props) {
    super(props);
    this.state = {
      shift: new Animated.Value(0),
    };
    this.animationDuration = 250;
  }

  componentDidMount() {
    this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
    this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
  }

  componentWillUnmount() {
    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();
  }

  render() {
    const { shift } = this.state;
    return (
      <Animated.View style={[styles.container, { transform: [{translateY: shift}] }]}>
        {this.props.children}
      </Animated.View>
    );
  }

  handleKeyboardDidShow = (event) => {
    const { height: windowHeight } = getDeviceDimensions();
    const keyboardHeight = event.endCoordinates.height;
    const currentlyFocusedField = TextInputState.currentlyFocusedField();
    UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
      const fieldHeight = height;
      const fieldTop = pageY;
      const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight);
      if (gap >= 0) {
        return;
      }

      const additionalOffset = fieldHeight / 2; // Add in extra spacing below the text input
      Animated.timing(
        this.state.shift,
        {
          toValue: gap - additionalOffset,
          duration: this.animationDuration,
          useNativeDriver: true,
        }
      ).start();
    });
  }

  handleKeyboardDidHide = () => {
    Animated.timing(
      this.state.shift,
      {
        toValue: 0,
        duration: this.animationDuration,
        useNativeDriver: true,
      }
    ).start();
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%'
  }
});