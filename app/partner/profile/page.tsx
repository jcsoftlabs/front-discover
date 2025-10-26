'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/axios';
import { getFirstImage } from '@/lib/utils';
import type { ApiResponse, Establishment } from '@/types';

export default function PartnerProfilePage() {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchEstablishments();
  }, []);

  const fetchEstablishments = async () => {
    try {
      const response = await apiClient.get<ApiResponse<Establishment[] | { data: Establishment[]; count: number }>>('/partner/establishments');
      // Le backend peut retourner soit directement un array soit un objet avec data
      const data = Array.isArray(response.data.data) ? response.data.data : response.data.data.data;
      setEstablishments(data || []);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Erreur lors du chargement des établissements');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleActive = async (establishmentId: string, currentStatus: boolean) => {
    try {
      await apiClient.put(`/partner/establishments/${establishmentId}`, {
        isActive: !currentStatus
      });
      await fetchEstablishments();
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes Établissements</h1>
          <p className="text-gray-600 mt-2">Gérez vos établissements touristiques</p>
        </div>
        <Link
          href="/partner/establishments/new"
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Nouvel établissement
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {establishments.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500 mb-4">Vous n&apos;avez pas encore d&apos;établissement.</p>
          <Link
            href="/partner/establishments/new"
            className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Créer votre premier établissement
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {establishments.map((establishment) => (
            <div key={establishment.id} className="bg-white rounded-lg shadow overflow-hidden">
              {(() => {
                const imageUrl = getFirstImage(establishment.images);
                return imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={establishment.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                );
              })()}
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{establishment.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{establishment.type}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      establishment.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {establishment.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {establishment.description || 'Aucune description'}
                </p>

                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  {establishment.address && (
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="line-clamp-1">{establishment.address}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/partner/establishments/${establishment.id}/edit`}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-center"
                  >
                    Modifier
                  </Link>
                  <button
                    onClick={() => toggleActive(establishment.id, establishment.isActive)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    {establishment.isActive ? 'Désactiver' : 'Activer'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
