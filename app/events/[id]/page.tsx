'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import apiClient from '@/lib/axios';
import type { Event, ApiResponse } from '@/types';

export default function PublicEventDetailPage() {
  const params = useParams();
  const router = useRouter();
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Chargement...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Événement introuvable</h1>
          <button
            onClick={() => router.push('/events')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
          >
            Retour aux événements
          </button>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const isPast = eventDate < new Date();
  const availableSeats = (event.maxCapacity || 0) - (event.currentRegistrations || 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {event.images && event.images.length > 0 && (
        <div className="relative h-96 bg-gray-900">
          <img
            src={event.images[0]}
            alt={event.title}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="max-w-5xl mx-auto">
              <span className="inline-block bg-purple-600 px-3 py-1 rounded-full text-sm font-medium mb-2">
                {event.category}
              </span>
              <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
              {event.location && (
                <p className="text-lg flex items-center gap-2">
                  📍 {event.location}
                  {event.ville && `, ${event.ville}`}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">À propos de l'événement</h2>
              {event.description ? (
                <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
              ) : (
                <p className="text-gray-500 italic">Aucune description disponible</p>
              )}
            </div>

            {event.images && event.images.length > 1 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4">Galerie</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {event.images.slice(1).map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Photo ${idx + 1}`}
                      className="w-full h-40 object-cover rounded-lg hover:scale-105 transition-transform"
                    />
                  ))}
                </div>
              </div>
            )}

            {event.organizer && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4">Organisateur</h2>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {event.organizer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{event.organizer.name}</h3>
                    {event.organizer.email && (
                      <p className="text-gray-600">{event.organizer.email}</p>
                    )}
                    {event.organizer.website && (
                      <a
                        href={event.organizer.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Site web
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <span className="text-3xl">📅</span>
                  <div>
                    <p className="text-sm text-gray-600">Date de début</p>
                    <p className="font-semibold">{eventDate.toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}</p>
                    <p className="text-sm">{eventDate.toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pb-4 border-b">
                  <span className="text-3xl">⏰</span>
                  <div>
                    <p className="text-sm text-gray-600">Date de fin</p>
                    <p className="font-semibold">{endDate.toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}</p>
                    <p className="text-sm">{endDate.toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  </div>
                </div>

                {event.price && (
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <span className="text-3xl">💵</span>
                    <div>
                      <p className="text-sm text-gray-600">Prix</p>
                      <p className="font-bold text-2xl text-green-600">{event.price} HTG</p>
                    </div>
                  </div>
                )}

                {event.maxCapacity && (
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <span className="text-3xl">👥</span>
                    <div className="w-full">
                      <p className="text-sm text-gray-600 mb-1">Places disponibles</p>
                      <p className="font-semibold text-lg">
                        {availableSeats > 0 ? (
                          <span className="text-green-600">{availableSeats} / {event.maxCapacity}</span>
                        ) : (
                          <span className="text-red-600">Complet</span>
                        )}
                      </p>
                      <div className="mt-2 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${((event.currentRegistrations || 0) / event.maxCapacity) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {event.address && (
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">📍</span>
                    <div>
                      <p className="text-sm text-gray-600">Adresse</p>
                      <p className="font-medium">{event.address}</p>
                      {(event.ville || event.departement) && (
                        <p className="text-sm text-gray-600">
                          {event.ville}{event.ville && event.departement && ', '}{event.departement}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {isPast ? (
                  <div className="bg-gray-100 text-gray-600 text-center py-3 rounded-lg mt-6">
                    Événement terminé
                  </div>
                ) : availableSeats === 0 ? (
                  <div className="bg-red-100 text-red-600 text-center py-3 rounded-lg mt-6">
                    Événement complet
                  </div>
                ) : (
                  <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-lg font-semibold mt-6 transition-all">
                    Réserver maintenant
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={() => router.push('/events')}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg"
            >
              ← Retour aux événements
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
