import { redirect } from '../config';

const APP_ID_KEY: string = 'tagify_app_id';
const APP_TOKEN_KEY: string = 'tagify_app_token';
const COOKIE_TTL: number = 1000 * 60 * 60 * 24 * 2; // 2 days

export const auth = (): string | undefined => {
    const urlParams = new URLSearchParams(window.location.search);
    const appToken = urlParams.get(APP_TOKEN_KEY);
    if (appToken && appToken.length > 0) {
        setCookie(APP_TOKEN_KEY, appToken, COOKIE_TTL);
        setCookie(APP_ID_KEY, urlParams.get(APP_ID_KEY) || '', COOKIE_TTL);
        redirect(window.location.pathname + clearAuthParams(urlParams));
    }
    return getCookie(APP_TOKEN_KEY);
}

export const isAdmin = (): boolean => {
    const t = auth();
    return t !== undefined && t !== '';
}

export const unAuth = (): string => {
    setCookie(APP_TOKEN_KEY, '', 1);
    setCookie(APP_ID_KEY, '', 1);
    return clearAuthParams(new URLSearchParams(window.location.search));
}

const clearAuthParams = (urlParams: URLSearchParams): string => {
    let q = '';
    urlParams.forEach((v, k) => {
        if (k === APP_TOKEN_KEY || k === APP_ID_KEY) {
            return;
        }
        if (q.length === 0) {
            q = '?';
        } else {
            q = '&';
        }
        q += `${v}=${k}`;
    });
    return q
}

// https://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript

function setCookie(name: string, value: string, days: number): void {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name: string): string | undefined {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return undefined;
}