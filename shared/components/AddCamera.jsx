import React, { Component, PropTypes } from 'react';
import { Textfield } from 'react-mdl';

import Button from 'react-mdl/lib/Button';

import './AddCamera.less';

const FORM_STEP = {
    NEW: 'NEW',
    CONFIG: 'CONFIG'
};

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
        step: FORM_STEP.NEW
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
                    ctx.drawImage(
                        this.canvasImg,
                        0,
                        0,
                        this.canvas.width,
                        this.canvas.height
                    );
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

        const { name, url } = this.state;

        this.props.addNewCamera({
            name,
            url
        });
    }

    renderForm = () => {
        const { l } = this.context.i18n;

        const { streamView } = this.props;
        const {
            name,
            url,
            step
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
            const finishBtnDisabled = !streamView.isAvailable;

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
                            />
                        );
                    })()}
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
