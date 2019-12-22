import { isDev } from '../../config';
import { domRender } from './render';
import tagifyClient, { TagifyRequestItem, TagifyBatchResponse } from '../../client/TagifyClient';

const LIMIT = 5;
const DEBUG_PREFIX_TAGIFY = '[tagify]';

export interface TagifyParams {
    appID: string;
    host: string,
    limit?: number;
    targets: TagifyTarget[];
}

export interface TagifyTarget {
    element: Element;
    source: string;
    title: string;
    query?: string;
}

type TargetMap = { [source in string]: Element };

const tagify = (params: TagifyParams): void => {

    const { appID, host, limit = LIMIT, targets = [] } = params;

    if (isDev()) {
        console.log(`${DEBUG_PREFIX_TAGIFY} recieved ${targets.length} targets: ${JSON.stringify(targets)}`);
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
            limit: limit,
        })
    });

    // fetchPagesTags(appID, host, limit, targets)
    tagifyClient.fetchPagesTags({ appID, host, limit, pages: reqs })
        .then((resp: TagifyBatchResponse) => {

            const { data: { pages } } = resp;

            if (isDev()) {
                console.log(`${DEBUG_PREFIX_TAGIFY} fetched ${!pages ? 0 : pages.length} pages`);
            }

            if (!pages || pages.length === 0) {
                return;
            }

            pages.forEach(p => {
                const { tags, source } = p;

                if (!tags || tags.length === 0) {
                    return;
                }

                const element = targetMap[source];

                if (tags.length > 0) {
                    domRender({ target: element, tags });
                }
            });
        });

}

export default tagify;
