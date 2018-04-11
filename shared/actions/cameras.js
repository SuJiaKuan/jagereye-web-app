import merge from 'lodash/merge';

import api from '../apiSingleton';
import ApiClient from '../api/ApiClient';
import config from '../config';
import { raiseError } from './errors';

export const LOAD_CAMERAS_REQUEST = 'LOAD_CAMERAS_REQUEST';
export const LOAD_CAMERAS_SUCCESS = 'LOAD_CAMERAS_SUCCESS';
export const LOAD_CAMERAS_FAIL = 'LOAD_CAMERAS_FAIL';

export function loadCameras() {
    return dispatch => {
        dispatch({
            type : LOAD_CAMERAS_REQUEST
        });

        return api.analyzers.list().then((result) => {
            dispatch({
                type : LOAD_CAMERAS_SUCCESS,
                cameraList: result
            });
        }).catch((error) => {
            dispatch({
                type : LOAD_CAMERAS_FAIL
            });
            dispatch(raiseError(error));
        });
    };
}

export const ADD_CAMERA_REQUEST = 'ADD_CAMERA_REQUEST';
export const ADD_CAMERA_SUCCESS = 'ADD_CAMERA_SUCCESS';
export const ADD_CAMERA_FAIL = 'ADD_CAMERA_FAIL';

export function addCamera({ params = {} }) {
    return dispatch => {
        dispatch({
            type : ADD_CAMERA_REQUEST
        });

        let camera = {
            name: params.name,
            source: {
                mode: 'stream',
                url: params.url
            },
            // TODO(JiaKuan Su): Customize pipelines.
            pipelines: [ {
                // TODO(JiaKuan Su): Customize type.
                type: 'IntrusionDetection',
                params: {
                    roi: params.region,
                    triggers: params.triggers
                }
            } ]
        };

        return api.analyzers.create(camera).then(({ id }) => {
            camera = merge({}, { _id: id }, camera);

            return api.analyzers.start(id);
        }).then(() => {
            dispatch({
                type   : ADD_CAMERA_SUCCESS,
                camera
            });
        }).catch((error) => {
            dispatch({
                type : ADD_CAMERA_FAIL
            });
            dispatch(raiseError(error));
        });
    };
}

export const DELETE_CAMERA_REQUEST = 'DELETE_CAMERA_REQUEST';
export const DELETE_CAMERA_SUCCESS = 'DELETE_CAMERA_SUCCESS';
export const DELETE_CAMERA_FAIL = 'DELETE_CAMERA_FAIL';

export function deleteCamera(id) {
    return dispatch => {
        dispatch({
            type : DELETE_CAMERA_REQUEST
        });

        return api.analyzers.remove(id).then(() => {
            dispatch({
                type : DELETE_CAMERA_SUCCESS,
                id
            });
        }).catch((error) => {
            dispatch({
                type : DELETE_CAMERA_FAIL
            });
            dispatch(raiseError(error));
        });
    };
}

export const CHANGE_CAMERA_VIEW = 'CHANGE_CAMERA_VIEW';

export function changeCameraView(idx) {
    return dispatch => {
        dispatch({
            type : CHANGE_CAMERA_VIEW,
            idx
        });
    };
}

export const ADDING_CAMERA_ENTER = 'ADDING_CAMERA_ENTER';
export const ADDING_CAMERA_LEAVE = 'ADDING_CAMERA_LEAVE';

export function addingCameraEnter() {
    return dispatch => {
        dispatch({
            type : ADDING_CAMERA_ENTER
        });
    };
}

export function addingCameraLeave() {
    return dispatch => {
        dispatch({
            type : ADDING_CAMERA_LEAVE
        });
    };
}

export const STREAM_VIEW_REQUEST = 'STREAM_VIEW_REQUEST';
export const STREAM_VIEW_SUCCESS = 'STREAM_VIEW_SUCCESS';
export const STREAM_VIEW_FAIL = 'STREAM_VIEW_FAIL';

export function newStreamView(url) {
    return dispatch => {
        const apiClient = new ApiClient({ prefix: config.streamPrefix });

        dispatch({
            type : STREAM_VIEW_REQUEST
        });

        return apiClient.post('stream', { url }).then((result) => {
            dispatch({
                type : STREAM_VIEW_SUCCESS,
                streamUrl: result.streamUrl
            });
        }).catch((error) => {
            dispatch({
                type : STREAM_VIEW_FAIL
            });
            dispatch(raiseError(error));
        });
    };
}
