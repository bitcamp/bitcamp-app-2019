import React from 'react';
import { TouchableOpacity, Switch, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { P } from './Text';
import { colors } from './Colors';

export default function SwitchInput(props) {
    console.log(props.isDisabled);
    return (
        <TouchableOpacity 
            style={[styles.container, props.style]}
            onPress={() => {
                props.isDisabled || props.onPress();
            }}
            activeOpacity={1}
        >
            <P style={props.textStyle}>{props.text}</P>
            <Switch
                trackColor={colors.primaryColor}
                value={props.value}
                onValueChange={props.onPress}
                disabled={props.isDisabled}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
});

const stylePropType = PropTypes.oneOfType([PropTypes.object, PropTypes.array]);
SwitchInput.propTypes = {
    style: stylePropType,
    onPress: PropTypes.func.isRequired,
    textStyle: stylePropType,
    text: PropTypes.string.isRequired,
    value: PropTypes.bool.isRequired,
    isDisabled: PropTypes.bool,
};

