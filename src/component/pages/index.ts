import { isDev } from '../../config'
import { TagifyPage } from "../../types";
import { 
    RELEVANT_LIST_CLASS,
    RELEVANT_LIST_STYLE,
    RELEVANT_ROW_CLASS,
    RELEVANT_ROW_STYLE,
    RELEVANT_LINK_CLASS, 
    RELEVANT_LINK_STYLE,
} from './styles';

const DEBUG_PREFIX = '[pagesRender]';

export const renderPages = (pages: TagifyPage[], tagifyValue: string, targetId: string) => {
    if (pages.length == 0) {
        if (isDev()) {
            console.log(`${DEBUG_PREFIX} no pages found for ${tagifyValue}`);
        }
        return;
    }

    const target = (<HTMLElement><any>document.getElementById(targetId));

    const ul = document.createElement("ul");
    ul.className = RELEVANT_LIST_CLASS;
    ul.setAttribute('style', RELEVANT_LIST_STYLE);

    pages.forEach(p => {

        let a: HTMLAnchorElement = document.createElement("a");
        a.href = p.source;
        a.innerText = p.title;
        a.className = RELEVANT_LINK_CLASS;
        a.setAttribute('style', RELEVANT_LINK_STYLE);

        let li = document.createElement("li");
        li.className = RELEVANT_ROW_CLASS;
        li.setAttribute('style', RELEVANT_ROW_STYLE);
        li.appendChild(a);

        ul.appendChild(li);
    });

    target.appendChild(ul);
}