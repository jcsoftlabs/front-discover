/**
 * Système de cache local pour améliorer les performances sur connexions lentes
 * Utilise localStorage avec expiration configurable
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes par défaut

export class LocalCache {
  private static isClient = typeof window !== 'undefined';

  /**
   * Stocke des données dans le cache avec une durée de vie
   */
  static set<T>(key: string, data: T, ttl: number = DEFAULT_TTL): void {
    if (!this.isClient) return;

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
    };

    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify(entry));
    } catch (error) {
      console.warn('Failed to save to cache:', error);
      // Si localStorage est plein, nettoyer les anciennes entrées
      this.clearExpired();
    }
  }

  /**
   * Récupère des données du cache si elles sont valides
   */
  static get<T>(key: string): T | null {
    if (!this.isClient) return null;

    try {
      const item = localStorage.getItem(`cache_${key}`);
      if (!item) return null;

      const entry: CacheEntry<T> = JSON.parse(item);

      // Vérifier l'expiration
      if (Date.now() > entry.expiresAt) {
        this.remove(key);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.warn('Failed to read from cache:', error);
      return null;
    }
  }

  /**
   * Supprime une entrée spécifique du cache
   */
  static remove(key: string): void {
    if (!this.isClient) return;
    localStorage.removeItem(`cache_${key}`);
  }

  /**
   * Nettoie toutes les entrées expirées
   */
  static clearExpired(): void {
    if (!this.isClient) return;

    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter(key => key.startsWith('cache_'));

    cacheKeys.forEach(key => {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          const entry = JSON.parse(item);
          if (Date.now() > entry.expiresAt) {
            localStorage.removeItem(key);
          }
        }
      } catch (error) {
        // Supprimer les entrées corrompues
        localStorage.removeItem(key);
      }
    });
  }

  /**
   * Vide tout le cache
   */
  static clear(): void {
    if (!this.isClient) return;

    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter(key => key.startsWith('cache_'));
    cacheKeys.forEach(key => localStorage.removeItem(key));
  }

  /**
   * Récupère des données avec fallback vers une fonction async
   * Utilise le cache si disponible, sinon exécute la fonction et met en cache
   */
  static async getOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = DEFAULT_TTL
  ): Promise<T> {
    // Essayer de récupérer depuis le cache
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Sinon, fetcher et mettre en cache
    const data = await fetchFn();
    this.set(key, data, ttl);
    return data;
  }
}

// Nettoyer les entrées expirées au chargement
if (typeof window !== 'undefined') {
  LocalCache.clearExpired();
}
