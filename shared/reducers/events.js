import {
    SEARCH_EVENTS_REQUEST,
    SEARCH_EVENTS_SUCCESS,
    SEARCH_EVENTS_FAIL
} from '../actions/events';

const DEFAULT_STATE = {
    isLoading: false,
    eventList: []
};

export default function events(state = DEFAULT_STATE, action) {
    switch (action.type) {
        case SEARCH_EVENTS_REQUEST: {
            return {
                ...state,
                isLoading: true
            };
        }

        case SEARCH_EVENTS_SUCCESS: {
            return {
                ...state,
                isLoading: false,
                eventList: action.eventList
            };
        }

        case SEARCH_EVENTS_FAIL: {
            return {
                ...state,
                isLoading: false
            };
        }

        default: {
            return state;
        }
    }
}
