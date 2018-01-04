import React, { Component, PropTypes } from 'react';

import './Loading.less';

export default class Loading extends Component {
    static propTypes = {
        show: PropTypes.bool,
        size: PropTypes.number
    };

    static defaultProps = {
        size: 84
    };

    render() {
        const { show, size } = this.props;
        const componentStyle = {
            width: show ? '100vw' : '0px',
            height: show ? '100vh' : '0px'
        };
        const iconStyle = {
            width: `${size}px`,
            height: `${size}px`
        };

        return (
            <div
                className = 'Loading'
                style     = {componentStyle}
            >
                {
                    show &&
                    <img
                        className = 'Loading__icon'
                        style     = {iconStyle}
                        src       = '/static/images/loading-default-black.svg'
                        alt       = 'loading'
                    />
                }
            </div>
        );
    }
}
