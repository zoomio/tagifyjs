import noop from 'lodash/noop';

import RestClient from './RestClient';
import { api } from '../config'

export interface TagItem {
    id?: string;
    value?: string;
    source?: string;
    pageTitle?: string;
    score?: number;
    count?: number;
    timestamp?: string;
}

interface Page {
    source: string;
    tags: TagItem[];
}

export interface TagItemsResponse {
    data: {
        pages: Page[];
    }
}

export interface FetchTagsRequest {
    appId: string;
    host: string;
    limit: number;
    pages: TagifyRequestItem[];
}

export interface TagifyResponseItem {
    source: string;
    tags: TagItem[];
}

export interface TagifyBatchResponse {
    data: {
        pages: TagifyResponseItem[];
    }
}

export interface TagifyRequestItem {
    source: string;
    title: string;
    limit?: number;
}

class TagifyClient extends RestClient {

    constructor({ baseUrl = '', onUnauthorised = noop } = {}) {
        super({ baseUrl, onUnauthorised });
    }

    fetchPagesTags(request: FetchTagsRequest): Promise<TagifyBatchResponse> {
        const { appId, host, limit, pages = [] } = request;
        const path = `/batch/${appId}`;
        // helps to bypass cross origin limits
        const extraFetchOptions = { credentials: 'omit', 'Content-Type': 'text/plain' };
        return this.postResource(path, { host, limit, pages }, extraFetchOptions);
    }

}

/**
 * REST Client to make calls to resources on the Tagify service.
 *
 * @type {RestClient}
 */
export default new TagifyClient({
    baseUrl: api(),
});