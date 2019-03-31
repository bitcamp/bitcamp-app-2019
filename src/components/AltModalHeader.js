import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Platform
} from 'react-native';
import { H3, P } from './Text';
import { colors } from './Colors';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { scale } from '../actions/scale'; 
import PropTypes from 'prop-types';

// An alternative modal style with a black, centered title and configurable action text
// on the left and right
const AltModalHeader = props => (
    <View style={[ styles.menu, props.style ]}>

        <ConditionalSideText
            text={props.leftText}
            func={props.leftFunc}
            textStyle={[styles.leftText, props.leftTextStyle]}
        />

        <H3 style={[styles.menuItem, styles.text, styles.title]}>{props.title}</H3>

        <ConditionalSideText
            text={props.rightText}
            func={props.rightFunc}
            textStyle={props.rightTextStyle}
            containerStyle={styles.rightMenuItem}
        />
    </View>
);

const ConditionalSideText = props => (
    <View style={[styles.menuItem, props.containerStyle]}>
        {props.text &&
            <TouchableOpacity onPress={props.func}>
                <P style={[
                    styles.text, 
                    styles.link,
                    props.textStyle
                ]}>
                    {props.text}
                </P>
            </TouchableOpacity>
        }
    </View>
);

AltModalHeader.propTypes = {
    title: PropTypes.string.isRequired,
    leftText: PropTypes.string,
    leftFunc: requireFunctionIfPresent('leftText'),
    leftTextStyle: PropTypes.object,
    rightText: PropTypes.string,
    rightTextStyle: PropTypes.object,
    rightFunc: requireFunctionIfPresent('rightText'),
};

// A utility for making a function required if the dependentProp is passed into this component
function requireFunctionIfPresent(dependentProp) {
    return (props, propName) => {
        if(props[dependentProp]) {
            if (!props[propName]) {
                return new Error(`You must provide '${propName}' if '${dependentProp}' is present`);
            } else if(typeof(props[propName]) !== 'function') {
                return new Error(`The '${propName}' property isn't a function`);
            }
        }
    }
}

const headerPadding = scale(15);
const styles = StyleSheet.create({
    menu: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        backgroundColor: 'pink', // TODO: change back to colors.backgroundColor.normal,
        borderBottomWidth: 0.25,
        borderBottomColor: colors.borderColor.normal,
        padding: headerPadding,
        paddingTop: Platform.OS === "ios" ? headerPadding + getStatusBarHeight() : headerPadding,
    },
    text: {
        fontWeight: 'bold',
        flex: 0,
        paddingHorizontal: scale(15), // Add in larger click area
    },
    menuItem: {
        flexDirection: 'row',
        flex: 1,
    },
    rightMenuItem: {
        justifyContent: 'flex-end',
    },
    link: {
        color: colors.primaryColor,
    },
    leftText: {
        fontWeight: 'normal',
    },
    title: {
        textAlign: 'center',
    },
});

export default AltModalHeader;