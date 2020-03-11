import { api } from '../config/index'

class HttpError {
  message: string;
  stack?: string;
  statusCode: number;

  constructor({ message, statusCode }: { message: string; statusCode: number }) {
    this.message = message;
    this.statusCode = statusCode;
    this.stack = new Error().stack;
  }
}

const defaultFetchOptions = {
  credentials: 'include',
  headers: {
    Accept: 'application/json',
  },
  mode: 'cors',
};

// Ideally we should check the content-type header if it is application/json but this would make
// most tests fail currently since fetch-mock doesn't set any headers.
function parseResponse<T>(response: Response): Promise<T> {
  const statusCode = response.status;
  if (statusCode === 204 || statusCode === 202) {
    return new Promise<T>(() => { });
  }

  return response.json();
}

export interface RestClientParams {
  baseUrl?: string;
  defaultFetchOptions?: object;
  onUnauthorised?: () => void;
}

class RestClient {
  protected baseUrl: string;
  protected defaultFetchOptions: object;
  protected onUnauthorised: () => void;

  constructor(params: RestClientParams = {}) {
    this.baseUrl = params.baseUrl || api() || '';
    this.defaultFetchOptions = params.defaultFetchOptions || defaultFetchOptions;
    this.onUnauthorised = params.onUnauthorised || function () { };
  }

  // T: return type
  // D: DELETE data type
  async deleteResource<T, D>(path: string, data?: D, additionalFetchOptions?: object): Promise<T> {
    let fetchOptions;
    if (data) {
      fetchOptions = {
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json',
        },
      };
    }
    if (additionalFetchOptions) {
      fetchOptions = {
        ...fetchOptions,
        ...additionalFetchOptions,
      }
    }
    return await this.fetchJson<T>(path, 'DELETE', fetchOptions);
  }

  async getResource<T>(path: string, additionalFetchOptions: object = {}): Promise<T> {
    return await this.fetchJson<T>(path, 'GET', additionalFetchOptions);
  }

  // T: return type
  // D: POST data type
  async postResource<T, D>(path: string, data: D, additionalFetchOptions?: object): Promise<T> {
    let fetchOptions = {
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json',
      }
    };

    if (additionalFetchOptions) {
      fetchOptions = {
        ...fetchOptions,
        ...additionalFetchOptions,
      }
    }

    return await this.fetchJson<T>(path, 'POST', fetchOptions);
  }

  // D: POST data type
  async postResourceIgnoreResponse<D>(path: string, data?: D): Promise<void> {
    let fetchOptions;
    if (data) {
      fetchOptions = {
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json',
        },
      };
    }
    await this.fetchResource(path, 'POST', fetchOptions);
  }

  // T: return type
  // D: PUT data type
  async putResource<T, D>(path: string, data?: D, additionalFetchOptions: object = {}): Promise<T> {
    let fetchOptions;
    if (data) {
      fetchOptions = {
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json',
        }
      };
    }
    if (additionalFetchOptions) {
      fetchOptions = {
        ...fetchOptions,
        ...additionalFetchOptions,
      }
    }
    return await this.fetchJson<T>(path, 'PUT', fetchOptions);
  }

  protected async fetchResource(path: string, method: string, additionalFetchOptions: object = {}): Promise<Response> {
    const response = await fetch(this.baseUrl + path, {
      credentials: 'include',
      method,
      ...this.defaultFetchOptions,
      ...additionalFetchOptions,
    });
    const statusCode = response.status;

    if (!response.ok) {
      if (statusCode === 401) {
        this.onUnauthorised();
      }

      const text = await response.text();
      throw new HttpError({ message: text, statusCode });
    }

    return response;
  }

  // T: response return type
  private async fetchJson<T>(path: string, method: string, additionalFetchOptions: object = {}): Promise<T> {
    const response = await this.fetchResource(path, method, additionalFetchOptions);
    return parseResponse(response);
    // const text = await response.text();

    // trying to parse empty response as JSON throws an error, but endpoints can return empty response in case of success
    // return text ? JSON.parse(text) : {};
  }
}

export default RestClient;
