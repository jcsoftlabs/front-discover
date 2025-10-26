'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  MapPin, Phone, Mail, Clock, Star, MessageCircle, 
  ArrowLeft, Share2, ExternalLink, ChevronLeft, ChevronRight 
} from 'lucide-react';
import apiClient from '@/lib/axios';
import { Establishment } from '@/types';
import GoogleMap from '@/components/ui/GoogleMap';
import FavoriteButton from '@/components/ui/FavoriteButton';
import RatingStars from '@/components/ui/RatingStars';
import AuthModal from '@/components/modals/AuthModal';
import { useAuth } from '@/lib/AuthContext';

const typeLabels: Record<string, string> = {
  HOTEL: 'Hôtel',
  RESTAURANT: 'Restaurant',
  BAR: 'Bar',
  CAFE: 'Café',
  ATTRACTION: 'Attraction',
  SHOP: 'Boutique',
  SERVICE: 'Service',
};

export default function EstablishmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [establishment, setEstablishment] = useState<Establishment & { 
    averageRating?: number; 
    reviewCount?: number;
    reviews?: any[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchEstablishment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchEstablishment = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(`/establishments/${params.id}`);
      if (response.data.success) {
        const data = response.data.data;
        const reviews = data.reviews || [];
        const averageRating = reviews.length > 0
          ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
          : 0;
        
        setEstablishment({
          ...data,
          // Convert latitude/longitude strings to numbers
          latitude: data.latitude ? parseFloat(data.latitude) : undefined,
          longitude: data.longitude ? parseFloat(data.longitude) : undefined,
          reviews,
          averageRating,
          reviewCount: reviews.length,
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'établissement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsSubmittingReview(true);
    try {
      await apiClient.post(`/establishments/${params.id}/reviews`, newReview);
      setNewReview({ rating: 5, comment: '' });
      await fetchEstablishment(); // Refresh data
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'avis:', error);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const nextImage = () => {
    if (establishment?.images && establishment.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % establishment.images!.length);
    }
  };

  const prevImage = () => {
    if (establishment?.images && establishment.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? establishment.images!.length - 1 : prev - 1
      );
    }
  };

  const handleShare = () => {
    if (navigator.share && establishment) {
      navigator.share({
        title: establishment.name,
        text: establishment.description || '',
        url: window.location.href,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!establishment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-gray-600 mb-4">Établissement non trouvé</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const images = establishment.images || [];
  const hasImages = images.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="p-2 text-gray-700 hover:text-blue-600 transition"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <FavoriteButton 
                establishmentId={establishment.id} 
                size="lg"
                onAuthRequired={() => setIsAuthModalOpen(true)}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Gallery */}
        {hasImages && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl mb-8"
          >
            <img
              src={images[currentImageIndex]}
              alt={establishment.name}
              className="w-full h-full object-cover"
            />
            
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full hover:bg-white transition shadow-lg"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full hover:bg-white transition shadow-lg"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition ${
                        index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-3">
                    {typeLabels[establishment.type] || establishment.type}
                  </span>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {establishment.name}
                  </h1>
                  {(establishment.address || establishment.ville || establishment.departement) && (
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <MapPin className="w-5 h-5" />
                      <span>
                        {establishment.address}
                        {establishment.ville && (
                          <>{establishment.address ? ', ' : ''}{establishment.ville}</>
                        )}
                        {establishment.departement && (
                          <>{(establishment.address || establishment.ville) ? ', ' : ''}{establishment.departement}</>
                        )}
                      </span>
                    </div>
                  )}
                </div>
                {establishment.price > 0 && (
                  <div className="text-right">
                    <p className="text-sm text-gray-600">À partir de</p>
                    <p className="text-3xl font-bold text-gray-900">
                      ${establishment.price}
                      <span className="text-lg font-normal text-gray-600">/nuit</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                <RatingStars rating={establishment.averageRating || 0} size="lg" />
                <span className="text-2xl font-bold text-gray-900">
                  {(establishment.averageRating || 0).toFixed(1)}
                </span>
                <div className="flex items-center gap-2 text-gray-600">
                  <MessageCircle className="w-5 h-5" />
                  <span>({establishment.reviewCount || 0} avis)</span>
                </div>
              </div>

              {/* Description */}
              {establishment.description && (
                <div className="pt-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {establishment.description}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Google Maps */}
            {establishment.latitude && establishment.longitude && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-blue-600" />
                  Localisation
                </h2>
                <GoogleMap
                  latitude={establishment.latitude}
                  longitude={establishment.longitude}
                  name={establishment.name}
                  height="400px"
                />
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${establishment.latitude},${establishment.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Ouvrir dans Google Maps
                  <ExternalLink className="w-4 h-4" />
                </a>
              </motion.div>
            )}

            {/* Reviews Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Avis des visiteurs</h2>

              {/* Review Form */}
              <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-4">Donnez votre avis</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Note
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating })}
                        className={`p-2 rounded-lg transition ${
                          newReview.rating >= rating
                            ? 'text-yellow-500'
                            : 'text-gray-300'
                        }`}
                      >
                        <Star className="w-8 h-8" fill={newReview.rating >= rating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commentaire
                  </label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Partagez votre expérience..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isSubmittingReview ? 'Envoi...' : 'Publier l\'avis'}
                </button>
              </form>

              {/* Reviews List */}
              <div className="space-y-6">
                {establishment.reviews && establishment.reviews.length > 0 ? (
                  establishment.reviews.map((review: any, index: number) => (
                    <div key={index} className="pb-6 border-b border-gray-200 last:border-b-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {review.user?.firstName} {review.user?.lastName}
                          </p>
                          <RatingStars rating={review.rating} size="sm" />
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-center py-8">Aucun avis pour le moment</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Informations de contact</h3>
              <div className="space-y-4">
                {establishment.phone && (
                  <a
                    href={`tel:${establishment.phone}`}
                    className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition"
                  >
                    <Phone className="w-5 h-5" />
                    <span>{establishment.phone}</span>
                  </a>
                )}
                {establishment.email && (
                  <a
                    href={`mailto:${establishment.email}`}
                    className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition"
                  >
                    <Mail className="w-5 h-5" />
                    <span>{establishment.email}</span>
                  </a>
                )}
                {establishment.website && (
                  <a
                    href={establishment.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>Site web</span>
                  </a>
                )}
                {(establishment as any).openingHours && (
                  <div className="flex items-start gap-3 text-gray-700">
                    <Clock className="w-5 h-5 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium mb-1">Horaires d'ouverture</p>
                      <p className="text-sm whitespace-pre-line">{(establishment as any).openingHours}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode="login"
      />
    </div>
  );
}
