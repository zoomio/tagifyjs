import RestClient from './rest-client';
import { getURL, getAppID } from '../config/index'

class TagifyClient extends RestClient {
    constructor({ appID = '', serviceUrl = '', onUnauthorised = _.noop } = {}) {
        super({ serviceUrl, onUnauthorised });
        this.appID = appID;
    }

    fetchTags({ source, limit }) {
        const path = `/api/tagify?source=${source}&limit=${limit}`;
        return this.getResource(path, { credentials: 'omit' });
    }

    register(host) {
        return this.postResource('/api/tagify/register', { host });
    }

    getToken() {
        return this.getResource('/api/token');
    }

    getTagsForApp({ source, title, limit }) {
        const path = `/api/tagify/${this.appID}?source=${source}&title=${title}&limit=${limit}`;
        return this.getResource(path, { credentials: 'omit' });
    }

    getTagsBatchForApp({ host, limit, pages = [] }) {
        const path = `/api/tagify/batch/${this.appID}`;
        return this.postResource(path, 
            { host, limit, pages }, 
            { credentials: 'omit', 'Content-Type': 'text/plain' });
    }

}

/**
 * REST Client to make calls to resources on the Tagify service.
 *
 * @type {RestClient}
 */
export default new TagifyClient({
    appID: getAppID(),
    serviceUrl: getURL(),
});