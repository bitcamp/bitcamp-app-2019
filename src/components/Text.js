import React, { Component } from 'react';
import { colors } from './Colors';
import {
  Text,
  StyleSheet,
  Platform
} from 'react-native';
import { scale } from '../actions/scale';

const styles = StyleSheet.create({
  text: {
    color: colors.textColor.normal,
    fontFamily: 'System',
    fontWeight: 'normal'
  },
  h1: {
    color: colors.primaryColor,
    fontFamily: 'Aleo-Bold',
    fontSize: scale(32),
    fontWeight: 'normal'
  },
  h2: {
    fontWeight: 'bold',
    fontSize: scale(18),
  },
  h3: {
    fontSize: scale(15),
  },
  h4: {
    fontSize: scale(14),
  },
  h5: {
    fontSize: scale(13),
  },
  h6: {
    fontSize: scale(12),
  },
  p: {
    fontSize: scale(14),
  },

});


const H1 = (props) => (
  <Text {...props} style={[styles.text, styles.h1, props.style]}>
    {props.children}
  </Text>
);

const H2 = (props) => (
  <Text {...props} style={[styles.text, styles.h2, props.style]}>
    {props.children}
  </Text>
);

const H3 = (props) => (
  <Text {...props} style={[styles.text, styles.h3, props.style]}>
    {props.children}
  </Text>
);

const H4 = (props) => (
  <Text {...props} style={[styles.text, styles.h4, props.style]}>
    {props.children}
  </Text>
);

const H5 = (props) => (
  <Text {...props} style={[styles.text, styles.h5, props.style]}>
    {props.children}
  </Text>
);

const H6 = (props) => (
  <Text {...props} style={[styles.text, styles.h6, props.style]}>
    {props.children}
  </Text>
);

const P = (props) => (
  <Text {...props} style={[styles.text, styles.p, props.style]}>
    {props.children}
  </Text>
);

const BaseText = (props) => (
  <Text {...props} style={[styles.text, props.style]}>
    {props.children}
  </Text>
);


export { H1, H2, H3, H4, H5, H6, P, BaseText }
