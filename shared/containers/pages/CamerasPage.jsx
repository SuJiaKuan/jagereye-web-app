import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux';

import {
    changeCameraView,
    addingCameraEnter,
    addingCameraLeave,
    loadCameras,
    addCamera,
    deleteCamera,
    newStreamView
} from '../../actions/cameras';
import connectDataFetchers from '../../lib/connectDataFetchers.jsx';

import CamerasPage from '../../components/pages/CamerasPage.jsx';

class CamerasPageContainer extends Component {
    static propTypes = {
        isAdding: PropTypes.bool,
        isLoading: PropTypes.bool,
        curCameraIdx: PropTypes.number,
        cameraList: PropTypes.arrayOf(PropTypes.object),
        streamView: PropTypes.object,
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

    newStreamView = (url) => {
        this.props.dispatch(newStreamView(url));
    }

    render() {
        return (
            <CamerasPage
                {...this.props}
                onCameraViewChange = {this.handleCameraViewChange}
                onAdding = {this.handleAddingCameraEnter}
                onStopAdding = {this.handleAddingCameraLeave}
                addNewCamera = {this.addNewCamera}
                deleteCamera = {this.deleteCamera}
                newStreamView = {this.newStreamView}
            />
        );
    }
}

function mapStateToProps({ cameras }) {
    const {
        isAdding,
        isLoading,
        curCameraIdx,
        cameraList,
        streamView
    } = cameras;

    return {
        isAdding,
        isLoading,
        curCameraIdx,
        cameraList,
        streamView
    };
}
export default connect(mapStateToProps)(
    connectDataFetchers(CamerasPageContainer, [ loadCameras ])
);
