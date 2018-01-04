import clone from 'lodash/clone';

import {
    ADDING_CAMERA_ENTER,
    ADDING_CAMERA_LEAVE,
    ADD_CAMERA_REQUEST,
    ADD_CAMERA_SUCCESS,
    ADD_CAMERA_FAIL
} from '../actions/cameras';

const DEFAULT_STATE = {
    isAdding  : false,
    isLoading : false,
    cameraList: []
};

export default function cameras(state = DEFAULT_STATE, action) {
    switch (action.type) {
        case ADDING_CAMERA_ENTER: {
            return {
                ...state,
                isAdding: true
            };
        }

        case ADDING_CAMERA_LEAVE: {
            return {
                ...state,
                isAdding: false
            };
        }

        case ADD_CAMERA_REQUEST: {
            return {
                ...state,
                isLoading: true
            };
        }

        case ADD_CAMERA_SUCCESS: {
            const newCameraList = clone(state.cameraList);

            newCameraList.push(action.camera);

            return {
                ...state,
                isAdding   : false,
                isLoading  : false,
                cameraList : newCameraList
            };
        }

        case ADD_CAMERA_FAIL: {
            return {
                ...state,
                isAdding  : false,
                isLoading : false
            };
        }

        default: {
            return state;
        }
    }
}
