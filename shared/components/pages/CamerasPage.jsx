import React, { Component, PropTypes } from 'react';

import { Button } from 'react-mdl';

import AddCamera from '../AddCamera.jsx';
import Loading from '../Loading.jsx';

import './CamerasPage.less';

const SHOWN_CONTENT = {
    VIEW: 'VIEW',
    ADD: 'ADD'
};

export default class CamerasPage extends Component {
    static propTypes = {
        isAdding   : PropTypes.bool,
        isLoading    : PropTypes.bool,
        cameraList   : PropTypes.arrayOf(PropTypes.object),
        onAdding     : PropTypes.func,
        onStopAdding : PropTypes.func,
        addNewCamera : PropTypes.func
    };

    static contextTypes = { i18n: React.PropTypes.object };

    state = {
        shownContent : SHOWN_CONTENT.VIEW,
        curCameraIdx : 0
    };

    handleCameraItemClick = (idx) => {
        this.setState({
            shownContent: SHOWN_CONTENT.VIEW,
            curCameraIdx: idx
        });
        this.props.onStopAdding();
    }

    renderCameraView(camera) {
        return (
            <div>
                <h3>{camera.name}</h3>
                <img
                    src    = {camera.url}
                    width  = '800'
                    height = '600'
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
            cameraList,
            onAdding,
            addNewCamera
        } = this.props;

        const { curCameraIdx } = this.state;

        return (
            <div className = 'CamerasPage'>
                <Loading show = {isLoading} />

                <div className = 'CamerasPage__content'>
                    {(() => {
                        if (isAdding) {
                            return <AddCamera addNewCamera = {addNewCamera} />;
                        }

                        if (cameraList.length === 0) {
                            return <h1>Add your first camera</h1>;
                        }

                        return this.renderCameraView(cameraList[curCameraIdx]);
                    })()}
                </div>

                <div className = 'CamerasPage__sidebar'>
                    {this.renderCameraList(cameraList)}
                    <br />
                    <Button
                        colored
                        ripple
                        onClick = {onAdding}
                    >
                        {l('+ Add Camera')}
                    </Button>
                </div>
            </div>
        );
    }
}
