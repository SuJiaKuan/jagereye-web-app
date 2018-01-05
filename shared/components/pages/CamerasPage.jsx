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

    reorderRegion(region) {
        return [ {
            x: Math.min(region[0].x, region[1].x),
            y: Math.min(region[0].y, region[1].y)
        }, {
            x: Math.max(region[0].x, region[1].x),
            y: Math.max(region[0].y, region[1].y)
        } ];
    }

    renderCameraView(camera) {
        const region = this.reorderRegion(camera.region);
        const regionX = region[0].x;
        const regionY = region[0].y;
        const regionWidth = region[1].x - region[0].x;
        const regionHeight = region[1].y - region[0].y;
        const regionStyle = {
            'position': 'absolute',
            'width': regionWidth,
            'height': regionHeight,
            'left': regionX,
            'top': regionY,
            'background-color': 'rgba(55,84,148, 0.5)'
        };

        return (
            <div>
                <h3>{camera.name}</h3>
                <div style = {{ position: 'relative' }}>
                    <div style = {regionStyle} />
                    <img
                        src    = {camera.url}
                        width  = '960'
                        height = '540'
                    />
                </div>
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
                    <h5 className = 'CamerasPage__logo'>JagerEye</h5>
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
