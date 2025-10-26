'use client';

import { useState, useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';

export interface ApiQueryState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  isEmpty: boolean;
}

export interface UseApiQueryOptions {
  /** Si false, la requête ne se lance pas automatiquement au montage */
  enabled?: boolean;
  /** Callback appelé en cas de succès */
  onSuccess?: (data: any) => void;
  /** Callback appelé en cas d'erreur */
  onError?: (error: string) => void;
}

/**
 * Hook personnalisé pour gérer les requêtes API
 * Gère automatiquement: loading states, erreurs réseau, réponses vides
 */
export function useApiQuery<T>(
  queryFn: () => Promise<T>,
  options: UseApiQueryOptions = {}
) {
  const { enabled = true, onSuccess, onError } = options;

  const [state, setState] = useState<ApiQueryState<T>>({
    data: null,
    loading: false,
    error: null,
    isEmpty: false,
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await queryFn();
      
      // Déterminer si la réponse est vide
      let isEmpty = false;
      if (result === null || result === undefined) {
        isEmpty = true;
      } else if (Array.isArray(result)) {
        isEmpty = result.length === 0;
      } else if (typeof result === 'object') {
        // Pour les objets avec data array (ApiResponse, PaginatedResponse)
        const dataObj = result as any;
        if (dataObj.data && Array.isArray(dataObj.data)) {
          isEmpty = dataObj.data.length === 0;
        }
      }

      setState({
        data: result,
        loading: false,
        error: null,
        isEmpty,
      });

      onSuccess?.(result);
    } catch (err) {
      const error = err as AxiosError;
      let errorMessage = 'Une erreur est survenue';

      if (error.response) {
        // Erreur de réponse du serveur
        const data = error.response.data as any;
        errorMessage = data?.message || `Erreur ${error.response.status}`;
      } else if (error.request) {
        // Erreur réseau (pas de réponse)
        errorMessage = 'Erreur réseau. Vérifiez votre connexion internet.';
      } else {
        // Autre erreur
        errorMessage = error.message || errorMessage;
      }

      setState({
        data: null,
        loading: false,
        error: errorMessage,
        isEmpty: false,
      });

      onError?.(errorMessage);
      console.error('API Query Error:', error);
    }
  }, [queryFn, onSuccess, onError]);

  useEffect(() => {
    if (enabled) {
      execute();
    }
  }, [enabled, execute]);

  return {
    ...state,
    refetch: execute,
  };
}

/**
 * Hook pour les mutations (POST, PUT, DELETE)
 */
export function useApiMutation<TData, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>
) {
  const [state, setState] = useState<ApiQueryState<TData>>({
    data: null,
    loading: false,
    error: null,
    isEmpty: false,
  });

  const mutate = useCallback(
    async (variables: TVariables) => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const result = await mutationFn(variables);

        setState({
          data: result,
          loading: false,
          error: null,
          isEmpty: false,
        });

        return { data: result, error: null };
      } catch (err) {
        const error = err as AxiosError;
        let errorMessage = 'Une erreur est survenue';

        if (error.response) {
          const data = error.response.data as any;
          errorMessage = data?.message || `Erreur ${error.response.status}`;
        } else if (error.request) {
          errorMessage = 'Erreur réseau. Vérifiez votre connexion internet.';
        } else {
          errorMessage = error.message || errorMessage;
        }

        setState({
          data: null,
          loading: false,
          error: errorMessage,
          isEmpty: false,
        });

        console.error('API Mutation Error:', error);
        return { data: null, error: errorMessage };
      }
    },
    [mutationFn]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      isEmpty: false,
    });
  }, []);

  return {
    ...state,
    mutate,
    reset,
  };
}
