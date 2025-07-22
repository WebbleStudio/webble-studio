import { useState, useCallback } from 'react';
import { ApplicationError, ErrorCode } from '@/lib/errors';

interface ApiCallState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiCallOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

/**
 * Reusable hook for API calls with loading states and error handling
 * Provides consistent interface for all API interactions
 */
export function useApiCall<T = unknown>(options: UseApiCallOptions = {}) {
  const [state, setState] = useState<ApiCallState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (apiCall: () => Promise<Response>): Promise<T | null> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await apiCall();

        if (!response.ok) {
          const errorData = await response.json();
          throw new ApplicationError(
            ErrorCode.NETWORK_ERROR,
            errorData.error?.message || 'Errore di rete'
          );
        }

        const data = await response.json();
        setState({ data, loading: false, error: null });

        options.onSuccess?.();
        return data;
      } catch (error) {
        const errorMessage =
          error instanceof ApplicationError
            ? error.message
            : 'Si è verificato un errore imprevisto';

        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));

        options.onError?.(errorMessage);
        return null;
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}
