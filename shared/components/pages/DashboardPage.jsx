import React, { Component, PropTypes }    from 'react';
import SelectField                        from 'react-material-select';
import DatePicker                         from 'react-datepicker';
import { DataTable, TableHeader, Button, Grid, Cell } from 'react-mdl';

import moment from 'moment';
import concat from 'lodash/concat';
import filter from 'lodash/filter';
import find from 'lodash/find';
import join from 'lodash/join';
import map from 'lodash/map';

import readableTime from '../../lib/readableTime';

import Loading from '../Loading.jsx';
import Dialog  from '../Dialog.jsx';

import 'react-material-select/lib/css/reactMaterialSelect.css';
import 'react-datepicker/dist/react-datepicker.css';
import './DashboardPage.less';

const ALL_CAMERAS = {
    _id: 'all',
    name: 'all'
};

export default class DashboardPage extends Component {
    static propTypes = {
        isLoading: PropTypes.bool,
        eventList: PropTypes.arrayOf(PropTypes.object),
        cameraList: PropTypes.arrayOf(PropTypes.object),
        searchEvents: PropTypes.func
    };

    static contextTypes = { i18n: React.PropTypes.object };

    state = {
        searchCamera: ALL_CAMERAS._id,
        startDate: moment(),
        endDate: moment(),
        videoUrl: ''
    };

    handleSearchCameraChange = (selected) => {
        this.setState({
            searchCamera: selected.value
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

    handleSearchBtnClick = (e) => {
        e.preventDefault();

        const {
            startDate,
            endDate,
            searchCamera
        } = this.state;

        const start = startDate.hours(0).minutes(0).seconds(0).unix();
        const end = endDate.hours(23).minutes(59).seconds(59).unix();
        const query = {
            timestamp: {
                start,
                end
            }
        };

        if (searchCamera !== ALL_CAMERAS._id) {
            query.analyzers = [ searchCamera ];
        }

        this.props.searchEvents({ query });
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

    renderTripwireEvents(tripwireEventList, cameraList) {
        const { l } = this.context.i18n;

        const {
            startDate,
            endDate
        } = this.state;

        const searchCameras = map(concat([ ALL_CAMERAS ], cameraList), (camera) => (
            <option dataValue = {camera._id}>{l(camera.name)}</option>
        ));

        const data = map(tripwireEventList, (tripwireEvent) => {
            const previewStyle = {
                background: `url(/shared/${tripwireEvent.content.thumbnail_name}) center / cover`
            };
            const preview = (
                <div
                    className = 'DashboardPage__events__preview'
                    style     = {previewStyle}
                    onClick   = {this.handlePreviewClicked.bind(this, `/shared/${tripwireEvent.content.video_name}`)}
                />
            );
            const time = readableTime(tripwireEvent.timestamp, false);
            const triggered = join(tripwireEvent.content.triggered, ', ');
            const camera = find(cameraList, {
                _id: tripwireEvent.analyzerId
            });
            const cameraName = camera ? camera.name : l('Unknown');

            return {
                preview,
                time,
                camera: cameraName,
                triggered
            };
        });

        return (
            <div className = 'DashboardPage__events'>
                <Grid className = 'DashboardPage__search demo-grid-ruler'>
                    <Cell col = {3}>
                        <SelectField
                            label        = {l('Camera')}
                            defaultValue = {ALL_CAMERAS._id}
                            resetLabel   = {false}
                            onChange     = {this.handleSearchCameraChange}
                        >
                            {searchCameras}
                        </SelectField>
                    </Cell>
                    <Cell
                        col = {4}
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
                        col = {4}
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
                    <Cell
                        col = {1}
                        align = 'middle'
                    >
                        <Button
                            raised
                            colored
                            onClick = {this.handleSearchBtnClick}
                        >
                            {l('Search')}
                        </Button>
                    </Cell>
                </Grid>

                <h5>{l('Tripwire Events')}</h5>

                {(() => {
                    if (tripwireEventList.length === 0) {
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
                            <TableHeader name = 'triggered'>{l('Triggered')}</TableHeader>
                        </DataTable>
                    );
                })()}
            </div>
        );
    }

    render() {
        const {
            isLoading,
            eventList,
            cameraList
        } = this.props;

        const tripwireEventList = filter(eventList, {
            type: 'tripwire_alert'
        });

        const { videoUrl } = this.state;

        return (
            <div className = 'DashboardPage'>
                <Loading show = {isLoading} />

                <Dialog
                    isOpen = {videoUrl !== ''}
                    onRequestClose = {this.handleVideoDialogClose}
                >
                    <video
                        className = 'DashboardPage__dialog__video'
                        src = {videoUrl}
                        controls
                        autoPlay
                        loop
                    />
                </Dialog>

                {(() => {
                    return this.renderTripwireEvents(tripwireEventList, cameraList);
                })()}
            </div>

        );
    }
}
