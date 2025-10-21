import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Generic API State
 */
export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Generic API Hook
 * Handles loading, error, and data states for any API call
 */
export function useApi<T>(
  apiFunction: () => Promise<T>,
  immediate: boolean = true
): ApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(immediate);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction();
      setData(result);
      setError(null);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 
                          err?.message || 
                          'An unexpected error occurred';
      setError(errorMessage);
      console.error('[useApi Error]', err);
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  useEffect(() => {
    if (immediate && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchData();
    }
  }, [immediate, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
