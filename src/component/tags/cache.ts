import { TagifyResponseItem } from '../../client/TagifyClient';

const LIMIT_KEY = btoa('limit');

class TagCache {

    setLimit(limit: number): void {
        localStorage.setItem(LIMIT_KEY, JSON.stringify({ limit }));
    }

    getLimit(): number | null {
        const cached = localStorage.getItem(LIMIT_KEY);
        if (!cached) {
            return null;
        }
        return JSON.parse(cached).limit;
    }

    removeLimit(): void {
        localStorage.removeItem(LIMIT_KEY);
    }

    setPage(key: string, page: TagifyResponseItem): void {
        localStorage.setItem(btoa(key), JSON.stringify(page));
    }

    getPage(key: string): TagifyResponseItem | null {
        const cached = localStorage.getItem(btoa(key));
        if (!cached) {
            return null;
        }
        return JSON.parse(cached);
    }

    removePage(key: string): void {
        localStorage.removeItem(btoa(key));
    }
}

export default new TagCache();