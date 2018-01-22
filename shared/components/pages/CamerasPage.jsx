import React, { Component, PropTypes } from 'react';

import { Button, IconButton } from 'react-mdl';

import AddCamera from '../AddCamera.jsx';
import Loading   from '../Loading.jsx';

import config from '../../config';

import './CamerasPage.less';

export default class CamerasPage extends Component {
    static propTypes = {
        isAdding: PropTypes.bool,
        isLoading: PropTypes.bool,
        curCameraIdx: PropTypes.number,
        cameraList: PropTypes.arrayOf(PropTypes.object),
        streamView: PropTypes.object,
        onCameraViewChange: PropTypes.func,
        onAdding: PropTypes.func,
        onStopAdding: PropTypes.func,
        addNewCamera: PropTypes.func,
        deleteCamera: PropTypes.func,
        newStreamView: PropTypes.func
    };

    static contextTypes = { i18n: React.PropTypes.object };

    componentDidMount() {
        const {
            isAdding,
            cameraList,
            curCameraIdx
        } = this.props;

        if (!isAdding && cameraList.length > 0) {
            this.props.newStreamView(cameraList[curCameraIdx].source.url);
        }
    }

    componentDidUpdate(prevProps) {
        const {
            isAdding,
            cameraList,
            curCameraIdx
        } = this.props;
        const {
            isAdding: prevIsAdding,
            curCameraIdx: prevCameraIdx,
            cameraList: prevCameraList
        } = prevProps;

        if (!isAdding
            && cameraList.length > 0
            && prevCameraList.length > 0
            && cameraList[curCameraIdx].source.url !== prevCameraList[prevCameraIdx].source.url) {
            return this.props.newStreamView(cameraList[curCameraIdx].source.url);
        }

        if (!isAdding
            && prevIsAdding
            && cameraList.length > 0) {
            return this.props.newStreamView(cameraList[curCameraIdx].source.url);
        }
    }

    handleDeleteBtnClick = (id) => {
        this.props.deleteCamera(id);
    }

    handleCameraItemClick = (idx) => {
        this.props.onStopAdding();
        this.props.onCameraViewChange(idx);
    }

    renderCameraView(camera, streamView) {
        const imgSrc =
            streamView.isAvailable ?
            `${streamView.url}?${new Date().getTime()}` :
            '/static/images/loading-default-black.svg';

        return (
            <div>
                <div className = 'CamerasPage__view__title'>
                    <h3>{camera.name}</h3>
                    <IconButton
                        name = 'delete'
                        onClick = {this.handleDeleteBtnClick.bind(this, camera._id)}
                    />
                </div>
                <img
                    src = {imgSrc}
                    width = '700'
                    height = '394'
                />
            </div>
        );
    }

    renderCameraList(cameraList) {
        const list = cameraList.map((camera, idx) => (
            <div key = {idx}>
                <Button onClick = {this.handleCameraItemClick.bind(this, idx)}>
                    {camera.name}
                </Button>
                <br />
            </div>
        ));

        return list;
    }

    render() {
        const { l } = this.context.i18n;

        const {
            isAdding,
            isLoading,
            curCameraIdx,
            cameraList,
            streamView,
            onAdding,
            addNewCamera,
            newStreamView
        } = this.props;

        return (
            <div className = 'CamerasPage'>
                <Loading show = {isLoading} />

                <div className = 'CamerasPage__content'>
                    {(() => {
                        if (isAdding) {
                            return (
                                <AddCamera
                                    streamView = {streamView}
                                    addNewCamera = {addNewCamera}
                                    newStreamView = {newStreamView}
                                />
                            );
                        }

                        if (cameraList.length === 0) {
                            return <h1>Add your first camera</h1>;
                        }

                        return this.renderCameraView(cameraList[curCameraIdx], streamView);
                    })()}
                </div>

                <div className = 'CamerasPage__sidebar'>
                    {this.renderCameraList(cameraList)}
                    <br />
                    {
                        cameraList.length < config.camerasLimit &&
                        <Button
                            colored
                            ripple
                            onClick = {onAdding}
                        >
                            {l('+ Add Camera')}
                        </Button>
                    }
                </div>
            </div>
        );
    }
}
