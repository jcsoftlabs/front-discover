'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/axios';
import type { ApiResponse, Review } from '@/types';

export default function PartnerReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await apiClient.get<ApiResponse<Review[]>>('/partner/reviews');
      setReviews(response.data.data || []);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Erreur lors du chargement des avis');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600">Chargement...</div>
      </div>
    );
  }

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
      : '0';

  const approvedReviews = reviews.filter(r => r.status === 'APPROVED');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Avis clients</h1>
        <p className="text-gray-600 mt-2">Consultez les avis de vos clients</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-600">Total des avis</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{reviews.length}</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-600">Note moyenne</div>
          <div className="flex items-center gap-2 mt-2">
            <div className="text-3xl font-bold text-yellow-500">{averageRating}</div>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-6 h-6 ${
                    i < Math.round(Number(averageRating)) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-600">Avis approuvés</div>
          <div className="text-3xl font-bold text-green-600 mt-2">{approvedReviews.length}</div>
        </div>
      </div>

      {/* Note d'information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note :</strong> La fonctionnalité de réponse aux avis est en cours de développement. 
          Elle sera disponible prochainement après mise à jour du backend.
        </p>
      </div>

      {/* Liste des avis */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-500">Aucun avis pour le moment.</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-gray-900">
                      {review.user ? `${review.user.firstName} ${review.user.lastName}` : 'Utilisateur'}
                    </span>
                    <div className="flex items-center">
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
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        review.status === 'APPROVED'
                          ? 'bg-green-100 text-green-800'
                          : review.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {review.status === 'APPROVED'
                        ? 'Approuvé'
                        : review.status === 'PENDING'
                        ? 'En attente'
                        : 'Rejeté'}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-3">{review.comment || 'Aucun commentaire'}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
