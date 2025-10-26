'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/axios';
import { Promotion } from '@/types';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function PromotionsPage() {
  usePageTitle('Gestion des Promotions');
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const response = await apiClient.get('/promotions');
      setPromotions(response.data.data || response.data);
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
          <h1 className="text-3xl font-bold text-gray-900">Gestion des promotions</h1>
          <p className="mt-2 text-gray-600">{promotions.length} promotion(s)</p>
        </div>
        <Link href="/admin" className="text-blue-600 hover:text-blue-800">← Retour</Link>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {promotions.map((promo) => (
            <div key={promo.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{promo.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{promo.description}</p>
                  <div className="mt-3 flex gap-4 text-sm text-gray-500">
                    <span>Réduction: {promo.discount}%</span>
                    <span>Du {new Date(promo.validFrom).toLocaleDateString('fr-FR')}</span>
                    <span>au {new Date(promo.validUntil).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${promo.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {promo.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
