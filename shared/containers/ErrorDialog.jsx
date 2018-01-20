import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux';

import { clearError } from '../actions/errors';

import ErrorDialog from '../components/ErrorDialog.jsx';

class ErrorDialogContainer extends Component {
    static propTypes = {
        errorList: PropTypes.arrayOf(PropTypes.object),
        dispatch: PropTypes.func
    };

    handleRequestClose = () => {
        this.props.dispatch(clearError());
    }

    render() {
        return (
            <ErrorDialog
                {...this.props}
                onRequestClose = {this.handleRequestClose}
            />
        );
    }
}

function mapStateToProps({ errors }) {
    const { errorList } = errors;

    return {
        errorList
    };
}

export default connect(mapStateToProps)(ErrorDialogContainer);
