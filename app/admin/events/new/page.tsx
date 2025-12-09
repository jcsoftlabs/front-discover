'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import apiClient from '@/lib/axios';
import type { ApiResponse, Partner } from '@/types';

const EVENT_CATEGORIES = [
  { value: 'CONCERT', label: 'Concert' },
  { value: 'FESTIVAL', label: 'Festival' },
  { value: 'CONFERENCE', label: 'Conférence' },
  { value: 'SPORT', label: 'Sport' },
  { value: 'EXHIBITION', label: 'Exposition' },
  { value: 'CULTURAL', label: 'Culturel' },
  { value: 'RELIGIOUS', label: 'Religieux' },
  { value: 'CARNIVAL', label: 'Carnaval' },
  { value: 'OTHER', label: 'Autre' },
];

const eventSchema = z.object({
  title: z.string().min(2, 'Le titre doit contenir au moins 2 caractères').max(255),
  description: z.string().optional(),
  category: z.enum(['CONCERT', 'FESTIVAL', 'CONFERENCE', 'SPORT', 'EXHIBITION', 'CULTURAL', 'RELIGIOUS', 'CARNIVAL', 'OTHER']),
  startDate: z.string().min(1, 'La date de début est requise'),
  endDate: z.string().min(1, 'La date de fin est requise'),
  location: z.string().optional(),
  address: z.string().optional(),
  ville: z.string().optional(),
  departement: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  price: z.number().min(0).optional().nullable(),
  maxCapacity: z.number().min(1).optional().nullable(),
  organizerId: z.string().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

export default function NewEventPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await apiClient.get<ApiResponse<Partner[]>>('/admin/partners');
      if (response.data.success) {
        setPartners(response.data.data);
      }
    } catch (err) {
      console.error('Erreur chargement partenaires:', err);
    }
  };

  const onSubmit = async (data: EventFormData) => {
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('category', data.category);
      formData.append('startDate', data.startDate);
      formData.append('endDate', data.endDate);
      
      if (data.description) formData.append('description', data.description);
      if (data.location) formData.append('location', data.location);
      if (data.address) formData.append('address', data.address);
      if (data.ville) formData.append('ville', data.ville);
      if (data.departement) formData.append('departement', data.departement);
      if (data.latitude) formData.append('latitude', data.latitude.toString());
      if (data.longitude) formData.append('longitude', data.longitude.toString());
      if (data.price) formData.append('price', data.price.toString());
      if (data.maxCapacity) formData.append('maxCapacity', data.maxCapacity.toString());
      if (data.organizerId) formData.append('organizerId', data.organizerId);

      imageFiles.forEach((file) => {
        formData.append('images', file);
      });

      const response = await apiClient.post<ApiResponse<any>>(
        '/events',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        router.push('/admin/events');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la création');
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
        <h1 className="text-3xl font-bold text-gray-900">Nouvel Événement</h1>
        <p className="mt-2 text-gray-600">Créez un nouvel événement touristique</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow space-y-6">
        {/* Titre */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Titre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('title')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>

        {/* Catégorie */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Catégorie <span className="text-red-500">*</span>
          </label>
          <select
            {...register('category')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          >
            <option value="">Sélectionner une catégorie</option>
            {EVENT_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            rows={4}
            {...register('description')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date de début <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              {...register('startDate')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            />
            {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date de fin <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              {...register('endDate')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            />
            {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>}
          </div>
        </div>

        {/* Localisation */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Lieu</label>
          <input
            type="text"
            {...register('location')}
            placeholder="Ex: Place de la Paix"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Adresse</label>
          <input
            type="text"
            {...register('address')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
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
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Département</label>
            <input
              type="text"
              {...register('departement')}
              placeholder="Ouest, Nord..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            />
          </div>
        </div>

        {/* Coordonnées GPS */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Latitude</label>
            <input
              type="number"
              step="0.000001"
              {...register('latitude', { setValueAs: (v) => v === '' ? null : parseFloat(v) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Longitude</label>
            <input
              type="number"
              step="0.000001"
              {...register('longitude', { setValueAs: (v) => v === '' ? null : parseFloat(v) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            />
          </div>
        </div>

        {/* Prix et capacité */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Prix (HTG)</label>
            <input
              type="number"
              step="0.01"
              {...register('price', { setValueAs: (v) => v === '' ? null : parseFloat(v) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Capacité maximale</label>
            <input
              type="number"
              {...register('maxCapacity', { setValueAs: (v) => v === '' ? null : parseInt(v) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            />
          </div>
        </div>

        {/* Organisateur */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Organisateur</label>
          <select
            {...register('organizerId')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          >
            <option value="">Aucun</option>
            {partners.map((partner) => (
              <option key={partner.id} value={partner.id}>
                {partner.name}
              </option>
            ))}
          </select>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {imageFiles.length > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              {imageFiles.length} fichier(s) sélectionné(s)
            </p>
          )}
        </div>

        {/* Boutons */}
        <div className="flex justify-end space-x-4 pt-4 border-t">
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
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Création...' : 'Créer l\'événement'}
          </button>
        </div>
      </form>
    </div>
  );
}
