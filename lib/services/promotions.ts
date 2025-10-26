import apiClient from '@/lib/axios';
import { LocalCache } from '@/lib/cache';
import { Promotion, ApiResponse, PaginatedResponse } from '@/types';

const CACHE_TTL = 3 * 60 * 1000; // 3 minutes (promotions changent plus souvent)

/**
 * Service pour gérer les promotions
 */
export const promotionsService = {
  /**
   * Récupère toutes les promotions avec pagination
   */
  async getAll(params?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
  }): Promise<PaginatedResponse<Promotion>> {
    const cacheKey = `promotions_${JSON.stringify(params || {})}`;
    
    return LocalCache.getOrFetch(
      cacheKey,
      async () => {
        const response = await apiClient.get<PaginatedResponse<Promotion>>(
          '/promotions',
          { params }
        );
        return response.data;
      },
      CACHE_TTL
    );
  },

  /**
   * Récupère une promotion par son ID
   */
  async getById(id: string): Promise<ApiResponse<Promotion>> {
    const cacheKey = `promotion_${id}`;
    
    return LocalCache.getOrFetch(
      cacheKey,
      async () => {
        const response = await apiClient.get<ApiResponse<Promotion>>(
          `/promotions/${id}`
        );
        return response.data;
      },
      CACHE_TTL
    );
  },

  /**
   * Récupère les promotions actives
   */
  async getActive(): Promise<ApiResponse<Promotion[]>> {
    const cacheKey = 'promotions_active';
    
    return LocalCache.getOrFetch(
      cacheKey,
      async () => {
        const response = await apiClient.get<ApiResponse<Promotion[]>>(
          '/promotions/active'
        );
        return response.data;
      },
      CACHE_TTL
    );
  },

  /**
   * Récupère les promotions d'un établissement
   */
  async getByEstablishment(establishmentId: string): Promise<ApiResponse<Promotion[]>> {
    const cacheKey = `promotions_establishment_${establishmentId}`;
    
    return LocalCache.getOrFetch(
      cacheKey,
      async () => {
        const response = await apiClient.get<ApiResponse<Promotion[]>>(
          `/promotions/establishment/${establishmentId}`
        );
        return response.data;
      },
      CACHE_TTL
    );
  },

  /**
   * Crée une nouvelle promotion (invalide le cache)
   */
  async create(data: Partial<Promotion>): Promise<ApiResponse<Promotion>> {
    const response = await apiClient.post<ApiResponse<Promotion>>(
      '/promotions',
      data
    );
    
    // Invalider le cache des promotions
    LocalCache.remove('promotions_');
    
    return response.data;
  },

  /**
   * Met à jour une promotion (invalide le cache)
   */
  async update(id: string, data: Partial<Promotion>): Promise<ApiResponse<Promotion>> {
    const response = await apiClient.put<ApiResponse<Promotion>>(
      `/promotions/${id}`,
      data
    );
    
    // Invalider le cache spécifique et général
    LocalCache.remove(`promotion_${id}`);
    LocalCache.remove('promotions_');
    
    return response.data;
  },

  /**
   * Supprime une promotion (invalide le cache)
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/promotions/${id}`
    );
    
    // Invalider le cache
    LocalCache.remove(`promotion_${id}`);
    LocalCache.remove('promotions_');
    
    return response.data;
  },
};
