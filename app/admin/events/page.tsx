'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/axios';
import type { ApiResponse, PaginatedResponse, Event } from '@/types';
import { Plus, Calendar, MapPin, Eye, Edit, Trash2, Filter } from 'lucide-react';

const EVENT_CATEGORIES = [
  { value: 'CONCERT', label: 'Concert' },
  { value: 'FESTIVAL', label: 'Festival' },
  { value: 'CONFERENCE', label: 'Conférence' },
  { value: 'SPORT', label: 'Sport' },
  { value: 'EXHIBITION', label: 'Exposition' },
  { value: 'CULTURAL', label: 'Culturel' },
  { value: 'RELIGIOUS', label: 'Religieux' },
  { value: 'CARNIVAL', label: 'Carnaval' },
  { value: 'OTHER', label: 'Autre' },
];

export default function AdminEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  
  // Filtres
  const [categoryFilter, setCategoryFilter] = useState('');
  const [upcomingOnly, setUpcomingOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    fetchEvents();
  }, [isMounted, categoryFilter, upcomingOnly, page]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });
      
      if (categoryFilter) params.append('category', categoryFilter);
      if (upcomingOnly) params.append('upcoming', 'true');

      const response = await apiClient.get<PaginatedResponse<Event>>(
        `/events?${params.toString()}`
      );

      if (response.data.success) {
        setEvents(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors du chargement des événements');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) return;

    try {
      await apiClient.delete(`/events/${id}`);
      fetchEvents();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erreur lors de la suppression');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      CONCERT: 'bg-purple-100 text-purple-800',
      FESTIVAL: 'bg-pink-100 text-pink-800',
      CONFERENCE: 'bg-blue-100 text-blue-800',
      SPORT: 'bg-green-100 text-green-800',
      EXHIBITION: 'bg-yellow-100 text-yellow-800',
      CULTURAL: 'bg-indigo-100 text-indigo-800',
      RELIGIOUS: 'bg-gray-100 text-gray-800',
      CARNIVAL: 'bg-red-100 text-red-800',
      OTHER: 'bg-gray-100 text-gray-600',
    };
    return colors[category] || colors.OTHER;
  };

  if (!isMounted) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Événements</h1>
          <p className="mt-2 text-gray-600">Gérez les événements touristiques</p>
        </div>
        <button
          onClick={() => router.push('/admin/events/new')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          Nouvel événement
        </button>
      </div>

      {/* Filtres */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filtres:</span>
        </div>
        
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Toutes les catégories</option>
          {EVENT_CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={upcomingOnly}
            onChange={(e) => setUpcomingOnly(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">À venir uniquement</span>
        </label>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Chargement...</div>
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun événement trouvé
          </h3>
          <p className="text-gray-600 mb-6">
            Commencez par créer votre premier événement
          </p>
          <button
            onClick={() => router.push('/admin/events/new')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Créer un événement
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
              >
                <div className="flex gap-4">
                  {/* Image */}
                  {event.images && event.images.length > 0 ? (
                    <img
                      src={event.images[0]}
                      alt={event.title}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Calendar className="w-12 h-12 text-gray-400" />
                    </div>
                  )}

                  {/* Contenu */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {event.title}
                        </h3>
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(event.category)}`}>
                          {EVENT_CATEGORIES.find(c => c.value === event.category)?.label}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/admin/events/${event.id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Voir"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/events/${event.id}/edit`)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                          title="Modifier"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Supprimer"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(event.startDate)} → {formatDate(event.endDate)}
                        </span>
                      </div>
                      {event.ville && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{event.ville}{event.departement ? `, ${event.departement}` : ''}</span>
                        </div>
                      )}
                      {event.price !== undefined && event.price > 0 && (
                        <div>
                          <span className="font-medium">{event.price} HTG</span>
                        </div>
                      )}
                      {event.maxCapacity && (
                        <div>
                          <span>Capacité: {event.maxCapacity} personnes</span>
                        </div>
                      )}
                    </div>

                    {event.organizer && (
                      <div className="mt-2 text-sm text-gray-500">
                        Organisé par: <span className="font-medium">{event.organizer.name}</span>
                      </div>
                    )}

                    <div className="mt-2">
                      <span className={`text-xs font-medium ${event.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                        {event.isActive ? '● Actif' : '○ Inactif'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Précédent
              </button>
              <span className="px-4 py-2 text-gray-700">
                Page {page} sur {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
