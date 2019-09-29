import { TagItem } from '../../client/TagifyClient'
import { isDev } from '../../config';

export interface RenderRequest {
    target: HTMLScriptElement;
    tags: TagItem[];
}

/**
 * Renders a list of tags inside given target DOM element.
 */
const render = (request: RenderRequest) => {

    const { target, tags } = request;

    if (isDev()) {
        console.log('[DOM render] request target type: ' + target.type);
        console.log('[DOM render] request target id: ' + target.id);
        console.log('[DOM render] request tags: ' + JSON.stringify(tags));
    }

    if (!target || tags.length == 0) {
        return;
    }

    const ul = document.createElement("ul");

    tags.forEach((tag, i) => {
        let a: HTMLAnchorElement = document.createElement("a");
        a.href = tag.source || '';
        a.innerText = tag.value || '';
        let li = document.createElement("li");
        li.appendChild(a);
        ul.appendChild(li);
    });

    target.appendChild(ul);
};

export default render;