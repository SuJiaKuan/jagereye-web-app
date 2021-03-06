import React, { Component, PropTypes } from 'react';
import { Checkbox, Textfield, Grid, Cell } from 'react-mdl';
import clone from 'lodash/clone';
import includes from 'lodash/includes';
import fill from 'lodash/fill';
import filter from 'lodash/filter';
import isEqual from 'lodash/isEqual';
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
        streamView: PropTypes.object,
        addNewCamera : PropTypes.func,
        newStreamView: PropTypes.func
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
        const {
            url,
            step: curStep
        } = this.state;
        const {
            newStreamView,
            streamView: curStreamView
        } = this.props;
        const { streamView: prevStreamView } = prevProps;

        if (prevStep === FORM_STEP.NEW && curStep === FORM_STEP.CONFIG) {
            newStreamView(url);
        } else if (curStep === FORM_STEP.CONFIG
                   && !prevStreamView.isAvailable
                   && curStreamView.isAvailable) {
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
            this.canvasImg.src = `${curStreamView.url}?${new Date().getTime()}`;
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

        const { streamView } = this.props;
        const {
            name,
            url,
            region,
            triggersChecked,
            step,
            isDrawing
        } = this.state;

        if (step === FORM_STEP.NEW) {
            const nextBtnDisabled = !name || !url;

            return (
                <form>
                    <Textfield
                        label    = {l('Name')}
                        value    = {name}
                        onChange = {this.handleNameChange}
                    />
                    <br />
                    <Textfield
                        label    = {l('URL')}
                        value    = {url}
                        onChange = {this.handleUrlChange}
                    />
                    <br />
                    <Button
                        disabled = {nextBtnDisabled}
                        colored
                        ripple
                        onClick = {this.handleNextBtnClick}
                        style   = {{ float: 'right' }}
                    >
                        {l('Next')}
                    </Button>
                </form>
            );
        } else if (step === FORM_STEP.CONFIG) {
            const triggerCheckBoxes = map(TRIGGERS, (trigger, idx) => (
                <Cell
                    key = {trigger}
                    col = {4}
                >
                    <Checkbox
                        label    = {l(trigger)}
                        checked  = {triggersChecked[idx]}
                        onChange = {this.handleTriggersChange.bind(this, idx)}
                    />
                </Cell>
            ));
            const finishBtnDisabled =
                !streamView.isAvailable ||
                !includes(triggersChecked, true) ||
                isEqual(region, [ {
                    x: 0,
                    y: 0
                }, {
                    x: 0,
                    y: 0
                } ]);

            return (
                <form>
                    {(() => {
                        if (!streamView.isAvailable) {
                            return (
                                <img
                                    src = '/static/images/loading-default-black.svg'
                                    width = '700'
                                    height = '394'
                                />
                            );
                        }

                        return (
                            <canvas
                                ref         = {canvas => this.canvas = canvas}
                                width       = '700'
                                height      = '394'
                                style       = {{ cursor: isDrawing ? 'nwse-resize' : 'crosshair' }}
                                onMouseDown = {this.handleCanvasMouseDown}
                                onMouseMove = {this.handleCanvasMouseMove}
                                onMouseUp   = {this.handleCanvasMouseUp}
                            />
                        );
                    })()}
                    <br />
                    <Grid>
                        {triggerCheckBoxes}
                    </Grid>
                    <br />
                    <Button
                        colored
                        ripple
                        onClick = {this.handlePreviousBtnClick}
                        style   = {{ float: 'left' }}
                    >
                        {l('Previous')}
                    </Button>
                    <Button
                        colored
                        ripple
                        disabled = {finishBtnDisabled}
                        onClick = {this.handleFinishBtnClick}
                        style = {{ float: 'right' }}
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
