import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Event from '../../events/Event';
import EventsManager from '../../events/EventsManager';

/**
 * A card that will reveal a modal with extra info about an event when clicked
 */
export default class ClickableEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: false
        };
        this.toggleModal = this.toggleModal.bind(this);
    }

    toggleModal() {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    }

    render() {
        return (
            <View>
                <EventModal
                    isModalVisible={this.state.isModalVisible}
                    toggleModal={this.toggleModal}
                    eventManager={this.props.eventManager}
                    event={this.props.event}
                    origin={this.props.origin}
                />
                <TouchableOpacity
                    onPress={this.toggleModal}
                    activeOpacity={0.7}
                >
                    {props.children}
                </TouchableOpacity>
            </View>
        );
    }    
} 

ClickableEvent.propTypes = {
    event: PropTypes.instanceOf(Event),
    eventManager: PropTypes.instanceOf(EventsManager),
    origin: PropTypes.string.isRequired
};