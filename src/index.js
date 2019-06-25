import tagifyClient from './client/tagify-client';
import domRender from './render/dom';

const LIMIT = 5;

const fetchTags = (source, limit) => {
  return tagifyClient.fetchTags({ source, limit });
}

class Tagify {
  constructor({ target, source, limit = LIMIT, render = domRender } = {}) {
    this.target = target;
    this.source = source;
    this.limit = limit;
    this.render = render;
    this.tags = fetchTags(this.source, this.limit) || [];
    this.renderTags();
  }

  renderTags() {
    const { target, tags } = this;
    this.render({ target, tags });
  }

}

export default Tagify;