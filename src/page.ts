import tagify from './component';
import { DEFAULT_PAGE_LIMIT, DEFAULT_TAG_LIMIT, isDev } from './config';
import { getHost, getUrl } from './util';

const LOG_PREFIX = '[getTagsForPage]';

export interface TagsForPageRequest {
    appId: string;
    pagesUrl: string;
    targetId: string;
    tagLimit?: number;
    pageLimit?: number;
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
        console.error('page has no title');
    }

    return '';
}

export const getTagsForPage = (req: TagsForPageRequest): void => {

    if (isDev()) {
        console.log(`${LOG_PREFIX} request: ${JSON.stringify(req)}`);
    }

    const {
        appId,
        pagesUrl,
        targetId,
        tagLimit = DEFAULT_TAG_LIMIT,
        pageLimit = DEFAULT_PAGE_LIMIT,
        isAdmin,
    } = req;

    const host: string = getHost();
    const url: string = getUrl();
    const element: HTMLElement = (<HTMLElement><any>document.getElementById(targetId));
    if (!element) {
        console.error(`${LOG_PREFIX} can't find target by id "${targetId}"`);
        return;
    }

    tagify({
        appId,
        host,
        targets: [ { element, source: url, title: getTitle() } ],
        pagesUrl,
        tagLimit,
        pageLimit,
        isAdmin,
    });
}