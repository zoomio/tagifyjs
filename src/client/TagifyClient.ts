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

    putTag(req: TagReq): void {
        const { appId, appToken, source, value, pageTitle, score } = req;
        this.putResource(
            `/${appId}`,
            { source, value, pageTitle, score },
            {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': 'Bearer ' + appToken,
                }
            })
            .catch(reason => console.error(reason));
    }

    deleteTag(req: TagReq): void {
        const { appId, appToken, source, value, pageTitle, score } = req;
        this.deleteResource(
            `/${appId}`,
            { source, value, pageTitle, score },
            {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': 'Bearer ' + appToken,
                }
            })
            .catch(reason => console.error(reason));
    }

    status(): Promise<TagifySatus> {
        return this.getResource('/status', EXTRA_FETCH_OPTIONS);
    }

    getUser(req: UserReq): Promise<UserProfile> {
        return this.getResource(`/user/${req.appId}`, EXTRA_FETCH_OPTIONS);
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