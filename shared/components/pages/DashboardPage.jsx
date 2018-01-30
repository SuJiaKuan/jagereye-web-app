import React, { Component, PropTypes }    from 'react';
import SelectField                        from 'react-material-select';
import DatePicker                         from 'react-datepicker';
import { DataTable, TableHeader, Button, Grid, Cell } from 'react-mdl';

import fetch from 'isomorphic-fetch';
import fileSaver from 'file-saver';
import JSZip from 'jszip';
import moment from 'moment';
import concat from 'lodash/concat';
import filter from 'lodash/filter';
import find from 'lodash/find';
import join from 'lodash/join';
import map from 'lodash/map';
import slice from 'lodash/slice';

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

const MIN_NUM_SHOWN_EVENTS = 5;
const MORE_SHOWN_EVENTS_STEP = 5;

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
        startDate: moment().subtract(3, 'days'),
        endDate: moment(),
        previewEvent: null,
        numShownEvents: MIN_NUM_SHOWN_EVENTS
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

        this.setState({
            numShownEvents: MIN_NUM_SHOWN_EVENTS
        });

        this.props.searchEvents({ query });
    }

    handlePreviewClicked = (previewEvent) => {
        this.setState({
            previewEvent
        });
    }

    handleVideoDialogClose = () => {
        this.setState({
            previewEvent: null
        });
    }

    handleDownloadBtnClick = (videoUrl, metadataUrl) => {
        const videoFileName = videoUrl.replace(/^.*[\\\/]/, '');
        const metadataFileName = metadataUrl.replace(/^.*[\\\/]/, '');
        const zipFileName = metadataFileName.replace('.json', '.zip');
        const zip = new JSZip();

        fetch(videoUrl, {
            headers: {
                Accept: 'video/mp4'
            }
        }).then((res) => {
            if (res.status >= 400) {
                throw new Error(res);
            }

            return res.arrayBuffer();
        }).then((videoFile) => {
            zip.file(videoFileName, videoFile);

            return fetch(metadataUrl, {
                headers: {
                    Accept: 'application/json'
                }
            });
        }).then((res) => {
            if (res.status >= 400) {
                throw new Error(res);
            }

            return res.arrayBuffer();
        }).then((metadataFile) => {
            zip.file(metadataFileName, metadataFile);

            return zip.generateAsync({
                type: 'blob'
            });
        }).then((zipFile) => {
            fileSaver.saveAs(zipFile, zipFileName);
        }).catch((error) => {
            // TODO: Error handling.
            console.error(error);
        });
    }

    handleMoreBtnClick = () => {
        this.setState({
            numShownEvents: this.state.numShownEvents + MORE_SHOWN_EVENTS_STEP
        });
    }

    readableDate(date) {
        return date.format('MM/DD/YYYY');
    }

    renderTripwireEvents(tripwireEventList, cameraList) {
        const { l } = this.context.i18n;

        const {
            startDate,
            endDate,
            searchCamera,
            numShownEvents
        } = this.state;

        const searchCameras = map(concat([ ALL_CAMERAS ], cameraList), (camera) => (
            <option dataValue = {camera._id}>{l(camera.name)}</option>
        ));

        const shownTripwireEventList = slice(tripwireEventList, 0, numShownEvents);
        const data = map(shownTripwireEventList, (tripwireEvent) => {
            const previewStyle = {
                background: `url(/shared/${tripwireEvent.content.thumbnail_name}) center / cover`
            };
            const preview = (
                <div
                    className = 'DashboardPage__events__preview'
                    style     = {previewStyle}
                    onClick   = {this.handlePreviewClicked.bind(this, tripwireEvent)}
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
                        const searchCameraName =
                            searchCamera === ALL_CAMERAS._id ?
                            ALL_CAMERAS.name :
                            find(cameraList, { _id: searchCamera }).name;

                        return (
                            <div>
                                <h6>{l('No events for following search')}</h6>
                                <div>{`Camera: ${searchCameraName}`}</div>
                                <div>{`Date: ${this.readableDate(startDate)} to ${this.readableDate(endDate)}`}</div>
                            </div>
                        );
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
                {
                    numShownEvents < tripwireEventList.length &&
                    <div className = 'DashboardPage__events__more__wrapper'>
                        <img
                            className = 'DashboardPage__events__more'
                            src = '/static/images/load-more-btn.svg'
                            width = '40'
                            height = '40'
                            onClick = {this.handleMoreBtnClick}
                        />
                    </div>
                }
            </div>
        );
    }

    render() {
        const { l } = this.context.i18n;

        const {
            isLoading,
            eventList,
            cameraList
        } = this.props;

        const tripwireEventList = filter(eventList, {
            type: 'tripwire_alert'
        });

        const { previewEvent } = this.state;

        return (
            <div className = 'DashboardPage'>
                <Loading show = {isLoading} />

                {(() => {
                    if (!previewEvent) {
                        return null;
                    }

                    const videoUrl = `/shared/${previewEvent.content.video_name}`;
                    const metadataUrl = `/shared/${previewEvent.content.metadata_name}`;

                    return (
                        <Dialog
                            isOpen = {previewEvent !== null}
                            onRequestClose = {this.handleVideoDialogClose}
                        >
                            <video
                                className = 'DashboardPage__dialog__video'
                                src = {videoUrl}
                                controls
                                autoPlay
                                loop
                            />
                            <Button
                                raised
                                colored
                                onClick = {this.handleDownloadBtnClick.bind(this, videoUrl, metadataUrl)}
                            >
                                {l('Download')}
                            </Button>
                        </Dialog>
                    );
                })()}

                {(() => {
                    return this.renderTripwireEvents(tripwireEventList, cameraList);
                })()}
            </div>

        );
    }
}
