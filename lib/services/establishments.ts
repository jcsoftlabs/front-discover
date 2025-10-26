import apiClient from '@/lib/axios';
import { LocalCache } from '@/lib/cache';
import { Establishment, ApiResponse, PaginatedResponse } from '@/types';

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Service pour gérer les établissements (hotels, restaurants, etc.)
 */
export const establishmentsService = {
  /**
   * Récupère tous les établissements avec pagination
   */
  async getAll(params?: {
    page?: number;
    limit?: number;
    type?: string;
    ville?: string;
    departement?: string;
    isActive?: boolean;
  }): Promise<PaginatedResponse<Establishment>> {
    const cacheKey = `establishments_${JSON.stringify(params || {})}`;
    
    return LocalCache.getOrFetch(
      cacheKey,
      async () => {
        const response = await apiClient.get<PaginatedResponse<Establishment>>(
          '/establishments',
          { params }
        );
        return response.data;
      },
      CACHE_TTL
    );
  },

  /**
   * Récupère un établissement par son ID
   */
  async getById(id: string): Promise<ApiResponse<Establishment>> {
    const cacheKey = `establishment_${id}`;
    
    return LocalCache.getOrFetch(
      cacheKey,
      async () => {
        const response = await apiClient.get<ApiResponse<Establishment>>(
          `/establishments/${id}`
        );
        return response.data;
      },
      CACHE_TTL
    );
  },

  /**
   * Recherche des établissements
   */
  async search(query: string, filters?: {
    type?: string;
    ville?: string;
    departement?: string;
  }): Promise<ApiResponse<Establishment[]>> {
    const cacheKey = `establishments_search_${query}_${JSON.stringify(filters || {})}`;
    
    return LocalCache.getOrFetch(
      cacheKey,
      async () => {
        const response = await apiClient.get<ApiResponse<Establishment[]>>(
          '/establishments/search',
          { params: { q: query, ...filters } }
        );
        return response.data;
      },
      CACHE_TTL
    );
  },

  /**
   * Récupère les établissements d'un partenaire
   */
  async getByPartner(partnerId: string): Promise<ApiResponse<Establishment[]>> {
    const cacheKey = `establishments_partner_${partnerId}`;
    
    return LocalCache.getOrFetch(
      cacheKey,
      async () => {
        const response = await apiClient.get<ApiResponse<Establishment[]>>(
          `/establishments/partner/${partnerId}`
        );
        return response.data;
      },
      CACHE_TTL
    );
  },

  /**
   * Crée un nouvel établissement (invalide le cache)
   */
  async create(data: Partial<Establishment>): Promise<ApiResponse<Establishment>> {
    const response = await apiClient.post<ApiResponse<Establishment>>(
      '/establishments',
      data
    );
    
    // Invalider le cache des listings
    LocalCache.remove('establishments_');
    
    return response.data;
  },

  /**
   * Met à jour un établissement (invalide le cache)
   */
  async update(id: string, data: Partial<Establishment>): Promise<ApiResponse<Establishment>> {
    const response = await apiClient.put<ApiResponse<Establishment>>(
      `/establishments/${id}`,
      data
    );
    
    // Invalider le cache spécifique et général
    LocalCache.remove(`establishment_${id}`);
    LocalCache.remove('establishments_');
    
    return response.data;
  },

  /**
   * Supprime un établissement (invalide le cache)
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/establishments/${id}`
    );
    
    // Invalider le cache
    LocalCache.remove(`establishment_${id}`);
    LocalCache.remove('establishments_');
    
    return response.data;
  },
};
