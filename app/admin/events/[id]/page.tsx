'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import apiClient from '@/lib/axios';
import type { ApiResponse, Event } from '@/types';
import { ArrowLeft, Calendar, MapPin, DollarSign, Users, Edit, Trash2, Building2 } from 'lucide-react';

const EVENT_CATEGORIES = {
  CONCERT: 'Concert', FESTIVAL: 'Festival', CONFERENCE: 'Conférence',
  SPORT: 'Sport', EXHIBITION: 'Exposition', CULTURAL: 'Culturel',
  RELIGIOUS: 'Religieux', CARNIVAL: 'Carnaval', OTHER: 'Autre',
};

export default function EventDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const response = await apiClient.get<ApiResponse<Event>>(`/events/${eventId}`);
      if (response.data.success) {
        setEvent(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) return;
    
    try {
      await apiClient.delete(`/events/${eventId}`);
      router.push('/admin/events');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erreur lors de la suppression');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="text-gray-600">Chargement...</div></div>;
  }

  if (error || !event) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error || 'Événement non trouvé'}
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => router.push('/admin/events')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour à la liste
      </button>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
          <span className={`inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full ${
            event.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
          }`}>
            {event.isActive ? 'Actif' : 'Inactif'}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/admin/events/${eventId}/edit`)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Edit className="w-4 h-4" />
            Modifier
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4" />
            Supprimer
          </button>
        </div>
      </div>

      {/* Galerie d'images */}
      {event.images && event.images.length > 0 && (
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {event.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${event.title} ${index + 1}`}
                className="w-full h-64 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Détails</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <p className="text-gray-900">{EVENT_CATEGORIES[event.category]}</p>
              </div>

              {event.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{event.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Calendar className="w-4 h-4" />
                    {formatDate(event.startDate)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Calendar className="w-4 h-4" />
                    {formatDate(event.endDate)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Localisation */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Localisation</h2>
            <div className="space-y-3">
              {event.location && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
                  <p className="text-gray-900">{event.location}</p>
                </div>
              )}
              {event.address && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  <div className="flex items-center gap-2 text-gray-900">
                    <MapPin className="w-4 h-4" />
                    {event.address}
                  </div>
                </div>
              )}
              {(event.ville || event.departement) && (
                <div className="flex gap-4">
                  {event.ville && <div><strong>Ville:</strong> {event.ville}</div>}
                  {event.departement && <div><strong>Département:</strong> {event.departement}</div>}
                </div>
              )}
              {event.latitude && event.longitude && (
                <div className="text-sm text-gray-600">
                  GPS: {event.latitude}, {event.longitude}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Informations pratiques */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Informations pratiques</h3>
            <div className="space-y-3">
              {event.price !== undefined && event.price > 0 ? (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-600">Prix</div>
                    <div className="font-bold text-gray-900">{event.price} HTG</div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="font-bold text-green-600">Gratuit</div>
                  </div>
                </div>
              )}

              {event.maxCapacity && (
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-600">Capacité maximale</div>
                    <div className="font-bold text-gray-900">{event.maxCapacity} personnes</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Organisateur */}
          {event.organizer && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Organisateur</h3>
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <div className="font-bold text-gray-900">{event.organizer.name}</div>
                  {event.organizer.email && (
                    <div className="text-sm text-gray-600">{event.organizer.email}</div>
                  )}
                  {event.organizer.phone && (
                    <div className="text-sm text-gray-600">{event.organizer.phone}</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Métadonnées */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Métadonnées</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">ID:</span>
                <span className="ml-2 font-mono text-gray-900">{event.id}</span>
              </div>
              <div>
                <span className="text-gray-600">Créé le:</span>
                <span className="ml-2 text-gray-900">
                  {new Date(event.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Modifié le:</span>
                <span className="ml-2 text-gray-900">
                  {new Date(event.updatedAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
