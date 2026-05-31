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

  // Used text instead of json to handle cases where the response is empty,
  // which would cause json parsing to fail
  const text = await response.text();

  if (!response.ok) {
    let errorData;
    try {
      errorData = text ? JSON.parse(text) : {};
    } catch {
      errorData = {};
    }
    throw new Error(errorData.message || 'An error occurred while fetching data.');
  }

  if (!text) return {} as FetchType;
  const cleanedResponse: FetchType = JSON.parse(text);
  handleDatesAndNull(cleanedResponse);
  return cleanedResponse;
};

export default backendFetch;
