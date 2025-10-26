import apiClient from '@/lib/axios';
import { LocalCache } from '@/lib/cache';
import { Review, ApiResponse, PaginatedResponse } from '@/types';

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Service pour gérer les avis
 */
export const reviewsService = {
  /**
   * Récupère tous les avis avec pagination
   */
  async getAll(params?: {
    page?: number;
    limit?: number;
    status?: 'PENDING' | 'APPROVED' | 'REJECTED';
    establishmentId?: string;
  }): Promise<PaginatedResponse<Review>> {
    const cacheKey = `reviews_${JSON.stringify(params || {})}`;
    
    return LocalCache.getOrFetch(
      cacheKey,
      async () => {
        const response = await apiClient.get<PaginatedResponse<Review>>(
          '/reviews',
          { params }
        );
        return response.data;
      },
      CACHE_TTL
    );
  },

  /**
   * Récupère un avis par son ID
   */
  async getById(id: string): Promise<ApiResponse<Review>> {
    const cacheKey = `review_${id}`;
    
    return LocalCache.getOrFetch(
      cacheKey,
      async () => {
        const response = await apiClient.get<ApiResponse<Review>>(
          `/reviews/${id}`
        );
        return response.data;
      },
      CACHE_TTL
    );
  },

  /**
   * Récupère les avis d'un établissement
   */
  async getByEstablishment(establishmentId: string, params?: {
    page?: number;
    limit?: number;
    status?: 'APPROVED';
  }): Promise<PaginatedResponse<Review>> {
    const cacheKey = `reviews_establishment_${establishmentId}_${JSON.stringify(params || {})}`;
    
    return LocalCache.getOrFetch(
      cacheKey,
      async () => {
        const response = await apiClient.get<PaginatedResponse<Review>>(
          `/reviews/establishment/${establishmentId}`,
          { params }
        );
        return response.data;
      },
      CACHE_TTL
    );
  },

  /**
   * Récupère les avis en attente de modération
   */
  async getPending(): Promise<ApiResponse<Review[]>> {
    const cacheKey = 'reviews_pending';
    
    return LocalCache.getOrFetch(
      cacheKey,
      async () => {
        const response = await apiClient.get<ApiResponse<Review[]>>(
          '/reviews/pending'
        );
        return response.data;
      },
      CACHE_TTL
    );
  },

  /**
   * Crée un nouvel avis (invalide le cache)
   */
  async create(data: {
    rating: number;
    comment?: string;
    establishmentId: string;
  }): Promise<ApiResponse<Review>> {
    const response = await apiClient.post<ApiResponse<Review>>(
      '/reviews',
      data
    );
    
    // Invalider le cache des avis
    LocalCache.remove('reviews_');
    
    return response.data;
  },

  /**
   * Met à jour un avis (invalide le cache)
   */
  async update(id: string, data: Partial<Review>): Promise<ApiResponse<Review>> {
    const response = await apiClient.put<ApiResponse<Review>>(
      `/reviews/${id}`,
      data
    );
    
    // Invalider le cache spécifique et général
    LocalCache.remove(`review_${id}`);
    LocalCache.remove('reviews_');
    
    return response.data;
  },

  /**
   * Modère un avis (approuve ou rejette)
   */
  async moderate(
    id: string,
    data: {
      status: 'APPROVED' | 'REJECTED';
      moderationNote?: string;
    }
  ): Promise<ApiResponse<Review>> {
    const response = await apiClient.put<ApiResponse<Review>>(
      `/reviews/${id}/moderate`,
      data
    );
    
    // Invalider le cache
    LocalCache.remove(`review_${id}`);
    LocalCache.remove('reviews_');
    
    return response.data;
  },

  /**
   * Supprime un avis (invalide le cache)
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/reviews/${id}`
    );
    
    // Invalider le cache
    LocalCache.remove(`review_${id}`);
    LocalCache.remove('reviews_');
    
    return response.data;
  },
};
