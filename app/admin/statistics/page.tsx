'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/axios';
import { Statistics, ApiResponse } from '@/types';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function StatisticsPage() {
  usePageTitle('Statistiques Détaillées');
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');

  useEffect(() => {
    fetchStatistics();
  }, [period]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<ApiResponse<Statistics>>(`/admin/statistics?period=${period}`);
      setStats(response.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Statistiques détaillées</h1>
          <p className="mt-2 text-gray-600">Analyses et rapports du système</p>
        </div>
        <div className="flex gap-3 items-center">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="7">7 derniers jours</option>
            <option value="30">30 derniers jours</option>
            <option value="90">90 derniers jours</option>
            <option value="365">Année entière</option>
          </select>
          <Link href="/admin" className="text-blue-600 hover:text-blue-800">← Retour</Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : stats ? (
        <div className="space-y-6">
          {/* Nouvelles inscriptions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="Nouveaux utilisateurs" value={stats.newUsers} color="blue" />
            <StatCard title="Nouveaux partenaires" value={stats.newPartners} color="green" />
            <StatCard title="Nouveaux établissements" value={stats.newEstablishments} color="purple" />
            <StatCard title="Nouveaux avis" value={stats.newReviews} color="yellow" />
          </div>

          {/* Distribution des types d'établissements */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Types d'établissements</h2>
            <div className="space-y-3">
              {stats.distributions.establishmentTypes.map((item) => (
                <div key={item.type} className="flex items-center justify-between">
                  <span className="text-gray-700">{item.type}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-48 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{
                          width: `${(item._count.type / Math.max(...stats.distributions.establishmentTypes.map(t => t._count.type))) * 100}%`
                        }}
                      ></div>
                    </div>
                    <span className="font-semibold text-gray-900 w-12 text-right">{item._count.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Distribution des catégories de sites */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Catégories de sites touristiques</h2>
            <div className="space-y-3">
              {stats.distributions.siteCategories.map((item) => (
                <div key={item.category} className="flex items-center justify-between">
                  <span className="text-gray-700">{item.category}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-48 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-600 h-2 rounded-full"
                        style={{
                          width: `${(item._count.category / Math.max(...stats.distributions.siteCategories.map(s => s._count.category))) * 100}%`
                        }}
                      ></div>
                    </div>
                    <span className="font-semibold text-gray-900 w-12 text-right">{item._count.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Distribution des notes */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Distribution des notes d'avis</h2>
            <div className="space-y-3">
              {stats.distributions.reviewRatings.sort((a, b) => b.rating - a.rating).map((item) => (
                <div key={item.rating} className="flex items-center justify-between">
                  <span className="text-gray-700 flex items-center gap-2">
                    {item.rating} ⭐
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-48 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{
                          width: `${(item._count.rating / Math.max(...stats.distributions.reviewRatings.map(r => r._count.rating))) * 100}%`
                        }}
                      ></div>
                    </div>
                    <span className="font-semibold text-gray-900 w-12 text-right">{item._count.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  color: string;
}

function StatCard({ title, value, color }: StatCardProps) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    purple: 'bg-purple-50 text-purple-700',
    yellow: 'bg-yellow-50 text-yellow-700'
  };

  return (
    <div className={`${colors[color]} p-6 rounded-lg`}>
      <p className="text-sm font-medium mb-1">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
