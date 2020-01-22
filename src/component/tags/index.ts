import { DEFAULT_TAG_LIMIT, DEFAULT_PAGE_LIMIT, isDev } from '../../config';
import { domRender } from './render';
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

const renderResponseItems = (
    items: TagifyResponseItem[],
    targetMap: Map<string, Element>,
    host: string,
    pagesUrl: string,
    pageLimit: number,
    isAdmin?: boolean): void => {
    items.forEach(p => {
        const { tags, source, title } = p;

        if (!tags || tags.length === 0) {
            return;
        }

        const element = targetMap.get(source);

        if (element && tags.length > 0) {
            domRender({ target: element, source, title, host, tags, pagesUrl, pageLimit, isAdmin });
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
    const result: TagifyResponseItem[] = [];

    targets.forEach(t => {
        targetMap.set(t.source, t.element);
        const cachedPage = localStorage.getItem(btoa(t.source));
        if (cachedPage) {
            result.push(JSON.parse(cachedPage));
            if (isDev()) {
                console.log(`${DEBUG_PREFIX} found page in cache for "${t.source}"`);
            }
        } else {
            reqs.push({ source: t.source, title: t.title, limit: tagLimit });
        }
    });

    if (reqs.length === 0) {
        renderResponseItems(result, targetMap, host, pagesUrl, pageLimit, isAdmin);
        return;
    }


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
                localStorage.setItem(btoa(source), JSON.stringify(p));
            });

            renderResponseItems(result, targetMap, host, pagesUrl, pageLimit, isAdmin);
        });
}

export default tagify;
