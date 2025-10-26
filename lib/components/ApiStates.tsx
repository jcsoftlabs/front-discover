'use client';

/**
 * Composants réutilisables pour afficher les états de chargement, erreurs et réponses vides
 */

interface LoadingProps {
  message?: string;
}

export function Loading({ message = 'Chargement...' }: LoadingProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  );
}

interface ErrorMessageProps {
  error: string;
  onRetry?: () => void;
}

export function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <div className="flex items-start">
        <svg
          className="h-6 w-6 text-red-600 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">Erreur</h3>
          <p className="mt-1 text-sm text-red-700">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 text-sm font-medium text-red-600 hover:text-red-500"
            >
              Réessayer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = 'Aucun résultat',
  message = 'Aucune donnée disponible pour le moment.',
  icon,
}: EmptyStateProps) {
  return (
    <div className="text-center p-8">
      {icon || (
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      )}
      <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
    </div>
  );
}

interface ApiStateWrapperProps<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  isEmpty: boolean;
  onRetry?: () => void;
  emptyState?: EmptyStateProps;
  children: (data: T) => React.ReactNode;
}

/**
 * Wrapper qui gère automatiquement l'affichage selon l'état de la requête
 */
export function ApiStateWrapper<T>({
  data,
  loading,
  error,
  isEmpty,
  onRetry,
  emptyState,
  children,
}: ApiStateWrapperProps<T>) {
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={onRetry} />;
  }

  if (isEmpty || !data) {
    return <EmptyState {...emptyState} />;
  }

  return <>{children(data)}</>;
}
