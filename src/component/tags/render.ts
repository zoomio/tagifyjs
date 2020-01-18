import { isDev } from '../../config';
import tagifyClient, { TagItem, TagReq } from '../../client/TagifyClient'
import { api } from '../../config'
import {
    ADD_BTN_STYLE,
    ADD_INPUT_STYLE_HIDDEN,
    ADD_INPUT_STYLE_VISIBLE,
    DEL_BTN_STYLE,
    PARENT_LIST_CLASS,
    PARENT_LIST_STYLE,
    PARENT_ROW_CLASS,
    PARENT_ROW_STYLE,
    TAG_LIST_CLASS,
    TAG_LIST_STYLE,
    TAG_ROW_CLASS,
    TAG_ROW_STYLE,
    TAG_LINK_STYLE,
} from './styles';

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

interface TagResp {
    anchor: HTMLAnchorElement;
    button: HTMLButtonElement;
}

const createTag = (host: string, value: string, source: string, pagesUrl: string, pageLimit: number): TagResp => {
    let a: HTMLAnchorElement = document.createElement("a");
    a.href = `${api()}/value?value=${value}&limit=${pageLimit}&redirect=${pagesUrl}`;
    a.innerText = `#${value}`;
    a.className = 'tagifyLink';
    a.setAttribute('style', TAG_LINK_STYLE);

    let delBtn: HTMLButtonElement = document.createElement("button");
    delBtn.className = 'tagifyDeleteBtn';
    delBtn.innerText = 'x';
    delBtn.setAttribute("style", DEL_BTN_STYLE);
    delBtn.onclick = () => {
        deleteTag({ host, value, source });
        // remove self
        let parent: HTMLLIElement = <HTMLLIElement>a.parentElement;
        delBtn.remove();
        a.remove();
        if (parent) {
            parent.remove();
        }
    };

    return {
        anchor: a,
        button: delBtn,
    };
}

interface CreateTagInputReq {
    host: string;
    source: string;
    pageTitle: string;
    pagesUrl: string;
    pageLimit: number;
    lastScore: number;
    tagList: HTMLUListElement;
}

const appendToUl = (ul: HTMLUListElement, children: HTMLElement[], liClassName: string): void => {
    if (!children || children.length === 0) {
        return;
    }

    let li: HTMLElement = document.createElement("li");
    li.className = liClassName;
    if (liClassName === TAG_ROW_CLASS) {
        li.setAttribute('style', TAG_ROW_STYLE);
    } else if (liClassName === PARENT_ROW_CLASS) {
        li.setAttribute('style', PARENT_ROW_STYLE);
    }

    children.forEach(child => {
        li.appendChild(child);
    });

    ul.appendChild(li);
}

const appendTag = (req: CreateTagInputReq, input: HTMLInputElement): void => {
    const { host, source, pageTitle, pagesUrl, pageLimit, lastScore, tagList } = req;
    const { value } = input;
    if (!value || value === '') {
        if (isDev()) {
            console.log(`${DEBUG_PREFIX} nothing to add empty tag value`);
        }
        return;
    }
    if (isDev()) {
        console.log(`${DEBUG_PREFIX} adding new tag value ${value}`);
    }
    addTag({ host, value: value, source, pageTitle, score: lastScore - 0.0001 });
    input.setAttribute("style", ADD_INPUT_STYLE_HIDDEN);
    const { anchor, button } = createTag(host, value, source, pagesUrl, pageLimit);
    appendToUl(tagList, [anchor, button], TAG_ROW_CLASS);
    input.value = '';
}

const createTagInput = (req: CreateTagInputReq): HTMLInputElement => {
    const addInp: HTMLInputElement = document.createElement("input");
    addInp.className = 'tagifyAddInp';
    addInp.setAttribute("style", ADD_INPUT_STYLE_HIDDEN);
    addInp.onblur = (e: Event) => {
        appendTag(req, <HTMLInputElement>e.target);
    };
    addInp.addEventListener("keyup", (e: KeyboardEvent) => {
        // Number 13 is the "Enter" key on the keyboard
        if (e.keyCode === 13) {
            // Cancel the default action, if needed
            e.preventDefault();
            // Trigger the button element with a click
            appendTag(req, <HTMLInputElement>e.target)
        }
    });
    return addInp;
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
    ul.className = PARENT_LIST_CLASS;
    ul.setAttribute('style', PARENT_LIST_STYLE);

    const ulTags = document.createElement("ul");
    ulTags.className = TAG_LIST_CLASS;
    ulTags.setAttribute('style', TAG_LIST_STYLE);

    let lastScore: number = 0;

    tags.forEach((tag, i) => {
        const { value, score } = tag;

        if (value === '') {
            if (isDev()) {
                console.log(`${DEBUG_PREFIX} skipping empty tag`);
            }
            return;
        }

        if (source === '') {
            if (isDev()) {
                console.log(`${DEBUG_PREFIX} skipping tag with empty source`);
            }
            return;
        }

        lastScore = score || 0;

        const { anchor, button } = createTag(host, value, source, pagesUrl, pageLimit);
        appendToUl(ulTags, [anchor, button], TAG_ROW_CLASS);
    });


    appendToUl(ul, [ulTags], PARENT_ROW_CLASS);

    const addInp = createTagInput({
        host,
        source,
        pageTitle: title,
        pagesUrl,
        pageLimit,
        lastScore,
        tagList: ulTags,
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

    target.appendChild(ul);

};
