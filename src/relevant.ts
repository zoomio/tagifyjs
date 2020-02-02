import { isDev } from './config';
import { TagifyPage } from './types';
import { renderPages } from './component/relevant'

const LOG_PREFIX = '[getRelevant]';

export interface RelevantRequest {
    appId: string;
    targetId: string;
}

interface TagifyPages {
    data: {
        pages: TagifyPage[];
    }
}

export const getRelevant = (req: RelevantRequest) => {
    const { appId, targetId } = req;

    if (isDev()) {
        console.log(`${LOG_PREFIX} targetId: ${targetId}`);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const tagifyValue = urlParams.get('tagify_value');
    if (!tagifyValue) {
        console.error(`${LOG_PREFIX} no tagify value`);
        return;
    }

    if (isDev()) {
        console.log(`${LOG_PREFIX} tagify value - ${tagifyValue}`);
    }

    const tagifyPages = urlParams.get('tagify_pages');
    if (!tagifyPages) {
        console.error(`${LOG_PREFIX} no tagify pages`);
        return;
    }

    const dataStr = atob(tagifyPages);
    if (!dataStr) {
        console.error(`${LOG_PREFIX} cant't decode tagify pages`);
        return;
    }

    const data: TagifyPages = JSON.parse(dataStr)
    if (!data) {
        console.error(`${LOG_PREFIX} cant't parse tagify pages`);
        return;
    }

    const { data: { pages } } = data;

    renderPages(pages, tagifyValue, targetId);
}