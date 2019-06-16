import _ from 'lodash';

export class HttpError {
  constructor({ message, statusCode }) {
    this.message = message;
    this.statusCode = statusCode;
    this.stack = new Error().stack;
  }
}
// Babel does not support extending built-in types
// http://stackoverflow.com/questions/31089801/extending-error-in-javascript-with-es6-syntax
HttpError.prototype = Object.create(Error.prototype);

const defaultFetchOptions = {
  credentials: 'include',
  headers: {
    Accept: 'application/json',
  },
  mode: 'cors',
};

function parseResponse(response) {
  const statusCode = response.status;
  if (statusCode === 204 || statusCode === 202) {
    return null;
  }

  return response.json();
}

class RestClient {
  constructor({ serviceUrl = '', onUnauthorised = _.noop } = {}) {
    this.serviceUrl = serviceUrl;
    this.onUnauthorised = onUnauthorised;
  }

  async getResource(path, fetchOptions = {}) {
    return this.makeRequest(path, fetchOptions);
  }

  async postResource(path, data, fetchOptions = {}) {
    fetchOptions = {
      method: 'post',
      ...fetchOptions,
    };

    if (data) {
      fetchOptions = _.assign({}, fetchOptions, {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
      });
    }

    return this.makeRequest(path, fetchOptions);
  }

  async makeRequest(path, additionalFetchOptions = {}) {
    const url = this.serviceUrl + path;
    const options = _.merge({}, defaultFetchOptions, additionalFetchOptions, {
      headers: this.localeOverrideHeader,
    });
    const response = await fetch(url, options);

    if (!response.ok) {
      const statusCode = response.status;
      if (statusCode === 401) {
        this.onUnauthorised();
      }

      const text = await response.text();
      throw new HttpError({ message: text, statusCode });
    }

    return additionalFetchOptions.ignoreResponse
      ? null
      : parseResponse(response);
  }
}

export default RestClient;
