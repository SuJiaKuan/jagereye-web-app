import { combineReducers } from 'redux';

import cameras                 from './cameras';
import activations             from './activations';
import currentActivation       from './currentActivation';
import accounts                from './accounts';
import currentAccount          from './currentAccount';
import currentAssessmentSystem from './currentAssessmentSystem';

const rootReducer = combineReducers({
    cameras,
    activations,
    currentActivation,
    accounts,
    currentAccount,
    currentAssessmentSystem
});

export default rootReducer;
