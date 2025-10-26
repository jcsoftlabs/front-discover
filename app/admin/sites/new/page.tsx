'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import apiClient from '@/lib/axios';
import type { ApiResponse } from '@/types';
import { usePageTitle } from '@/hooks/usePageTitle';

const siteCategories = [
  { value: 'MONUMENT', label: 'Monument' },
  { value: 'MUSEUM', label: 'Musée' },
  { value: 'PARK', label: 'Parc' },
  { value: 'BEACH', label: 'Plage' },
  { value: 'MOUNTAIN', label: 'Montagne' },
  { value: 'CULTURAL', label: 'Culturel' },
  { value: 'RELIGIOUS', label: 'Religieux' },
  { value: 'NATURAL', label: 'Naturel' },
  { value: 'HISTORICAL', label: 'Historique' },
  { value: 'ENTERTAINMENT', label: 'Divertissement' },
];

const siteSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  description: z.string().optional(),
  category: z.string().min(1, 'La catégorie est requise'),
  address: z.string().min(1, 'L\'adresse est requise'),
  ville: z.string().max(100, 'La ville ne peut pas dépasser 100 caractères').optional(),
  departement: z.string().max(100, 'Le département ne peut pas dépasser 100 caractères').optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  phone: z.string().max(50, 'Le téléphone ne peut pas dépasser 50 caractères').optional(),
  website: z.string().url('URL invalide').optional().or(z.literal('')),
  entryFee: z.number().min(0, 'Le prix d\'entrée doit être positif').optional().nullable(),
});

type SiteFormData = z.infer<typeof siteSchema>;

export default function NewSitePage() {
  usePageTitle('Nouveau Site - Admin');
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SiteFormData>({
    resolver: zodResolver(siteSchema),
  });

  const onSubmit = async (data: SiteFormData) => {
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('category', data.category);
      formData.append('address', data.address);
      formData.append('latitude', data.latitude.toString());
      formData.append('longitude', data.longitude.toString());
      
      if (data.description) formData.append('description', data.description);
      if (data.ville) formData.append('ville', data.ville);
      if (data.departement) formData.append('departement', data.departement);
      if (data.phone) formData.append('phone', data.phone);
      if (data.website) formData.append('website', data.website);
      if (data.entryFee !== undefined && data.entryFee !== null) {
        formData.append('entryFee', data.entryFee.toString());
      }

      imageFiles.forEach((file) => {
        formData.append('images', file);
      });

      const response = await apiClient.post<ApiResponse<any>>('/sites', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        router.push('/admin/sites');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la création du site');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Nouveau Site Touristique</h1>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('name')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Catégorie <span className="text-red-500">*</span>
          </label>
          <select
            {...register('category')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          >
            <option value="">Sélectionner une catégorie</option>
            {siteCategories.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            rows={4}
            {...register('description')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Adresse <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('address')}
            placeholder="Adresse complète du site"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
          {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Ville</label>
            <input
              type="text"
              {...register('ville')}
              placeholder="Port-au-Prince, Cap-Haïtien..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            />
            {errors.ville && <p className="mt-1 text-sm text-red-600">{errors.ville.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Département</label>
            <input
              type="text"
              {...register('departement')}
              placeholder="Ouest, Nord..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            />
            {errors.departement && <p className="mt-1 text-sm text-red-600">{errors.departement.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Latitude <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.000001"
              {...register('latitude', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            />
            {errors.latitude && <p className="mt-1 text-sm text-red-600">{errors.latitude.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Longitude <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.000001"
              {...register('longitude', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            />
            {errors.longitude && <p className="mt-1 text-sm text-red-600">{errors.longitude.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Téléphone</label>
            <input
              type="tel"
              {...register('phone')}
              placeholder="+509 XXXX XXXX"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Prix d'entrée (HTG)</label>
            <input
              type="number"
              step="0.01"
              {...register('entryFee', { 
                setValueAs: (v) => v === '' ? null : parseFloat(v) 
              })}
              placeholder="0.00"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            />
            {errors.entryFee && <p className="mt-1 text-sm text-red-600">{errors.entryFee.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Site web</label>
          <input
            type="url"
            {...register('website')}
            placeholder="https://www.site.com"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
          {errors.website && <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => e.target.files && setImageFiles(Array.from(e.target.files))}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700"
          />
          {imageFiles.length > 0 && (
            <p className="mt-2 text-sm text-gray-600">{imageFiles.length} fichier(s) sélectionné(s)</p>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Création...' : 'Créer le site'}
          </button>
        </div>
      </form>
    </div>
  );
}
