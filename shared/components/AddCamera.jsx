import React, { Component, PropTypes } from 'react';
import clone from 'lodash/clone';
import fill from 'lodash/fill';
import filter from 'lodash/filter';
import map from 'lodash/map';

import Button from 'react-mdl/lib/Button';

import './AddCamera.less';

const FORM_STEP = {
    NEW: 'NEW',
    CONFIG: 'CONFIG'
};

const TRIGGERS = [
    'person',
    'dog',
    'car'
];

export default class AddCamera extends Component {
    static propTypes = {
        addNewCamera : PropTypes.func
    };

    static contextTypes = { i18n: PropTypes.object };

    state = {
        name: '',
        url: '',
        region: [ {
            x: 0,
            y: 0
        }, {
            x: 0,
            y: 0
        } ],
        triggersChecked: fill(new Array(TRIGGERS.length), false),
        step: FORM_STEP.NEW,
        isDrawing: false
    }

    componentDidUpdate(prevProps, prevState) {
        const prevStep = prevState.step;
        const curStep = this.state.step;

        if (prevStep === FORM_STEP.NEW && curStep === FORM_STEP.CONFIG) {
            const ctx = this.canvas.getContext('2d');

            this.canvasImg = new Image();
            this.canvasImg.onload = () => {
                this.canvasTimer = setInterval(() => {
                    const region = this.reoderRegion(this.state.region);
                    const x = region[0].x;
                    const y = region[0].y;
                    const width = region[1].x - x;
                    const height = region[1].y - y;

                    ctx.drawImage(
                        this.canvasImg,
                        0,
                        0,
                        this.canvas.width,
                        this.canvas.height
                    );
                    ctx.fillStyle = '#375494';
                    ctx.globalAlpha = 0.5;
                    ctx.fillRect(x, y, width, height);
                    ctx.globalAlpha = 1;
                }, 50);
            };
            this.canvasImg.src = this.state.url;
        } else if (prevStep === FORM_STEP.CONFIG && curStep === FORM_STEP.NEW) {
            clearInterval(this.canvasTimer);
        }
    }

    componentWillUnmount() {
        clearInterval(this.canvasTimer);
    }

    handleCanvasMouseDown = (e) => {
        const position = this.getMousePosition(this.canvas, e);

        this.setState({
            region: [position, position],
            isDrawing: true
        });
    }

    handleCanvasMouseMove = (e) => {
        const { isDrawing, region } = this.state;

        if (isDrawing) {
            const position = this.getMousePosition(this.canvas, e);

            this.setState({
                region: [region[0], position]
            });
        }
    }

    handleCanvasMouseUp = () => {
        this.setState({
            isDrawing: false
        });
    }

    handleNameChange = (e) => {
        this.setState({
            name: e.target.value
        });
    }

    handleUrlChange = (e) => {
        this.setState({
            url: e.target.value
        });
    }

    handleNextBtnClick = (e) => {
        e.preventDefault();

        this.setState({
            step: FORM_STEP.CONFIG
        });
    }

    handlePreviousBtnClick = (e) => {
        e.preventDefault();

        this.setState({
            step: FORM_STEP.NEW
        });
    }

    handleFinishBtnClick = (e) => {
        e.preventDefault();

        const { name, url, region, triggersChecked } = this.state;
        const triggers = filter(TRIGGERS, (trigger, idx) => (
            triggersChecked[idx]
        ));
        const reoderedRegion = this.reoderRegion(region);
        const ratioX = this.canvasImg.width / this.canvas.width;
        const ratioY = this.canvasImg.height / this.canvas.height;
        const scaledRegion = [ {
            x: Math.round(reoderedRegion[0].x * ratioX),
            y: Math.round(reoderedRegion[0].y * ratioY)
        }, {
            x: Math.round(reoderedRegion[1].x * ratioX),
            y: Math.round(reoderedRegion[1].y * ratioY)
        } ];

        this.props.addNewCamera({
            name,
            url,
            region: scaledRegion,
            triggers
        });
    }

    handleTriggersChange = (idx) => {
        const newTriggersChecked = clone(this.state.triggersChecked);

        newTriggersChecked[idx] = !newTriggersChecked[idx];
        this.setState({
            triggersChecked: newTriggersChecked
        });
    }

    getMousePosition(obj, e) {
        let elX = 0;
        let elY = 0;
        let _obj = obj;

        if (_obj.offsetParent) {
            do {
                elX += _obj.offsetLeft;
                elY += _obj.offsetTop;
                _obj = _obj.offsetParent;
            } while (_obj);
        }

        return {
            x: e.pageX - elX,
            y: e.pageY - elY
        };
    }

    reoderRegion(region) {
        return [ {
            x: Math.min(region[0].x, region[1].x),
            y: Math.min(region[0].y, region[1].y)
        }, {
            x: Math.max(region[0].x, region[1].x),
            y: Math.max(region[0].y, region[1].y)
        } ];
    }

    renderForm = () => {
        const { l } = this.context.i18n;

        const { name, url, triggersChecked, step } = this.state;

        if (step === FORM_STEP.NEW) {
            return (
                <form>
                    <label>
                        {l('Name')}
                        <input
                            type     = 'text'
                            value    = {name}
                            onChange = {this.handleNameChange}
                        />
                    </label>
                    <br />
                    <label>
                        {l('URL')}
                        <input
                            type     = 'text'
                            value    = {url}
                            onChange = {this.handleUrlChange}
                        />
                    </label>
                    <br />
                    <Button
                        colored
                        ripple
                        onClick = {this.handleNextBtnClick}
                    >
                        {l('Next')}
                    </Button>
                </form>
            );
        } else if (step === FORM_STEP.CONFIG) {
            const triggerCheckBoxes = map(TRIGGERS, (trigger, idx) => (
                <label key = {trigger}>
                    {trigger}
                    <input
                        name     = {l(trigger)}
                        type     = 'checkbox'
                        checked    = {triggersChecked[idx]}
                        onChange = {this.handleTriggersChange.bind(this, idx)}
                    />
                </label>
            ));

            return (
                <form>
                    <canvas
                        ref         = {canvas => this.canvas = canvas}
                        width       = '960'
                        height      = '540'
                        onMouseDown = {this.handleCanvasMouseDown}
                        onMouseMove = {this.handleCanvasMouseMove}
                        onMouseUp   = {this.handleCanvasMouseUp}
                    />
                    <br />
                    <label>{l('Triggers:')}</label>
                    <br />
                    {triggerCheckBoxes}
                    <br />
                    <Button
                        colored
                        ripple
                        onClick = {this.handlePreviousBtnClick}
                    >
                        {l('Previous')}
                    </Button>
                    <Button
                        colored
                        ripple
                        onClick = {this.handleFinishBtnClick}
                    >
                        {l('Finish')}
                    </Button>
                </form>
            );
        }

        return (
            <form />
        );
    }

    render() {
        return (
            <div className='AddCamera'>
                {this.renderForm()}
            </div>
        );
    }
}
