import apiClient from '@/lib/axios';
import { LocalCache } from '@/lib/cache';
import { Establishment, ApiResponse, PaginatedResponse } from '@/types';
import { calculateDistance, getUserLocation } from '@/lib/utils';

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
    
    const data = await LocalCache.getOrFetch(
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

    // Calculate distances if user location is available
    const userLocation = await getUserLocation();
    if (userLocation && data.data) {
      data.data = data.data.map(establishment => {
        if (establishment.latitude && establishment.longitude) {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            establishment.latitude,
            establishment.longitude
          );
          return { ...establishment, distance };
        }
        return establishment;
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
   * Récupère un établissement par son ID
   */
  async getById(id: string): Promise<ApiResponse<Establishment>> {
    const cacheKey = `establishment_${id}`;
    
    const data = await LocalCache.getOrFetch(
      cacheKey,
      async () => {
        const response = await apiClient.get<ApiResponse<Establishment>>(
          `/establishments/${id}`
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
   * Recherche des établissements
   */
  async search(query: string, filters?: {
    type?: string;
    ville?: string;
    departement?: string;
  }): Promise<ApiResponse<Establishment[]>> {
    const cacheKey = `establishments_search_${query}_${JSON.stringify(filters || {})}`;
    
    const data = await LocalCache.getOrFetch(
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

    // Calculate distances if user location is available
    const userLocation = await getUserLocation();
    if (userLocation && data.data) {
      data.data = data.data.map(establishment => {
        if (establishment.latitude && establishment.longitude) {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            establishment.latitude,
            establishment.longitude
          );
          return { ...establishment, distance };
        }
        return establishment;
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
   * Récupère les établissements d'un partenaire
   */
  async getByPartner(partnerId: string): Promise<ApiResponse<Establishment[]>> {
    const cacheKey = `establishments_partner_${partnerId}`;
    
    const data = await LocalCache.getOrFetch(
      cacheKey,
      async () => {
        const response = await apiClient.get<ApiResponse<Establishment[]>>(
          `/establishments/partner/${partnerId}`
        );
        return response.data;
      },
      CACHE_TTL
    );

    // Calculate distances if user location is available
    const userLocation = await getUserLocation();
    if (userLocation && data.data) {
      data.data = data.data.map(establishment => {
        if (establishment.latitude && establishment.longitude) {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            establishment.latitude,
            establishment.longitude
          );
          return { ...establishment, distance };
        }
        return establishment;
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
