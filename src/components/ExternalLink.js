import React from 'react';
import { Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { BaseText } from './Text';
import { colors } from './Colors';
import PropTypes from 'prop-types';
import { Linking } from 'expo';

export default class ExternalLink extends React.Component {
    openURL() {
        // TODO: update to follow the expo API here: 
        // https://docs.expo.io/versions/v33.0.0/workflow/linking/
        const { url } = this.props;
        Linking.canOpenURL(url)
            .then((supported) => {
                if (!supported) {
                    this.displayError(url);
                } else {
                    return Linking.openURL(url);
                }
            })
            .catch(() => this.displayError(url));
    }

    displayError() {
        const { url } = this.props;
        Alert.alert(
            "Sorry, something went wrong",
            `Unable to open ${url}`,
            [{ text: "OK", onPress: () => console.log("OK Pressed") }],
            { cancelable: false }
        );
    }

    render() {
        return (
            <TouchableOpacity
                onPress={() => this.openURL(this.props.url)}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
              >
                <BaseText style={styles.link}>{this.props.text}</BaseText>
            </TouchableOpacity>
        );
    }
}

ExternalLink.propTypes = {
    url: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
};

const styles = {
    link: {
        color: colors.primaryColor
    }
}