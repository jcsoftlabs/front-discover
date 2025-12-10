'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import apiClient from '@/lib/axios';
import ListingCard from '@/components/ui/ListingCard';
import AuthModal from '@/components/modals/AuthModal';
import type { Establishment } from '@/types';

export default function FavoritesPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [favorites, setFavorites] = useState<(Establishment & { averageRating?: number; reviewCount?: number })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      setIsLoading(false);
      return;
    }
    
    fetchFavorites();
  }, [isAuthenticated]);

  const fetchFavorites = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/favorites');
      if (response.data.success) {
        // Map favorites to establishments with ratings
        const favoritesData = response.data.data.map((fav: any) => {
          const establishment = fav.establishment;
          const reviews = establishment.reviews || [];
          const averageRating = reviews.length > 0
            ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
            : 0;
          
          return {
            ...establishment,
            averageRating,
            reviewCount: reviews.length,
          };
        });
        setFavorites(favoritesData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthModalClose = () => {
    setIsAuthModalOpen(false);
    if (!isAuthenticated) {
      router.push('/');
    }
  };

  if (!isAuthenticated && !isAuthModalOpen) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-700 hover:text-red-500 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </button>
            <div className="flex items-center gap-2 text-red-500">
              <Heart className="w-6 h-6 fill-current" />
              <span className="font-semibold text-lg">Mes Favoris</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden text-white py-16"
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url("https://visithaiti.com/wp-content/uploads/2023/03/beach-Ile-a-Rat-Amiga-Island-cap-haitien-jean-oscar-augustin_hero.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/90 via-pink-900/85 to-rose-900/90 z-[1]" />
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <div className="inline-block px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-6">
            <span className="font-semibold text-sm tracking-wide">❤️ VOS COUPS DE CŒUR</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">Mes Favoris</h1>
          <p className="text-xl text-white/95 max-w-2xl mx-auto drop-shadow-md">
            {isAuthenticated && user 
              ? `Bonjour ${user.firstName}, retrouvez tous vos établissements préférés en un seul endroit`
              : 'Retrouvez tous vos établissements préférés en un seul endroit'
            }
          </p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="bg-gray-200 rounded-2xl h-96 animate-pulse"
              />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white rounded-2xl shadow-lg"
          >
            <div className="mb-6">
              <Heart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Aucun favori pour le moment
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Explorez Haïti et ajoutez vos établissements préférés à vos favoris en cliquant sur le cœur ❤️
            </p>
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition font-semibold text-lg"
            >
              <Sparkles className="w-5 h-5" />
              Découvrir les établissements
            </button>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Vos établissements favoris
              </h2>
              <p className="text-gray-600">
                {favorites.length} établissement{favorites.length > 1 ? 's' : ''} sauvegardé{favorites.length > 1 ? 's' : ''}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {favorites.map((establishment, index) => (
                <motion.div
                  key={establishment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ListingCard
                    establishment={establishment}
                    onAuthRequired={() => setIsAuthModalOpen(true)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleAuthModalClose}
        defaultMode="login"
      />
    </div>
  );
}
