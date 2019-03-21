import React, { Component } from 'react';
import { colors } from './Colors';
import {
  Text,
  StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  text: {
    color: colors.textColor.normal,
  },
  h1: {
    color: colors.primaryColor,
    fontFamily: "Aleo-Bold",
    fontSize: 36,
  },
  h2: {
    fontWeight: 'bold',
    fontSize: 21,
  },
  h3: {
    fontSize: 16,
  },
  h4: {
    fontSize: 13,
  },
  h5: {
    fontSize: 11,
  },
  h6: {
    fontSize: 13,
  },
  p: {
    fontSize: 15,
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


export { H1, H2, H3, H4, H5, H6, P }
