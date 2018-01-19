import Base from './Base';

export default class EventsAPI extends Base {
    search(query) {
        return this.apiClient.post('events', query, {});
    }
}
