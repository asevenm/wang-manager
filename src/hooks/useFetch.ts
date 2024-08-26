import { createFetch, } from '@vueuse/core';
import type { CreateFetchOptions, UseFetchOptions  } from '@vueuse/core';

interface FetchParams {
  url: string;
  params?: Record<string, any> | string;
  method?: 'get' | 'post';
}

const object2Search = (obj: Record<string, any>) => {
  let search = '?';
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (value !== undefined && value !== null) {
      search += `${key}=${value}&`;
    }
  });
  return search.slice(0, search.length - 1);
}

class Fetch {
  instance;

  constructor(config: CreateFetchOptions) {
    const {
      baseUrl = '/api',
      fetchOptions = {
        mode: 'cors',
      },
      options,
    } = config;
    this.instance = createFetch({
      baseUrl,
      fetchOptions,
      options,
    });
  }

  get({ url, params }: FetchParams, fetchOptions: UseFetchOptions) {
    const paramStr = typeof params === 'string' ? `?${params}` : params ? object2Search(params) : '';
    return this.instance(`${url}${paramStr}`, fetchOptions).json();
  }

  post({ url, params }: FetchParams, fetchOptions: UseFetchOptions) {
    return this.instance(url, fetchOptions).post(params).json();
  }
}

const fetch = new Fetch({
    baseUrl: '/api',
    combination: 'overwrite',
    options: {
      // beforeFetch in pre-configured instance will only run when the newly spawned instance do not pass beforeFetch
      async beforeFetch({ options }) {
        // const myToken = await getMyToken()
        // options.headers.Authorization = `Bearer ${myToken}`
  
        return { options }
      },
      async afterFetch(ctx) {
        const { data } = ctx;
        ctx.data = data.data;
        return ctx;
      },
    },
  });

const useMyFetch = ({ url, params, method }: FetchParams, fetchOptions?: UseFetchOptions) => {
  const fn = method ? fetch[method].bind(fetch) : fetch.get.bind(fetch);
  return fn({ url, params }, fetchOptions || {});
}

export default useMyFetch;