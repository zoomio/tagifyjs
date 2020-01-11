import { isDev } from './config';
import { TagifyPage } from './types';
import { renderPages } from './component/pages'

const DEBUG_PREFIX = '[getRelevant]';

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
        console.log(`${DEBUG_PREFIX} targetId: ${targetId}`);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const tagifyValue = urlParams.get('tagify_value');
    if (!tagifyValue) {
        if (isDev()) {
            console.log(`${DEBUG_PREFIX} no tagify value`);
        }
        return;
    }

    if (isDev()) {
        console.log(`${DEBUG_PREFIX} tagify value - ${tagifyValue}`);
    }

    const tagifyPages = urlParams.get('tagify_pages');
    if (!tagifyPages) {
        if (isDev()) {
            console.log(`${DEBUG_PREFIX} no tagify pages`);
        }
        return;
    }

    const dataStr = atob(tagifyPages);
    if (!dataStr) {
        if (isDev()) {
            console.log(`${DEBUG_PREFIX} no encoded pages`);
        }
        return;
    }

    const data: TagifyPages = JSON.parse(dataStr)
    if (!data) {
        if (isDev()) {
            console.log(`${DEBUG_PREFIX} no JSON pages`);
        }
        return;
    }

    const { data: { pages } } = data;

    renderPages(pages, tagifyValue, targetId);
}