export const RAISE_ERROR = 'RAISE_ERROR';

export function raiseError(error) {
    return dispatch => {
        dispatch({
            type: RAISE_ERROR,
            error
        });
    };
}

export const CLEAR_ERROR = 'CLEAR_ERROR';

export function clearError() {
    return dispatch => {
        dispatch({
            type: CLEAR_ERROR
        });
    };
}
