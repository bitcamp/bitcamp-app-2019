import React from 'react';
import Modal from 'react-native-modal';
import { modalStyle, ModalContent } from '../Base';
import { colors } from '../Colors';
import { ViewPropTypes } from 'react-native';
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
        style={modalStyle}
        {...props}
    >
        {props.header}
        <ModalContent style={props.contentStyle}>
            {props.children}
        </ModalContent>
    </Modal>
);

FullScreenModal.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onBackButtonPress: PropTypes.func.isRequired,
    contentStyle: ViewPropTypes.style,
    header: PropTypes.element
};

export default FullScreenModal;