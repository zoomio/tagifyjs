import noop from 'lodash/noop';

import RestClient from './RestClient';
import { api } from '../config'

export interface TagItem {
    value: string;
    score?: number;
}

export interface FetchTagsRequest {
    appId: string;
    limit: number;
    pages: TagifyRequestItem[];
}

export interface FetchForContentReq {
    appId: string;
    content: string;
    contentType: string;
    source?: string;
    title?: string;
    limit?: number;
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
    appId: string;
    appToken: string;
    value: string;
    source: string;
    pageTitle?: string;
    score?: number;
}

export interface TagifySatus {
    version: string;
}

export interface UserReq {
    appId: string;
}

export interface UserProfile {
    id: string;
    displayName: string;
    imageURL: string;
    email: string;
    role: string;
    isAdmin: boolean;
}

// helps to bypass cross origin limits
const EXTRA_FETCH_OPTIONS = { credentials: 'omit', 'Content-Type': 'text/plain' };

class TagifyClient extends RestClient {

    constructor({ baseUrl = '', onUnauthorised = noop } = {}) {
        super({ baseUrl, onUnauthorised });
    }

    fetchTagsForSources(req: FetchTagsRequest): Promise<TagifyBatchResponse> {
        const { appId, limit, pages = [] } = req;
        const path = `/batch/${appId}`;
        return this.postResource(path, { limit, pages }, EXTRA_FETCH_OPTIONS);
    }

    fetchTagsForContent(req: FetchForContentReq): Promise<TagifyBatchResponse> {
        const { appId, content, contentType, source, title, limit } = req;
        const path = `/content/${appId}`;
        return this.postResource(path, { content, contentType, source, title, limit }, EXTRA_FETCH_OPTIONS);
    }

    async putTag(req: TagReq): Promise<boolean> {
        const { appId, appToken, source, value, pageTitle, score } = req;
        try {
            await this.putResource(`/${appId}`, { source, value, pageTitle, score }, {
                credentials: 'omit',
                headers: {
                    'content-type': 'application/json',
                    'Authorization': 'Bearer ' + appToken,
                }
            });
            return true;
        } catch (reason) {
            console.log(reason);
            return false;
        }
    }

    async deleteTag(req: TagReq): Promise<boolean> {
        const { appId, appToken, source, value, pageTitle, score } = req;
        try {
            await this.deleteResource(`/${appId}`, { source, value, pageTitle, score }, {
                credentials: 'omit',
                headers: {
                    'content-type': 'application/json',
                    'Authorization': 'Bearer ' + appToken,
                }
            });
            return true;
        } catch (reason) {
            console.log(reason);
            return false;
        }
    }

    status(): Promise<TagifySatus> {
        return this.getResource('/status', EXTRA_FETCH_OPTIONS);
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