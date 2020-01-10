import { isDev } from './config';

const DEBUG_PREFIX = '[getRelevant]';

export interface RelevantRequest {
    appId: string;
    targetId: string;
}

interface TagifyPage {
    title: string;
    source: string;
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

    if (pages.length == 0) {
        console.log(`${DEBUG_PREFIX} no pages found for ${tagifyValue}`);
        return;
    }

    const target = (<HTMLElement><any>document.getElementById(targetId));

    const ul = document.createElement("ul");
    ul.className = 'tagifyRelevantList';

    pages.forEach(p => {

        let a: HTMLAnchorElement = document.createElement("a");
        a.href = p.source;
        a.innerText = p.title;
        a.className = 'tagifyRelevantLink';

        let li = document.createElement("li");
        li.className = 'tagifyRelevantRow';
        li.appendChild(a);

        ul.appendChild(li);
    });

    target.appendChild(ul);
}