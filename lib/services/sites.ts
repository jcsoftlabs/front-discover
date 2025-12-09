import apiClient from '@/lib/axios';
import { LocalCache } from '@/lib/cache';
import { Site, ApiResponse, PaginatedResponse } from '@/types';
import { calculateDistance, getUserLocation } from '@/lib/utils';

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
    
    const data = await LocalCache.getOrFetch(
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

    // Calculate distances if user location is available
    const userLocation = await getUserLocation();
    if (userLocation && data.data) {
      data.data = data.data.map(site => {
        if (site.latitude && site.longitude) {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            site.latitude,
            site.longitude
          );
          return { ...site, distance };
        }
        return site;
      });

      // Sort by distance
      data.data.sort((a, b) => {
        if (a.distance === undefined && b.distance === undefined) return 0;
        if (a.distance === undefined) return 1;
        if (b.distance === undefined) return -1;
        return a.distance - b.distance;
      });
    }

    return data;
  },

  /**
   * Récupère un site par son ID
   */
  async getById(id: string): Promise<ApiResponse<Site>> {
    const cacheKey = `site_${id}`;
    
    const data = await LocalCache.getOrFetch(
      cacheKey,
      async () => {
        const response = await apiClient.get<ApiResponse<Site>>(
          `/sites/${id}`
        );
        return response.data;
      },
      CACHE_TTL
    );

    // Calculate distance if user location is available
    const userLocation = await getUserLocation();
    if (userLocation && data.data?.latitude && data.data?.longitude) {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        data.data.latitude,
        data.data.longitude
      );
      data.data = { ...data.data, distance };
    }

    return data;
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
    
    const data = await LocalCache.getOrFetch(
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

    // Calculate distances if user location is available
    const userLocation = await getUserLocation();
    if (userLocation && data.data) {
      data.data = data.data.map(site => {
        if (site.latitude && site.longitude) {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            site.latitude,
            site.longitude
          );
          return { ...site, distance };
        }
        return site;
      });

      // Sort by distance
      data.data.sort((a, b) => {
        if (a.distance === undefined && b.distance === undefined) return 0;
        if (a.distance === undefined) return 1;
        if (b.distance === undefined) return -1;
        return a.distance - b.distance;
      });
    }

    return data;
  },

  /**
   * Récupère les sites par catégorie
   */
  async getByCategory(category: string): Promise<ApiResponse<Site[]>> {
    const cacheKey = `sites_category_${category}`;
    
    const data = await LocalCache.getOrFetch(
      cacheKey,
      async () => {
        const response = await apiClient.get<ApiResponse<Site[]>>(
          `/sites/category/${category}`
        );
        return response.data;
      },
      CACHE_TTL
    );

    // Calculate distances if user location is available
    const userLocation = await getUserLocation();
    if (userLocation && data.data) {
      data.data = data.data.map(site => {
        if (site.latitude && site.longitude) {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            site.latitude,
            site.longitude
          );
          return { ...site, distance };
        }
        return site;
      });

      // Sort by distance
      data.data.sort((a, b) => {
        if (a.distance === undefined && b.distance === undefined) return 0;
        if (a.distance === undefined) return 1;
        if (b.distance === undefined) return -1;
        return a.distance - b.distance;
      });
    }

    return data;
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
