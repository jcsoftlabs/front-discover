'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/axios';
import { getFirstImage } from '@/lib/utils';
import type { ApiResponse, Listing } from '@/types';

export default function EstablishmentsPage() {
  const router = useRouter();
  const [establishments, setEstablishments] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEstablishments();
  }, []);

  const fetchEstablishments = async () => {
    try {
      const response = await apiClient.get<ApiResponse<Listing[]>>('/partner/establishments');
      if (response.data.success) {
        setEstablishments(response.data.data || []);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors du chargement des établissements');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
          <h1 className="text-3xl font-bold text-gray-900">Mes Établissements</h1>
          <p className="mt-2 text-gray-600">
            Gérez vos établissements touristiques
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/partner/establishments/import')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            Import CSV
          </button>
          <button
            onClick={() => router.push('/partner/establishments/new')}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            + Nouvel Établissement
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {establishments.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun établissement
          </h3>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas encore créé d'établissement. Commencez maintenant !
          </p>
          <button
            onClick={() => router.push('/partner/establishments/new')}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Créer mon premier établissement
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {establishments.map((establishment) => (
            <div
              key={establishment.id}
              className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/partner/establishments/${establishment.id}`)}
            >
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
                  <svg
                    className="h-16 w-16 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                );
              })()}
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {establishment.name}
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    establishment.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {establishment.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">
                  {establishment.type}
                </p>
                
                {establishment.description && (
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                    {establishment.description}
                  </p>
                )}
                
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-green-600">
                    {establishment.price} HTG
                  </span>
                  {establishment.address && (
                    <span className="text-gray-500 truncate ml-2">
                      {establishment.address}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
