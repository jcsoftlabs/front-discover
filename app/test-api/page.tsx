'use client';

import { useApiQuery } from '@/lib/hooks/useApiQuery';
import { ApiStateWrapper } from '@/lib/components/ApiStates';
import {
  establishmentsService,
  sitesService,
  promotionsService,
  reviewsService,
} from '@/lib/services';

/**
 * Page de test pour vérifier l'intégration avec le backend
 */
export default function TestApiPage() {
  // Test des établissements
  const establishments = useApiQuery(() =>
    establishmentsService.getAll({ page: 1, limit: 5 })
  );

  // Test des sites
  const sites = useApiQuery(() => sitesService.getAll({ page: 1, limit: 5 }));

  // Test des promotions
  const promotions = useApiQuery(() => promotionsService.getActive());

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Test de l'intégration API</h1>

      {/* Test Établissements */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Établissements</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <ApiStateWrapper
            data={establishments.data}
            loading={establishments.loading}
            error={establishments.error}
            isEmpty={establishments.isEmpty}
            onRetry={establishments.refetch}
            emptyState={{
              title: 'Aucun établissement',
              message: 'Aucun établissement trouvé dans la base de données.',
            }}
          >
            {data => (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Total: {data.pagination?.total || 0} établissements
                </p>
                <div className="grid gap-4">
                  {data.data?.map((est: any) => (
                    <div
                      key={est.id}
                      className="border border-gray-200 rounded p-4"
                    >
                      <h3 className="font-semibold">{est.name}</h3>
                      <p className="text-sm text-gray-600">Type: {est.type}</p>
                      {est.ville && (
                        <p className="text-sm text-gray-600">
                          Ville: {est.ville}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ApiStateWrapper>
        </div>
      </section>

      {/* Test Sites */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Sites touristiques</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <ApiStateWrapper
            data={sites.data}
            loading={sites.loading}
            error={sites.error}
            isEmpty={sites.isEmpty}
            onRetry={sites.refetch}
            emptyState={{
              title: 'Aucun site',
              message: 'Aucun site touristique trouvé dans la base de données.',
            }}
          >
            {data => (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Total: {data.pagination?.total || 0} sites
                </p>
                <div className="grid gap-4">
                  {data.data?.map((site: any) => (
                    <div
                      key={site.id}
                      className="border border-gray-200 rounded p-4"
                    >
                      <h3 className="font-semibold">{site.name}</h3>
                      <p className="text-sm text-gray-600">
                        Catégorie: {site.category}
                      </p>
                      {site.ville && (
                        <p className="text-sm text-gray-600">
                          Ville: {site.ville}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ApiStateWrapper>
        </div>
      </section>

      {/* Test Promotions */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Promotions actives</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <ApiStateWrapper
            data={promotions.data}
            loading={promotions.loading}
            error={promotions.error}
            isEmpty={promotions.isEmpty}
            onRetry={promotions.refetch}
            emptyState={{
              title: 'Aucune promotion',
              message: 'Aucune promotion active pour le moment.',
            }}
          >
            {data => (
              <div className="grid gap-4">
                {data.data?.map((promo: any) => (
                  <div
                    key={promo.id}
                    className="border border-green-200 bg-green-50 rounded p-4"
                  >
                    <h3 className="font-semibold text-green-900">
                      {promo.title}
                    </h3>
                    <p className="text-sm text-green-700">
                      Réduction: {promo.discount}%
                    </p>
                    <p className="text-xs text-green-600 mt-2">
                      Valide jusqu'au:{' '}
                      {new Date(promo.validUntil).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </ApiStateWrapper>
        </div>
      </section>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
        <p className="text-sm text-blue-800">
          💡 Cette page teste la connexion au backend de production et
          l'utilisation du cache local.
        </p>
      </div>
    </div>
  );
}
