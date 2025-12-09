'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function LocationPermissionModal() {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [hasAsked, setHasAsked] = useState(false);

  useEffect(() => {
    // Vérifier si on a déjà demandé la permission
    const locationPermissionAsked = localStorage.getItem('locationPermissionAsked');
    
    if (!locationPermissionAsked) {
      // Attendre 2 secondes avant d'afficher le modal pour une meilleure UX
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = async () => {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 0,
        });
      });

      // Stocker la position
      localStorage.setItem('userLocation', JSON.stringify({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: Date.now(),
      }));

      // Marquer comme demandé
      localStorage.setItem('locationPermissionAsked', 'true');
      localStorage.setItem('locationPermissionGranted', 'true');
      
      setIsOpen(false);
      setHasAsked(true);
    } catch (error) {
      console.error('Erreur lors de la récupération de la localisation:', error);
      
      // Même si refusé, marquer comme demandé
      localStorage.setItem('locationPermissionAsked', 'true');
      localStorage.setItem('locationPermissionGranted', 'false');
      
      setIsOpen(false);
      setHasAsked(true);
    }
  };

  const handleDecline = () => {
    localStorage.setItem('locationPermissionAsked', 'true');
    localStorage.setItem('locationPermissionGranted', 'false');
    setIsOpen(false);
    setHasAsked(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            onClick={handleDecline}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-md mx-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative">
                <button
                  onClick={handleDecline}
                  className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                    <MapPin className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {t('locationModal.title') || 'Partagez votre position'}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {t('locationModal.description') || 
                    'Pour vous offrir une meilleure expérience, nous aimerions accéder à votre position afin de vous suggérer des établissements et sites touristiques près de chez vous.'}
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-900">
                    <span className="font-semibold">🔒 {t('locationModal.privacy') || 'Confidentialité'} :</span>{' '}
                    {t('locationModal.privacyText') || 
                      'Vos données de localisation ne sont stockées que localement sur votre appareil et ne sont jamais partagées avec des tiers.'}
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAccept}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition font-semibold"
                  >
                    {t('locationModal.accept') || 'Autoriser'}
                  </button>
                  <button
                    onClick={handleDecline}
                    className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition font-semibold"
                  >
                    {t('locationModal.decline') || 'Non merci'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
