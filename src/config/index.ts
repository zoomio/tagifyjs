// default number of relevant tags for a page.
export const DEFAULT_TAG_LIMIT = 5;

// default number of relevant pages for the tag.
export const DEFAULT_RELEVANT_LIMIT = 10;

// default size of batch request, 
// i.e. how many pages to handle in a single request.
export const DEFAULT_REQUEST_BATCH_LIMIT = 5;

type Env = 'development' | 'production';

const config = {
    api: 'http://localhost:8080/api/tagify',
};

type Config = typeof config;

type EnvironmentOverrides = { [env in Env]?: Partial<Config> };

const getEnv = (): Env => {
    return __DEV__ ? 'development' : 'production';
}

const environmentOverrides: EnvironmentOverrides = {
    development: {
        api: 'http://localhost:8080/api/tagify',
    },
    production: {
        api: 'https://zoomio.org/api/tagify',
    }
};

export const isDev = (): boolean => {
    return getEnv() === 'development';
}

export const api = (): string | undefined => {
    const cfg = environmentOverrides[getEnv()];
    if (!cfg) {
        return undefined;
    }
    return cfg.api;
}

export const redirect = (hostname: string): void => {
    window.location.assign(hostname);
}

export const locationHref = (): string => {
    return window.location.href;
}
