import Base from './Base';

export default class AnalyzersAPI extends Base {
    list() {
        return this.apiClient.get('analyzers', {}, {});
    }

    create(config) {
        return this.apiClient.post('analyzers', config, {});
    }

    removeAll() {
        return this.apiClient.delete('analyzers', {}, {});
    }

    show(id) {
        return this.apiClient.get(`analyzer/${id}`, {}, {});
    }

    remove(id) {
        return this.apiClient.delete(`analyzer/${id}`, {}, {});
    }

    start(id) {
        return this.apiClient.post(`analyzer/${id}/start`, {}, {});
    }

    stop(id) {
        return this.apiClient.delete(`analyzer/${id}/stop`, {}, {});
    }
}
