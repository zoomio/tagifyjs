import tagifyClient from './client/TagifyClient';
import { isDev } from './config';
import { Render } from './render';
import domRender from './render/dom';

const LIMIT = 5;

export interface TagifyParams {
    appID: string;
    target: HTMLScriptElement;
    render?: Render;
    source: string;
    query?: string;
    limit?: number;
}

const fetchTags = async (appID: string, source: string, limit: number, query: string) => {
    const { data } = await tagifyClient.fetchTags({ appID, source, limit, query });
    return data && data.tags ? data.tags : [];
}

export const tagify = (params: TagifyParams) => {

    const { appID, target, source, query = '', limit = LIMIT, render = domRender } = params;

    fetchTags(appID, source, limit, query)
        .then(tags => {
            if (isDev()) {
                console.log(`[Tagify] fetched ${tags.length} tags`);
            }

            if (tags.length > 0) {
                render({ target, tags });
            }
        });
}