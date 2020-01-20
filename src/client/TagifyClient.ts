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
    hash(): string;
}

export class FetchTagsRequestImpl implements FetchTagsRequest {
    public appId: string;
    public host: string;
    public limit: number;
    public pages: TagifyRequestItem[];

    constructor(appId: string, host: string, limit: number, pages: TagifyRequestItem[]) {
        this.appId = appId;
        this.host = host;
        this.limit = limit;
        this.pages = pages;
    }

    hash(): string {
        const rawString = [];
        rawString.push(`${this.appId}|${this.host}|${this.limit}`);
        this.pages.forEach(p => rawString.push(p.hash()));
        return btoa(rawString.join(''));
    }
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
    hash(): string;
}

export class TagifyRequestItemImpl implements TagifyRequestItem {
    public source: string;
    public title: string;
    public limit?: number;

    constructor(source: string, title: string, limit?: number) {
        this.source = source;
        this.title = title;
        this.limit = limit;
    }

    hash(): string {
        return btoa(`${this.source}|${this.title}|${this.limit}`);
    }
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
        this.putResource('', req)
            .catch(reason => console.error(reason));
    }

    deleteTag(req: TagReq): void {
        this.deleteResource('', req)
            .catch(reason => console.error(reason));
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