import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux';

import {
    subscribeNotifications,
    checkNotifications,
    readNotification
} from '../actions/notifications';

import Notifcations from '../components/Notifications.jsx';

class NotificationsContainer extends Component {
    static propTypes = {
        cameraList: PropTypes.arrayOf(PropTypes.object),
        notificationList: PropTypes.arrayOf(PropTypes.object),
        uncheckedCount: PropTypes.number,
        dispatch: PropTypes.func
    };

    componentDidMount() {
        this.props.dispatch(subscribeNotifications());
    }

    handleBtnClick = () => {
        this.props.dispatch(checkNotifications());
    }

    readNotification = (id) => {
        this.props.dispatch(readNotification(id));
    }

    render() {
        return (
            <Notifcations
                {...this.props}
                onBtnClick = {this.handleBtnClick}
                readNotification = {this.readNotification}
            />
        );
    }
}

function mapStateToProps({ cameras, notifications }) {
    const { cameraList } = cameras;
    const { notificationList, uncheckedCount } = notifications;

    return {
        cameraList,
        notificationList,
        uncheckedCount
    };
}

export default connect(mapStateToProps)(NotificationsContainer);
