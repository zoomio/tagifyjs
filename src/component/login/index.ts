import { unAuth } from '../../auth';
import { api, isDev, locationHref, redirect } from '../../config';
import { 
    LOGIN_BTN_CLASS, 
    LOGIN_BTN_STYLE, 
    LOGIN_BTN_PARENT_CLASS, 
    LOGOUT_BTN_CLASS 
} from './styles';

const LOG_PREFIX = '[appendLogin]';
const DEFAULT_LOGIN_TEXT = 'Log in';
const DEFAULT_LOGOUT_TEXT = 'Log out';

interface LoginParams {
    appId: string;
    appToken?: string;
    container: HTMLElement;
    loginText?: string;
    logoutText?: string;
}

export const appendLogin = (params: LoginParams): void => {
    if (isDev()) {
        console.log(`${LOG_PREFIX} params: ${JSON.stringify(params)}`);
    }

    const {
        appId,
        appToken,
        container,
        loginText = DEFAULT_LOGIN_TEXT,
        logoutText = DEFAULT_LOGOUT_TEXT
    } = params;

    let parent: HTMLElement = document.createElement("span");
    parent.className = LOGIN_BTN_PARENT_CLASS;

    container.appendChild(parent);

    // Unauthenticated
    if (!appToken || appToken === '') {
        let loginBtn: HTMLAnchorElement = document.createElement("a");
        loginBtn.className = LOGIN_BTN_CLASS;
        loginBtn.href = `${api()}/login?redirect=${encodeURIComponent(locationHref())}&app_id=${appId}`;
        loginBtn.innerText = loginText;
        loginBtn.setAttribute('role', 'button');
        loginBtn.setAttribute('style', LOGIN_BTN_STYLE);
        parent.appendChild(loginBtn);
        return;
    }

    // Authenticated
    let authed: HTMLElement = document.createElement("span");
    let logoutBtn: HTMLButtonElement = document.createElement("button");
    logoutBtn.className = LOGOUT_BTN_CLASS;
    logoutBtn.onclick = (): void => {
        redirect(unAuth());
    };
    logoutBtn.innerText = logoutText;
    logoutBtn.setAttribute('style', LOGIN_BTN_STYLE);
    authed.appendChild(logoutBtn);
    parent.appendChild(authed);
};
