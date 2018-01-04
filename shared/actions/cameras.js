export const ADD_CAMERA_REQUEST = 'ADD_CAMERA_REQUEST';
export const ADD_CAMERA_SUCCESS = 'ADD_CAMERA_SUCCESS';
export const ADD_CAMERA_FAIL = 'ADD_CAMERA_FAIL';

export function addCamera({ params = {} }) {
    return dispatch => {
        dispatch({
            type : ADD_CAMERA_REQUEST
        });
        // TODO(JiaKuan Su): Integrate with API.
        dispatch({
            type   : ADD_CAMERA_SUCCESS,
            camera : params
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
