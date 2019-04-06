import React from 'react';
import { TouchableOpacity, Switch } from 'react-native';
import PropTypes from 'prop-types';
import { P } from './Text';
import { colors } from './Colors';

export default function SwitchInput(props) {
    return (
        <TouchableOpacity 
            style={props.style}
            onPress={props.onPress}
            activeOpacity={1}
        >
            <P style={props.textStyle}>{props.text}</P>
            <Switch
                trackColor={colors.primaryColor}
                value={props.value}
                onValueChange={props.onPress}
            />
        </TouchableOpacity>
    );
}

const stylePropType = PropTypes.oneOfType([PropTypes.object, PropTypes.array]);
SwitchInput.propTypes = {
    style: stylePropType,
    onPress: PropTypes.func.isRequired,
    textStyle: stylePropType,
    text: PropTypes.string.isRequired,
    value: PropTypes.bool.isRequired
};

