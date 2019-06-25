const getEnv = () => {
    return __DEV__ ? 'development' : 'production';
}

const config = {
    development: {
        api: 'http://localhost:8080/api/tagify',
        appID: '<APP_ID>',
    },
    production: {
        api: 'https://zoomio.org/api/tagify',
        appID: '<APP_ID>',
    }
};

export const api = () => {
    return config[getEnv()].api;
}

export const appID = () => {
    return config[getEnv()].tagifyAppID;
}