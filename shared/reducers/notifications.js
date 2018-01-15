import uuid from 'uuid/v4';
import clone from 'lodash/clone';
import concat from 'lodash/concat';
import findIndex from 'lodash/findIndex';
import map from 'lodash/map';
import merge from 'lodash/merge';
import reverse from 'lodash/reverse';

import {
    NEW_NOTIFICATIONS,
    CHECK_NOTIFICATIONS,
    READ_NOTIFICATION
} from '../actions/notifications';

const DEFAULT_STATE = {
    notificationList: [],
    uncheckedCount: 0
};

export default function notifications(state = DEFAULT_STATE, action) {
    switch (action.type) {
        case NEW_NOTIFICATIONS: {
            const newNotificationList = map(
                reverse(action.notificationList),
                (notification) => (merge({}, notification, {
                    _id: uuid(),
                    read: false
                })));
            const notificationList
                = concat(newNotificationList, state.notificationList);
            const uncheckedCount
                = state.uncheckedCount + newNotificationList.length;

            return {
                ...state,
                notificationList,
                uncheckedCount
            };
        }

        case CHECK_NOTIFICATIONS: {
            return {
                ...state,
                uncheckedCount: 0
            };
        }

        case READ_NOTIFICATION: {
            const notificationList = clone(state.notificationList);
            const idx = findIndex(
                notificationList,
                (notification) => notification._id === action.id
            );

            notificationList[idx].read = true;

            return {
                ...state,
                notificationList
            };
        }

        default: {
            return state;
        }
    }
}
