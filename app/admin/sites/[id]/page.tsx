'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import apiClient from '@/lib/axios';
import type { ApiResponse, Site } from '@/types';
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
  ville: z.string().optional(),
  departement: z.string().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  phone: z.string().optional(),
  website: z.string().url('URL invalide').optional().or(z.literal('')),
  entryFee: z.number().min(0).optional().nullable(),
  isActive: z.boolean(),
});

type SiteFormData = z.infer<typeof siteSchema>;

export default function EditSitePage() {
  usePageTitle('Éditer Site - Admin');
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [site, setSite] = useState<Site | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SiteFormData>({
    resolver: zodResolver(siteSchema),
  });

  useEffect(() => {
    const fetchSite = async () => {
      try {
        const response = await apiClient.get<ApiResponse<Site>>(`/sites/${id}`);
        const data = response.data.data;
        setSite(data);

        reset({
          name: data.name,
          description: data.description || '',
          category: data.category,
          address: data.address || '',
          ville: data.ville || '',
          departement: data.departement || '',
          latitude: data.latitude,
          longitude: data.longitude,
          phone: data.phone || '',
          website: data.website || '',
          entryFee: data.entryFee || null,
          isActive: data.isActive,
        });
      } catch (err: any) {
        setError(err.response?.data?.error || 'Erreur lors du chargement');
      } finally {
        setLoadingData(false);
      }
    };

    fetchSite();
  }, [id, reset]);

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
      formData.append('isActive', data.isActive.toString());
      
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

      const response = await apiClient.put<ApiResponse<any>>(`/sites/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        router.push('/admin/sites');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Site introuvable
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Éditer le Site</h1>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow space-y-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            {...register('isActive')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
            Site actif
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('name')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Catégorie <span className="text-red-500">*</span>
          </label>
          <select
            {...register('category')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Département</label>
            <input
              type="text"
              {...register('departement')}
              placeholder="Ouest, Nord..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Site web</label>
          <input
            type="url"
            {...register('website')}
            placeholder="https://www.site.com"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.website && <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>}
        </div>

        {site.images && site.images.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Images actuelles</label>
            <div className="grid grid-cols-3 gap-4">
              {site.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${site.name} ${index + 1}`}
                  className="w-full h-32 object-cover rounded"
                />
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Ajouter des images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => e.target.files && setImageFiles(Array.from(e.target.files))}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700"
          />
          {imageFiles.length > 0 && (
            <p className="mt-2 text-sm text-gray-600">{imageFiles.length} nouveau(x) fichier(s)</p>
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
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}
