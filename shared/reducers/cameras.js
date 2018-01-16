import clone  from 'lodash/clone';
import remove from 'lodash/remove';

import {
    CHANGE_CAMERA_VIEW,
    ADDING_CAMERA_ENTER,
    ADDING_CAMERA_LEAVE,
    LOAD_CAMERAS_REQUEST,
    LOAD_CAMERAS_SUCCESS,
    LOAD_CAMERAS_FAIL,
    ADD_CAMERA_REQUEST,
    ADD_CAMERA_SUCCESS,
    ADD_CAMERA_FAIL,
    DELETE_CAMERA_REQUEST,
    DELETE_CAMERA_SUCCESS,
    DELETE_CAMERA_FAIL,
    STREAM_VIEW_REQUEST,
    STREAM_VIEW_SUCCESS,
    STREAM_VIEW_FAIL
} from '../actions/cameras';

const DEFAULT_STATE = {
    isAdding  : false,
    isLoading : false,
    curCameraIdx: 0,
    cameraList: [],
    streamView: {
        isAvailable: false,
        url: ''
    }
};

export default function cameras(state = DEFAULT_STATE, action) {
    switch (action.type) {
        case CHANGE_CAMERA_VIEW: {
            return {
                ...state,
                curCameraIdx: action.idx
            };
        }

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

        case LOAD_CAMERAS_REQUEST: {
            return {
                ...state,
                isLoading: true
            };
        }

        case LOAD_CAMERAS_SUCCESS: {
            return {
                ...state,
                isLoading: false,
                cameraList: action.cameraList
            };
        }

        case LOAD_CAMERAS_FAIL: {
            return {
                ...state,
                isLoading: false
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

        case DELETE_CAMERA_REQUEST: {
            return {
                ...state,
                isLoading: true
            };
        }

        case DELETE_CAMERA_SUCCESS: {
            const newCameraList = remove(state.cameraList, (camera) => (
                camera.id !== action.id
            ));

            return {
                ...state,
                isLoading  : false,
                curCameraIdx: 0,
                cameraList : newCameraList
            };
        }

        case DELETE_CAMERA_FAIL: {
            return {
                ...state,
                isLoading: false
            };
        }

        case STREAM_VIEW_REQUEST: {
            return {
                ...state,
                streamView: {
                    isAvailable: false,
                    url: ''
                }
            };
        }

        case STREAM_VIEW_SUCCESS: {
            return {
                ...state,
                streamView: {
                    isAvailable: true,
                    url: action.streamUrl
                }
            };
        }

        case STREAM_VIEW_FAIL: {
            return {
                ...state,
                streamView: {
                    isAvailable: false,
                    url: ''
                }
            };
        }

        default: {
            return state;
        }
    }
}
