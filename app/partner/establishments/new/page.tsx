'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import apiClient from '@/lib/axios';
import type { ApiResponse } from '@/types';

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
  type: z.enum(['HOTEL', 'RESTAURANT', 'BAR', 'CAFE', 'ATTRACTION', 'SHOP', 'SERVICE'], {
    message: 'Le type est requis',
  }),
  price: z.number()
    .min(0, 'Le prix doit être un nombre positif'),
  address: z.string()
    .max(255, 'L\'adresse ne peut pas dépasser 255 caractères')
    .optional(),
  ville: z.string()
    .max(100, 'La ville ne peut pas dépasser 100 caractères')
    .optional(),
  departement: z.string()
    .max(100, 'Le département ne peut pas dépasser 100 caractères')
    .optional(),
  phone: z.string()
    .max(50, 'Le téléphone ne peut pas dépasser 50 caractères')
    .optional(),
  email: z.string()
    .email('Email invalide')
    .optional()
    .or(z.literal('')),
  website: z.string()
    .url('URL invalide')
    .optional()
    .or(z.literal('')),
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
});

type EstablishmentFormData = z.infer<typeof establishmentSchema>;

export default function NewEstablishmentPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EstablishmentFormData>({
    resolver: zodResolver(establishmentSchema),
  });

  const onSubmit = async (data: EstablishmentFormData) => {
    setError('');
    setLoading(true);

    try {
      // Récupérer les infos du partenaire depuis localStorage
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        setError('Session expirée. Veuillez vous reconnecter.');
        return;
      }

      const user = JSON.parse(userStr);
      
      // Récupérer le partnerId depuis le dashboard API
      const dashboardResponse = await apiClient.get<ApiResponse<any>>('/partner/dashboard');
      if (!dashboardResponse.data.success || !dashboardResponse.data.data?.partner?.id) {
        setError('Impossible de récupérer les informations du partenaire.');
        return;
      }
      
      const partnerId = dashboardResponse.data.data.partner.id;
      
      // Créer un FormData pour envoyer les fichiers
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('type', data.type);
      formData.append('price', data.price.toString());
      
      if (data.description) {
        formData.append('description', data.description);
      }
      if (data.address) {
        formData.append('address', data.address);
      }
      if (data.ville) {
        formData.append('ville', data.ville);
      }
      if (data.departement) {
        formData.append('departement', data.departement);
      }
      if (data.phone) {
        formData.append('phone', data.phone);
      }
      if (data.email) {
        formData.append('email', data.email);
      }
      if (data.website) {
        formData.append('website', data.website);
      }
      if (data.latitude) {
        formData.append('latitude', data.latitude.toString());
      }
      if (data.longitude) {
        formData.append('longitude', data.longitude.toString());
      }

      // Ajouter le partnerId récupéré depuis l'API
      formData.append('partnerId', partnerId);

      // Ajouter les images
      imageFiles.forEach((file) => {
        formData.append('images', file);
      });

      const response = await apiClient.post<ApiResponse<any>>(
        '/establishments',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        router.push('/partner/establishments');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error || 'Erreur lors de la création de l\'établissement'
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Nouvel Établissement
        </h1>
        <p className="mt-2 text-gray-600">
          Créez un nouvel établissement pour votre activité
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow">
        <div className="space-y-6">
          {/* Nom */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              {...register('name')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-gray-900"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-gray-900"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-gray-900"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-gray-900"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-gray-900"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
            )}
          </div>

          {/* Ville et Département */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="ville" className="block text-sm font-medium text-gray-700">
                Ville
              </label>
              <input
                type="text"
                id="ville"
                {...register('ville')}
                placeholder="Port-au-Prince, Cap-Haïtien..."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-gray-900"
              />
              {errors.ville && (
                <p className="mt-1 text-sm text-red-600">{errors.ville.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="departement" className="block text-sm font-medium text-gray-700">
                Département
              </label>
              <input
                type="text"
                id="departement"
                {...register('departement')}
                placeholder="Ouest, Nord..."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-gray-900"
              />
              {errors.departement && (
                <p className="mt-1 text-sm text-red-600">{errors.departement.message}</p>
              )}
            </div>
          </div>

          {/* Informations de contact */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Téléphone
              </label>
              <input
                type="tel"
                id="phone"
                {...register('phone')}
                placeholder="+509 XXXX XXXX"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-gray-900"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register('email')}
                placeholder="contact@etablissement.com"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-gray-900"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Site web */}
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700">
              Site web
            </label>
            <input
              type="url"
              id="website"
              {...register('website')}
              placeholder="https://www.etablissement.com"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-gray-900"
            />
            {errors.website && (
              <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-gray-900"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-gray-900"
              />
              {errors.longitude && (
                <p className="mt-1 text-sm text-red-600">{errors.longitude.message}</p>
              )}
            </div>
          </div>

          {/* Images */}
          <div>
            <label htmlFor="images" className="block text-sm font-medium text-gray-700">
              Images
            </label>
            <input
              type="file"
              id="images"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            {imageFiles.length > 0 && (
              <p className="mt-2 text-sm text-gray-600">
                {imageFiles.length} fichier(s) sélectionné(s)
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
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Création...' : 'Créer l\'établissement'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
