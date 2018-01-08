const DEFAULT_STATE = {
    iaLoading: false,
    tripwireEvents: []
};

export default function events(state = DEFAULT_STATE, action) {
    switch (action.type) {
        default: {
            return state;
        }
    }
}
