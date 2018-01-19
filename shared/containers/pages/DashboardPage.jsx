import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux';

import { loadCameras } from '../../actions/cameras';
import { searchEvents } from '../../actions/events';
import connectDataFetchers from '../../lib/connectDataFetchers.jsx';

import DashboardPage from '../../components/pages/DashboardPage.jsx';

class DashboardPageContainer extends Component {
    static propTypes = {
        isLoading: PropTypes.bool,
        eventList: PropTypes.arrayOf(PropTypes.object),
        cameraList: PropTypes.arrayOf(PropTypes.object),
        dispatch: PropTypes.func
    };

    searchEvents = ({ query }) => {
        this.props.dispatch(searchEvents({ query }));
    }

    render() {
        return (
            <DashboardPage
                {...this.props}
                searchEvents = {this.searchEvents}
            />
        );
    }
}

function mapStateToProps({ events, cameras }) {
    const {
        isLoading: isSearchingEvents,
        eventList
    } = events;
    const {
        isLoading: isLoadingCameras,
        cameraList
    } = cameras;

    return {
        isLoading: isSearchingEvents || isLoadingCameras,
        eventList,
        cameraList
    };
}
export default connect(mapStateToProps)(
    connectDataFetchers(DashboardPageContainer, [loadCameras, searchEvents])
);
