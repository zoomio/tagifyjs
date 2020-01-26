import { isDev } from '../../config';
import tagifyClient, { TagReq } from '../../client/TagifyClient'
import { api } from '../../config'
import tagCache from './cache';
import {
    ADD_INPUT_STYLE_HIDDEN,
    DEL_BTN_STYLE,
    PARENT_ROW_CLASS,
    PARENT_ROW_STYLE,
    TAG_ROW_CLASS,
    TAG_ROW_STYLE,
    TAG_LINK_CLASS,
    TAG_LINK_STYLE,
} from './styles';


const DEBUG_PREFIX = '[domRenderUtil]';

export interface TagResp {
    anchor: HTMLAnchorElement;
    button: HTMLButtonElement;
}

export interface CustomTagReq {
    host: string;
    appId: string;
    source: string;
    pageTitle: string;
    pagesUrl: string;
    pageLimit: number;
    lastScore: number;
    tagList: HTMLUListElement;
    seenTags: Map<string, boolean>;
}

export const createTag = (req: CustomTagReq, value: string): TagResp => {
    const { host, appId, source, pagesUrl, pageLimit, pageTitle, lastScore } = req;
    let a: HTMLAnchorElement = document.createElement("a");
    a.href = `${api()}/value/${appId}?value=${value}&limit=${pageLimit}&redirect=${pagesUrl}`;
    a.innerText = `#${value}`;
    a.className = TAG_LINK_CLASS;
    a.setAttribute('style', TAG_LINK_STYLE);

    let delBtn: HTMLButtonElement = document.createElement("button");
    delBtn.className = 'tagifyDeleteBtn';
    delBtn.innerText = 'x';
    delBtn.setAttribute("style", DEL_BTN_STYLE);
    delBtn.onclick = () => {
        if (appId == '') {
            if (isDev()) {
                console.log(`${DEBUG_PREFIX} appId is required`);
            }
            return;
        }
        if (host === '') {
            if (isDev()) {
                console.log(`${DEBUG_PREFIX} host is required`);
            }
            return;
        }
        if (value === '') {
            if (isDev()) {
                console.log(`${DEBUG_PREFIX} value is required`);
            }
            return;
        }
        if (source === '') {
            if (isDev()) {
                console.log(`${DEBUG_PREFIX} source is required`);
            }
            return;
        }
        deleteTag({ appId, host, value, source, pageTitle, score: lastScore });
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

export const appendToUl = (ul: HTMLUListElement, children: HTMLElement[], liClassName: string): void => {
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

export const createTagInput = (req: CustomTagReq): HTMLInputElement => {
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

const appendTag = (req: CustomTagReq, input: HTMLInputElement): void => {
    const { appId, host, source, pageTitle, lastScore, tagList, seenTags } = req;
    const { value } = input;

    input.setAttribute("style", ADD_INPUT_STYLE_HIDDEN);

    if (!value || value === '') {
        if (isDev()) {
            console.log(`${DEBUG_PREFIX} nothing to add empty tag value`);
        }
        return;
    }
    if (seenTags.has(value)) {
        if (isDev()) {
            console.log(`${DEBUG_PREFIX} duplicate value in the tag list: ${value}`);
        }
        return;
    }
    if (isDev()) {
        console.log(`${DEBUG_PREFIX} adding tag: ${JSON.stringify(req)}`);
    }

    addTag({ appId, host, value: value, source, pageTitle, score: lastScore - 0.0001 });
    const { anchor, button } = createTag(req, value);
    appendToUl(tagList, [anchor, button], TAG_ROW_CLASS);
    input.value = '';
}

const addTag = (req: TagReq): void => {
    tagifyClient.putTag(req);
    tagCache.removePage(req.source);
}

const deleteTag = (req: TagReq): void => {
    if (isDev()) {
        console.log(`${DEBUG_PREFIX} removing tag: ${JSON.stringify(req)}`);
    }
    tagifyClient.deleteTag(req);
    tagCache.removePage(req.source);
}