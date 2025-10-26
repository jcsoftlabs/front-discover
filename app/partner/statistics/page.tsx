'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/axios';
import { ApiResponse, PartnerDashboard } from '@/types';

interface EstablishmentStats {
  id: string;
  name: string;
  type: string;
  reviewCount: number;
  averageRating: number;
  activePromotions: number;
  isActive: boolean;
}

export default function PartnerStatisticsPage() {
  const [dashboard, setDashboard] = useState<PartnerDashboard | null>(null);
  const [establishments, setEstablishments] = useState<EstablishmentStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      
      // Récupérer le dashboard
      const dashboardResponse = await apiClient.get<ApiResponse<PartnerDashboard>>(
        '/partner/dashboard'
      );
      
      if (dashboardResponse.data.success) {
        setDashboard(dashboardResponse.data.data);
      }

      // Récupérer les établissements avec détails
      const establishmentsResponse = await apiClient.get<ApiResponse<any[]>>(
        '/partner/establishments'
      );
      
      if (establishmentsResponse.data.success) {
        const estabs = establishmentsResponse.data.data.map((e: any) => ({
          id: e.id,
          name: e.name,
          type: e.type,
          reviewCount: e.reviews?.length || 0,
          averageRating: e.reviews?.length > 0
            ? e.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / e.reviews.length
            : 0,
          activePromotions: e.promotions?.length || 0,
          isActive: e.isActive
        }));
        setEstablishments(estabs);
      }
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err.response?.data?.error || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des statistiques...</p>
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

  const stats = dashboard?.stats;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Statistiques</h1>
        <p className="text-gray-600 mt-2">Analyses détaillées de vos performances</p>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Établissements"
          value={stats?.totalEstablishments || 0}
          subtitle={`${stats?.activeEstablishments || 0} actifs`}
          icon="🏭"
          color="bg-blue-50 text-blue-700"
        />
        <StatCard
          title="Avis reçus"
          value={stats?.totalReviews || 0}
          subtitle={`Note moyenne: ${stats?.averageRating.toFixed(1) || '0.0'}/5`}
          icon="⭐"
          color="bg-yellow-50 text-yellow-700"
        />
        <StatCard
          title="Promotions actives"
          value={stats?.activePromotions || 0}
          subtitle="En cours"
          icon="🎁"
          color="bg-green-50 text-green-700"
        />
        <StatCard
          title="Taux d'activité"
          value={`${stats?.totalEstablishments ? Math.round((stats.activeEstablishments / stats.totalEstablishments) * 100) : 0}%`}
          subtitle="Établissements actifs"
          icon="📈"
          color="bg-purple-50 text-purple-700"
        />
      </div>

      {/* Performance par établissement */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Performance par établissement</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Établissement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Note moyenne
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Promotions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {establishments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Aucun établissement
                  </td>
                </tr>
              ) : (
                establishments.map((establishment) => (
                  <tr key={establishment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{establishment.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{establishment.type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{establishment.reviewCount}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900">
                          {establishment.averageRating > 0 ? establishment.averageRating.toFixed(1) : '-'}
                        </span>
                        {establishment.averageRating > 0 && (
                          <span className="ml-1 text-yellow-400">⭐</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{establishment.activePromotions}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          establishment.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {establishment.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Distribution des avis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Distribution des notes</h3>
          {stats && stats.totalReviews > 0 ? (
            <div className="space-y-3">
              {dashboard?.recentReviews && (
                <RatingDistribution reviews={dashboard.recentReviews} />
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Aucun avis reçu</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Conseils pour améliorer</h3>
          <div className="space-y-4">
            <Tip
              icon="📸"
              text="Ajoutez des photos attrayantes de vos établissements"
            />
            <Tip
              icon="🎁"
              text="Créez des promotions pour attirer plus de clients"
            />
            <Tip
              icon="💬"
              text="Répondez aux avis pour montrer votre engagement"
            />
            <Tip
              icon="✅"
              text="Gardez vos informations à jour (horaires, menu, etc.)"
            />
          </div>
        </div>
      </div>

      {/* Note d'information */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">À venir prochainement</p>
            <p>Statistiques de clics, vues détaillées, analyses temporelles et comparaisons avec d'autres établissements.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: string;
  color: string;
}

function StatCard({ title, value, subtitle, icon, color }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className={`text-3xl mb-3 ${color} w-12 h-12 rounded-lg flex items-center justify-center`}>
        {icon}
      </div>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
}

function RatingDistribution({ reviews }: { reviews: any[] }) {
  const distribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((r) => r.rating === rating).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { rating, count, percentage };
  });

  return (
    <div className="space-y-2">
      {distribution.map(({ rating, count, percentage }) => (
        <div key={rating} className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 w-8">{rating}⭐</span>
          <div className="flex-1 bg-gray-200 rounded-full h-4">
            <div
              className="bg-yellow-400 h-4 rounded-full transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
        </div>
      ))}
    </div>
  );
}

function Tip({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-2xl">{icon}</span>
      <p className="text-sm text-gray-700 mt-1">{text}</p>
    </div>
  );
}
