import { Render, RenderRequest } from '../.';
import { isDev } from '../../config';

/**
 * Renders a list of tags inside given target DOM element.
 */
const render: Render = (request: RenderRequest) => {

    const { target, tags } = request;

    if (isDev()) {
        console.log('[DOM render] request target type: ' + target.type);
        console.log('[DOM render] request target id: ' + target.id);
        console.log('[DOM render] request tags: ' + JSON.stringify(tags));
    }

    if (!target || tags.length == 0) {
        return;
    }

    if (isDev()) {
        console.log('[DOM render] rendering tags...');
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

export default render;