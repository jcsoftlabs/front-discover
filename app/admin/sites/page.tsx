'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/axios';
import { Site } from '@/types';
import EstablishmentImage from '@/components/EstablishmentImage';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function SitesPage() {
  usePageTitle('Sites Touristiques');
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/sites');
      setSites(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer le site "${name}" ?`)) return;

    try {
      await apiClient.delete(`/admin/sites/${id}`);
      alert('Site supprimé');
      fetchSites();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erreur');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sites touristiques</h1>
            <p className="mt-2 text-gray-600">{sites.length} site(s)</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin" className="text-blue-600 hover:text-blue-800">← Retour</Link>
            <Link href="/admin/sites/import" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              Import CSV
            </Link>
            <Link href="/admin/sites/new" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              + Nouveau site
            </Link>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((site) => (
            <div key={site.id} className="bg-white rounded-lg shadow overflow-hidden">
              <EstablishmentImage
                src={site.images?.[0]}
                alt={site.name}
                fallbackIcon="🏛️"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{site.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${site.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {site.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{site.category}</p>
                {site.description && (
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{site.description}</p>
                )}
                <div className="flex gap-2">
                  <Link href={`/admin/sites/${site.id}`} className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 text-center">
                    Éditer
                  </Link>
                  <button onClick={() => handleDelete(site.id, site.name)} className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700">
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
