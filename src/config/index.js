const getEnv = () => {
    return __DEV__ ? 'development' : 'production';
}

const config = {
    development: {
        api: 'http://localhost:8080',
        appID: '<APP_ID>',
    },
    production: {
        api: 'https://zoomio.org',
        appID: '<APP_ID>',
    }
};

export const getURL = () => {
    return config[getEnv()].api;
}

export const getAppID = () => {
    return config[getEnv()].tagifyAppID;
}