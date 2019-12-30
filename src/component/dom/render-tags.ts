import { isDev } from '../../config';
import { TagItem } from '../../client/TagifyClient'
import renderPageListByTag from './render-page-list-by-tag';

const DEBUG_PREFIX_RENDER_TAGS = '[rendertags]';

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
export const renderTags: Render = (request: RenderRequest) => {

    const { target, tags } = request;

    if (isDev()) {
        console.log(`${DEBUG_PREFIX_RENDER_TAGS} tags: ${JSON.stringify(tags)}`);
    }

    if (!target || tags.length == 0) {
        return;
    }

    if (isDev()) {
        console.log(`${DEBUG_PREFIX_RENDER_TAGS} rendering tags...`);
    }

    const ul = document.createElement("ul");
    ul.className = 'tagifyList';

    tags.forEach((tag, i) => {
        if (!tag.source || tag.source === '') {
            return;
        }

        const anchor: HTMLAnchorElement = document.createElement("a");
        anchor.href = '#';
        anchor.innerText = tag.value || `tag ${i}`;
        anchor.className = 'tagifyLink';
        anchor.addEventListener('click', (ev: MouseEvent) => {
            ev.preventDefault();
            renderPageListByTag(target, tag.value || '');
        });
        const li = document.createElement("li");
        li.className = 'tagifyRow';
        li.appendChild(anchor);

        ul.appendChild(li);
    });

    target.appendChild(ul);
};
