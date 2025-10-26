'use client';

export default function PartnerAvailabilityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Disponibilités & Horaires</h1>
        <p className="text-gray-600 mt-2">Gérez les disponibilités et horaires de vos établissements</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Fonctionnalité en cours de développement</h3>
            <p className="text-blue-800 mb-4">
              La gestion des disponibilités et horaires est actuellement en cours d&apos;intégration avec le backend.
              Cette fonctionnalité sera bientôt disponible.
            </p>
            <div className="space-y-2 text-sm text-blue-700">
              <p><strong>Fonctionnalités prévues :</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Gestion des horaires d&apos;ouverture hebdomadaires</li>
                <li>Configuration des disponibilités pour les hôtels</li>
                <li>Tarifs variables selon les périodes</li>
                <li>Fermetures exceptionnelles</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Modification temporaire</h2>
        <p className="text-gray-600 mb-4">
          En attendant la mise en place de cette interface, vous pouvez modifier directement les disponibilités 
          de vos établissements en contactant l&apos;administrateur ou en utilisant le champ JSON <code className="bg-gray-100 px-2 py-1 rounded">availability</code> 
          lors de la modification de votre établissement.
        </p>
      </div>
    </div>
  );
}
