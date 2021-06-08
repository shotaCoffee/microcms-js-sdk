/**
 * microCMS API SDK
 * https://github.com/wantainc/microcms-js-sdk
 */
import fetch from 'node-fetch';
import { parseQuery } from './utils/parseQuery';
import { isString } from './utils/isCheckValue';
import { ClientParams, MakeRequest, GetRequest, PostRequest } from './types';

const BASE_DOMAIN = 'microcms.io';
const API_VERSION = 'v1';

/**
 * Initialize SDK Client
 */
const createClient = ({ serviceDomain, apiKey, apiWriteKey, globalDraftKey }: ClientParams) => {
  if (!serviceDomain || !apiKey) {
    throw new Error('parameter is required (check serviceDomain and apiKey)');
  }

  if (!isString(serviceDomain) || !isString(apiKey)) {
    throw new Error('parameter is not string');
  }

  /**
   * Defined microCMS base URL
   */
  const baseUrl = `https://${serviceDomain}.${BASE_DOMAIN}/api/${API_VERSION}`;

  /**
   * Make request
   */
  const makeRequest = async <T>({ endpoint, contentId, queries = {}, useGlobalDraftKey = true, contentData }: MakeRequest<T>): Promise<T> => {
    const queryString = parseQuery(queries);

    const baseHeaders = {
      headers: { 'X-API-KEY': apiKey },
    };

    if (globalDraftKey && useGlobalDraftKey) {
      Object.assign(baseHeaders.headers, { 'X-GLOBAL-DRAFT-KEY': globalDraftKey });
    }

    if (apiWriteKey) {
      Object.assign(baseHeaders.headers, {'X-WRITE-API-KEY': apiWriteKey})
    }

    const url = `${baseUrl}/${endpoint}${contentId ? `/${contentId}` : ''}${
      queryString ? `?${queryString}` : ''
    }`;

    try {
      const response = contentData ? await fetch(url, baseHeaders): await fetch(url, {
        method: 'POST',
        body: JSON.stringify(contentData),
        ...baseHeaders
      });

      if (!response.ok) {
        throw new Error(`fetch API response status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      if (error.data) {
        throw error.data;
      }

      if (error.response?.data) {
        throw error.response.data;
      }

      return Promise.reject(
        new Error(`serviceDomain or endpoint may be wrong.\n Details: ${error}`)
      );
    }
  };

  /**
   * Get API data for microCMS
   */
  const get = async <T>({ endpoint, contentId, queries = {}, useGlobalDraftKey }: GetRequest): Promise<T> => {
    if (!endpoint) {
      return Promise.reject(new Error('endpoint is required'));
    }
    return await makeRequest<T>({ endpoint, contentId, queries, useGlobalDraftKey });
  };

  const post = async <T>({endpoint, contentData}: PostRequest<T>): Promise<T> => {
    if (!endpoint) {
      return Promise.reject(new Error('endpoint is required'));
    }
    return await makeRequest<T>({endpoint: endpoint, contentData: contentData});
  }

  return {
    get,
    post
  };
};

export default createClient;
