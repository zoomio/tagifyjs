import { DEFAULT_RELEVANT_LIMIT, DEFAULT_TAG_LIMIT, isDev } from './config';
import { getHost, getUrl } from './util';
import { domRender } from './component/render';
import tagifyClient, { TagifyBatchResponse } from './client/TagifyClient';

const LOG_PREFIX = '[getTagsForContent]';

export interface TagifyContentReq {
    appId: string,
    content: string,
    contentType: string,
    source?: string,
    title?: string,
    targetId: string,
    tagLimit?: number,
    relevantUrl: string,
    relevantLimit?: number,
    isAdmin: boolean,
}

export const getTagsForContent = (req: TagifyContentReq): void => {

    if (isDev()) {
        console.log(`${LOG_PREFIX} request: ${JSON.stringify(req)}`);
    }

    const {
        appId,
        content,
        contentType,
        source = getUrl(),
        title,
        targetId,
        tagLimit = DEFAULT_TAG_LIMIT,
        relevantUrl,
        relevantLimit = DEFAULT_RELEVANT_LIMIT,
        isAdmin,
    } = req;

    if (content === '') {
        if (isDev()) {
            console.log(`${LOG_PREFIX} empty page content`);
        }
        return
    }

    tagifyClient.fetchTagsForContent({
        appId,
        content,
        contentType,
        source,
        title,
        limit: tagLimit
    }).then((resp: TagifyBatchResponse) => {
        const { data: { pages } } = resp;

        if (isDev()) {
            console.log(`${LOG_PREFIX} fetched ${!pages ? 0 : pages.length} pages`);
        }

        if (!pages || pages.length === 0) {
            return;
        }

        const { tags, title } = pages[0];
        const tagContainer: HTMLElement = (<HTMLElement><any>document.getElementById(targetId));

        tagContainer.innerHTML = '';

        domRender({
            target: tagContainer,
            source: source,
            title: title || 'Draft',
            appId,
            tags,
            relevantUrl,
            relevantLimit,
            isAdmin,
        });
    });

}