import React from 'react';
import Modal from 'react-native-modal';
import { colors } from '../Colors';
import { scale } from '../../utils/scale';
import { ViewPropTypes, StyleSheet, View, ScrollView } from 'react-native';
import PropTypes from 'prop-types';

/* A <Modal> wrapper that uses a standard set of animations and colors */
const FullScreenModal = props => (
    <Modal
        backdropColor={colors.backgroundColor.normal}
        backdropOpacity={1}
        animationIn="fadeInUp"
        animationOut="fadeOutDown"
        animationInTiming={250}
        animationOutTiming={300}
        backdropTransitionInTiming={250}
        backdropTransitionOutTiming={300}
        avoidKeyboard={true}
        style={styles.modal}
        {...props}
    >
        {props.header}
        {props.shouldntScroll 
            ? <View style={[styles.content, props.contentStyle]}>{props.children}</View>
            : <ScrollView keyboardShouldPersistTaps='handled'>
                <View style={[styles.content, props.contentStyle]}>{props.children}</View>
              </ScrollView>
        }
    </Modal>
);

const styles = StyleSheet.create({
    modal: {
        margin: 0
    },
    content: {
        flex: 1,
        backgroundColor: colors.backgroundColor.normal,
        padding: scale(15),
        paddingTop: 0,
    }
});

FullScreenModal.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onBackButtonPress: PropTypes.func.isRequired,
    contentStyle: ViewPropTypes.style,
    header: PropTypes.element,
    shouldntScroll: PropTypes.bool
};

export default FullScreenModal;