import { DEFAULT_TAG_LIMIT, DEFAULT_PAGE_LIMIT, isDev } from '../../config';
import { domRender } from './render';
import tagifyClient, { TagifyRequestItem, TagifyBatchResponse } from '../../client/TagifyClient';

const DEBUG_PREFIX = '[tagify]';

export interface TagifyParams {
    appId: string;
    host: string,
    targets: TagifyTarget[];
    pagesUrl: string;
    tagLimit?: number;
    pageLimit?: number;
}

export interface TagifyTarget {
    element: Element;
    source: string;
    title: string;
    query?: string;
}

type TargetMap = { [source in string]: Element };

const tagify = (params: TagifyParams): void => {

    const { appId, host, targets, pagesUrl, tagLimit = DEFAULT_TAG_LIMIT, pageLimit = DEFAULT_PAGE_LIMIT } = params;

    if (isDev()) {
        console.log(`${DEBUG_PREFIX} recieved ${targets.length} targets: ${JSON.stringify(targets)}`);
    }

    if (targets.length === 0) {
        return;
    }

    const targetMap: TargetMap = {};
    const reqs: TagifyRequestItem[] = [];

    targets.forEach(t => {
        targetMap[t.source] = t.element;
        reqs.push({
            source: t.source,
            title: t.title,
            limit: tagLimit,
        })
    });

    // fetchPagesTags(appId, host, limit, targets)
    tagifyClient.fetchPagesTags({ appId, host, limit: tagLimit, pages: reqs })
        .then((resp: TagifyBatchResponse) => {

            const { data: { pages } } = resp;

            if (isDev()) {
                console.log(`${DEBUG_PREFIX} fetched ${!pages ? 0 : pages.length} pages`);
            }

            if (!pages || pages.length === 0) {
                return;
            }

            pages.forEach(p => {
                const { tags, source, title } = p;

                if (!tags || tags.length === 0) {
                    return;
                }

                const element = targetMap[source];

                if (tags.length > 0) {
                    domRender({ target: element, source, title, host, tags, pagesUrl, pageLimit });
                }
            });
        });

}

export default tagify;
