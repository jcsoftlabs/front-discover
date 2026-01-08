'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  MapPin, Phone, Globe, Clock, Tag,
  ArrowLeft, Share2, ExternalLink, ChevronLeft, ChevronRight, DollarSign
} from 'lucide-react';
import apiClient from '@/lib/axios';
import { Site } from '@/types';
import { getAllImages, decodeHtmlEntities } from '@/lib/utils';
import GoogleMap from '@/components/ui/GoogleMap';
import FavoriteButton from '@/components/ui/FavoriteButton';
import AuthModal from '@/components/modals/AuthModal';
import { useAuth } from '@/lib/AuthContext';

const categoryLabels: Record<string, string> = {
  MONUMENT: 'Monument',
  MUSEUM: 'Musée',
  PARK: 'Parc',
  BEACH: 'Plage',
  MOUNTAIN: 'Montagne',
  CULTURAL: 'Culturel',
  RELIGIOUS: 'Religieux',
  NATURAL: 'Naturel',
  HISTORICAL: 'Historique',
  ENTERTAINMENT: 'Divertissement',
};

const categoryColors: Record<string, string> = {
  MONUMENT: 'from-amber-500 to-orange-500',
  MUSEUM: 'from-purple-500 to-pink-500',
  PARK: 'from-green-500 to-emerald-500',
  BEACH: 'from-blue-500 to-cyan-500',
  MOUNTAIN: 'from-gray-500 to-slate-600',
  CULTURAL: 'from-indigo-500 to-purple-500',
  RELIGIOUS: 'from-yellow-500 to-amber-500',
  NATURAL: 'from-lime-500 to-green-600',
  HISTORICAL: 'from-red-500 to-rose-600',
  ENTERTAINMENT: 'from-fuchsia-500 to-pink-600',
};

export default function SiteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [site, setSite] = useState<Site | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchSite();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchSite = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(`/sites/${params.id}`);
      if (response.data.success) {
        const data = response.data.data;
        // Convert latitude/longitude to numbers, handling Decimal objects from Prisma
        const lat = data.latitude ? parseFloat(data.latitude.toString()) : undefined;
        const lng = data.longitude ? parseFloat(data.longitude.toString()) : undefined;

        setSite({
          ...data,
          latitude: lat,
          longitude: lng,
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement du site:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextImage = () => {
    if (site?.images && site.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % site.images!.length);
    }
  };

  const prevImage = () => {
    if (site?.images && site.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? site.images!.length - 1 : prev - 1
      );
    }
  };

  const handleShare = async () => {
    if (navigator.share && site) {
      // 📊 Track share action  
      const { default: telemetryService } = await import('@/lib/services/telemetry');
      telemetryService.trackShare('site', site.id, 'native_share');

      navigator.share({
        title: site.name,
        text: site.description || '',
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

  if (!site) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-gray-600 mb-4">Site touristique non trouvé</p>
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

  const images = getAllImages(site.images);
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
                siteId={site.id}
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
            className="mb-8"
          >
            {/* Main Image */}
            <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl mb-4 group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/30 z-10" />
              <motion.img
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                src={images[currentImageIndex]}
                alt={site.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                crossOrigin="anonymous"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-white/95 backdrop-blur-sm rounded-full hover:bg-white hover:scale-110 transition-all shadow-xl z-20 group/btn"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-800 group-hover/btn:text-blue-600" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white/95 backdrop-blur-sm rounded-full hover:bg-white hover:scale-110 transition-all shadow-xl z-20 group/btn"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-800 group-hover/btn:text-blue-600" />
                  </button>

                  {/* Image counter */}
                  <div className="absolute top-6 right-6 px-4 py-2 bg-black/70 backdrop-blur-md text-white text-sm font-semibold rounded-full z-20 shadow-lg">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden transition-all ${index === currentImageIndex
                        ? 'ring-4 ring-blue-500 scale-105 shadow-lg'
                        : 'ring-2 ring-gray-200 hover:ring-blue-300 opacity-70 hover:opacity-100'
                      }`}
                  >
                    <img
                      src={image}
                      alt={`${site.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                    {index === currentImageIndex && (
                      <div className="absolute inset-0 bg-blue-500/20" />
                    )}
                  </button>
                ))}
              </div>
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
              <div className="mb-6">
                <div className={`inline-block px-4 py-2 bg-gradient-to-r ${categoryColors[site.category] || 'from-gray-500 to-gray-600'} text-white rounded-full text-sm font-semibold mb-4 shadow-lg`}>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    {categoryLabels[site.category] || site.category}
                  </div>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                  {site.name}
                </h1>
                {(site.address || site.ville || site.departement) && (
                  <div className="flex items-center gap-2 text-gray-600 text-lg">
                    <MapPin className="w-5 h-5" />
                    <span>
                      {site.address}
                      {site.ville && (
                        <>{site.address ? ', ' : ''}{site.ville}</>
                      )}
                      {site.departement && (
                        <>{(site.address || site.ville) ? ', ' : ''}{site.departement}</>
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* Entry Fee */}
              {site.entryFee && site.entryFee > 0 && (
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Prix d'entrée</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {site.entryFee} HTG
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              {site.description && (
                <div className="pt-6 border-t border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">À propos</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {decodeHtmlEntities(site.description)}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Google Maps */}
            {site.latitude && site.longitude && (
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
                  latitude={site.latitude}
                  longitude={site.longitude}
                  name={site.name}
                  height="400px"
                />
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${site.latitude},${site.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Ouvrir dans Google Maps
                  <ExternalLink className="w-4 h-4" />
                </a>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Informations pratiques</h3>
              <div className="space-y-4">
                {site.phone && (
                  <a
                    href={`tel:${site.phone}`}
                    className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition"
                  >
                    <Phone className="w-5 h-5" />
                    <span>{site.phone}</span>
                  </a>
                )}
                {site.website && (
                  <a
                    href={site.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition"
                  >
                    <Globe className="w-5 h-5" />
                    <span>Site web</span>
                  </a>
                )}
                {site.openingHours && (
                  <div className="flex items-start gap-3 text-gray-700">
                    <Clock className="w-5 h-5 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium mb-1">Horaires d'ouverture</p>
                      <p className="text-sm whitespace-pre-line">{site.openingHours}</p>
                    </div>
                  </div>
                )}
                {site.entryFee && site.entryFee > 0 && (
                  <div className="flex items-start gap-3 text-gray-700">
                    <DollarSign className="w-5 h-5 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium mb-1">Prix d'entrée</p>
                      <p className="text-sm">{site.entryFee} HTG</p>
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
