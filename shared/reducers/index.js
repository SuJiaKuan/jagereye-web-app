import { combineReducers } from 'redux';

import events                  from './events';
import cameras                 from './cameras';
import notifications           from './notifications';
import activations             from './activations';
import currentActivation       from './currentActivation';
import accounts                from './accounts';
import currentAccount          from './currentAccount';
import currentAssessmentSystem from './currentAssessmentSystem';

const rootReducer = combineReducers({
    events,
    cameras,
    notifications,
    activations,
    currentActivation,
    accounts,
    currentAccount,
    currentAssessmentSystem
});

export default rootReducer;
