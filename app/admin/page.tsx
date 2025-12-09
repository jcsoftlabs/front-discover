'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/axios';
import { AdminDashboard, ApiResponse } from '@/types';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function AdminDashboardPage() {
  usePageTitle('Dashboard Administrateur');
  
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Vérifier que le composant est bien monté côté client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Ne charger les données qu'après le montage côté client
    if (!isMounted) return;
    fetchDashboard();
  }, [isMounted]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      console.log('Fetching dashboard data...');
      console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
      console.log('Token:', localStorage.getItem('token') ? 'Present' : 'Missing');
      
      const response = await apiClient.get<ApiResponse<AdminDashboard>>('/admin/dashboard');
      console.log('Dashboard response:', response.data);
      
      if (response.data.success && response.data.data) {
        setDashboard(response.data.data);
      } else {
        setError('Données du dashboard invalides');
      }
    } catch (err: any) {
      console.error('Dashboard error:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.error || err.message || 'Erreur lors du chargement du dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">❌ Erreur de chargement</h2>
          <p className="text-red-700 mb-4">{error}</p>
          
          <div className="bg-white p-4 rounded border border-red-200 mb-4">
            <p className="text-sm text-gray-700 mb-2"><strong>Vérifications :</strong></p>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Le backend est-il lancé sur http://localhost:3000 ?</li>
              <li>Êtes-vous connecté avec un compte ADMIN ?</li>
              <li>Votre token est-il valide ? (Ouvrez la console pour plus de détails)</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchDashboard}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Réessayer
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Se reconnecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stats = dashboard?.stats;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord administrateur</h1>
        <p className="mt-2 text-gray-600">Vue d'ensemble du système Touris Haiti</p>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Utilisateurs"
          value={stats?.totalUsers || 0}
          icon="👥"
          linkTo="/admin/users"
          color="bg-blue-50 text-blue-700"
        />
        <StatCard
          title="Partenaires"
          value={stats?.totalPartners || 0}
          badge={stats?.pendingPartners}
          badgeLabel="en attente"
          icon="🏢"
          linkTo="/admin/partners"
          color="bg-green-50 text-green-700"
        />
        <StatCard
          title="Établissements"
          value={stats?.totalEstablishments || 0}
          subtitle={`${stats?.activeEstablishments || 0} actifs`}
          icon="🏨"
          linkTo="/admin/establishments"
          color="bg-purple-50 text-purple-700"
        />
        <StatCard
          title="Sites touristiques"
          value={stats?.totalSites || 0}
          subtitle={`${stats?.activeSites || 0} actifs`}
          icon="🏛️"
          linkTo="/admin/sites"
          color="bg-orange-50 text-orange-700"
        />
        <StatCard
          title="Avis"
          value={stats?.totalReviews || 0}
          badge={stats?.pendingReviews}
          badgeLabel="à modérer"
          icon="⭐"
          linkTo="/admin/reviews"
          color="bg-yellow-50 text-yellow-700"
        />
        <StatCard
          title="Promotions"
          value={stats?.totalPromotions || 0}
          icon="🎁"
          linkTo="/admin/promotions"
          color="bg-pink-50 text-pink-700"
        />
      </div>

      {/* Modules de gestion */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Modules de gestion</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ModuleCard
            title="Gestion des utilisateurs"
            description="Gérer les comptes, rôles et permissions"
            icon="👥"
            linkTo="/admin/users"
            color="blue"
          />
          <ModuleCard
            title="Gestion des partenaires"
            description="Valider et modérer les partenaires"
            icon="🏢"
            linkTo="/admin/partners"
            color="green"
          />
          <ModuleCard
            title="Gestion des établissements"
            description="Ajouter et gérer les établissements"
            icon="🏨"
            linkTo="/admin/establishments"
            color="purple"
          />
          <ModuleCard
            title="Sites touristiques"
            description="Créer et éditer les fiches de sites"
            icon="🏛️"
            linkTo="/admin/sites"
            color="orange"
          />
          <ModuleCard
            title="Modération des avis"
            description="Approuver ou rejeter les avis"
            icon="⭐"
            linkTo="/admin/reviews"
            color="yellow"
          />
          <ModuleCard
            title="Gestion des promotions"
            description="Surveiller les offres promotionnelles"
            icon="🎁"
            linkTo="/admin/promotions"
            color="pink"
          />
          <ModuleCard
            title="Administrateurs"
            description="Gérer les comptes administrateurs"
            icon="🔐"
            linkTo="/admin/administrators"
            color="indigo"
          />
          <ModuleCard
            title="Configuration système"
            description="Catégories, types et paramètres"
            icon="⚙️"
            linkTo="/admin/settings"
            color="gray"
          />
          <ModuleCard
            title="Statistiques"
            description="Rapports et analyses détaillées"
            icon="📊"
            linkTo="/admin/statistics"
            color="cyan"
          />
        </div>
      </div>

      {/* Activité récente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Partenaires récents */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Partenaires récents</h3>
          {dashboard?.recentActivity.recentPartners.length === 0 ? (
            <p className="text-gray-500 text-sm">Aucun partenaire récent</p>
          ) : (
            <div className="space-y-3">
              {dashboard?.recentActivity.recentPartners.map((partner) => (
                <div key={partner.id} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium text-gray-900">{partner.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(partner.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      partner.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : partner.status === 'APPROVED'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {partner.status === 'PENDING' ? 'En attente' : 
                     partner.status === 'APPROVED' ? 'Approuvé' : 'Rejeté'}
                  </span>
                </div>
              ))}
            </div>
          )}
          <Link
            href="/admin/partners"
            className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Voir tous les partenaires →
          </Link>
        </div>

        {/* Avis en attente */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Avis en attente de modération</h3>
          {dashboard?.recentActivity.recentPendingReviews.length === 0 ? (
            <p className="text-gray-500 text-sm">Aucun avis en attente</p>
          ) : (
            <div className="space-y-3">
              {dashboard?.recentActivity.recentPendingReviews.map((review) => (
                <div key={review.id} className="border-b pb-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900 text-sm">
                      {review.user?.firstName} {review.user?.lastName}
                    </p>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>{i < review.rating ? '⭐' : '☆'}</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{review.establishment?.name}</p>
                  {review.comment && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
          <Link
            href="/admin/reviews"
            className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Modérer les avis →
          </Link>
        </div>
      </div>
    </div>
  );
}

// Composant StatCard
interface StatCardProps {
  title: string;
  value: number;
  subtitle?: string;
  badge?: number;
  badgeLabel?: string;
  icon: string;
  linkTo: string;
  color: string;
}

function StatCard({ title, value, subtitle, badge, badgeLabel, icon, linkTo, color }: StatCardProps) {
  return (
    <Link href={linkTo} className="block">
      <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className={`text-3xl ${color} p-3 rounded-lg`}>{icon}</div>
          {badge !== undefined && badge > 0 && (
            <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-1 rounded-full">
              {badge}
            </span>
          )}
        </div>
        <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
        <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        {badge !== undefined && badge > 0 && badgeLabel && (
          <p className="text-xs text-red-600 mt-1 font-medium">{badgeLabel}</p>
        )}
      </div>
    </Link>
  );
}

// Composant ModuleCard
interface ModuleCardProps {
  title: string;
  description: string;
  icon: string;
  linkTo: string;
  color: string;
}

function ModuleCard({ title, description, icon, linkTo, color }: ModuleCardProps) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
    green: 'bg-green-50 text-green-600 group-hover:bg-green-100',
    purple: 'bg-purple-50 text-purple-600 group-hover:bg-purple-100',
    orange: 'bg-orange-50 text-orange-600 group-hover:bg-orange-100',
    yellow: 'bg-yellow-50 text-yellow-600 group-hover:bg-yellow-100',
    pink: 'bg-pink-50 text-pink-600 group-hover:bg-pink-100',
    indigo: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100',
    gray: 'bg-gray-50 text-gray-600 group-hover:bg-gray-100',
    cyan: 'bg-cyan-50 text-cyan-600 group-hover:bg-cyan-100',
  };

  return (
    <Link href={linkTo} className="group block">
      <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-all border-2 border-transparent group-hover:border-blue-500">
        <div className={`text-4xl mb-4 ${colorClasses[color]} w-16 h-16 rounded-lg flex items-center justify-center transition-colors`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
        <div className="mt-4 text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform inline-block">
          Accéder →
        </div>
      </div>
    </Link>
  );
}
