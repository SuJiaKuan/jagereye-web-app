import React, { Component, PropTypes } from 'react';
import { DataTable, TableHeader }      from 'react-mdl';
import join                            from 'lodash/join';
import map                             from 'lodash/map';

import Loading from '../Loading.jsx';
import Dialog  from '../Dialog.jsx';

import './DashboardPage.less';

export default class DashboardPage extends Component {
    static propTypes = {
        isLoading      : PropTypes.bool,
        tripwireEvents : PropTypes.arrayOf(PropTypes.object)
    };

    static contextTypes = { i18n: React.PropTypes.object };

    state = {
        videoUrl: ''
    };

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

    renderTripwireEvents(tripwireEvents) {
        const { l } = this.context.i18n;

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
            </div>
        );
    }

    render() {
        const { l } = this.context.i18n;

        const {
            isLoading,
            tripwireEvents
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
                    if (tripwireEvents.length === 0) {
                        return <h1>{l('No events yet :)')}</h1>;
                    }

                    return this.renderTripwireEvents(tripwireEvents);
                })()}
            </div>

        );
    }
}
