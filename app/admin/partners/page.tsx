'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/axios';
import { Partner } from '@/types';
import { usePageTitle } from '@/hooks/usePageTitle';

interface PartnerWithStats extends Partner {
  _count?: {
    establishments: number;
  };
  validator?: {
    firstName: string;
    lastName: string;
  };
}

interface PaginatedResponse {
  success: boolean;
  data: PartnerWithStats[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export default function PartnersPage() {
  usePageTitle('Gestion des Partenaires');
  
  const [partners, setPartners] = useState<PartnerWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchPartners();
  }, [currentPage, statusFilter]);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(statusFilter && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await apiClient.get<PaginatedResponse>(`/admin/partners?${params}`);
      setPartners(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setTotalItems(response.data.pagination.totalItems);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors du chargement des partenaires');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPartners();
  };

  const handleUpdateStatus = async (partnerId: string, status: string) => {
    const confirmMsg = status === 'APPROVED' 
      ? 'Approuver ce partenaire ?' 
      : status === 'REJECTED' 
      ? 'Rejeter ce partenaire ?' 
      : 'Suspendre ce partenaire ?';

    if (!confirm(confirmMsg)) return;

    try {
      console.log('Mise à jour statut:', { partnerId, status, idLength: partnerId.length });
      
      const response = await apiClient.put(`/admin/partners/${partnerId}/status`, { status });
      
      console.log('Réponse:', response.data);
      alert('Statut mis à jour avec succès');
      fetchPartners();
    } catch (err: any) {
      console.error('Erreur complète:', err);
      console.error('Réponse d\'erreur:', err.response?.data);
      
      const errorMessage = err.response?.data?.error 
        || err.response?.data?.message 
        || JSON.stringify(err.response?.data?.errors || [])
        || 'Erreur lors de la mise à jour';
      
      alert(`Erreur: ${errorMessage}`);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      SUSPENDED: 'bg-gray-100 text-gray-800'
    };
    const labels = {
      PENDING: 'En attente',
      APPROVED: 'Approuvé',
      REJECTED: 'Rejeté',
      SUSPENDED: 'Suspendu'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des partenaires</h1>
            <p className="mt-2 text-gray-600">{totalItems} partenaire(s) au total</p>
          </div>
          <Link href="/admin" className="text-blue-600 hover:text-blue-800">
            ← Retour au dashboard
          </Link>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <form onSubmit={handleSearch} className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tous les statuts</option>
            <option value="PENDING">En attente</option>
            <option value="APPROVED">Approuvés</option>
            <option value="REJECTED">Rejetés</option>
            <option value="SUSPENDED">Suspendus</option>
          </select>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Rechercher
          </button>
        </form>
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
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Partenaire</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Établissements</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {partners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-xs font-mono text-gray-500" title={partner.id}>
                        {partner.id.substring(0, 8)}...
                      </div>
                      <div className="text-xs text-gray-400">({partner.id.length} cars)</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{partner.name}</div>
                      {partner.description && (
                        <div className="text-sm text-gray-500 line-clamp-1">{partner.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{partner.email}</div>
                      {partner.phone && <div className="text-sm text-gray-500">{partner.phone}</div>}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(partner.status)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {partner._count?.establishments || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(partner.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <div className="flex justify-end gap-2">
                        {partner.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(partner.id, 'APPROVED')}
                              className="text-green-600 hover:text-green-900 font-medium"
                            >
                              Approuver
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(partner.id, 'REJECTED')}
                              className="text-red-600 hover:text-red-900 font-medium"
                            >
                              Rejeter
                            </button>
                          </>
                        )}
                        {partner.status === 'APPROVED' && (
                          <button
                            onClick={() => handleUpdateStatus(partner.id, 'SUSPENDED')}
                            className="text-orange-600 hover:text-orange-900 font-medium"
                          >
                            Suspendre
                          </button>
                        )}
                        <Link
                          href={`/admin/partners/${partner.id}`}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          Détails
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-700">Page {currentPage} sur {totalPages}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Précédent
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
