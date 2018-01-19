import ApiClient            from './ApiClient';
import ActivationsAPI       from './Activations';
import AccountsAPI          from './Accounts';
import AssessmentSystemsAPI from './AssessmentSystems';
import AnalyzersAPI         from './Analyzers';
import EventsAPI            from './Events';

export default function ({ apiPrefix } = {}) {
    if (!apiPrefix) {
        throw new Error('[apiPrefix] required');
    }

    const api = new ApiClient({ prefix: apiPrefix });

    return {
        apiClient         : api,
        activations       : new ActivationsAPI({ apiClient: api }),
        accounts          : new AccountsAPI({ apiClient: api }),
        assessmentSystems : new AssessmentSystemsAPI({ apiClient: api }),
        analyzers         : new AnalyzersAPI({ apiClient: api }),
        events            : new EventsAPI({ apiClient: api })
    };
}
