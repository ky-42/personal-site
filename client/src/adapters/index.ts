import jsonConfig from '@config/config.json';
import { handleDatesAndNull } from './helpers';

const baseURL = import.meta.env.DEV ? 'http://localhost:8080' : jsonConfig.productionServerUrl;

const backendFetch = async <FetchType>(
  url: string,
  queryParams?: unknown,
  options?: RequestInit,
): Promise<FetchType> => {
  const newUrl = `${baseURL}${url}${
    queryParams ? `?${new URLSearchParams(queryParams as Record<string, string>).toString()}` : ''
  }`;
  const headers = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  const response = await fetch(newUrl, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'An error occurred while fetching data.');
  }

  const cleanedRespone: FetchType = handleDatesAndNull(await response.json());

  return cleanedRespone;
};

export default backendFetch;
