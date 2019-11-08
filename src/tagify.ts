import tagifyClient, { TagifyResponseItem } from './client/TagifyClient';
import { isDev } from './config';
import { Render } from './render';
import domRender from './render/dom';

const LIMIT = 5;

interface TagifyTarget {
    element: HTMLScriptElement;
    source: string;
    title: string;
    query?: string;
}

export interface TagifyParams {
    appID: string;
    host: string,
    render?: Render;
    limit?: number;
    targets: TagifyTarget[];
}

type TargetMap = { [source in string]: TagifyTarget };

const fetchPagesTags = async (appID: string, host: string, limit: number, targets: TagifyTarget[]): Promise<TagifyResponseItem[]> => {
    const pages = targets.map((t: TagifyTarget) => {
        return {
            source: t.source,
            title: t.title,
            limit: limit,
        }
    });
    const { data } = await tagifyClient.fetchPagesTags({ appID, host, limit, pages });
    return data && data.pages ? data.pages : [];
}

export const tagify = (params: TagifyParams): void => {

    const { appID, host, render = domRender, limit = LIMIT, targets = [] } = params;

    if (isDev()) {
        console.log(`[Tagify] recieved ${targets.length} targets: ${JSON.stringify(targets)}`);
    }

    if (targets.length === 0) {
        return;
    }

    const targetMap: TargetMap = {};
    targets.forEach(t => {
        targetMap[t.source] = t;
    });

    fetchPagesTags(appID, host, limit, targets)
        .then(pages => {
            if (isDev()) {
                console.log(`[Tagify] fetched ${pages.length} pages`);
            }

            if (!pages || pages.length === 0) {
                return;
            }

            pages.forEach(page => {
                const { tags, source } = page;

                if (!tags || tags.length === 0) {
                    return;
                }

                const target = targetMap[source];

                if (tags.length > 0) {
                    render({ target: target.element, tags: page.tags });
                }
            });
        });

}