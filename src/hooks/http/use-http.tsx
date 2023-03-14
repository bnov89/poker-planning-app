import React, { useState } from 'react';

export interface RequestConfig {
  url: any;
  method: 'POST' | 'GET';
  headers?: HeadersInit;
  body?: BodyInit;
}

export interface ErrorResponse {
  httpCode: number;
  error?: Error;
}

export interface Error {
  reason: string;
}


export interface CallState {
  isLoading: boolean;
  error: ErrorResponse;
}

export interface UseHttpReturn extends CallState {
  sendRequest: <T>(
    requestConfig: RequestConfig,
    applyData: (data: T) => void
  ) => Promise<void>;
}

function useHttp(): UseHttpReturn {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorResponse>(null);

  const sendRequest = async function <T>(
    requestConfig: RequestConfig,
    applyData: (data: T) => void
  ) {
    setIsLoading(true);
    try {
      const response = await fetch(requestConfig.url, {
        method: requestConfig.method,
        headers: requestConfig.headers ? requestConfig.headers : {},
        body: requestConfig.body ? requestConfig.body : null,
      });
      if (response.ok) {
        applyData(await response.json());
        setError(null);
      } else {
        setError({
          httpCode: response.status,
          error: await response.json(),
        });
      }
    } catch (err) {
      setError({
        httpCode: err.code,
        error: { reason: err.message },
      });
    }
    setIsLoading(false);
  };
  return { isLoading, sendRequest, error };
}

export default useHttp;
