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
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-[100]"
        >
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="p-4 sm:p-5">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                      {t('locationModal.title') || 'Partagez votre position'}
                    </h3>
                    <button
                      onClick={handleDecline}
                      className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-lg transition"
                      aria-label="Fermer"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                  
                  <p className="text-gray-600 text-xs sm:text-sm mb-3 leading-relaxed">
                    {t('locationModal.description') || 
                      'Pour vous offrir une meilleure expérience, nous aimerions accéder à votre position afin de vous suggérer des établissements et sites touristiques près de chez vous.'}
                  </p>
                  
                  {/* Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleAccept}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-md transition text-sm font-medium"
                    >
                      {t('locationModal.accept') || 'Autoriser'}
                    </button>
                    <button
                      onClick={handleDecline}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition text-sm font-medium"
                    >
                      {t('locationModal.decline') || 'Non merci'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
