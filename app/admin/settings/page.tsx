'use client';

import Link from 'next/link';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function SettingsPage() {
  usePageTitle('Configuration Système');
  const establishmentTypes = [
    { value: 'HOTEL', label: 'Hôtel', description: 'Établissements d\'hébergement' },
    { value: 'RESTAURANT', label: 'Restaurant', description: 'Services de restauration' },
    { value: 'BAR', label: 'Bar', description: 'Bars et pubs' },
    { value: 'CAFE', label: 'Café', description: 'Cafés et salons de thé' },
    { value: 'ATTRACTION', label: 'Attraction', description: 'Sites touristiques et attractions' },
    { value: 'SHOP', label: 'Boutique', description: 'Commerces et boutiques' },
    { value: 'SERVICE', label: 'Service', description: 'Services touristiques' }
  ];

  const siteCategories = [
    { value: 'MONUMENT', label: 'Monument', description: 'Monuments historiques' },
    { value: 'MUSEUM', label: 'Musée', description: 'Musées et galeries' },
    { value: 'PARK', label: 'Parc', description: 'Parcs et espaces verts' },
    { value: 'BEACH', label: 'Plage', description: 'Plages et zones côtières' },
    { value: 'HERITAGE', label: 'Patrimoine', description: 'Sites patrimoniaux' },
    { value: 'NATURE', label: 'Nature', description: 'Sites naturels' },
    { value: 'RELIGIOUS', label: 'Religieux', description: 'Sites religieux' }
  ];

  const amenities = [
    { value: 'WIFI', label: 'WiFi gratuit', icon: '📶' },
    { value: 'PARKING', label: 'Parking', icon: '🅿️' },
    { value: 'POOL', label: 'Piscine', icon: '🏊' },
    { value: 'AC', label: 'Climatisation', icon: '❄️' },
    { value: 'RESTAURANT', label: 'Restaurant', icon: '🍽️' },
    { value: 'BAR', label: 'Bar', icon: '🍺' },
    { value: 'SPA', label: 'Spa', icon: '🧖' },
    { value: 'GYM', label: 'Salle de sport', icon: '💪' },
    { value: 'PETS', label: 'Animaux acceptés', icon: '🐕' },
    { value: 'ACCESSIBLE', label: 'Accessible PMR', icon: '♿' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuration système</h1>
          <p className="mt-2 text-gray-600">Gérer les types, catégories et paramètres</p>
        </div>
        <Link href="/admin" className="text-blue-600 hover:text-blue-800">← Retour</Link>
      </div>

      <div className="space-y-6">
        {/* Types d'établissements */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Types d'établissements</h2>
            <span className="text-sm text-gray-500">{establishmentTypes.length} types configurés</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {establishmentTypes.map((type) => (
              <div key={type.value} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{type.label}</h3>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">{type.value}</span>
                </div>
                <p className="text-sm text-gray-600">{type.description}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-500">
            ℹ️ Ces types sont définis dans le schéma de base de données et nécessitent une migration pour être modifiés.
          </p>
        </div>

        {/* Catégories de sites */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Catégories de sites touristiques</h2>
            <span className="text-sm text-gray-500">{siteCategories.length} catégories</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {siteCategories.map((category) => (
              <div key={category.value} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{category.label}</h3>
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">{category.value}</span>
                </div>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Services et équipements */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Services et équipements disponibles</h2>
            <span className="text-sm text-gray-500">{amenities.length} équipements</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {amenities.map((amenity) => (
              <div key={amenity.value} className="border border-gray-200 rounded-lg p-3 text-center">
                <div className="text-2xl mb-1">{amenity.icon}</div>
                <p className="text-xs font-medium text-gray-900">{amenity.label}</p>
                <p className="text-xs text-gray-500 mt-1">{amenity.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Statuts */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Statuts disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Statuts des partenaires</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">PENDING</span>
                  <span className="text-sm text-gray-600">En attente de validation</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">APPROVED</span>
                  <span className="text-sm text-gray-600">Approuvé et actif</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">REJECTED</span>
                  <span className="text-sm text-gray-600">Rejeté</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">SUSPENDED</span>
                  <span className="text-sm text-gray-600">Suspendu temporairement</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Statuts des avis</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">PENDING</span>
                  <span className="text-sm text-gray-600">En attente de modération</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">APPROVED</span>
                  <span className="text-sm text-gray-600">Approuvé et publié</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">REJECTED</span>
                  <span className="text-sm text-gray-600">Rejeté (non publié)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rôles utilisateurs */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Rôles utilisateurs</h2>
          <div className="space-y-3">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">USER</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Utilisateur</span>
              </div>
              <p className="text-sm text-gray-600">
                Utilisateurs standard - Peuvent consulter les établissements, laisser des avis et créer un compte.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">PARTNER</h3>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Partenaire</span>
              </div>
              <p className="text-sm text-gray-600">
                Partenaires commerciaux - Peuvent gérer leurs établissements, promotions et consulter leurs statistiques.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">ADMIN</h3>
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Administrateur</span>
              </div>
              <p className="text-sm text-gray-600">
                Administrateurs du Ministère - Accès complet pour gérer utilisateurs, valider partenaires, modérer contenus et configurer le système.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
