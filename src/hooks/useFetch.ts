import { createFetch } from '@vueuse/core';
import type { CreateFetchOptions, UseFetchOptions } from '@vueuse/core';
import type { ApiResponse, HttpMethod, FetchOptions } from '../types/api';
import type { Ref } from 'vue';

interface FetchParams {
  url: string;
  params?: Record<string, any> | string;
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
}

interface TypedFetchOptions<T = any> extends UseFetchOptions {
  // Add any additional typed options here
}

// Type-safe fetch result
type FetchResult<T> = Promise<{
  data: Ref<ApiResponse<T> | null>;
  error: Ref<any>;
  isFetching: Ref<boolean>;
  canAbort: Ref<boolean>;
  aborted: Ref<boolean>;
  abort: () => void;
  execute: () => Promise<any>;
}>;

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
  instance: ReturnType<typeof createFetch>;

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

  get<T = any>({ url, params }: FetchParams, fetchOptions?: TypedFetchOptions<T>) {
    const paramStr = typeof params === 'string' ? `?${params}` : params ? object2Search(params) : '';
    return this.instance(`${url}${paramStr}`, fetchOptions || {}).json<ApiResponse<T>>();
  }

  post<T = any>({ url, params }: FetchParams, fetchOptions?: TypedFetchOptions<T>) {
    return this.instance(url, fetchOptions || {}).post(params).json<ApiResponse<T>>();
  }

  put<T = any>({ url, params }: FetchParams, fetchOptions?: TypedFetchOptions<T>) {
    return this.instance(url, fetchOptions || {}).put(params).json<ApiResponse<T>>();
  }

  patch<T = any>({ url, params }: FetchParams, fetchOptions?: TypedFetchOptions<T>) {
    return this.instance(url, fetchOptions || {}).patch(params).json<ApiResponse<T>>();
  }

  delete<T = any>({ url }: Pick<FetchParams, 'url'>, fetchOptions?: TypedFetchOptions<T>) {
    return this.instance(url, fetchOptions || {}).delete().json<ApiResponse<T>>();
  }
}

const fetchInstance = new Fetch({
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

const useMyFetch = <T = any>({ url, params, method = 'get' }: FetchParams, fetchOptions?: TypedFetchOptions<T>) => {
  const methodName = method.toLowerCase() as keyof Fetch;
  
  if (methodName === 'delete') {
    return fetchInstance.delete<T>({ url }, fetchOptions);
  }
  
  const fn = fetchInstance[methodName] as any;
  if (typeof fn === 'function') {
    return fn.call(fetchInstance, { url, params }, fetchOptions) as FetchResult<T>;
  }
  
  // Fallback to get if method not found
  return fetchInstance.get<T>({ url, params }, fetchOptions);
}

// Create a direct fetch function for non-VueUse usage
export const directFetch = async <T = any>(
  url: string, 
  options: FetchOptions & { method?: HttpMethod } = {}
): Promise<ApiResponse<T>> => {
  const { params, method = 'GET', ...fetchOptions } = options;
  
  let finalUrl = `/api${url}`;
  if (params && method === 'GET') {
    const paramStr = object2Search(params);
    finalUrl += paramStr;
  }
  
  const requestOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
    ...fetchOptions,
  };
  
  if (params && method !== 'GET') {
    requestOptions.body = JSON.stringify(params);
  }
  
  const response = await fetch(finalUrl, requestOptions);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }
  
  return data;
};

export default useMyFetch;
export type { FetchResult, TypedFetchOptions };