import merge from 'lodash/merge';
import moment from 'moment';

import api from '../apiSingleton';
import ApiClient from '../api/ApiClient';
import { raiseError } from './errors';

export const SEARCH_EVENTS_REQUEST = 'SEARCH_EVENTS_REQUEST';
export const SEARCH_EVENTS_SUCCESS = 'SEARCH_EVENTS_SUCCESS';
export const SEARCH_EVENTS_FAIL = 'SEARCH_EVENTS_FAIL';

export function searchEvents({ query = {} }) {
    return dispatch => {
        dispatch({
            type: SEARCH_EVENTS_REQUEST
        });

        const { timestamp } = query;

        const finalQuery = merge({}, query, {
            timestamp: {
                start: timestamp && timestamp.start ? timestamp.start : moment().subtract(3, 'days').unix(),
                end: timestamp && timestamp.end ? timestamp.end : moment().unix()
            }
        });

        return api.events.search(finalQuery).then((eventList) => {
            dispatch({
                type: SEARCH_EVENTS_SUCCESS,
                eventList
            });
        }).catch((error) => {
            dispatch({
                type: SEARCH_EVENTS_FAIL
            });
            dispatch(raiseError(error));
        });
    };
}

export const LOAD_EVENT_METADATA_REQUEST = 'LOAD_EVENT_METADATA_REQUEST';
export const LOAD_EVENT_METADATA_SUCCESS = 'LOAD_EVENT_METADATA_SUCCESS';
export const LOAD_EVENT_METADATA_FAIL = 'LOAD_EVENT_METADATA_FAIL';
export const CHANGE_PREVIEW_EVENT = 'CHANGE_PREVIEW_EVENT';

export function changePreviewEvent(previewEvent) {
    return dispatch => {
        if (!previewEvent) {
            dispatch({
                type: CHANGE_PREVIEW_EVENT,
                previewEvent: null,
                eventMetadata: null
            });
        } else {
            const apiClient = new ApiClient({ prefix: '' });
            const metadataUrl = `jager-store/${previewEvent.content.metadata}`;

            dispatch({
                type: LOAD_EVENT_METADATA_REQUEST
            });

            apiClient.get(metadataUrl).then((eventMetadata) => {
                dispatch({
                    type: LOAD_EVENT_METADATA_SUCCESS
                });
                dispatch({
                    type: CHANGE_PREVIEW_EVENT,
                    previewEvent,
                    previewEventMetadata: eventMetadata
                });
            }).catch((error) => {
                dispatch({
                    type : LOAD_EVENT_METADATA_FAIL
                });
                dispatch(raiseError(error));
            });
        }
    };
}
