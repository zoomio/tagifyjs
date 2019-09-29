import tagifyClient, { TagItem } from './client/TagifyClient';
import domRender, { RenderRequest } from './render/dom';

const LIMIT = 5;

const fetchTags = async (source: string, limit: number, query: string) => {
  const { data } = await tagifyClient.fetchTags({ source, limit, query });
  return data && data.tags ? data.tags : [];
}

export interface TagifyParams {
  target: HTMLScriptElement;
  source: string;
  query?: string;
  limit?: number;
  render?: (request: RenderRequest) => void;
}

export class Tagify {
  private target: HTMLScriptElement;
  private source: string;
  private query: string;
  private limit: number;
  private render: (request: RenderRequest) => void;
  private tags: TagItem[] = [];

  constructor(params: TagifyParams) {
    this.target = params.target;
    this.source = params.source;
    this.query = params.query || '';
    this.limit = params.limit || LIMIT;
    this.render = params.render || domRender;
    this.renderTags();
  }

  async renderTags() {
    const { target, source, query, limit, tags, render } = this;

    if (tags.length == 0) {
      this.tags = await fetchTags(source, limit, query);
    }

    if (tags.length > 0) {
      render({ target, tags });
    }
  }

}