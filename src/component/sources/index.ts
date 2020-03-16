import { DEFAULT_TAG_LIMIT, DEFAULT_RELEVANT_LIMIT, isDev } from '../../config';
import tagCache, { TagifyPage } from './cache';
import tagifyClient, {
    TagifyBatchResponse,
    TagifyRequestItem,
    TagifyResponseItem,
} from '../../client/TagifyClient';
import { domRender } from '../render';

const DEBUG_PREFIX = '[tagify]';

export interface TagifyParams {
    appId: string;
    targets: TagifyTarget[];
    relevantUrl: string;
    tagLimit?: number;
    relevantLimit?: number;
}

export interface TagifyTarget {
    tagContainer: Element;
    source: string;
    title: string;
}

interface RenderItemsParams {
    items: TagifyResponseItem[];
    targetMap: Map<string, Element>;
    appId: string;
    relevantUrl: string;
    relevantLimit: number;
}

const renderResponseItems = (params: RenderItemsParams): void => {
    const { items, targetMap, appId, relevantUrl, relevantLimit } = params;
    items.forEach(page => {
        const { tags, source, title } = page;

        if (!tags || tags.length === 0) {
            return;
        }

        const tagContainer = targetMap.get(source);

        if (tagContainer && tags.length > 0) {
            domRender({
                target: tagContainer,
                source,
                title,
                appId,
                tags,
                relevantUrl,
                relevantLimit,
            });
        }
    });
}

const tagify = (params: TagifyParams): void => {

    const {
        appId,
        targets,
        tagLimit = DEFAULT_TAG_LIMIT,
        relevantUrl,
        relevantLimit = DEFAULT_RELEVANT_LIMIT,
    } = params;

    if (isDev()) {
        console.log(`${DEBUG_PREFIX} recieved ${targets.length} targets: ${JSON.stringify(targets)}`);
    }

    if (targets.length === 0) {
        return;
    }

    const targetMap: Map<string, Element> = new Map();
    const reqs: TagifyRequestItem[] = []; // for pages not found in cache
    const cachedResult: TagifyResponseItem[] = []; // list of results from cache
    const cachedTS: Map<string, string> = new Map(); // map of cached timestamps
    const invalidateReqs: TagifyRequestItem[] = []; // async cache invalidation
    const now: number = new Date().getTime(); // now in millis

    const cachedLimit = tagCache.getLimit();
    const invalidateCache = !cachedLimit || cachedLimit < tagLimit;

    targets.forEach(t => {
        targetMap.set(t.source, t.tagContainer);

        const cachedPage: TagifyPage | null = tagCache.getPage(t.source);
        if (!invalidateCache && cachedPage && cachedPage.value) {
            cachedResult.push(cachedPage.value);
            cachedTS.set(cachedPage.value.source, cachedPage.value.timestamp || '');
            if (isDev()) {
                console.log(`${DEBUG_PREFIX} found page in cache for "${t.source}", invalidate: ${cachedPage.invalidateExp}`);
            }
            if (!cachedPage.invalidateExp || cachedPage.invalidateExp < now) {
                if (isDev()) {
                    console.log(`${DEBUG_PREFIX} time to invalidate cache asynchronously`);
                }
                invalidateReqs.push({ source: t.source, title: t.title, limit: tagLimit });
            }
        } else {
            reqs.push({ source: t.source, title: t.title, limit: tagLimit });
        }
    });

    if (invalidateReqs.length > 0) {
        if (isDev()) {
            console.log(`${DEBUG_PREFIX} number of invalidation requests is ${invalidateReqs.length}`);
        }
        tagifyClient.fetchTagsForSources({ appId, limit: tagLimit, pages: invalidateReqs })
            .then((resp: TagifyBatchResponse) => {
                const { data: { pages } } = resp;
    
                if (isDev()) {
                    console.log(`${DEBUG_PREFIX} invalidation fetched ${!pages ? 0 : pages.length} pages`);
                }
    
                if (!pages || pages.length === 0) {
                    return;
                }
    
                pages.forEach(p => {
                    const { tags, source, timestamp } = p;
    
                    if (!tags || tags.length === 0) {
                        return;
                    }
                        
                    const pageTS: string | undefined = cachedTS.get(source);
                    if (!pageTS || pageTS === '' || (timestamp && pageTS < timestamp)) {
                        tagCache.setPage(source, p);
                        if (isDev()) {
                            console.log(`${DEBUG_PREFIX} invalidated ${source}`);
                        }
                    } else if (isDev()) {
                        console.log(`${DEBUG_PREFIX} not invalidated ${source}`);
                    }
    
                });
            });
    }

    if (cachedResult.length > 0) {
        renderResponseItems({ items: cachedResult, targetMap, appId, relevantUrl, relevantLimit });
    }

    if (reqs.length === 0) {
        return;
    }

    const result: TagifyResponseItem[] = [];

    tagifyClient.fetchTagsForSources({ appId, limit: tagLimit, pages: reqs })
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

            renderResponseItems({
                items: result,
                targetMap,
                appId,
                relevantUrl,
                relevantLimit,
            });

            // Update limit cache
            tagCache.setLimit(tagLimit);
        });
}

export default tagify;
