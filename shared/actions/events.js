import merge from 'lodash/merge';
import moment from 'moment';

import api from '../apiSingleton';

export const SEARCH_EVENTS_REQUEST = 'SEARCH_EVENTS_REQUEST';
export const SEARCH_EVENTS_SUCCESS = 'SEARCH_EVENTS_SUCCESS';
export const SEARCH_EVENTS_FAIL = 'SEARCH_EVENTS_FAIL';

export function searchEvents({ query }) {
    return dispatch => {
        dispatch({
            type: SEARCH_EVENTS_REQUEST
        });

        const { timestamp } = query;

        const finalQuery = merge({}, query, {
            timestamp: {
                start: timestamp && timestamp.start ? timestamp.start : moment().subtract(7, 'days').unix(),
                end: timestamp && timestamp.end ? timestamp.end : moment().unix()
            }
        });

        return api.events.search(finalQuery).then((eventList) => {
            dispatch({
                type: SEARCH_EVENTS_SUCCESS,
                eventList
            });
        }).catch(() => {
            dispatch({
                type: SEARCH_EVENTS_FAIL
            });
        });
    };
}
