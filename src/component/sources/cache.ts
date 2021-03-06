import { TagifyResponseItem } from '../../client/TagifyClient';

const LIMIT_KEY: string = 'tagify-limit';
const API_VERSION_KEY: string = 'tagify-api-version';
const DEFAULT_CACHE_TTL: number = 1000 * 60 * 60 * 24 * 90; // 90 days
const DEFAULT_ASYNC_CACHE_TTL: number = 1000 * 60 * 15; // 15 minutes

export type CachedValue = TagLimit | ApiVersion | TagifyResponseItem;

export interface CacheItem {
    expiry?: number;
    invalidateExp?: number;
    value: CachedValue;
}

interface TagLimit {
    limit: number;
}

interface ApiVersion {
    version: string;
}

export interface TagifyPage {
    invalidateExp?: number;
    value?: TagifyResponseItem;
}

class TagCache {

    private cacheTtl: number;

    constructor(cacheTtl?: number) {
        this.cacheTtl = cacheTtl || DEFAULT_CACHE_TTL;
    }

    private set(key: string, value: CachedValue): void {
        const cachedValue: CacheItem = { value };
        localStorage.setItem(btoa(key), JSON.stringify(cachedValue));
    }

    private setWithExpiry(key: string, value: CachedValue): void {
        const now = new Date().getTime();
        const cachedValue: CacheItem = {
            expiry: now + this.cacheTtl,
            invalidateExp: now + DEFAULT_ASYNC_CACHE_TTL,
            value
        };
        localStorage.setItem(btoa(key), JSON.stringify(cachedValue));
    }

    private get(key: string): CacheItem | null {
        const cached = localStorage.getItem(btoa(key));
        if (!cached) {
            return null;
        }

        try {
            return JSON.parse(cached);
        } catch (error) {
            // ignored
            return null;
        }
    }

    private getWithExpiry(key: string): CacheItem | null {
        const value = this.get(key);
        if (!value) {
            return null;
        }

        const now = new Date().getTime();
        if (value.expiry && value.expiry < now) {
            return null;
        }

        return value;
    }

    updateTtl(durationInMillis: number): void {
        this.cacheTtl = durationInMillis;
    }

    remove(key: string): void {
        localStorage.removeItem(btoa(key));
    }

    setLimit(limit: number): void {
        this.set(LIMIT_KEY, { limit });
    }

    getLimit(): number | null {
        const cached = this.get(LIMIT_KEY);
        if (!cached) {
            return null;
        }
        return (<TagLimit>cached.value).limit;
    }

    removeLimit(): void {
        this.remove(LIMIT_KEY);
    }

    setPage(key: string, page: TagifyResponseItem): void {
        this.setWithExpiry(key, page);
    }

    getPage(key: string): TagifyPage | null {
        const cached = this.getWithExpiry(key);
        if (!cached) {
            return null;
        }
        return {
            invalidateExp: cached.invalidateExp,
            value: <TagifyResponseItem>cached.value
        };
    }

    removePage(key: string): void {
        this.remove(key);
    }

    getApiVersion(): string | null {
        const cached = this.get(API_VERSION_KEY);
        if (!cached) {
            return null;
        }
        return (<ApiVersion>cached.value).version;
    }

    setApiVersion(version: string): void {
        this.set(API_VERSION_KEY, { version });
    }
}

export default new TagCache();