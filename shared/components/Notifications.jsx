import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { IconButton } from 'react-mdl';
import { Menu, MenuItem } from 'react-mdl-extra';
import map from 'lodash/map';
import find from 'lodash/find';

import readableTime from '../lib/readableTime';

import './Notifications.less';

export default class CamerasPage extends Component {
    static propTypes = {
        cameraList: PropTypes.arrayOf(PropTypes.object),
        notificationList: PropTypes.arrayOf(PropTypes.object),
        uncheckedCount: PropTypes.number,
        onBtnClick: PropTypes.func
    };

    static contextTypes = { i18n: React.PropTypes.object };


    render() {
        const { l } = this.context.i18n;

        const {
            cameraList,
            notificationList,
            uncheckedCount,
            onBtnClick
        } = this.props;
        const count = uncheckedCount > 99 ? 99 : uncheckedCount;

        const countStyle = {
            'opacity': count > 0 ? '1' : '0'
        };
        // XXX(JiaKuan Su): I register "onMouseDown" instead "onClick" because
        // "onClick" is registered by Menu.
        const btn = (
            <div
                className     = 'Notifcations__btn'
                onMouseDown   = {onBtnClick}
            >
                <IconButton name = 'notifications' />
                <div
                    className = 'Notifcations__count'
                    style = {countStyle}
                >
                    {count}
                </div>
            </div>
        );
        const headerText
            = notificationList.length > 0 ? l('Recent Events') : l('No Recent Events');
        const menuItems = map(notificationList, (notification, idx) => {
            const {
                analyzer_id: analyzerId,
                timestamp,
                content
            } = notification;
            const camera = find(cameraList, (o) => o._id === analyzerId);
            const previewStyle = {
                background: `url(${content.thumbnail_name}) center / cover`
            };

            return (
                <MenuItem key = {idx}>
                    <Link
                        className = 'Notifcations__item'
                        to         = '/dashboard'
                    >
                        <div
                            className = 'Notifcations__item__preview'
                            style     = {previewStyle}
                        />
                        <div>
                            {`From ${camera.name} at ${readableTime(timestamp)}`}
                        </div>
                    </Link>
                </MenuItem>
            );
        });

        return (
            <Menu
                target = {btn}
                align = 'tl bl'
            >
                <MenuItem><h5>{headerText}</h5></MenuItem>
                {menuItems}
            </Menu>
        );
    }
}
