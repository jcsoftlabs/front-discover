'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import apiClient from '@/lib/axios';
import type { Event, ApiResponse } from '@/types';

export default function PartnerEventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const response = await apiClient.get<ApiResponse<Event>>(`/events/${eventId}`);
      setEvent(response.data.data);
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Supprimer cet événement ?')) return;

    try {
      await apiClient.delete(`/events/${eventId}`);
      alert('Événement supprimé avec succès');
      router.push('/partner/events');
    } catch (error: any) {
      console.error('Error deleting event:', error);
      alert(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  if (!event) {
    return <div className="text-center py-12 text-red-600">Événement introuvable</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/partner/events/${event.id}/edit`)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Modifier
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Supprimer
          </button>
        </div>
      </div>

      {event.images && event.images.length > 0 && (
        <div className="mb-6">
          <img
            src={event.images[0]}
            alt={event.title}
            className="w-full h-96 object-cover rounded-lg"
          />
          {event.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-2">
              {event.images.slice(1).map((img, idx) => (
                <img key={idx} src={img} alt="" className="h-24 object-cover rounded" />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <div>
          <h3 className="font-semibold text-gray-700">Catégorie</h3>
          <p>{event.category}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-700">Date de début</h3>
            <p>{new Date(event.startDate).toLocaleString('fr-FR')}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700">Date de fin</h3>
            <p>{new Date(event.endDate).toLocaleString('fr-FR')}</p>
          </div>
        </div>

        {event.description && (
          <div>
            <h3 className="font-semibold text-gray-700">Description</h3>
            <p className="text-gray-600">{event.description}</p>
          </div>
        )}

        {event.location && (
          <div>
            <h3 className="font-semibold text-gray-700">Lieu</h3>
            <p>{event.location}</p>
            {event.address && <p className="text-sm text-gray-600">{event.address}</p>}
            {(event.ville || event.departement) && (
              <p className="text-sm text-gray-600">
                {event.ville}{event.ville && event.departement && ', '}{event.departement}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          {event.price && (
            <div>
              <h3 className="font-semibold text-gray-700">Prix</h3>
              <p>{event.price} HTG</p>
            </div>
          )}
          {event.maxCapacity && (
            <div>
              <h3 className="font-semibold text-gray-700">Capacité</h3>
              <p>{event.currentRegistrations || 0} / {event.maxCapacity}</p>
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-700">Statut</h3>
            <p className={event.isActive ? 'text-green-600' : 'text-red-600'}>
              {event.isActive ? 'Actif' : 'Inactif'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
