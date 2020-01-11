import { isDev } from '../../config';
import tagifyClient, { TagItem, TagReq } from '../../client/TagifyClient'
import { api } from '../../config'

const DEBUG_PREFIX = '[domRender]';

/**
 * Request for rendering tags.
 */
export interface RenderRequest {
    target: Element;
    source: string;
    title: string;
    tags: TagItem[];
    host: string;
    pagesUrl: string;
    pageLimit: number;
}

export type Render = (request: RenderRequest) => void;

const addTag = (req: TagReq): void => {
    if (isDev()) {
        console.log(`${DEBUG_PREFIX} adding tag: ${JSON.stringify(req)}`);
    }
    tagifyClient.putTag(req);
}

const deleteTag = (req: TagReq): void => {
    if (isDev()) {
        console.log(`${DEBUG_PREFIX} removing tag: ${JSON.stringify(req)}`);
    }
    tagifyClient.deleteTag(req);
}

/**
 * Renders a list of tags inside given target DOM element.
 */
export const domRender: Render = (request: RenderRequest) => {

    const { host, source, title, target, tags, pagesUrl, pageLimit } = request;

    if (isDev()) {
        console.log(`${DEBUG_PREFIX} tags: ${JSON.stringify(tags)}`);
    }

    if (!target || tags.length == 0) {
        return;
    }

    if (isDev()) {
        console.log(`${DEBUG_PREFIX} rendering tags...`);
    }

    const ul = document.createElement("ul");
    ul.className = 'tagifyList';

    let lastScore: number;

    tags.forEach((tag, i) => {
        if (tag.value === '') {
            if (isDev()) {
                console.log(`${DEBUG_PREFIX} skipping empty tag value...`);
            }
            return;
        }

        lastScore = tag.score || 0;

        let a: HTMLAnchorElement = document.createElement("a");
        a.href = `${api()}/value?value=${tag.value}&limit=${pageLimit}&redirect=${pagesUrl}`;
        a.innerText = `#${tag.value}`;
        a.className = 'tagifyLink';

        let btn: HTMLButtonElement = document.createElement("button");
        btn.className = 'tagifyDeleteBtn';
        btn.onclick = () => {
            deleteTag({ host, value: tag.value, source: tag.source });
        };

        let li: HTMLElement = document.createElement("li");
        li.className = 'tagifyRow';
        li.appendChild(a);
        li.appendChild(btn);

        ul.appendChild(li);
    });

    // "add extra tag"
    let inp: HTMLInputElement = document.createElement("input");
    inp.className = 'tagifyAddInp';
    inp.onblur = (e: Event) => {
        let input = <HTMLInputElement>e.target;
        if (isDev()) {
            console.log(`${DEBUG_PREFIX} adding new tag value ${input.value}`);
        }
        addTag({ host, value: input.value, source, pageTitle: title, score: lastScore - 0.01 });
    };
    // inp.onmouseenter = () => { };

    let btn: HTMLButtonElement = document.createElement("button");
    btn.className = 'tagifyAddBtn';
    btn.onclick = () => {
        // addTag({ value: '' });
    };

    target.appendChild(ul);
};
