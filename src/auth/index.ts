import { redirect } from '../config';

const APP_TOKEN: string = 'token';
const APP_TOKEN_COOKIE: string = 'tagify_token';
const COOKIE_TTL: number = 1000 * 60 * 60 * 24 * 2; // 2 days

export const auth = (): string | undefined => {
    const urlParams = new URLSearchParams(window.location.search);
    const appToken = urlParams.get(APP_TOKEN);
    if (appToken && appToken.length > 0) {
        setCookie(APP_TOKEN_COOKIE, appToken, COOKIE_TTL);
        redirect(window.location.pathname + clearAuthParams(urlParams));
    }
    return getCookie(APP_TOKEN_COOKIE);
}

export const isAuthed = (): boolean => {
    const t = auth();
    return t !== undefined && t !== '';
}

export const unAuth = (): string => {
    setCookie(APP_TOKEN_COOKIE, '', 1);
    return clearAuthParams(new URLSearchParams(window.location.search));
}

const clearAuthParams = (urlParams: URLSearchParams): string => {
    let q = '';
    urlParams.forEach((value, key) => {
        if (key === APP_TOKEN) {
            return;
        }
        if (q.length === 0) {
            q = '?';
        } else {
            q = '&';
        }
        q += `${key}=${value}`;
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