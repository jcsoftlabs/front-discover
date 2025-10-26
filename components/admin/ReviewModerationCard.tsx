'use client';

import { useState } from 'react';
import { Review } from '@/types';
import { getReviewStatusColor } from '@/lib/constants';

interface ReviewModerationCardProps {
  review: Review;
  onModerate: (reviewId: string, status: 'APPROVED' | 'REJECTED', moderationNote?: string) => Promise<void>;
}

export default function ReviewModerationCard({ review, onModerate }: ReviewModerationCardProps) {
  const [loading, setLoading] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [moderationNote, setModerationNote] = useState('');

  const handleApprove = async () => {
    setLoading(true);
    try {
      await onModerate(review.id, 'APPROVED');
    } catch (error) {
      console.error('Error approving review:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!moderationNote.trim()) {
      setShowNoteInput(true);
      return;
    }

    setLoading(true);
    try {
      await onModerate(review.id, 'REJECTED', moderationNote);
      setShowNoteInput(false);
      setModerationNote('');
    } catch (error) {
      console.error('Error rejecting review:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {renderStars(review.rating)}
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              review.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
              review.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
              {review.status}
            </span>
          </div>

          <div className="text-sm text-gray-600 mb-2">
            <strong>Par:</strong> {review.user?.firstName} {review.user?.lastName}
          </div>

          <div className="text-sm text-gray-600 mb-3">
            <strong>Établissement:</strong> {review.establishment?.name} 
            {review.establishment?.type && (
              <span className="ml-2 text-gray-500">({review.establishment.type})</span>
            )}
          </div>

          {review.comment && (
            <div className="bg-gray-50 p-3 rounded-lg mb-3">
              <p className="text-gray-700">{review.comment}</p>
            </div>
          )}

          <div className="text-xs text-gray-500">
            {new Date(review.createdAt).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>

      {review.status === 'PENDING' && (
        <div className="space-y-3">
          {showNoteInput && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Note de modération (requis pour rejeter)
              </label>
              <textarea
                value={moderationNote}
                onChange={(e) => setModerationNote(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Raison du rejet..."
              />
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleApprove}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Traitement...' : 'Approuver'}
            </button>

            <button
              onClick={() => {
                if (showNoteInput) {
                  handleReject();
                } else {
                  setShowNoteInput(true);
                }
              }}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Traitement...' : 'Rejeter'}
            </button>

            {showNoteInput && (
              <button
                onClick={() => {
                  setShowNoteInput(false);
                  setModerationNote('');
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Annuler
              </button>
            )}
          </div>
        </div>
      )}

      {review.status !== 'PENDING' && review.moderationNote && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm font-medium text-blue-900 mb-1">Note de modération:</div>
          <div className="text-sm text-blue-700">{review.moderationNote}</div>
          {review.moderatedBy && review.moderatedAt && (
            <div className="text-xs text-blue-600 mt-2">
              Modéré le {new Date(review.moderatedAt).toLocaleDateString('fr-FR')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
