import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux';

import { loadCameras } from '../../actions/cameras';
import {
    searchEvents,
    changePreviewEvent
} from '../../actions/events';
import connectDataFetchers from '../../lib/connectDataFetchers.jsx';

import DashboardPage from '../../components/pages/DashboardPage.jsx';

class DashboardPageContainer extends Component {
    static propTypes = {
        isLoading: PropTypes.bool,
        eventList: PropTypes.arrayOf(PropTypes.object),
        cameraList: PropTypes.arrayOf(PropTypes.object),
        previewEvent: PropTypes.object,
        previewEventMetadata: PropTypes.object,
        dispatch: PropTypes.func
    };

    searchEvents = ({ query }) => {
        this.props.dispatch(searchEvents({ query }));
    }

    changePreviewEvent = (previewEvent) => {
        this.props.dispatch(changePreviewEvent(previewEvent));
    }

    render() {
        return (
            <DashboardPage
                {...this.props}
                searchEvents = {this.searchEvents}
                changePreviewEvent = {this.changePreviewEvent}
            />
        );
    }
}

function mapStateToProps({ events, cameras }) {
    const {
        isLoading: isSearchingEvents,
        eventList,
        previewEvent,
        previewEventMetadata
    } = events;
    const {
        isLoading: isLoadingCameras,
        cameraList
    } = cameras;

    return {
        isLoading: isSearchingEvents || isLoadingCameras,
        eventList,
        cameraList,
        previewEvent,
        previewEventMetadata
    };
}
export default connect(mapStateToProps)(
    connectDataFetchers(DashboardPageContainer, [loadCameras, searchEvents])
);
