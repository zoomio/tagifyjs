import { TagItem } from '../client/TagifyClient'

/**
 * Request for rendering tags.
 */
export interface RenderRequest {
    target: HTMLScriptElement;
    tags: TagItem[];
}

export type Render = (request: RenderRequest) => void;