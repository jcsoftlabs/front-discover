'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import apiClient from '@/lib/axios';
import type { ApiResponse } from '@/types';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function PartnerDetailPage() {
  usePageTitle('Détails Partenaire - Admin');
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [partner, setPartner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const response = await apiClient.get<ApiResponse<any>>(`/partners/${id}`);
        setPartner(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchPartner();
  }, [id]);

  const handleUpdateStatus = async (newStatus: string) => {
    const confirmMsg =
      newStatus === 'APPROVED'
        ? 'Approuver ce partenaire ?'
        : newStatus === 'REJECTED'
        ? 'Rejeter ce partenaire ?'
        : 'Suspendre ce partenaire ?';

    if (!confirm(confirmMsg)) return;

    try {
      await apiClient.put(`/admin/partners/${id}/status`, { status: newStatus });
      alert('Statut mis à jour avec succès');
      if (partner) setPartner({ ...partner, status: newStatus });
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erreur lors de la mise à jour');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      SUSPENDED: 'bg-gray-100 text-gray-800',
    };
    const labels = {
      PENDING: 'En attente',
      APPROVED: 'Approuvé',
      REJECTED: 'Rejeté',
      SUSPENDED: 'Suspendu',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!partner || error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || 'Partenaire introuvable'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <button onClick={() => router.back()} className="text-blue-600 hover:text-blue-800 mb-4">
          ← Retour
        </button>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">{partner.name}</h1>
          {getStatusBadge(partner.status)}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500">Email</label>
            <p className="mt-1 text-lg text-gray-900">{partner.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">Téléphone</label>
            <p className="mt-1 text-lg text-gray-900">{partner.phone || 'N/A'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">Date d'inscription</label>
            <p className="mt-1 text-lg text-gray-900">
              {new Date(partner.createdAt).toLocaleDateString('fr-FR')}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">Établissements</label>
            <p className="mt-1 text-lg text-gray-900">{partner._count?.establishments || 0}</p>
          </div>
        </div>

        {partner.description && (
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">Description</label>
            <p className="text-gray-700">{partner.description}</p>
          </div>
        )}

        {partner.establishments && partner.establishments.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Établissements</h2>
            <div className="space-y-3">
              {partner.establishments.map((est: any) => (
                <div key={est.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{est.name}</h3>
                      <p className="text-sm text-gray-600">{est.type}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        est.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {est.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-gray-200 flex gap-4">
          {partner.status === 'PENDING' && (
            <>
              <button
                onClick={() => handleUpdateStatus('APPROVED')}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Approuver
              </button>
              <button
                onClick={() => handleUpdateStatus('REJECTED')}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Rejeter
              </button>
            </>
          )}
          {partner.status === 'APPROVED' && (
            <button
              onClick={() => handleUpdateStatus('SUSPENDED')}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
            >
              Suspendre
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
