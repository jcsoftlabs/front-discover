'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/axios';
import type { ApiResponse, PartnerDashboard } from '@/types';

export default function PartnerDashboard() {
  const [dashboardData, setDashboardData] = useState<PartnerDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await apiClient.get<ApiResponse<PartnerDashboard>>('/partner/dashboard');
        setDashboardData(response.data.data);
      } catch (err) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || 'Erreur lors du chargement du tableau de bord');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600 mt-2">Aperçu de vos performances</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-600">Total des établissements</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{dashboardData?.stats.totalEstablishments || 0}</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-600">Établissements actifs</div>
          <div className="text-3xl font-bold text-green-600 mt-2">{dashboardData?.stats.activeEstablishments || 0}</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-600">Total des avis</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{dashboardData?.stats.totalReviews || 0}</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-600">Note moyenne</div>
          <div className="text-3xl font-bold text-yellow-500 mt-2">
            {dashboardData?.stats.averageRating ? dashboardData.stats.averageRating.toFixed(1) : 'N/A'}
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/partner/profile"
            className="p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <div className="font-medium text-gray-900">Modifier le profil</div>
            <div className="text-sm text-gray-600 mt-1">Mettre à jour les informations de votre établissement</div>
          </Link>

          <Link
            href="/partner/promotions"
            className="p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <div className="font-medium text-gray-900">Gérer les promotions</div>
            <div className="text-sm text-gray-600 mt-1">Créer et modifier vos offres promotionnelles</div>
          </Link>

          <Link
            href="/partner/reviews"
            className="p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <div className="font-medium text-gray-900">Avis clients</div>
            <div className="text-sm text-gray-600 mt-1">Consulter et répondre aux avis</div>
          </Link>
        </div>
      </div>

      {/* Avis récents */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Avis récents</h2>
        {dashboardData?.recentReviews && dashboardData.recentReviews.length > 0 ? (
          <div className="space-y-4">
            {dashboardData.recentReviews.map((review) => (
              <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-gray-900">
                      {review.user ? `${review.user.firstName} ${review.user.lastName}` : 'Utilisateur'}
                    </div>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <p className="text-gray-700 mt-2">{review.comment || 'Aucun commentaire'}</p>
                <div className="mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    review.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    review.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {review.status === 'APPROVED' ? 'Approuvé' :
                     review.status === 'PENDING' ? 'En attente' : 'Rejeté'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Aucun avis pour le moment.</p>
        )}
      </div>
    </div>
  );
}
