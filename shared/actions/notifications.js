import config from '../config';

export const NEW_NOTIFICATIONS = 'NEW_NOTIFICATIONS';

export function subscribeNotifications() {
    return dispatch => {
        const url = `${config.wsPrefix}/notifications`;
        const ws = new WebSocket(url, 'protocolOne');

        ws.onopen = () => {
            // TODO
        };

        ws.onerror = (error) => {
            // TODO: Error handling.
            console.error(error);
        };

        ws.onmessage = (event) => {
            dispatch({
                type: NEW_NOTIFICATIONS,
                notificationList: event.data
            });
        };
    };
}

export const CHECK_NOTIFICATIONS = 'CHECK_NOTIFICATIONS';

export function checkNotifications() {
    return dispatch => {
        dispatch({
            type : CHECK_NOTIFICATIONS
        });
    };
}
