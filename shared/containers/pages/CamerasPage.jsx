import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux';

import { addCamera, addingCameraEnter, addingCameraLeave } from '../../actions/cameras';
import connectDataFetchers from '../../lib/connectDataFetchers.jsx';

import CamerasPage from '../../components/pages/CamerasPage.jsx';

class CamerasPageContainer extends Component {
    static propTypes = {
        isAdding   : PropTypes.bool,
        isLoading  : PropTypes.bool,
        cameraList : PropTypes.arrayOf(PropTypes.object),
        dispatch   : PropTypes.func
    };

    handleAddingCameraEnter = () => {
        this.props.dispatch(addingCameraEnter());
    }

    handleAddingCameraLeave = () => {
        this.props.dispatch(addingCameraLeave());
    }

    addNewCamera = (params) => {
        this.props.dispatch(addCamera({ params }));
    }

    render() {
        return (
            <CamerasPage
                {...this.props}
                addNewCamera = {this.addNewCamera}
                onAdding     = {this.handleAddingCameraEnter}
                onStopAdding = {this.handleAddingCameraLeave}
            />
        );
    }
}

function mapStateToProps({ cameras }) {
    const { isAdding, isLoading, cameraList } = cameras;

    return {
        isAdding,
        isLoading,
        cameraList
    };
}
export default connect(mapStateToProps)(
    connectDataFetchers(CamerasPageContainer, [])
);
