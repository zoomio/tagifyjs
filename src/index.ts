import tagify from './component';
import { TagifyTarget } from './component/dom';
import { isDev } from './config'

const DEBUG_PREFIX_GET_TAGS_FOR_ANCHORS = '[getTagsForAnchors]';

export const getTagsForAnchors = (className: string, appId: string, limit?: number, batch?: number) => {
    const articles = (<HTMLAnchorElement[]><any>document.getElementsByClassName(className));

    if (!articles || articles.length == 0) {
        if (isDev()) {
            console.log(`${DEBUG_PREFIX_GET_TAGS_FOR_ANCHORS} no a tags found with CSS class name ${className}`);
        }
        return;
    }

    const host = `${location.protocol}//${location.hostname}` + (location.port && `:${location.port}`);
    if (isDev()) {
        console.log(`${DEBUG_PREFIX_GET_TAGS_FOR_ANCHORS} setting host to ${host}`);
    }

    if (!limit) {
        limit = 5;
        if (isDev()) {
            console.log(`${DEBUG_PREFIX_GET_TAGS_FOR_ANCHORS} setting limit to ${limit}`);
        }
    }

    if (!batch) {
        batch = 5;
        if (isDev()) {
            console.log(`${DEBUG_PREFIX_GET_TAGS_FOR_ANCHORS} setting batch to ${batch}`);
        }
    }

    let targets: TagifyTarget[] = [];

    for (let i = 0; i < articles.length; i++) {
        const article: HTMLAnchorElement = articles[i];

        if (!article) {
            if (isDev()) {
                console.log(`${DEBUG_PREFIX_GET_TAGS_FOR_ANCHORS} article is undefined`);
            }
            continue;
        }

        const href = article.href;
        if (!href) {
            if (isDev()) {
                console.log(`${DEBUG_PREFIX_GET_TAGS_FOR_ANCHORS} article element does not have "href" property`);
            }
            continue;
        }

        const innerText = article.innerText;
        if (!innerText) {
            if (isDev()) {
                console.log(`${DEBUG_PREFIX_GET_TAGS_FOR_ANCHORS} article element does not have "innerText" property`);
            }
            continue;
        }

        targets.push({
            element: article,
            source: href,
            title: innerText,
        });

        if (targets.length === batch) {
            tagify({
                appID: appId,
                host: host,
                limit: limit,
                targets: targets
            });
            targets = [];
        }
    }

}

export const getTags = tagify;
export default tagify;