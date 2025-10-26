'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import apiClient from '@/lib/axios';
import type { ApiResponse } from '@/types';

const registerSchema = z.object({
  // Informations utilisateur
  firstName: z.string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s-]+$/, 'Le prénom ne peut contenir que des lettres, espaces et tirets'),
  lastName: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s-]+$/, 'Le nom ne peut contenir que des lettres, espaces et tirets'),
  email: z.string().email('Email invalide'),
  password: z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial'
    ),
  confirmPassword: z.string(),
  // Informations partenaire/entreprise
  businessName: z.string()
    .min(2, 'Le nom de l\'entreprise doit contenir au moins 2 caractères')
    .max(100, 'Le nom de l\'entreprise ne peut pas dépasser 100 caractères'),
  phone: z.string()
    .regex(/^[\d\s\-+()]+$/, 'Numéro de téléphone invalide')
    .optional(),
  businessDescription: z.string()
    .max(1000, 'La description ne peut pas dépasser 1000 caractères')
    .optional(),
  website: z.string()
    .url('URL invalide')
    .optional()
    .or(z.literal('')),
  address: z.string()
    .max(255, 'L\'adresse ne peut pas dépasser 255 caractères')
    .optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function PartnerRegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError('');
    setLoading(true);

    try {
      // 1. Créer l'utilisateur avec le rôle PARTNER
      const userResponse = await apiClient.post<ApiResponse<{ user: any; token: string }>>('/auth/register', {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: 'PARTNER',
      });

      if (!userResponse.data.success) {
        throw new Error(userResponse.data.message || 'Erreur lors de la création du compte');
      }

      const userId = userResponse.data.data.user.id;

      // 2. Créer le profil Partner avec statut PENDING
      // Note: Cette route n'existe pas encore dans le backend
      // Il faudra l'ajouter ou utiliser une route admin
      // Pour l'instant, on pourrait utiliser une approche temporaire
      
      setSuccess(true);
      
      // Rediriger après 3 secondes
      setTimeout(() => {
        router.push('/partner/login');
      }, 3000);

    } catch (err: any) {
      console.error('Registration error:', err);
      setError(
        err.response?.data?.error || 
        err.message || 
        'Erreur lors de l\'inscription. Veuillez réessayer.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Demande envoyée !
          </h2>
          <p className="text-gray-600 mb-4">
            Votre demande d'inscription a été soumise avec succès.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Votre compte sera examiné par le Ministère du Tourisme. Vous recevrez un email
            une fois votre compte approuvé.
          </p>
          <p className="text-sm text-gray-400">
            Redirection vers la page de connexion...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Inscription Partenaire
          </h1>
          <p className="text-gray-600 mt-2">
            Créez votre compte pour gérer vos établissements touristiques
          </p>
          <p className="text-sm text-yellow-600 mt-2">
            ⚠️ Votre compte devra être approuvé par le Ministère du Tourisme
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow">
          <div className="space-y-6">
            {/* Informations personnelles */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Informations personnelles
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    {...register('firstName')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    {...register('lastName')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  {...register('email')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Mot de passe <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    {...register('password')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirmer le mot de passe <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    {...register('confirmPassword')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Informations entreprise */}
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Informations entreprise
              </h2>

              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                  Nom de l'entreprise <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="businessName"
                  {...register('businessName')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                {errors.businessName && (
                  <p className="mt-1 text-sm text-red-600">{errors.businessName.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    {...register('phone')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                    Site web
                  </label>
                  <input
                    type="url"
                    id="website"
                    {...register('website')}
                    placeholder="https://example.com"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                  {errors.website && (
                    <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Adresse
                </label>
                <input
                  type="text"
                  id="address"
                  {...register('address')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                )}
              </div>

              <div className="mt-4">
                <label htmlFor="businessDescription" className="block text-sm font-medium text-gray-700">
                  Description de l'entreprise
                </label>
                <textarea
                  id="businessDescription"
                  rows={4}
                  {...register('businessDescription')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="Décrivez votre entreprise et vos activités touristiques..."
                />
                {errors.businessDescription && (
                  <p className="mt-1 text-sm text-red-600">{errors.businessDescription.message}</p>
                )}
              </div>
            </div>

            {/* Boutons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.push('/partner/login')}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Retour à la connexion
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Inscription...' : 'S\'inscrire'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
