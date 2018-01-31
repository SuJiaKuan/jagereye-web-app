import orderBy from 'lodash/orderBy';

import {
    SEARCH_EVENTS_REQUEST,
    SEARCH_EVENTS_SUCCESS,
    SEARCH_EVENTS_FAIL,
    CHANGE_PREVIEW_EVENT,
    LOAD_EVENT_METADATA_REQUEST,
    LOAD_EVENT_METADATA_SUCCESS,
    LOAD_EVENT_METADATA_FAIL
} from '../actions/events';

const DEFAULT_STATE = {
    isLoading: false,
    eventList: [],
    previewEvent: null,
    previewEventMetadata: null
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
                eventList: orderBy(action.eventList, 'timestamp', 'desc')
            };
        }

        case SEARCH_EVENTS_FAIL: {
            return {
                ...state,
                isLoading: false
            };
        }

        case CHANGE_PREVIEW_EVENT: {
            return {
                ...state,
                previewEvent: action.previewEvent,
                previewEventMetadata: action.previewEventMetadata
            };
        }

        case LOAD_EVENT_METADATA_REQUEST: {
            return {
                ...state,
                isLoading: true
            };
        }

        case LOAD_EVENT_METADATA_SUCCESS: {
            return {
                ...state,
                isLoading: false
            };
        }

        case LOAD_EVENT_METADATA_FAIL: {
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
