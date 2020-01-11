import { isDev } from '../../config'
import { TagifyPage } from "../../types";

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
    ul.className = 'tagifyRelevantList';

    pages.forEach(p => {

        let a: HTMLAnchorElement = document.createElement("a");
        a.href = p.source;
        a.innerText = p.title;
        a.className = 'tagifyRelevantLink';

        let li = document.createElement("li");
        li.className = 'tagifyRelevantRow';
        li.appendChild(a);

        ul.appendChild(li);
    });

    target.appendChild(ul);
}