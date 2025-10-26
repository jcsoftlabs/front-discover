'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import apiClient from '@/lib/axios';
import type { ApiResponse, User } from '@/types';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function UserDetailPage() {
  usePageTitle('Détails Utilisateur - Admin');
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
        setUser(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChangeRole = async (newRole: string) => {
    if (!confirm(`Changer le rôle de cet utilisateur en ${newRole} ?`)) return;

    try {
      await apiClient.put(`/users/${id}`, { role: newRole });
      alert('Rôle modifié avec succès');
      if (user) setUser({ ...user, role: newRole as any });
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erreur lors de la modification');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Supprimer définitivement cet utilisateur ?')) return;

    try {
      await apiClient.delete(`/users/${id}`);
      alert('Utilisateur supprimé');
      router.push('/admin/users');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!user || error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || 'Utilisateur introuvable'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Retour
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {user.firstName} {user.lastName}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500">Email</label>
            <p className="mt-1 text-lg text-gray-900">{user.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">Rôle</label>
            <div className="mt-1">
              <select
                value={user.role}
                onChange={(e) => handleChangeRole(e.target.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user.role === 'ADMIN'
                    ? 'bg-red-100 text-red-800'
                    : user.role === 'PARTNER'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                <option value="USER">USER</option>
                <option value="PARTNER">PARTNER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">Inscription</label>
            <p className="mt-1 text-lg text-gray-900">
              {new Date(user.createdAt).toLocaleDateString('fr-FR')}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">Avis postés</label>
            <p className="mt-1 text-lg text-gray-900">{(user as any)._count?.reviews || (user as any).reviews?.length || 0}</p>
          </div>
        </div>

        {(user as any).reviews && (user as any).reviews.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Avis postés</h2>
            <div className="space-y-4">
              {(user as any).reviews.map((review: any) => (
                <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">
                      Note: {review.rating}/5
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-gray-700">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-gray-200">
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Supprimer cet utilisateur
          </button>
        </div>
      </div>
    </div>
  );
}
