'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';
import { Review, ApiResponse } from '@/types';
import ReviewModerationCard from '@/components/admin/ReviewModerationCard';

export default function ReviewModerationPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPendingReviews();
  }, []);

  const loadPendingReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get<ApiResponse<Review[]>>(
        '/admin/reviews/moderate'
      );
      
      if (response.data.success) {
        setReviews(response.data.data);
      }
    } catch (err) {
      console.error('Error loading reviews:', err);
      setError('Erreur lors du chargement des avis');
    } finally {
      setLoading(false);
    }
  };

  const moderateReview = async (
    reviewId: string,
    status: 'APPROVED' | 'REJECTED',
    moderationNote?: string
  ) => {
    try {
      await apiClient.put(`/admin/reviews/${reviewId}/moderate`, {
        status,
        moderationNote
      });
      
      // Retirer de la liste
      setReviews(reviews.filter(r => r.id !== reviewId));
    } catch (err) {
      console.error('Error moderating review:', err);
      throw err; // Re-throw pour que le composant gère l'erreur
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des avis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-800">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
        <button
          onClick={loadPendingReviews}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modération des avis</h1>
          <p className="text-gray-600 mt-1">
            Gérez les avis en attente de validation
          </p>
        </div>

        <button
          onClick={loadPendingReviews}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualiser
        </button>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun avis en attente
          </h3>
          <p className="text-gray-600">
            Tous les avis ont été modérés
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-800">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{reviews.length} avis en attente de modération</span>
            </div>
          </div>

          {reviews.map(review => (
            <ReviewModerationCard
              key={review.id}
              review={review}
              onModerate={moderateReview}
            />
          ))}
        </div>
      )}
    </div>
  );
}
