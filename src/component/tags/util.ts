import { isDev } from '../../config';
import tagifyClient, { TagReq } from '../../client/TagifyClient'
import { api } from '../../config'
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

export interface CreateInputReq {
    host: string;
    source: string;
    pageTitle: string;
    pagesUrl: string;
    pageLimit: number;
    lastScore: number;
    tagList: HTMLUListElement;
}

export const createTag = (host: string, value: string, source: string, pagesUrl: string, pageLimit: number): TagResp => {
    let a: HTMLAnchorElement = document.createElement("a");
    a.href = `${api()}/value?value=${value}&limit=${pageLimit}&redirect=${pagesUrl}`;
    a.innerText = `#${value}`;
    a.className = TAG_LINK_CLASS;
    a.setAttribute('style', TAG_LINK_STYLE);

    let delBtn: HTMLButtonElement = document.createElement("button");
    delBtn.className = 'tagifyDeleteBtn';
    delBtn.innerText = 'x';
    delBtn.setAttribute("style", DEL_BTN_STYLE);
    delBtn.onclick = () => {
        if (!host || host === '' || !value || value === '' || !source || source === '') {
            if (isDev()) {
                console.log(`${DEBUG_PREFIX} can't delete empty tag`);
            }
            return;
        }
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

export const createTagInput = (req: CreateInputReq): HTMLInputElement => {
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

const appendTag = (req: CreateInputReq, input: HTMLInputElement): void => {
    const { host, source, pagesUrl, pageLimit, pageTitle, lastScore, tagList } = req;
    const { value } = input;

    input.setAttribute("style", ADD_INPUT_STYLE_HIDDEN);

    if (!value || value === '') {
        if (isDev()) {
            console.log(`${DEBUG_PREFIX} nothing to add empty tag value`);
        }
        return;
    }
    if (isDev()) {
        console.log(`${DEBUG_PREFIX} adding tag: ${JSON.stringify(req)}`);
    }

    addTag({ host, value: value, source, pageTitle, score: lastScore - 0.0001 });
    const { anchor, button } = createTag(host, value, source, pagesUrl, pageLimit);
    appendToUl(tagList, [anchor, button], TAG_ROW_CLASS);
    input.value = '';
}

const addTag = (req: TagReq): void => {
    tagifyClient.putTag(req);
}

const deleteTag = (req: TagReq): void => {
    if (isDev()) {
        console.log(`${DEBUG_PREFIX} removing tag: ${JSON.stringify(req)}`);
    }
    tagifyClient.deleteTag(req);
}