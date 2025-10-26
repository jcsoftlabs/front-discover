'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';
import { getCurrentUser } from '@/lib/auth';

interface FavoriteButtonProps {
  establishmentId?: string;
  siteId?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function FavoriteButton({ 
  establishmentId, 
  siteId,
  className = '',
  size = 'md'
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get user ID from auth
    const user = getCurrentUser();
    if (user?.user?.id) {
      setUserId(user.user.id);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      checkFavorite();
    }
  }, [userId, establishmentId, siteId]);

  const checkFavorite = async () => {
    if (!userId) return;

    try {
      const params = new URLSearchParams({ userId });
      if (establishmentId) params.append('establishmentId', establishmentId);
      if (siteId) params.append('siteId', siteId);

      const response = await apiClient.get(`/favorites/check?${params}`);
      if (response.data.success) {
        setIsFavorite(response.data.data.isFavorite || false);
      }
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      // Could show a login prompt here
      console.log('User must be logged in to favorite');
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        // Remove favorite
        const endpoint = establishmentId
          ? `/favorites/user/${userId}/establishment/${establishmentId}`
          : `/favorites/user/${userId}/site/${siteId}`;
        await apiClient.delete(endpoint);
        setIsFavorite(false);
      } else {
        // Add favorite
        await apiClient.post('/favorites', {
          userId,
          establishmentId,
          siteId
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return null; // Don't show button if user is not logged in
  }

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`${sizeClasses[size]} flex items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      {loading ? (
        <div className={`animate-spin rounded-full border-b-2 border-red-500 ${iconSizeClasses[size]}`}></div>
      ) : (
        <svg
          className={`${iconSizeClasses[size]} ${isFavorite ? 'text-red-500' : 'text-gray-400'} transition-colors`}
          fill={isFavorite ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      )}
    </button>
  );
}
