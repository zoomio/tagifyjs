import { auth } from './auth';
import { appendLogin } from './component/login';
import { isDev } from './config';

const LOG_PREFIX = '[renderLogin]';

export interface LoginParams {
    appId: string;
    targetId: string;
}

export const renderLogin = (params: LoginParams): void => {
    const appToken = auth();
    const { appId, targetId } = params;
    if (isDev()) {
        console.log(`${LOG_PREFIX} params: ${JSON.stringify(params)}`);
    }
    const container = document.getElementById(targetId);
    if (!container) {
        console.error(`${LOG_PREFIX} HTML element not found by ID: ${targetId}`);
        return;
    }
    appendLogin({ appId, appToken, container });
}
