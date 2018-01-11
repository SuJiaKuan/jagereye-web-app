import React, { Component, PropTypes }    from 'react';
import SelectField                        from 'react-material-select';
import DatePicker                         from 'react-datepicker';
import { DataTable, TableHeader, Button, Grid, Cell } from 'react-mdl';

import moment from 'moment';
import concat from 'lodash/concat';
import join   from 'lodash/join';
import map    from 'lodash/map';

import Loading from '../Loading.jsx';
import Dialog  from '../Dialog.jsx';

import { TRIGGERS } from '../../const';

import 'react-material-select/lib/css/reactMaterialSelect.css';
import 'react-datepicker/dist/react-datepicker.css';
import './DashboardPage.less';

const ALL = 'all';

export default class DashboardPage extends Component {
    static propTypes = {
        isLoading      : PropTypes.bool,
        tripwireEvents : PropTypes.arrayOf(PropTypes.object),
        cameraList : PropTypes.arrayOf(PropTypes.object)
    };

    static contextTypes = { i18n: React.PropTypes.object };

    state = {
        searchType: ALL,
        searchCamera: ALL,
        startDate: moment(),
        endDate: moment(),
        videoUrl: ''
    };

    handleSearchTypeChange = (selected) => {
        this.setState({
            searchType: selected.label
        });
    }

    handleSearchCameraChange = (selected) => {
        this.setState({
            searchCamera: selected.label
        });
    }

    handleStartDateChange = (date) => {
        this.setState({
            startDate: date
        });
    }

    handleEndDateChange = (date) => {
        this.setState({
            endDate: date
        });
    }

    handleSearchBtnClick = () => {
        // TODO(JiaKuan Su): Implementation.
    }

    handlePreviewClicked = (videoUrl) => {
        this.setState({
            videoUrl
        });
    }

    handleVideoDialogClose = () => {
        this.setState({
            videoUrl: ''
        });
    }

    renderTripwireEvents(tripwireEvents, cameraList) {
        const { l } = this.context.i18n;

        const {
            startDate,
            endDate
        } = this.state;

        const searchTypes = map(concat([ ALL ], TRIGGERS), (trigger) => (
            <option dataValue = {trigger}>{l(trigger)}</option>
        ));
        const cameraNames = map(cameraList, (camera) => camera.name);
        const searchCameras = map(concat([ ALL ], cameraNames), (name) => (
            <option dataValue = {name}>{l(name)}</option>
        ));

        const data = map(tripwireEvents, (tripwireEvent) => {
            const previewStyle = {
                background: `url(${tripwireEvent.preview}) center / cover`
            };
            const preview = (
                <div
                    className = 'DashboardPage__events__preview'
                    style     = {previewStyle}
                    onClick   = {this.handlePreviewClicked.bind(this, tripwireEvent.video)}
                />
            );
            const time = tripwireEvent.timestamp.split('.')[0];
            const types = join(tripwireEvent.triggered, ', ');
            const camera = tripwireEvent.name;

            return {
                preview,
                time,
                camera,
                types
            };
        });

        return (
            <div className = 'DashboardPage__events'>
                <h3>{l('Tripwire Events')}</h3>

                <Grid className = 'DashboardPage__search demo-grid-ruler'>
                    <Cell col = {6}>
                        <SelectField
                            label        = {l('Type')}
                            defaultValue = {ALL}
                            resetLabel   = {false}
                            onChange     = {this.handleSearchTypeChange}
                        >
                            {searchTypes}
                        </SelectField>
                    </Cell>
                    <Cell col = {6}>
                        <SelectField
                            label        = {l('Camera')}
                            defaultValue = {ALL}
                            resetLabel   = {false}
                            onChange     = {this.handleSearchCameraChange}
                        >
                            {searchCameras}
                        </SelectField>
                    </Cell>
                    <Cell
                        col = {5}
                        align = 'middle'
                    >
                        <div className = 'DashboardPage__search__date'>
                            <span>{l('From')}</span>
                            <DatePicker
                                selected = {startDate}
                                onChange = {this.handleStartDateChange}
                            />
                        </div>
                    </Cell>
                    <Cell
                        col = {5}
                        align = 'middle'
                    >
                        <div className = 'DashboardPage__search__date'>
                            <span>{l('To')}</span>
                            <DatePicker
                                selected = {endDate}
                                onChange = {this.handleEndDateChange}
                            />
                        </div>
                    </Cell>
                    <Cell col = {2}>
                        <Button
                            raised
                            colored
                            onClick = {this.handleSearchBtnClick}
                        >
                            {l('Search')}
                        </Button>
                    </Cell>
                </Grid>

                {(() => {
                    if (tripwireEvents.length === 0) {
                        return <h1>{l('No events yet :)')}</h1>;
                    }

                    return (
                        <DataTable
                            shadow = {0}
                            rows   = {data}
                            onSelectionChanged = {this.handleSelectionChanged}
                        >
                            <TableHeader name = 'preview'>{l('Preview')}</TableHeader>
                            <TableHeader name = 'time'>{l('Time')}</TableHeader>
                            <TableHeader name = 'camera'>{l('Camera')}</TableHeader>
                            <TableHeader name = 'types'>{l('Types')}</TableHeader>
                        </DataTable>
                    );
                })()}
            </div>
        );
    }

    render() {
        const {
            isLoading,
            tripwireEvents,
            cameraList
        } = this.props;

        const { videoUrl } = this.state;

        return (
            <div className = 'DashboardPage'>
                <Loading show = {isLoading} />

                <Dialog
                    isOpen = {videoUrl !== ''}
                    onRequestClose = {this.handleVideoDialogClose}
                >
                    <video
                        src = {videoUrl}
                        controls
                        autoPlay
                        loop
                    />
                </Dialog>

                {(() => {
                    return this.renderTripwireEvents(tripwireEvents, cameraList);
                })()}
            </div>

        );
    }
}
