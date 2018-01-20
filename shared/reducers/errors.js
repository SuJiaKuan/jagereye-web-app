import clone from 'lodash/clone';

import {
    RAISE_ERROR,
    CLEAR_ERROR
} from '../actions/errors';

const DEFAULT_STATE = {
    errorList: []
};

export default function errors(state = DEFAULT_STATE, action) {
    switch (action.type) {
        case RAISE_ERROR: {
            const newErrorList = clone(state.errorList);

            newErrorList.push(action.error);

            return {
                ...state,
                errorList: newErrorList
            };
        }

        case CLEAR_ERROR: {
            return {
                ...state,
                errorList: []
            };
        }

        default: {
            return state;
        }
    }
}
