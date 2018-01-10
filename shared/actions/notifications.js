export const CHECK_NOTIFICATIONS = 'CHECK_NOTIFICATIONS';

export function checkNotifications() {
    return dispatch => {
        dispatch({
            type : CHECK_NOTIFICATIONS
        });
    };
}
