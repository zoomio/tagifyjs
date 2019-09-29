type Env = 'development' | 'production';

const config = {
    api: 'http://localhost:8080/api/tagify',
    appID: '<APP_ID>',
};

type Config = typeof config;

type EnvironmentOverrides = { [env in Env]?: Partial<Config> };

const getEnv = (): Env => {
    return __DEV__ ? 'development' : 'production';
}

const environmentOverrides: EnvironmentOverrides = {
    development: {
        api: 'http://localhost:8080/api/tagify',
        appID: '<APP_ID>',
    },
    production: {
        api: 'https://zoomio.org/api/tagify',
        appID: '<APP_ID>',
    }
};

export const api = (): string | undefined => {
    const cfg = environmentOverrides[getEnv()];
    if (!cfg) {
        return undefined;
    }
    return cfg.api;
}

export const appID = (): string | undefined => {
    const cfg = environmentOverrides[getEnv()];
    if (!cfg) {
        return undefined;
    }
    return cfg.appID;
}