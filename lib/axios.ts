import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Pour envoyer les cookies
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs et le refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Si erreur 401 et pas encore retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Si un refresh est déjà en cours, mettre en queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      if (typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          // Pas de refresh token, ne pas rediriger si on est sur une page publique
          isRefreshing = false;
          localStorage.clear();
          // Ne pas rediriger automatiquement, laisser l'app gérer
          return Promise.reject(error);
        }

        try {
          // Tenter de rafraîchir le token
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            { refreshToken },
            { withCredentials: true }
          );

          if (response.data.success) {
            const { accessToken } = response.data.data;
            localStorage.setItem('accessToken', accessToken);
            
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            }
            
            processQueue(null, accessToken);
            isRefreshing = false;
            
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          // Échec du refresh, déconnecter l'utilisateur
          processQueue(refreshError as AxiosError, null);
          isRefreshing = false;
          localStorage.clear();
          // Ne pas rediriger automatiquement, laisser l'app gérer
          return Promise.reject(refreshError);
        }
      }
    }

    // Erreur 403 - Accès refusé
    if (error.response?.status === 403) {
      const message = (error.response.data as { error?: string })?.error;
      
      // Si le partenaire n'est pas validé
      if (message?.includes('attente de validation')) {
        if (typeof window !== 'undefined') {
          window.location.href = '/partner/pending';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
