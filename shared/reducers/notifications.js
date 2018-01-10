import { CHECK_NOTIFICATIONS } from '../actions/notifications';

const DEFAULT_STATE = {
    notificationList: [],
    isChecked: true
};

export default function notifications(state = DEFAULT_STATE, action) {
    switch (action.type) {
        case CHECK_NOTIFICATIONS: {
            return {
                ...state,
                isChecked: true
            };
        }

        default: {
            return state;
        }
    }
}
