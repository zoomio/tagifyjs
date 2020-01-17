import noop from 'lodash/noop';

import RestClient from './RestClient';
import { api } from '../config'

export interface TagItem {
    value: string;
    score?: number;
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
    title: string;
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

export interface TagReq {
    host: string;
    value: string;
    source: string;
    pageTitle?: string;
    score?: number;
}

// helps to bypass cross origin limits
const EXTRA_FETCH_OPTIONS = { credentials: 'omit', 'Content-Type': 'text/plain' };

class TagifyClient extends RestClient {

    constructor({ baseUrl = '', onUnauthorised = noop } = {}) {
        super({ baseUrl, onUnauthorised });
    }

    fetchPagesTags(request: FetchTagsRequest): Promise<TagifyBatchResponse> {
        const { appId, host, limit, pages = [] } = request;
        const path = `/batch/${appId}`;
        return this.postResource(path, { host, limit, pages }, EXTRA_FETCH_OPTIONS);
    }

    putTag(req: TagReq): void {
        void this.putResource('', req);
    }

    deleteTag(req: TagReq): void {
        void this.deleteResource('', req);
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