import api from '../apiSingleton';

console.log(api);

export const ADD_CAMERA_REQUEST = 'ADD_CAMERA_REQUEST';
export const ADD_CAMERA_SUCCESS = 'ADD_CAMERA_SUCCESS';
export const ADD_CAMERA_FAIL = 'ADD_CAMERA_FAIL';

export function addCamera({ params = {} }) {
    return dispatch => {
        dispatch({
            type : ADD_CAMERA_REQUEST
        });

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
            return api.analyzers.start(id);
        }).then(() => {
            dispatch({
                type   : ADD_CAMERA_SUCCESS,
                camera : params
            });
        }).catch(() => {
            dispatch({
                type : ADD_CAMERA_FAIL
            });
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
