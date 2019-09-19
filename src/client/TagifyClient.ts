import _ from 'lodash';

import RestClient from './RestClient';
import { api, appID } from '../config/index'

export interface TagItem {
    id?: string;
    value?: string;
    source?: string;
    pageTitle?: string;
    score?: number;
    count?: number;
    timestamp?: string;
}

export interface TagItemsResponse {
    data: {
        tags: TagItem[];
    }
}

class TagifyClient extends RestClient {
    protected appID: string;

    constructor({ appID = '', baseUrl = '', onUnauthorised = _.noop } = {}) {
        super({ baseUrl, onUnauthorised });
        this.appID = appID;
    }

    fetchTags({ source, limit, query }): Promise<TagItemsResponse> {
        const path = `/api/tagify?source=${source}&limit=${limit}&query=${query}`;
        return this.getResource(path, { credentials: 'omit' });
    }

}

/**
 * REST Client to make calls to resources on the Tagify service.
 *
 * @type {RestClient}
 */
export default new TagifyClient({
    appID: appID(),
    baseUrl: api(),
});