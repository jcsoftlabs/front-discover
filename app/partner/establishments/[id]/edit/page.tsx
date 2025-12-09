'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import apiClient from '@/lib/axios';
import type { ApiResponse, Establishment } from '@/types';
import { ArrowLeft } from 'lucide-react';
import AmenitiesInput from '@/components/forms/AmenitiesInput';
import MenuInput from '@/components/forms/MenuInput';
import AvailabilityInput from '@/components/forms/AvailabilityInput';

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
  isActive: z.boolean().optional(),
  amenities: z.array(z.string()).optional(),
  menu: z.record(z.string()).optional(),
  availability: z.record(z.string()).optional(),
});

type EstablishmentFormData = z.infer<typeof establishmentSchema>;

export default function EditEstablishmentPage() {
  const router = useRouter();
  const params = useParams();
  const establishmentId = params.id as string;
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [menu, setMenu] = useState<Record<string, string>>({});
  const [availability, setAvailability] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EstablishmentFormData>({
    resolver: zodResolver(establishmentSchema),
  });

  useEffect(() => {
    if (establishmentId) {
      fetchEstablishment();
    }
  }, [establishmentId]);

  const fetchEstablishment = async () => {
    try {
      const response = await apiClient.get<ApiResponse<Establishment>>(
        `/partner/establishments/${establishmentId}`
      );
      
      if (response.data.success) {
        const establishment = response.data.data;
        
        // Pré-remplir le formulaire
        reset({
          name: establishment.name,
          description: establishment.description || '',
          type: establishment.type as any,
          price: establishment.price,
          address: establishment.address || '',
          ville: establishment.ville || '',
          departement: establishment.departement || '',
          phone: establishment.phone || '',
          email: establishment.email || '',
          website: establishment.website || '',
          latitude: establishment.latitude || null,
          longitude: establishment.longitude || null,
          isActive: establishment.isActive,
        });
        
        // Sauvegarder les images existantes
        if (establishment.images && Array.isArray(establishment.images)) {
          setExistingImages(establishment.images as string[]);
        }

        // Pré-remplir les champs JSON avancés
        if (establishment.amenities && Array.isArray(establishment.amenities)) {
          setAmenities(establishment.amenities as string[]);
        }
        if (establishment.menu && typeof establishment.menu === 'object') {
          setMenu(establishment.menu as Record<string, string>);
        }
        if (establishment.availability && typeof establishment.availability === 'object') {
          setAvailability(establishment.availability as Record<string, string>);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors du chargement');
    } finally {
      setLoadingData(false);
    }
  };

  const onSubmit = async (data: EstablishmentFormData) => {
    setError('');
    setLoading(true);

    try {
      // Créer un FormData pour envoyer les fichiers
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('type', data.type);
      formData.append('price', data.price.toString());
      
      if (data.description) formData.append('description', data.description);
      if (data.address) formData.append('address', data.address);
      if (data.ville) formData.append('ville', data.ville);
      if (data.departement) formData.append('departement', data.departement);
      if (data.phone) formData.append('phone', data.phone);
      if (data.email) formData.append('email', data.email);
      if (data.website) formData.append('website', data.website);
      if (data.latitude) formData.append('latitude', data.latitude.toString());
      if (data.longitude) formData.append('longitude', data.longitude.toString());
      if (data.isActive !== undefined) formData.append('isActive', data.isActive.toString());

      // Ajouter les champs JSON avancés
      if (amenities.length > 0) {
        formData.append('amenities', JSON.stringify(amenities));
      }
      if (Object.keys(menu).length > 0) {
        formData.append('menu', JSON.stringify(menu));
      }
      if (Object.keys(availability).length > 0) {
        formData.append('availability', JSON.stringify(availability));
      }

      // Ajouter les nouvelles images
      imageFiles.forEach((file) => {
        formData.append('images', file);
      });

      const response = await apiClient.put<ApiResponse<any>>(
        `/establishments/${establishmentId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        router.push(`/partner/establishments/${establishmentId}`);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error || 'Erreur lors de la modification'
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

  if (loadingData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => router.push(`/partner/establishments/${establishmentId}`)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux détails
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          Modifier l'Établissement
        </h1>
        <p className="mt-2 text-gray-600">
          Mettez à jour les informations de votre établissement
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

          {/* Images existantes */}
          {existingImages.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images actuelles
              </label>
              <div className="grid grid-cols-3 gap-4">
                {existingImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Nouvelles images */}
          <div>
            <label htmlFor="images" className="block text-sm font-medium text-gray-700">
              Ajouter de nouvelles images
            </label>
            <input
              type="file"
              id="images"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-green-50 file:text-green-700
                hover:file:bg-green-100"
            />
            {imageFiles.length > 0 && (
              <p className="mt-1 text-sm text-gray-600">
                {imageFiles.length} fichier(s) sélectionné(s)
              </p>
            )}
          </div>

          {/* Champs JSON avancés */}
          <div className="border-t pt-6 space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Informations supplémentaires</h3>
            
            <AmenitiesInput
              value={amenities}
              onChange={setAmenities}
            />

            <MenuInput
              value={menu}
              onChange={setMenu}
            />

            <AvailabilityInput
              value={availability}
              onChange={setAvailability}
            />
          </div>

          {/* Status actif/inactif */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              {...register('isActive')}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Établissement actif
            </label>
          </div>

          {/* Boutons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.push(`/partner/establishments/${establishmentId}`)}
              className="text-gray-600 hover:text-gray-900"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
