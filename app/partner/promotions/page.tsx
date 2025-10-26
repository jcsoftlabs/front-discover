'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/axios';
import { Establishment, Promotion, ApiResponse } from '@/types';

interface EstablishmentWithPromotions extends Establishment {
  promotions: Promotion[];
}

export default function PartnerPromotionsPage() {
  const [establishments, setEstablishments] = useState<EstablishmentWithPromotions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEstablishmentsWithPromotions();
  }, []);

  const fetchEstablishmentsWithPromotions = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<ApiResponse<EstablishmentWithPromotions[]>>(
        '/partner/establishments'
      );
      
      if (response.data.success) {
        // Pour chaque établissement, récupérer ses promotions
        const establishmentsData = response.data.data;
        const establishmentsWithPromotions = await Promise.all(
          establishmentsData.map(async (establishment) => {
            try {
              const promoResponse = await apiClient.get<ApiResponse<Promotion[]>>(
                `/partner/establishments/${establishment.id}/promotions`
              );
              return {
                ...establishment,
                promotions: promoResponse.data.success ? promoResponse.data.data : []
              };
            } catch (err) {
              console.error(`Erreur promotions pour ${establishment.name}:`, err);
              return { ...establishment, promotions: [] };
            }
          })
        );
        
        setEstablishments(establishmentsWithPromotions);
      }
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err.response?.data?.error || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const deletePromotion = async (establishmentId: string, promotionId: string) => {
    if (!confirm('Voulez-vous vraiment supprimer cette promotion ?')) return;

    try {
      await apiClient.delete(
        `/partner/establishments/${establishmentId}/promotions/${promotionId}`
      );
      await fetchEstablishmentsWithPromotions();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erreur lors de la suppression');
    }
  };

  const togglePromotion = async (establishmentId: string, promotion: Promotion) => {
    try {
      await apiClient.put(
        `/partner/establishments/${establishmentId}/promotions/${promotion.id}`,
        { isActive: !promotion.isActive }
      );
      await fetchEstablishmentsWithPromotions();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erreur lors de la mise à jour');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  const totalPromotions = establishments.reduce((sum, e) => sum + e.promotions.length, 0);
  const activePromotions = establishments.reduce(
    (sum, e) => sum + e.promotions.filter(p => p.isActive).length,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Promotions</h1>
        <p className="text-gray-600 mt-2">Gérez vos offres promotionnelles par établissement</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total promotions</p>
          <p className="text-3xl font-bold text-gray-900">{totalPromotions}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Promotions actives</p>
          <p className="text-3xl font-bold text-green-600">{activePromotions}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Établissements</p>
          <p className="text-3xl font-bold text-gray-900">{establishments.length}</p>
        </div>
      </div>

      {/* Liste des établissements avec promotions */}
      {establishments.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <p className="text-gray-600 mb-4">Vous n'avez pas encore d'établissements</p>
          <Link
            href="/partner/establishments/new"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Ajouter un établissement
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {establishments.map((establishment) => (
            <div key={establishment.id} className="bg-white rounded-lg shadow">
              {/* En-tête de l'établissement */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{establishment.name}</h2>
                    <p className="text-sm text-gray-500 mt-1">{establishment.type}</p>
                  </div>
                  <Link
                    href={`/partner/establishments/${establishment.id}/promotions/new`}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  >
                    + Nouvelle promotion
                  </Link>
                </div>
              </div>

              {/* Liste des promotions */}
              <div className="p-6">
                {establishment.promotions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Aucune promotion pour cet établissement
                  </p>
                ) : (
                  <div className="space-y-4">
                    {establishment.promotions.map((promotion) => {
                      const isExpired = new Date(promotion.validUntil) < new Date();
                      const isUpcoming = new Date(promotion.validFrom) > new Date();

                      return (
                        <div
                          key={promotion.id}
                          className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-gray-900">{promotion.title}</h3>
                                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                                  -{promotion.discount}%
                                </span>
                                {isExpired && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                    Expirée
                                  </span>
                                )}
                                {isUpcoming && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                                    À venir
                                  </span>
                                )}
                                {!isExpired && !isUpcoming && promotion.isActive && (
                                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                                    Active
                                  </span>
                                )}
                                {!promotion.isActive && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                    Inactive
                                  </span>
                                )}
                              </div>
                              {promotion.description && (
                                <p className="text-sm text-gray-600 mb-2">{promotion.description}</p>
                              )}
                              <p className="text-xs text-gray-500">
                                Du {new Date(promotion.validFrom).toLocaleDateString('fr-FR')} au{' '}
                                {new Date(promotion.validUntil).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <button
                                onClick={() => togglePromotion(establishment.id, promotion)}
                                className={`px-3 py-1 text-sm rounded ${
                                  promotion.isActive
                                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
                              >
                                {promotion.isActive ? 'Désactiver' : 'Activer'}
                              </button>
                              <Link
                                href={`/partner/establishments/${establishment.id}/promotions/${promotion.id}/edit`}
                                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                              >
                                Modifier
                              </Link>
                              <button
                                onClick={() => deletePromotion(establishment.id, promotion.id)}
                                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                              >
                                Supprimer
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
