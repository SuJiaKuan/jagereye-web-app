import React, { Component, PropTypes } from 'react';

import map from 'lodash/map';

import Dialog from './Dialog.jsx';

import './ErrorDialog.less';

export default class ErrorDialog extends Component {
    static propTypes = {
        errorList: PropTypes.arrayOf(PropTypes.object),
        onRequestClose : PropTypes.func.isRequired
    };

    static contextTypes = { i18n: PropTypes.object };

    renderErrorMsg(error) {
        const { l } = this.context.i18n;

        const {
            name,
            type,
            code,
            errno,
            message
        } = error;

        return (
            <div className = 'ErrorDialog__error'>
                { name && <div>{`[${l('name')}] ${error.name}`}</div> }
                { type && <div>{`[${l('type')}] ${error.type}`}</div> }
                { code && <div>{`[${l('code')}] ${error.code}`}</div> }
                { errno && <div>{`[${l('errno')}] ${error.errno}`}</div> }
                { message && <div>{`[${l('message')}] ${error.message}`}</div> }
            </div>
        );
    }

    render() {
        const { l } = this.context.i18n;

        const { errorList } = this.props;

        const isOpen = errorList.length > 0;
        const errorMsgList = map(errorList, (error) => this.renderErrorMsg(error));

        return (
            <div className='ErrorDialog'>
                <Dialog
                    {...this.props}
                    title = {l('Oops! Something Error')}
                    isOpen = {isOpen}
                >
                    {errorMsgList}
                </Dialog>
            </div>
        );
    }
}

