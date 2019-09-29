import { TagItem } from '../../client/TagifyClient'

export interface RenderRequest {
    target: HTMLScriptElement;
    tags: TagItem[];
}

/**
 * Renders a list of tags inside given target DOM element.
 */
const render = (request: RenderRequest) => {

    const { target, tags } = request;

    console.log('target: ' + target);
    console.log('tags: ' + tags);

    if (!target || tags.length == 0) {
        return;
    }

    const ul = document.createElement("ul");

    tags.forEach((tag, i) => {
        let a: HTMLAnchorElement = document.createElement("a");
        a.href = tag.value || '';
        let li = document.createElement("li");
        li.appendChild(a);
        ul.appendChild(li);
    });

    target.appendChild(ul);
};

export default render;