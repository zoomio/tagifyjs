const APP_TOKEN_KEY: string = 'tagify_app_token';
const COOKIE_TTL: number = 1000 * 60 * 60 * 24 * 7; // 7 days

export const getAppToken = (): string | undefined => {
    const urlParams = new URLSearchParams(window.location.search);
    const appToken = urlParams.get(APP_TOKEN_KEY);
    if (appToken && appToken.length > 0) {
        // todo: set cookie && return appToken
        setCookie(APP_TOKEN_KEY, appToken, COOKIE_TTL);
        return appToken;
    }
    return getCookie(APP_TOKEN_KEY);
}

export const isAdmin = (): boolean => {
    const t = getAppToken();
    return t !== undefined && t !== '';
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

function eraseCookie(name: string) {
    document.cookie = name + '=; Max-Age=-99999999;';
}