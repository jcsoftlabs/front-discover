'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import apiClient from '@/lib/axios';
import EventCard from '@/components/events/EventCard';
import type { Event, ApiResponse } from '@/types';

export default function PublicEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [showUpcoming, setShowUpcoming] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [filterCategory, showUpcoming]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterCategory) params.append('category', filterCategory);
      if (showUpcoming) params.append('upcoming', 'true');
      params.append('isActive', 'true');

      const response = await apiClient.get<ApiResponse<Event[]>>(`/events?${params.toString()}`);
      setEvents(response.data.data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </button>
            <div className="flex items-center gap-2 text-purple-600">
              <Calendar className="w-6 h-6" />
              <span className="font-semibold text-lg">Événements</span>
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
            backgroundImage: 'url("https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=2070&auto=format&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 via-indigo-900/85 to-pink-900/90 z-[1]" />
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <div className="inline-block px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-6">
            <span className="font-semibold text-sm tracking-wide">🎭 ÉVÉNEMENTS & FESTIVITÉS</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">Événements en Haïti</h1>
          <p className="text-xl text-white/95 max-w-2xl mx-auto drop-shadow-md">
            Découvrez les concerts, festivals, conférences et plus encore qui font vibrer la Perle des Antilles
          </p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Événements Variés</h3>
                <p className="text-sm text-gray-600">
                  Concerts, festivals, conférences, événements sportifs et culturels
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <MapPin className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">À Travers le Pays</h3>
                <p className="text-sm text-gray-600">
                  Des événements dans toutes les régions d'Haïti
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-pink-100 rounded-lg">
                <Clock className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Toute l'Année</h3>
                <p className="text-sm text-gray-600">
                  De nouvelles expériences à découvrir chaque mois
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-lg mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Filtrer les événements</h2>
          <div className="flex flex-wrap gap-4">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="flex-1 min-w-[200px] px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="">Toutes les catégories</option>
              <option value="CONCERT">Concerts</option>
              <option value="FESTIVAL">Festivals</option>
              <option value="CONFERENCE">Conférences</option>
              <option value="SPORT">Événements sportifs</option>
              <option value="EXHIBITION">Expositions</option>
              <option value="CULTURAL">Culturels</option>
              <option value="RELIGIOUS">Religieux</option>
              <option value="CARNIVAL">Carnavals</option>
              <option value="OTHER">Autres</option>
            </select>

            <label className="flex items-center gap-2 px-4 py-3 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition">
              <input
                type="checkbox"
                checked={showUpcoming}
                onChange={(e) => setShowUpcoming(e.target.checked)}
                className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
              />
              <span className="font-medium text-gray-900">Événements à venir uniquement</span>
            </label>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {events.length} événement{events.length > 1 ? 's' : ''} trouvé{events.length > 1 ? 's' : ''}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        ) : events.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-white rounded-2xl shadow-lg"
          >
            <div className="text-6xl mb-4">📅</div>
            <p className="text-2xl font-bold text-gray-900 mb-2">Aucun événement trouvé</p>
            <p className="text-gray-600 mb-6">Essayez de modifier vos filtres</p>
            <button
              onClick={() => {
                setFilterCategory('');
                setShowUpcoming(false);
              }}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition font-semibold"
            >
              Réinitialiser les filtres
            </button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <EventCard
                  event={event}
                  onClick={() => router.push(`/events/${event.id}`)}
                  showOrganizer={true}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
