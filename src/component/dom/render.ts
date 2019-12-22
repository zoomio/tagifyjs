import { isDev } from '../../config';
import { TagItem } from '../../client/TagifyClient'

const DEBUG_PREFIX_DOM_RENDER = '[domRender]';

/**
 * Request for rendering tags.
 */
export interface RenderRequest {
    target: Element;
    tags: TagItem[];
}

export type Render = (request: RenderRequest) => void;

/**
 * Renders a list of tags inside given target DOM element.
 */
export const domRender: Render = (request: RenderRequest) => {

    const { target, tags } = request;

    if (isDev()) {
        console.log(`${DEBUG_PREFIX_DOM_RENDER} tags: ${JSON.stringify(tags)}`);
    }

    if (!target || tags.length == 0) {
        return;
    }

    if (isDev()) {
        console.log(`${DEBUG_PREFIX_DOM_RENDER} rendering tags...`);
    }

    const ul = document.createElement("ul");
    ul.className = 'tagifyList';

    tags.forEach((tag, i) => {
        if (!tag.source || tag.source === '') {
            return;
        }

        let a: HTMLAnchorElement = document.createElement("a");
        a.href = tag.source;
        a.innerText = tag.value || `tag ${i}`;
        a.className = 'tagifyLink';

        let li = document.createElement("li");
        li.className = 'tagifyRow';
        li.appendChild(a);

        ul.appendChild(li);
    });

    target.appendChild(ul);
};
