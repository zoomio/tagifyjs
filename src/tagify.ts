import tagifyClient, { TagItem } from './client/TagifyClient';
import { isDev } from './config';
import { Render } from './render';
import domRender from './render/dom';

const LIMIT = 5;

export interface TagifyParams {
    target: HTMLScriptElement;
    render?: Render;
    source: string;
    query?: string;
    limit?: number;
}

const fetchTags = async (source: string, limit: number, query: string) => {
    const { data } = await tagifyClient.fetchTags({ source, limit, query });
    return data && data.tags ? data.tags : [];
}

export const renderTags = (params: TagifyParams) => {

    const { target, source, query = '', limit = LIMIT, render = domRender } = params;

    fetchTags(source, limit, query)
        .then(tags => {
            if (isDev()) {
                console.log(`[Tagify] fetched ${tags.length} tags`);
            }

            if (tags.length > 0) {
                render({ target, tags });
            }
        });
}