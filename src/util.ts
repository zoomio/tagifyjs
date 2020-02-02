export const getHost = (): string => {
    return `${location.protocol}//${location.hostname}` + (location.port && `:${location.port}`);
}

export const getUrl = (): string => {
    return window.location.href;
}