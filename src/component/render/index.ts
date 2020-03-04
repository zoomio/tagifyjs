import { isDev } from '../../config';
import { TagItem } from '../../client/TagifyClient'
import { appendToUl, createTag, createTagInput } from '../sources/util';
import {
    ADD_BTN_STYLE,
    ADD_INPUT_STYLE_VISIBLE,
    PARENT_LIST_CLASS,
    PARENT_LIST_STYLE,
    PARENT_ROW_CLASS,
    TAG_LIST_CLASS,
    TAG_LIST_STYLE,
    TAG_ROW_CLASS,
} from '../sources/styles';

const DEBUG_PREFIX = '[domRender]';

/**
 * Request for rendering tags.
 */
export interface RenderRequest {
    target: Element;
    source: string;
    title: string;
    tags: TagItem[];
    appId: string;
    relevantUrl: string;
    relevantLimit: number;
    isAdmin?: boolean;
}

export type Render = (request: RenderRequest) => void;

/**
 * Renders a list of tags inside given target DOM element.
 */
export const domRender: Render = (request: RenderRequest) => {

    const { appId, source, title, target, tags, relevantUrl, relevantLimit, isAdmin } = request;

    if (isDev()) {
        console.log(`${DEBUG_PREFIX} tags: ${JSON.stringify(tags)}`);
    }

    if (!isAdmin && isDev()) {
        console.log(`${DEBUG_PREFIX} not allowed to edit tags`);
    }

    if (!target || tags.length == 0) {
        return;
    }

    if (isDev()) {
        console.log(`${DEBUG_PREFIX} rendering tags...`);
    }

    const ul = document.createElement("ul");
    ul.className = PARENT_LIST_CLASS;
    ul.setAttribute('style', PARENT_LIST_STYLE);

    const ulTags = document.createElement("ul");
    ulTags.className = TAG_LIST_CLASS;
    ulTags.setAttribute('style', TAG_LIST_STYLE);

    let lastScore: number = 0;

    const seenTags = new Map<string, boolean>()

    tags.forEach((tag, i) => {
        const { value, score } = tag;

        if (value === '') {
            if (isDev()) {
                console.log(`${DEBUG_PREFIX} skipping empty tag [${i}]`);
            }
            return;
        }

        if (source === '') {
            if (isDev()) {
                console.log(`${DEBUG_PREFIX} skipping tag with empty source [${i}]`);
            }
            return;
        }

        lastScore = score || 0;

        // keep track of seen tags,
        // to avoid duplicates.
        seenTags.set(value, true);

        const { anchor, button } = createTag({
            appId,
            source,
            pageTitle: title,
            relevantUrl,
            relevantLimit,
            lastScore,
            tagList: ulTags,
            seenTags,
        }, value);
        if (isAdmin) {
            appendToUl(ulTags, [anchor, button], TAG_ROW_CLASS);
        } else {
            appendToUl(ulTags, [anchor], TAG_ROW_CLASS);
        }
    });

    appendToUl(ul, [ulTags], PARENT_ROW_CLASS);

    target.appendChild(ul);

    if (!isAdmin) {
        return;
    }

    const addInp = createTagInput({
        appId,
        source,
        pageTitle: title,
        relevantUrl,
        relevantLimit,
        lastScore,
        tagList: ulTags,
        seenTags,
    });

    const addBtn: HTMLButtonElement = document.createElement("button");
    addBtn.className = 'tagifyAddBtn';
    addBtn.innerText = '+';
    addBtn.setAttribute("style", ADD_BTN_STYLE);
    addBtn.onclick = () => {
        addInp.setAttribute("style", ADD_INPUT_STYLE_VISIBLE);
        addInp.focus();
    };

    appendToUl(ul, [addInp, addBtn], PARENT_ROW_CLASS);

};
