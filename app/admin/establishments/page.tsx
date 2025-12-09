'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/axios';
import type { Establishment } from '@/types';
import EstablishmentImage from '@/components/ui/EstablishmentImage';
import { usePageTitle } from '@/hooks/usePageTitle';
import { decodeHtmlEntities } from '@/lib/utils';

export default function EstablishmentsPage() {
  usePageTitle('Gestion des Établissements');
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    fetchEstablishments();
  }, [typeFilter]);

  const fetchEstablishments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        ...(typeFilter && { type: typeFilter }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await apiClient.get(`/establishments?${params}`);
      setEstablishments(response.data.data || response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer l'établissement "${name}" ?`)) return;

    try {
      await apiClient.delete(`/establishments/${id}`);
      alert('Établissement supprimé');
      fetchEstablishments();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erreur lors de la suppression');
    }
  };

  const establishmentTypes = {
    HOTEL: 'Hôtel',
    RESTAURANT: 'Restaurant',
    BAR: 'Bar',
    CAFE: 'Café',
    ATTRACTION: 'Attraction',
    SHOP: 'Boutique',
    SERVICE: 'Service'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des établissements</h1>
            <p className="mt-2 text-gray-600">{establishments.length} établissement(s)</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin" className="text-blue-600 hover:text-blue-800">
              ← Retour
            </Link>
            <Link
              href="/admin/establishments/import"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              Import CSV
            </Link>
            <Link
              href="/admin/establishments/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              + Nouvel établissement
            </Link>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchEstablishments()}
            className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Tous les types</option>
            {Object.entries(establishmentTypes).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <button
            onClick={fetchEstablishments}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Rechercher
          </button>
        </div>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {establishments.map((establishment) => (
            <div key={establishment.id} className="bg-white rounded-lg shadow overflow-hidden">
              <EstablishmentImage
                src={establishment.images?.[0]}
                alt={establishment.name}
                fallbackIcon="🏢"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{establishment.name}</h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      establishment.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {establishment.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {establishmentTypes[establishment.type as keyof typeof establishmentTypes]}
                </p>
                {establishment.description && (
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                    {decodeHtmlEntities(establishment.description)}
                  </p>
                )}
                {establishment.address && (
                  <p className="text-xs text-gray-400 mb-3">📍 {establishment.address}</p>
                )}
                <div className="flex gap-2">
                  <Link
                    href={`/admin/establishments/${establishment.id}`}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 text-center"
                  >
                    Éditer
                  </Link>
                  <button
                    onClick={() => handleDelete(establishment.id, establishment.name)}
                    className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Supprimer
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
