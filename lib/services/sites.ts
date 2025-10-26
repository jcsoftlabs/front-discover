import apiClient from '@/lib/axios';
import { LocalCache } from '@/lib/cache';
import { Site, ApiResponse, PaginatedResponse } from '@/types';

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Service pour gérer les sites touristiques (monuments, plages, parcs, etc.)
 */
export const sitesService = {
  /**
   * Récupère tous les sites avec pagination
   */
  async getAll(params?: {
    page?: number;
    limit?: number;
    category?: string;
    ville?: string;
    departement?: string;
    isActive?: boolean;
  }): Promise<PaginatedResponse<Site>> {
    const cacheKey = `sites_${JSON.stringify(params || {})}`;
    
    return LocalCache.getOrFetch(
      cacheKey,
      async () => {
        const response = await apiClient.get<PaginatedResponse<Site>>(
          '/sites',
          { params }
        );
        return response.data;
      },
      CACHE_TTL
    );
  },

  /**
   * Récupère un site par son ID
   */
  async getById(id: string): Promise<ApiResponse<Site>> {
    const cacheKey = `site_${id}`;
    
    return LocalCache.getOrFetch(
      cacheKey,
      async () => {
        const response = await apiClient.get<ApiResponse<Site>>(
          `/sites/${id}`
        );
        return response.data;
      },
      CACHE_TTL
    );
  },

  /**
   * Recherche des sites
   */
  async search(query: string, filters?: {
    category?: string;
    ville?: string;
    departement?: string;
  }): Promise<ApiResponse<Site[]>> {
    const cacheKey = `sites_search_${query}_${JSON.stringify(filters || {})}`;
    
    return LocalCache.getOrFetch(
      cacheKey,
      async () => {
        const response = await apiClient.get<ApiResponse<Site[]>>(
          '/sites/search',
          { params: { q: query, ...filters } }
        );
        return response.data;
      },
      CACHE_TTL
    );
  },

  /**
   * Récupère les sites par catégorie
   */
  async getByCategory(category: string): Promise<ApiResponse<Site[]>> {
    const cacheKey = `sites_category_${category}`;
    
    return LocalCache.getOrFetch(
      cacheKey,
      async () => {
        const response = await apiClient.get<ApiResponse<Site[]>>(
          `/sites/category/${category}`
        );
        return response.data;
      },
      CACHE_TTL
    );
  },

  /**
   * Crée un nouveau site (invalide le cache)
   */
  async create(data: Partial<Site>): Promise<ApiResponse<Site>> {
    const response = await apiClient.post<ApiResponse<Site>>(
      '/sites',
      data
    );
    
    // Invalider le cache des sites
    LocalCache.remove('sites_');
    
    return response.data;
  },

  /**
   * Met à jour un site (invalide le cache)
   */
  async update(id: string, data: Partial<Site>): Promise<ApiResponse<Site>> {
    const response = await apiClient.put<ApiResponse<Site>>(
      `/sites/${id}`,
      data
    );
    
    // Invalider le cache spécifique et général
    LocalCache.remove(`site_${id}`);
    LocalCache.remove('sites_');
    
    return response.data;
  },

  /**
   * Supprime un site (invalide le cache)
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/sites/${id}`
    );
    
    // Invalider le cache
    LocalCache.remove(`site_${id}`);
    LocalCache.remove('sites_');
    
    return response.data;
  },
};
