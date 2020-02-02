import tagify from './component';
import { TagifyTarget } from './component/tags';
import { DEFAULT_PAGE_LIMIT, DEFAULT_TAG_LIMIT, DEFAULT_REQUEST_BATCH_LIMIT, isDev } from './config'
import { getHost } from './util';

const LOG_PREFIX = '[getTagsForAnchors]';

export interface TagsForAnchorsRequest {
    appId: string;
    anchorsClassName: string;
    pagesUrl: string;
    targetsClassName?: string;
    tagLimit?: number;
    pageLimit?: number;
    batchLimit?: number;
    isAdmin?: boolean;
}

export const getTagsForAnchors = (req: TagsForAnchorsRequest) => {

    if (isDev()) {
        console.log(`${LOG_PREFIX} request: ${JSON.stringify(req)}`);
    }

    const {
        appId,
        anchorsClassName,
        pagesUrl,
        targetsClassName,
        tagLimit = DEFAULT_TAG_LIMIT,
        pageLimit = DEFAULT_PAGE_LIMIT,
        batchLimit = DEFAULT_REQUEST_BATCH_LIMIT,
        isAdmin,
    } = req;

    const sources = (<HTMLAnchorElement[]><any>document.getElementsByClassName(anchorsClassName));

    if (!sources || sources.length == 0) {
        console.error(`${LOG_PREFIX} no <a> tags found with CSS class name ${anchorsClassName}`);
        return;
    }

    let targets: HTMLElement[] = sources;
    if (targetsClassName) {
        targets = (<HTMLElement[]><any>document.getElementsByClassName(targetsClassName));
        if (!targets || targets.length == 0) {
            console.error(`${LOG_PREFIX} no target tags found with CSS class name ${targetsClassName}`);
            return;
        }
        if (targets.length != sources.length) {
            console.log(`${LOG_PREFIX} number of targets (${targets.length}) not equal to the number of <a> tags (${sources.length})`);
            return;
        }
    }

    const host = getHost();
    if (isDev()) {
        console.log(`${LOG_PREFIX} setting host to ${host}`);
    }

    let reqTargets: TagifyTarget[] = [];

    for (let i = 0; i < sources.length; i++) {
        const source: HTMLAnchorElement = sources[i];
        const target: HTMLElement = targets[i];

        if (!source) {
            console.log(`${LOG_PREFIX} article is undefined`);
            continue;
        }

        const href = source.href;
        if (!href) {
            console.log(`${LOG_PREFIX} article element does not have "href" property`);
            continue;
        }

        const innerText = source.innerText;
        if (!innerText) {
            console.log(`${LOG_PREFIX} article element does not have "innerText" property`);
            continue;
        }

        reqTargets.push({
            element: target,
            source: href,
            title: innerText,
        });

        if (reqTargets.length === batchLimit || i === sources.length - 1) {
            tagify({
                appId,
                host,
                targets: reqTargets,
                pagesUrl,
                tagLimit,
                pageLimit,
                isAdmin,
            });
            reqTargets = [];
        }
    }

}