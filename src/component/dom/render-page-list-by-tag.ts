import tagifyClient from '../../client/TagifyClient';
import {isDev} from '../../config';

const DEBUG_PREFIX_RENDER_PAGE_LIST = '[renderPageListByTag]';

interface Page {
    title: string;
    location: string;
}

const getPagesByTag = (tag: string): Promise<Page[]> => {
    return Promise.resolve([
        {
            location: 'https://some.url',
            title: 'some page'
        }
    ]);
};

const renderPages = (target: Element, pages: Page[]) => {
    const ul = document.createElement('ul');

    pages.forEach((page, i) => {
        if (!page.location || page.location === '') {
            return;
        }

        let a: HTMLAnchorElement = document.createElement('a');
        a.href = page.location;
        a.innerText = page.title || `Page ${i}`;
        a.className = 'pageLink';

        let li = document.createElement("li");
        li.className = 'pageRow';
        li.appendChild(a);

        ul.appendChild(li);
    });

    target.replaceWith(ul);
};

const renderPageListByTag = async (target: Element, tag: string) => {
    if (isDev()) {
        console.log(`${DEBUG_PREFIX_RENDER_PAGE_LIST} tag: ${tag}`);
    }

    if (!tag) {
        return;
    }

    if (isDev()) {
        console.log(`${DEBUG_PREFIX_RENDER_PAGE_LIST} rendering page list...`);
    }

    const pages = await getPagesByTag(tag);

    renderPages(target, pages);
};

export default renderPageListByTag;