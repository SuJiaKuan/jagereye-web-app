import config from '../config';

export const NEW_NOTIFICATIONS = 'NEW_NOTIFICATIONS';

export function subscribeNotifications() {
    return dispatch => {
        const url = `${config.wsPrefix}/notification`;
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
                notificationList: JSON.parse(event.data.replace(/'/g, '"'))
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

export const READ_NOTIFICATION = 'READ_NOTIFICATION';

export function readNotification(id) {
    return dispatch => {
        dispatch({
            type : READ_NOTIFICATION,
            id
        });
    };
}
