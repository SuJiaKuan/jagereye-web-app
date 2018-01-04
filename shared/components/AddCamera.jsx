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
        triggersChecked: fill(new Array(TRIGGERS.length), false),
        step: FORM_STEP.NEW
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

        const { name, url, triggersChecked } = this.state;
        const triggers = filter(TRIGGERS, (trigger, idx) => (
            triggersChecked[idx]
        ));

        this.props.addNewCamera({
            name,
            url,
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
