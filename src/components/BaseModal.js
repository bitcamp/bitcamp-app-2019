import Modal from 'react-native-modal';
import { modalStyle } from './Base';
import { colors } from './Colors';
import { ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

/* A wrapper for a generic modal that standardizes animation timings, and colors modal properties */
const BaseModal = props => (
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
        style={[modalStyle, props.style]}
        {...props}
    >
        {props.children}
    </Modal>
);

BaseModal.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onBackButtonPress: PropTypes.func.isRequired,
    style: ViewPropTypes.style
};

export default BaseModal;