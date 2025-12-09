'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/axios';
import EventCard from '@/components/events/EventCard';
import type { Event, ApiResponse } from '@/types';

export default function PartnerEventsPage() {
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
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const partnerId = user.partnerId;

      if (!partnerId) {
        console.error('Partner ID not found');
        return;
      }

      const params = new URLSearchParams();
      if (filterCategory) params.append('category', filterCategory);
      if (showUpcoming) params.append('upcoming', 'true');

      const response = await apiClient.get<ApiResponse<Event[]>>(
        `/events/partner/${partnerId}?${params.toString()}`
      );

      setEvents(response.data.data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('Supprimer cet événement ?')) return;

    try {
      await apiClient.delete(`/events/${eventId}`);
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mes Événements</h1>
        <button
          onClick={() => router.push('/partner/events/new')}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          + Créer un événement
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex gap-4">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">Toutes les catégories</option>
            <option value="CONCERT">Concert</option>
            <option value="FESTIVAL">Festival</option>
            <option value="CONFERENCE">Conférence</option>
            <option value="SPORT">Sport</option>
            <option value="EXHIBITION">Exposition</option>
            <option value="CULTURAL">Culturel</option>
            <option value="RELIGIOUS">Religieux</option>
            <option value="CARNIVAL">Carnaval</option>
            <option value="OTHER">Autre</option>
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
        <div className="text-center py-12">Chargement...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Aucun événement trouvé. Créez votre premier événement !
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onClick={() => router.push(`/partner/events/${event.id}`)}
              showOrganizer={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
