'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import apiClient from '@/lib/axios';

const eventSchema = z.object({
  title: z.string().min(3, 'Minimum 3 caractères'),
  category: z.enum(['CONCERT', 'FESTIVAL', 'CONFERENCE', 'SPORT', 'EXHIBITION', 'CULTURAL', 'RELIGIOUS', 'CARNIVAL', 'OTHER']),
  startDate: z.string(),
  endDate: z.string(),
  description: z.string().optional(),
  location: z.string().optional(),
  address: z.string().optional(),
  ville: z.string().optional(),
  departement: z.string().optional(),
  price: z.number().min(0).optional(),
  maxCapacity: z.number().min(1).optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

export default function PartnerNewEventPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const { register, handleSubmit, formState: { errors } } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  });

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true);
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
      if (data.price) formData.append('price', data.price.toString());
      if (data.maxCapacity) formData.append('maxCapacity', data.maxCapacity.toString());

      imageFiles.forEach((file) => {
        formData.append('images', file);
      });

      await apiClient.post('/events/partner/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Événement créé avec succès !');
      router.push('/partner/events');
    } catch (error: any) {
      console.error('Error creating event:', error);
      alert(error.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Créer un événement</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
          <input
            type="text"
            {...register('title')}
            className="w-full border rounded-lg px-3 py-2"
          />
          {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
            <select {...register('category')} className="w-full border rounded-lg px-3 py-2">
              <option value="">Sélectionner...</option>
              <option value="CONCERT">Concert</option>
              <option value="FESTIVAL">Festival</option>
              <option value="CONFERENCE">Conférence</option>
              <option value="SPORT">Sport</option>
              <option value="EXHIBITION">Exposition</option>
              <option value="CULTURAL">Culturel</option>
              <option value="RELIGIOUS">Religieux</option>
              <option value="CARNIVAL">Carnaval</option>
              <option value="OTHER">Autre</option>
            </select>
            {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prix (HTG)</label>
            <input
              type="number"
              step="0.01"
              {...register('price', { valueAsNumber: true })}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de début *</label>
            <input
              type="datetime-local"
              {...register('startDate')}
              className="w-full border rounded-lg px-3 py-2"
            />
            {errors.startDate && <p className="text-red-600 text-sm mt-1">{errors.startDate.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin *</label>
            <input
              type="datetime-local"
              {...register('endDate')}
              className="w-full border rounded-lg px-3 py-2"
            />
            {errors.endDate && <p className="text-red-600 text-sm mt-1">{errors.endDate.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
            <input
              type="text"
              {...register('location')}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <input
              type="text"
              {...register('address')}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
            <input
              type="text"
              {...register('ville')}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Département</label>
            <input
              type="text"
              {...register('departement')}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Capacité max</label>
            <input
              type="number"
              {...register('maxCapacity', { valueAsNumber: true })}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Images (max 10)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImageFiles(Array.from(e.target.files || []).slice(0, 10))}
            className="w-full border rounded-lg px-3 py-2"
          />
          {imageFiles.length > 0 && (
            <p className="text-sm text-gray-600 mt-1">{imageFiles.length} fichier(s) sélectionné(s)</p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {isSubmitting ? 'Création...' : 'Créer'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
