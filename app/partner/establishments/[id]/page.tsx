'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import apiClient from '@/lib/axios';
import type { ApiResponse, Establishment } from '@/types';
import { getFirstImage, decodeHtmlEntities } from '@/lib/utils';
import { ArrowLeft, Edit2, MapPin, Phone, Mail, Globe, Calendar } from 'lucide-react';

export default function EstablishmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const establishmentId = params.id as string;
  
  const [establishment, setEstablishment] = useState<Establishment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isToggling, setIsToggling] = useState(false);

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
        setEstablishment(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors du chargement de l\'établissement');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async () => {
    if (!establishment) return;

    setIsToggling(true);
    try {
      const response = await apiClient.put(
        `/establishments/${establishmentId}`,
        { isActive: !establishment.isActive }
      );

      if (response.data.success) {
        setEstablishment({ ...establishment, isActive: !establishment.isActive });
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la mise à jour');
    } finally {
      setIsToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Chargement...</div>
      </div>
    );
  }

  if (error && !establishment) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!establishment) {
    return <div>Établissement non trouvé</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <button
            onClick={() => router.push('/partner/establishments')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la liste
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{establishment.name}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className={`px-3 py-1 text-sm rounded-full ${
              establishment.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {establishment.isActive ? 'Actif' : 'Inactif'}
            </span>
            <span className="text-sm text-gray-600">{establishment.type}</span>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleToggleActive}
            disabled={isToggling}
            className={`px-4 py-2 rounded-md text-white transition disabled:opacity-50 ${
              establishment.isActive
                ? 'bg-gray-600 hover:bg-gray-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isToggling ? 'Chargement...' : establishment.isActive ? 'Désactiver' : 'Activer'}
          </button>
          <button
            onClick={() => router.push(`/partner/establishments/${establishmentId}/edit`)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Edit2 className="w-4 h-4" />
            Modifier
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Galerie d'images */}
      {establishment.images && establishment.images.length > 0 && (
        <div className="mb-6 bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            {establishment.images.map((image, index) => (
              <img
                key={index}
                src={typeof image === 'string' ? image : image}
                alt={`${establishment.name} - Image ${index + 1}`}
                className="w-full h-64 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          {establishment.description && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {decodeHtmlEntities(establishment.description)}
              </p>
            </div>
          )}

          {/* Menu */}
          {establishment.menu && Object.keys(establishment.menu).length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Menu</h2>
              <div className="space-y-2">
                {Object.entries(establishment.menu).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-medium text-gray-700">{key}</span>
                    <span className="text-gray-600">{value as string}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Disponibilités */}
          {establishment.availability && Object.keys(establishment.availability).length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Horaires
              </h2>
              <div className="space-y-2">
                {Object.entries(establishment.availability).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-medium text-gray-700 capitalize">{key}</span>
                    <span className="text-gray-600">{value as string}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Commodités */}
          {establishment.amenities && establishment.amenities.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Commodités</h2>
              <div className="flex flex-wrap gap-2">
                {establishment.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Prix */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tarifs</h2>
            <div className="text-3xl font-bold text-green-600">
              {establishment.price} HTG
            </div>
          </div>

          {/* Coordonnées */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact</h2>
            <div className="space-y-3">
              {establishment.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">{establishment.address}</span>
                </div>
              )}
              {establishment.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <a href={`tel:${establishment.phone}`} className="text-blue-600 hover:underline text-sm">
                    {establishment.phone}
                  </a>
                </div>
              )}
              {establishment.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <a href={`mailto:${establishment.email}`} className="text-blue-600 hover:underline text-sm">
                    {establishment.email}
                  </a>
                </div>
              )}
              {establishment.website && (
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <a 
                    href={establishment.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Site web
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Localisation */}
          {establishment.latitude && establishment.longitude && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Localisation</h2>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Latitude: {establishment.latitude}</p>
                <p>Longitude: {establishment.longitude}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
