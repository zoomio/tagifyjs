export const getHost = (): string => {
    return `${location.protocol}//${location.hostname}` + (location.port && `:${location.port}`);
}

export const getUrl = (): string => {
    const src = window.location.href;
    if (src.endsWith('/')) {
        return src.substr(0, src.length - 1);
    }
    return src;
}