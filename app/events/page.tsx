'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/axios';
import EventCard from '@/components/events/EventCard';
import type { Event, ApiResponse } from '@/types';

export default function PublicEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [showUpcoming, setShowUpcoming] = useState(true);

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
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Événements en Haïti</h1>
          <p className="text-lg">Découvrez les concerts, festivals, conférences et plus encore</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-wrap gap-4">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border rounded px-4 py-2"
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

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showUpcoming}
                onChange={(e) => setShowUpcoming(e.target.checked)}
                className="rounded"
              />
              <span>Événements à venir uniquement</span>
            </label>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse">Chargement des événements...</div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-xl mb-2">Aucun événement trouvé</p>
            <p>Essayez de modifier vos filtres</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => router.push(`/events/${event.id}`)}
                showOrganizer={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
