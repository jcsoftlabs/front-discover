'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CSVImporter from '@/components/CSVImporter';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function SitesImportPage() {
  usePageTitle('Import CSV - Sites Touristiques');
  const router = useRouter();
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    // Load token from localStorage on mount
    const loadToken = () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
      }
    };
    loadToken();
  }, []);

  const handleImportComplete = (result: any) => {
    if (result.data.summary.success > 0) {
      setTimeout(() => {
        router.push('/admin/sites');
      }, 3000);
    }
  };

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Import CSV - Sites Touristiques</h1>
            <p className="mt-2 text-gray-600">Importez plusieurs sites touristiques à la fois</p>
          </div>
          <Link href="/admin/sites" className="text-blue-600 hover:text-blue-800">
            ← Retour
          </Link>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-semibold text-yellow-800">⚠️ Important - Encodage UTF-8 Requis</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p className="mb-2">Pour que les caractères français (é, è, à, ï, ç) s'affichent correctement:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Excel (Windows):</strong> Utilisez "Enregistrer sous" → "CSV UTF-8 (délimité par des virgules)"</li>
                <li><strong>Excel (Mac):</strong> Utilisez "Fichier" → "Enregistrer sous" → Format: "CSV UTF-8"</li>
                <li><strong>Google Sheets:</strong> Téléchargez en format CSV (UTF-8 par défaut) ✅</li>
                <li><strong>LibreOffice:</strong> Cochez "Modifier les paramètres du filtre" et sélectionnez "UTF-8"</li>
              </ul>
              <p className="mt-2 text-xs bg-yellow-100 p-2 rounded">
                💡 <strong>Test:</strong> Si vous voyez des caractères bizarres comme "Laferri├¿re" au lieu de "Laferrière",
                votre fichier n'est pas en UTF-8. Réenregistrez-le correctement.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">📋 Instructions</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Téléchargez le modèle CSV pour voir le format requis</li>
          <li>Remplissez votre fichier avec les données des sites</li>
          <li>Les champs obligatoires sont: <code className="bg-blue-100 px-1 rounded">name</code>, <code className="bg-blue-100 px-1 rounded">address</code>, <code className="bg-blue-100 px-1 rounded">latitude</code>, <code className="bg-blue-100 px-1 rounded">longitude</code></li>
          <li>Les coordonnées GPS doivent être valides (latitude: -90 à 90, longitude: -180 à 180)</li>
          <li>Pour les images multiples, séparez les URLs par le caractère <code className="bg-blue-100 px-1 rounded">|</code></li>
        </ul>
      </div>

      <CSVImporter
        type="sites"
        apiEndpoint={`${apiUrl}/sites/import-csv`}
        token={token}
        onImportComplete={handleImportComplete}
      />

      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Remarques importantes</h3>
        <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
          <li>L'import peut prendre du temps pour les gros fichiers</li>
          <li>Les entrées avec des erreurs seront ignorées</li>
          <li>Vous verrez un résumé détaillé à la fin de l'import</li>
          <li>Les coordonnées GPS sont essentielles pour la localisation</li>
          <li>Les sites créés seront automatiquement actifs</li>
        </ul>
      </div>
    </div>
  );
}
