import tagify from './component';
import { DEFAULT_RELEVANT_LIMIT, DEFAULT_TAG_LIMIT, isDev } from './config';
import { getUrl } from './util';

const LOG_PREFIX = '[getTagsForPage]';

export interface TagsForPageRequest {
    appId: string;
    targetId: string;
    tagLimit?: number;
    relevantUrl: string;
    relevantLimit?: number;
    isAdmin?: boolean;
}

const getTitle = (): string => {
    const titles: HTMLElement[] = (<HTMLElement[]><any>document.getElementsByTagName('title'));
    if (titles && titles.length > 0) {
        return titles[0].innerText;
    }

    const h1s: HTMLElement[] = (<HTMLElement[]><any>document.getElementsByTagName('h1'));
    if (h1s && h1s.length > 0) {
        return h1s[0].innerText;
    }

    if (isDev()) {
        console.error(`${LOG_PREFIX} page has no title`);
    }

    return '';
}

export const getTagsForPage = (req: TagsForPageRequest): void => {

    if (isDev()) {
        console.log(`${LOG_PREFIX} request: ${JSON.stringify(req)}`);
    }

    const {
        appId,
        targetId,
        tagLimit = DEFAULT_TAG_LIMIT,
        relevantUrl,
        relevantLimit = DEFAULT_RELEVANT_LIMIT,
        isAdmin,
    } = req;

    const url: string = getUrl();
    const tagContainer: HTMLElement = (<HTMLElement><any>document.getElementById(targetId));
    if (!tagContainer) {
        console.error(`${LOG_PREFIX} can't find target by id "${targetId}"`);
        return;
    }

    tagify({
        appId,
        targets: [{ tagContainer, source: url, title: getTitle() }],
        relevantUrl,
        tagLimit,
        relevantLimit,
        isAdmin,
    });
}