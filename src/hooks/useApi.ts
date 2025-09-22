import axios, { AxiosRequestConfig, Method } from 'axios';
import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface ApiOptions {
  method?: ApiMethod;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  axiosConfig?: AxiosRequestConfig;
}

export async function apiRequest(endpoint: string, options: ApiOptions = {}) {
  const url = BASE_URL + endpoint;
  const method: Method = options.method || 'GET';
  const config: AxiosRequestConfig = {
    url,
    method,
    headers: options.headers,
    params: options.params,
    data: options.data,
    ...options.axiosConfig,
  };
  const res = await axios(config);
  return res.data;
}

export function useApiQuery<T = any>(
  key: any[],
  endpoint: string,
  options: ApiOptions = {},
  queryOptions?: Omit<UseQueryOptions<T, any, T, any[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery<T, any, T, any[]>({
    queryKey: key,
    queryFn: () => apiRequest(endpoint, options),
    ...queryOptions
  });
}

export function useApiMutation<T = any>(
  endpoint: string,
  method: ApiMethod,
  mutationOptions?: UseMutationOptions<T, any, ApiOptions>
) {
  return useMutation<T, any, ApiOptions>({
    mutationFn: (options: ApiOptions) => apiRequest(endpoint, { ...options, method }),
    ...mutationOptions
  });
}
