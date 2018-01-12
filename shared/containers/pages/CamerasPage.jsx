import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux';

import {
    changeCameraView,
    addingCameraEnter,
    addingCameraLeave,
    loadCameras,
    addCamera,
    deleteCamera
} from '../../actions/cameras';
import connectDataFetchers from '../../lib/connectDataFetchers.jsx';

import CamerasPage from '../../components/pages/CamerasPage.jsx';

class CamerasPageContainer extends Component {
    static propTypes = {
        isAdding: PropTypes.bool,
        isLoading: PropTypes.bool,
        curCameraIdx: PropTypes.number,
        cameraList: PropTypes.arrayOf(PropTypes.object),
        dispatch: PropTypes.func
    };

    handleCameraViewChange = (idx) => {
        this.props.dispatch(changeCameraView(idx));
    }

    handleAddingCameraEnter = () => {
        this.props.dispatch(addingCameraEnter());
    }

    handleAddingCameraLeave = () => {
        this.props.dispatch(addingCameraLeave());
    }

    addNewCamera = (params) => {
        this.props.dispatch(addCamera({ params }));
    }

    deleteCamera = (id) => {
        this.props.dispatch(deleteCamera(id));
    }

    render() {
        return (
            <CamerasPage
                {...this.props}
                addNewCamera = {this.addNewCamera}
                deleteCamera = {this.deleteCamera}
                onCameraViewChange = {this.handleCameraViewChange}
                onAdding = {this.handleAddingCameraEnter}
                onStopAdding = {this.handleAddingCameraLeave}
            />
        );
    }
}

function mapStateToProps({ cameras }) {
    const {
        isAdding,
        isLoading,
        curCameraIdx,
        cameraList
    } = cameras;

    return {
        isAdding,
        isLoading,
        curCameraIdx,
        cameraList
    };
}
export default connect(mapStateToProps)(
    connectDataFetchers(CamerasPageContainer, [ loadCameras ])
);
