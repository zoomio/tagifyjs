import { DEFAULT_TAG_LIMIT, DEFAULT_PAGE_LIMIT, isDev } from '../../config';
import { domRender } from './render';
import tagCache from './cache';
import tagifyClient, {
    TagifyBatchResponse,
    TagifyRequestItem,
    TagifyResponseItem,
} from '../../client/TagifyClient';

const DEBUG_PREFIX = '[tagify]';

export interface TagifyParams {
    appId: string;
    host: string,
    targets: TagifyTarget[];
    pagesUrl: string;
    tagLimit?: number;
    pageLimit?: number;
    isAdmin?: boolean;
}

export interface TagifyTarget {
    element: Element;
    source: string;
    title: string;
    query?: string;
}

interface RenderItemsParams {
    items: TagifyResponseItem[];
    targetMap: Map<string, Element>;
    host: string;
    appId: string;
    pagesUrl: string;
    pageLimit: number;
    isAdmin?: boolean;
}

const renderResponseItems = (params: RenderItemsParams): void => {
    const { items, targetMap, host, appId, pagesUrl, pageLimit, isAdmin } = params;
    items.forEach(page => {
        const { tags, source, title } = page;

        if (!tags || tags.length === 0) {
            return;
        }

        const element = targetMap.get(source);

        if (element && tags.length > 0) {
            domRender({ target: element, source, title, host, appId, tags, pagesUrl, pageLimit, isAdmin });
        }
    });
}

const tagify = (params: TagifyParams): void => {

    const {
        appId,
        host,
        targets,
        pagesUrl,
        tagLimit = DEFAULT_TAG_LIMIT,
        pageLimit = DEFAULT_PAGE_LIMIT,
        isAdmin,
    } = params;

    if (isDev()) {
        console.log(`${DEBUG_PREFIX} recieved ${targets.length} targets: ${JSON.stringify(targets)}`);
    }

    if (targets.length === 0) {
        return;
    }

    const targetMap: Map<string, Element> = new Map();
    const reqs: TagifyRequestItem[] = [];
    const cachedResult: TagifyResponseItem[] = [];

    let cachedLimit = tagCache.getLimit();
    const invalidateCache = !cachedLimit || cachedLimit < tagLimit;

    targets.forEach(t => {
        targetMap.set(t.source, t.element);

        const cachedPage = tagCache.getPage(t.source);
        if (!invalidateCache && cachedPage) {
            cachedResult.push(cachedPage);
            if (isDev()) {
                console.log(`${DEBUG_PREFIX} found page in cache for "${t.source}"`);
            }
        } else {
            reqs.push({ source: t.source, title: t.title, limit: tagLimit });
        }
    });

    if (cachedResult.length > 0) {
        renderResponseItems({ items: cachedResult, targetMap, host, appId, pagesUrl, pageLimit, isAdmin });
    }

    if (reqs.length === 0) {        
        return;
    }

    const result: TagifyResponseItem[] = [];

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
                const { tags, source } = p;

                if (!tags || tags.length === 0) {
                    return;
                }

                // set result
                result.push(p);

                // cache found page
                tagCache.setPage(source, p);
            });

            renderResponseItems({ items: result, targetMap, host, appId, pagesUrl, pageLimit, isAdmin });

            // Update limit cache
            tagCache.setLimit(tagLimit);
        });
}

export default tagify;
