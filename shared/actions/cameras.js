import api from '../apiSingleton';

export const ADD_CAMERA_REQUEST = 'ADD_CAMERA_REQUEST';
export const ADD_CAMERA_SUCCESS = 'ADD_CAMERA_SUCCESS';
export const ADD_CAMERA_FAIL = 'ADD_CAMERA_FAIL';

export function addCamera({ params = {} }) {
    return dispatch => {
        dispatch({
            type : ADD_CAMERA_REQUEST
        });

        let cameraId;

        return api.analyzers.create({
            name: params.name,
            // TODO(JiaKuan Su): Customize type.
            type: 'tripwire',
            enabled: true,
            source: {
                mode: 'stream',
                url: params.url
            },
            // TODO(JiaKuan Su): Customize pipelines.
            pipelines: [ {
                name: 'tripwire',
                params: {
                    region: params.region,
                    triggers: params.triggers
                }
            } ]
        }).then(({ id }) => {
            cameraId = id;

            return api.analyzers.start(id);
        }).then(() => {
            dispatch({
                type   : ADD_CAMERA_SUCCESS,
                camera : {
                    ...params,
                    id: cameraId
                }
            });
        }).catch(() => {
            dispatch({
                type : ADD_CAMERA_FAIL
            });
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
        }).catch(() => {
            dispatch({
                type : ADD_CAMERA_FAIL
            });
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
