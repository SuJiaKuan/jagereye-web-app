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

const TRIPWIRE_NORMAL_COLOR = 'rgba(59, 137, 226, 0.5)';
const TRIPWIRE_ALERT_COLOR = 'rgba(244, 194, 66, 0.5)';

export default class DashboardPage extends Component {
    static propTypes = {
        isLoading: PropTypes.bool,
        eventList: PropTypes.arrayOf(PropTypes.object),
        cameraList: PropTypes.arrayOf(PropTypes.object),
        previewEvent: PropTypes.object,
        previewEventMetadata: PropTypes.object,
        searchEvents: PropTypes.func,
        changePreviewEvent: PropTypes.func
    };

    static contextTypes = { i18n: React.PropTypes.object };

    state = {
        searchCamera: ALL_CAMERAS._id,
        startDate: moment().subtract(3, 'days'),
        endDate: moment(),
        numShownEvents: MIN_NUM_SHOWN_EVENTS,
        tripwireColor: TRIPWIRE_NORMAL_COLOR,
        videoRatio: 0
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
        this.props.changePreviewEvent(previewEvent);
    }

    handleVideoDialogClose = () => {
        this.props.changePreviewEvent(null);
        this.setState({
            tripwireColor: TRIPWIRE_NORMAL_COLOR,
            videoRatio: 0
        });
    }

    handleVideoLoadedMetadata = () => {
        this.setState({
            videoRatio: this.video.clientWidth / this.video.videoWidth
        });
    }

    handleVideoTimeUpdate = () => {
        const { frames } = this.props.previewEventMetadata;
        const index =
            parseInt((this.video.currentTime / this.video.duration) * frames.length, 10);
        const { mode } = frames[index];
        const tripwireColor = mode > 0 ? TRIPWIRE_ALERT_COLOR : TRIPWIRE_NORMAL_COLOR;

        this.setState({
            tripwireColor
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
                background: `url(/jager-store/${tripwireEvent.content.thumbnail}) center / cover`
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
            cameraList,
            previewEvent,
            previewEventMetadata
        } = this.props;

        const {
            tripwireColor,
            videoRatio
        } = this.state;

        const tripwireEventList = filter(eventList, {
            type: 'tripwire_alert'
        });

        return (
            <div className = 'DashboardPage'>
                <Loading show = {isLoading} />

                {(() => {
                    if (!previewEvent) {
                        return null;
                    }

                    const videoUrl = `/jager-store/${previewEvent.content.video}`;
                    const metadataUrl = `/jager-store/${previewEvent.content.metadata}`;

                    const { region } = previewEventMetadata.custom;

                    const relativeRegion = [ {
                        x: parseInt(region[0] * videoRatio, 10),
                        y: parseInt(region[1] * videoRatio, 10)
                    }, {
                        x: parseInt(region[2] * videoRatio, 10),
                        y: parseInt(region[3] * videoRatio, 10)
                    } ];
                    const regionWidth = relativeRegion[1].x - relativeRegion[0].x;
                    const regionHeight = relativeRegion[1].y - relativeRegion[0].y;

                    const tripwireStyle = {
                        left: `${relativeRegion[0].x}px`,
                        top: `${relativeRegion[0].y}px`,
                        width: `${regionWidth}px`,
                        height: `${regionHeight}px`,
                        backgroundColor: tripwireColor
                    };

                    return (
                        <Dialog
                            isOpen = {previewEvent !== null}
                            onRequestClose = {this.handleVideoDialogClose}
                        >
                            <div className = 'DashboardPage__dialog__video__wrapper'>
                                <video
                                    ref = {video => this.video = video}
                                    className = 'DashboardPage__dialog__video'
                                    src = {videoUrl}
                                    controls
                                    autoPlay
                                    loop
                                    onLoadedMetadata = {this.handleVideoLoadedMetadata}
                                    onTimeUpdate = {this.handleVideoTimeUpdate}
                                />
                                <div
                                    className = 'DashboardPage__dialog__video__tripwire'
                                    style = {tripwireStyle}
                                />
                            </div>
                            <p />
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
