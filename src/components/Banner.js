import React from 'react';
import PropTypes from 'prop-types';
import { ImageBackground, StyleSheet } from 'react-native';
import { PadContainer, H3, H2 } from './Base';
import LinearGradient from 'react-native-linear-gradient';
import { getDeviceWidth, getImageHeight } from '../utils/sizing';

/* A banner that fills the width of the screen. It has a background image, 
   a title, and a description */
const Banner = () => (
    <ImageBackground
        style={styles.imageBg}
        source={props.imageSource}
    >
        <LinearGradient
            style={styles.darkImageMask}
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.65)']}
            locations={[0.3, 1]}
        >
            <PadContainer style={styles.textGroup}>
                <H3 style={styles.description}>
                    {props.description}
                </H3>
                <H2 style={styles.title}>
                    {props.title}
                </H2>
            </PadContainer>
        </LinearGradient>
    </ImageBackground>
);

Banner.propTypes = {
    title: PropTypes.string.isRequired,
    imageSource: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
    imageBg: {
      position: 'relative',
      width: getDeviceWidth(),
      height: getImageHeight()
    },
    darkImageMask: {
      flex: 1,
    },
    description: {
      fontWeight: 'bold',
      color: colors.textColor.primary,
    },
    title: {
      color: colors.textColor.primary,
      fontSize: 26,
    },
    textGroup: {
      marginBottom: 40,
      flex: 1,
      justifyContent: 'flex-end',
    },
});

export default Banner;