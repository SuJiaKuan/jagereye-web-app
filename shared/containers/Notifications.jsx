import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux';

import {
    subscribeNotifications,
    checkNotifications
} from '../actions/notifications';
import { loadCameras } from '../actions/cameras';
import connectDataFetchers from '../lib/connectDataFetchers.jsx';

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

    render() {
        return (
            <Notifcations
                {...this.props}
                onBtnClick = {this.handleBtnClick}
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

export default connect(mapStateToProps)(
    connectDataFetchers(NotificationsContainer, [ loadCameras ])
);
