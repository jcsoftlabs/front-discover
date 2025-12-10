'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import apiClient from '@/lib/axios';

interface FavoriteButtonProps {
  establishmentId?: string;
  siteId?: string;
  initialIsFavorite?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onAuthRequired?: () => void;
}

export default function FavoriteButton({
  establishmentId,
  siteId,
  initialIsFavorite = false,
  size = 'md',
  onAuthRequired,
}: FavoriteButtonProps) {
  const { user, isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);

  // Vérifier si l'établissement/site est déjà en favoris au chargement
  useEffect(() => {
    if (isAuthenticated && user && (establishmentId || siteId)) {
      checkIfFavorite();
    }
  }, [isAuthenticated, user, establishmentId, siteId]);

  const checkIfFavorite = async () => {
    if (!user) return;
    
    try {
      const params = new URLSearchParams({ userId: user.id });
      if (establishmentId) {
        params.append('establishmentId', establishmentId);
      } else if (siteId) {
        params.append('siteId', siteId);
      }
      
      const response = await apiClient.get(`/favorites/check?${params.toString()}`);
      if (response.data.success) {
        setIsFavorite(response.data.data.isFavorite);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du favori:', error);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated || !user) {
      console.log('🔒 Utilisateur non authentifié, ouverture du modal');
      onAuthRequired?.();
      return;
    }

    console.log('❤️ Action favori:', { 
      action: isFavorite ? 'retirer' : 'ajouter',
      userId: user.id,
      establishmentId,
      siteId 
    });

    setIsLoading(true);
    try {
      if (isFavorite) {
        // Retirer des favoris
        if (establishmentId) {
          const response = await apiClient.delete(`/favorites/user/${user.id}/establishment/${establishmentId}`);
          console.log('✅ Favori retiré:', response.data);
        } else if (siteId) {
          const response = await apiClient.delete(`/favorites/user/${user.id}/site/${siteId}`);
          console.log('✅ Favori retiré:', response.data);
        }
        setIsFavorite(false);
      } else {
        // Ajouter aux favoris
        const payload: any = { userId: user.id };
        if (establishmentId) {
          payload.establishmentId = establishmentId;
        } else if (siteId) {
          payload.siteId = siteId;
        }
        console.log('📤 Payload favori:', payload);
        const response = await apiClient.post('/favorites', payload);
        console.log('✅ Favori ajouté:', response.data);
        setIsFavorite(true);
      }
    } catch (error: any) {
      console.error('❌ Erreur lors de la gestion du favori:', error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`${sizeClasses[size]} ${
        isFavorite
          ? 'bg-red-500 hover:bg-red-600'
          : 'bg-white hover:bg-gray-50'
      } rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${
        isLoading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <Heart
        className={`${iconSizes[size]} ${
          isFavorite ? 'text-white' : 'text-gray-600'
        }`}
        fill={isFavorite ? 'currentColor' : 'none'}
      />
    </motion.button>
  );
}
