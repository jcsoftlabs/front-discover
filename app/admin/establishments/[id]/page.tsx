'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import apiClient from '@/lib/axios';
import type { ApiResponse, Establishment } from '@/types';
import { usePageTitle } from '@/hooks/usePageTitle';

const establishmentTypes = [
  { value: 'HOTEL', label: 'Hôtel' },
  { value: 'RESTAURANT', label: 'Restaurant' },
  { value: 'BAR', label: 'Bar' },
  { value: 'CAFE', label: 'Café' },
  { value: 'ATTRACTION', label: 'Attraction' },
  { value: 'SHOP', label: 'Boutique' },
  { value: 'SERVICE', label: 'Service' },
] as const;

const establishmentSchema = z.object({
  name: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  description: z.string()
    .max(1000, 'La description ne peut pas dépasser 1000 caractères')
    .optional(),
  type: z.enum(['HOTEL', 'RESTAURANT', 'BAR', 'CAFE', 'ATTRACTION', 'SHOP', 'SERVICE']),
  price: z.number()
    .min(0, 'Le prix doit être un nombre positif'),
  address: z.string()
    .max(255, 'L\'adresse ne peut pas dépasser 255 caractères')
    .optional(),
  latitude: z.number()
    .min(-90, 'Latitude invalide')
    .max(90, 'Latitude invalide')
    .optional()
    .nullable(),
  longitude: z.number()
    .min(-180, 'Longitude invalide')
    .max(180, 'Longitude invalide')
    .optional()
    .nullable(),
  isActive: z.boolean(),
  partnerId: z.string()
    .optional()
    .nullable()
    .transform(val => val === '' || val === null ? undefined : val),
});

type EstablishmentFormData = z.infer<typeof establishmentSchema>;

export default function EditEstablishmentPage() {
  usePageTitle('Éditer Établissement - Admin');
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [establishment, setEstablishment] = useState<Establishment | null>(null);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EstablishmentFormData>({
    resolver: zodResolver(establishmentSchema),
  });

  // Charger les partenaires et l'établissement
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        
        // Charger les partenaires
        const partnersResponse = await apiClient.get('/admin/partners');
        setPartners(partnersResponse.data.data || partnersResponse.data);

        // Charger l'établissement
        const establishmentResponse = await apiClient.get<ApiResponse<Establishment>>(`/establishments/${id}`);
        const data = establishmentResponse.data.data;
        
        if (!data) {
          setError('Établissement introuvable');
          setLoadingData(false);
          return;
        }
        
        setEstablishment(data);

        // Pré-remplir le formulaire
        reset({
          name: data.name,
          description: data.description || '',
          type: data.type as any,
          price: data.price,
          address: data.address || '',
          latitude: data.latitude,
          longitude: data.longitude,
          isActive: data.isActive,
          partnerId: data.partnerId || '',
        });
      } catch (err: any) {
        setError(err.response?.data?.error || 'Erreur lors du chargement');
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [id, reset]);

  const onSubmit = async (data: EstablishmentFormData) => {
    setError('');
    setLoading(true);

    try {
      // Créer un FormData pour envoyer les fichiers
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('type', data.type);
      formData.append('price', data.price.toString());
      if (data.partnerId) {
        formData.append('partnerId', data.partnerId);
      }
      formData.append('isActive', data.isActive.toString());
      
      if (data.description) {
        formData.append('description', data.description);
      }
      if (data.address) {
        formData.append('address', data.address);
      }
      if (data.latitude) {
        formData.append('latitude', data.latitude.toString());
      }
      if (data.longitude) {
        formData.append('longitude', data.longitude.toString());
      }

      // Ajouter les nouvelles images
      imageFiles.forEach((file) => {
        formData.append('images', file);
      });

      // Ajouter les images à supprimer
      if (imagesToDelete.length > 0) {
        formData.append('imagesToDelete', JSON.stringify(imagesToDelete));
      }

      const response = await apiClient.put<ApiResponse<any>>(
        `/establishments/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        router.push('/admin/establishments');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error || 'Erreur lors de la mise à jour de l\'établissement'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const handleDeleteImage = (imageUrl: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
      setImagesToDelete([...imagesToDelete, imageUrl]);
    }
  };

  if (loadingData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!establishment) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Établissement introuvable
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Éditer l'établissement
        </h1>
        <p className="mt-2 text-gray-600">
          Modifiez les informations de l'établissement
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow">
        <div className="space-y-6">
          {/* Statut actif/inactif */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              {...register('isActive')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Établissement actif
            </label>
          </div>

          {/* Partenaire */}
          <div>
            <label htmlFor="partnerId" className="block text-sm font-medium text-gray-700">
              Partenaire <span className="text-gray-400">(optionnel)</span>
            </label>
            <select
              id="partnerId"
              {...register('partnerId')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 px-3 py-2 border"
            >
              <option value="">Sélectionner un partenaire</option>
              {partners.map((partner) => (
                <option key={partner.id} value={partner.id}>
                  {partner.businessName}
                </option>
              ))}
            </select>
            {errors.partnerId && (
              <p className="mt-1 text-sm text-red-600">{errors.partnerId.message}</p>
            )}
          </div>

          {/* Nom */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              {...register('name')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 px-3 py-2 border"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              id="type"
              {...register('type')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 px-3 py-2 border"
            >
              <option value="">Sélectionner un type</option>
              {establishmentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              {...register('description')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 px-3 py-2 border"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Prix */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Prix (HTG) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="price"
              step="0.01"
              {...register('price', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 px-3 py-2 border"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>

          {/* Adresse */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Adresse
            </label>
            <input
              type="text"
              id="address"
              {...register('address')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 px-3 py-2 border"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
            )}
          </div>

          {/* Coordonnées GPS */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
                Latitude
              </label>
              <input
                type="number"
                id="latitude"
                step="0.000001"
                {...register('latitude', { 
                  setValueAs: (v) => v === '' ? null : parseFloat(v) 
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 px-3 py-2 border"
              />
              {errors.latitude && (
                <p className="mt-1 text-sm text-red-600">{errors.latitude.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
                Longitude
              </label>
              <input
                type="number"
                id="longitude"
                step="0.000001"
                {...register('longitude', { 
                  setValueAs: (v) => v === '' ? null : parseFloat(v) 
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 px-3 py-2 border"
              />
              {errors.longitude && (
                <p className="mt-1 text-sm text-red-600">{errors.longitude.message}</p>
              )}
            </div>
          </div>

          {/* Images existantes */}
          {establishment.images && establishment.images.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images actuelles
              </label>
              <div className="grid grid-cols-3 gap-4">
                {establishment.images
                  .filter(image => !imagesToDelete.includes(image))
                  .map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`${establishment.name} ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(image)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Supprimer cette image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              {imagesToDelete.length > 0 && (
                <p className="mt-2 text-sm text-red-600">
                  {imagesToDelete.length} image(s) sera supprimée(s) lors de la sauvegarde
                </p>
              )}
            </div>
          )}

          {/* Nouvelles images */}
          <div>
            <label htmlFor="images" className="block text-sm font-medium text-gray-700">
              Ajouter des images
            </label>
            <input
              type="file"
              id="images"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {imageFiles.length > 0 && (
              <p className="mt-2 text-sm text-gray-600">
                {imageFiles.length} nouveau(x) fichier(s) sélectionné(s)
              </p>
            )}
          </div>

          {/* Boutons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
