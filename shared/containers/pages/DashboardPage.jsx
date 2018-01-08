import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux';

import connectDataFetchers from '../../lib/connectDataFetchers.jsx';

import DashboardPage from '../../components/pages/DashboardPage.jsx';

class DashboardPageContainer extends Component {
    static propTypes = {
        isLoading    : PropTypes.bool,
        tripwireList : PropTypes.arrayOf(PropTypes.object),
        dispatch     : PropTypes.func
    };

    render() {
        return (
            <DashboardPage {...this.props} />
        );
    }
}

function mapStateToProps({ events }) {
    const { isLoading, tripwireEvents } = events;

    return {
        isLoading,
        tripwireEvents
    };
}
export default connect(mapStateToProps)(
    connectDataFetchers(DashboardPageContainer, [])
);
