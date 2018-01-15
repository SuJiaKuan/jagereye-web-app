import concat from 'lodash/concat';
import reverse from 'lodash/reverse';

import {
    NEW_NOTIFICATIONS,
    CHECK_NOTIFICATIONS
} from '../actions/notifications';

const DEFAULT_STATE = {
    notificationList: [],
    uncheckedCount: 0
};

export default function notifications(state = DEFAULT_STATE, action) {
    switch (action.type) {
        case NEW_NOTIFICATIONS: {
            const newNotificationList = reverse(action.notificationList);
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

        default: {
            return state;
        }
    }
}
