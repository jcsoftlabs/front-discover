'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/axios';
import { Review } from '@/types';
import { usePageTitle } from '@/hooks/usePageTitle';

interface ReviewWithDetails extends Omit<Review, 'establishment' | 'moderator'> {
  establishment?: {
    id: string;
    name: string;
    type: string;
    partner?: {
      name: string;
    };
  };
  moderator?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface PaginatedResponse {
  success: boolean;
  data: ReviewWithDetails[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export default function ReviewsPage() {
  usePageTitle('Modération des Avis');

  const [reviews, setReviews] = useState<ReviewWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [currentPage, statusFilter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(statusFilter && { status: statusFilter })
      });

      console.log('Fetching reviews:', `/admin/reviews/moderate?${params}`);
      const response = await apiClient.get<PaginatedResponse>(`/admin/reviews/moderate?${params}`);
      console.log('Reviews response:', response.data);

      if (response.data.success) {
        setReviews(response.data.data || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setTotalItems(response.data.pagination?.totalItems || 0);
      } else {
        setError('Réponse invalide du serveur');
      }
    } catch (err: any) {
      console.error('Reviews error:', err);
      console.error('Error response:', err.response);
      const errorMsg = err.response?.data?.error || err.message || 'Erreur lors du chargement des avis';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (reviewId: string, status: string, note?: string) => {
    try {
      await apiClient.put(`/admin/reviews/${reviewId}/moderate`, {
        status,
        moderationNote: note
      });
      alert(`Avis ${status === 'APPROVED' ? 'approuvé' : 'rejeté'} avec succès`);
      fetchReviews();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erreur lors de la modération');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Modération des avis</h1>
            <p className="mt-2 text-gray-600">{totalItems} avis à traiter</p>
          </div>
          <Link href="/admin" className="text-blue-600 hover:text-blue-800">
            ← Retour au dashboard
          </Link>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          >
            <option value="PENDING">En attente</option>
            <option value="APPROVED">Approuvés</option>
            <option value="REJECTED">Rejetés</option>
          </select>
        </div>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">❌ Erreur</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <div className="bg-white p-4 rounded border border-red-200 mb-4">
            <p className="text-sm text-gray-700 mb-2"><strong>Suggestions :</strong></p>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Vérifiez que le backend est lancé sur http://localhost:3000</li>
              <li>Ouvrez la console (F12) pour voir les détails de l'erreur</li>
              <li>Vérifiez que votre token est valide</li>
            </ul>
          </div>
          <button
            onClick={fetchReviews}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Réessayer
          </button>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <p className="text-gray-500">Aucun avis à modérer</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {review.user?.firstName} {review.user?.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Établissement:</span>{' '}
                      {review.establishment?.name}
                      {review.establishment?.partner && (
                        <span className="text-gray-400">
                          {' '}
                          · {review.establishment.partner.name}
                        </span>
                      )}
                    </p>
                    {review.comment && (
                      <div className="mt-3 p-3 bg-gray-50 rounded">
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    )}
                    {review.moderationNote && (
                      <div className="mt-3 p-3 bg-blue-50 rounded">
                        <p className="text-sm text-blue-800">
                          <span className="font-medium">Note de modération:</span> {review.moderationNote}
                        </p>
                        {review.moderator && (
                          <p className="text-xs text-blue-600 mt-1">
                            Par {review.moderator.firstName} {review.moderator.lastName}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${review.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : review.status === 'APPROVED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                    >
                      {review.status === 'PENDING'
                        ? 'En attente'
                        : review.status === 'APPROVED'
                          ? 'Approuvé'
                          : 'Rejeté'}
                    </span>
                  </div>
                </div>

                {review.status === 'PENDING' && (
                  <div className="flex gap-3 mt-4 pt-4 border-t">
                    <button
                      onClick={() => handleModerate(review.id, 'APPROVED', 'Avis conforme')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      ✓ Approuver
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt('Raison du rejet (optionnel):');
                        if (reason !== null) {
                          handleModerate(review.id, 'REJECTED', reason || 'Avis non conforme');
                        }
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      ✗ Rejeter
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Page {currentPage} sur {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Précédent
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
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
