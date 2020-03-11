import { unAuth } from '../../auth';
import { api, isDev, locationHref, redirect } from '../../config';

const LOG_PREFIX = '[appendLogin]';

interface LoginParams {
    appId: string;
    appToken?: string;
    container: HTMLElement;
}

export const appendLogin = (params: LoginParams): void => {
    if (isDev()) {
        console.log(`${LOG_PREFIX} params: ${JSON.stringify(params)}`);
    }

    const { appId, appToken, container } = params;

    let parent: HTMLElement = document.createElement("span");
    parent.className = ''; // todo
    parent.setAttribute('style', ''); // todo

    container.appendChild(parent);

    // Unauthenticated
    if (!appToken || appToken === '') {
        let loginBtn: HTMLAnchorElement = document.createElement("a");
        loginBtn.className = 'btn btn-dark btn-outline-light btn-sm'; // todo
        loginBtn.href = `${api()}/login?redirect=${encodeURIComponent(locationHref())}&tagify_app_id=${appId}`;
        loginBtn.innerText = 'Log in';
        loginBtn.setAttribute('role', 'button');
        parent.appendChild(loginBtn);
        return;
    }

    // Authenticated
    let authed: HTMLElement = document.createElement("span");
    let logoutBtn: HTMLButtonElement = document.createElement("button");
    logoutBtn.className = 'btn btn-dark btn-default btn-sm'; // todo
    logoutBtn.onclick = (): void => {
        redirect(unAuth());
    };
    logoutBtn.innerText = 'Log out';
    authed.appendChild(logoutBtn);
    parent.appendChild(authed);
};
