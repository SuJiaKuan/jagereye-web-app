import React, { Component, PropTypes } from 'react';
import { Link }                        from 'react-router';
import { IconButton }                  from 'react-mdl';
import { Menu, MenuItem }              from 'react-mdl-extra';
import map                             from 'lodash/map';

import readableTime from '../lib/readableTime';

import './Notifications.less';

export default class CamerasPage extends Component {
    static propTypes = {
        notificationList : PropTypes.arrayOf(PropTypes.object),
        isChecked        : PropTypes.bool,
        onBtnClick       : PropTypes.func
    };

    static contextTypes = { i18n: React.PropTypes.object };


    render() {
        const { l } = this.context.i18n;

        const {
            notificationList,
            isChecked,
            onBtnClick
        } = this.props;
        const count = notificationList.length;

        // XXX(JiaKuan Su): I register "onMouseDown" instead "onClick" because
        // "onClick" is registered by Menu.
        const btn = (
            <div
                className     = 'Notifcations__btn'
                onMouseDown   = {onBtnClick}
            >
                <IconButton name = 'notifications' />
                { !isChecked && <div className = 'Notifcations__count'>{count}</div> }
            </div>
        );
        const headerText = count > 0 ? l('Recent Events') : l('No Recent Events');
        const menuItems = map(notificationList, (notification, idx) => {
            const {
                preview,
                name,
                timestamp
            } = notification;
            const previewStyle = {
                background: `url(${preview}) center / cover`
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
                            {`From ${name} at ${readableTime(timestamp)}`}
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
