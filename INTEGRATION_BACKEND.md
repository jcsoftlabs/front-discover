# Intégration Backend Production

## ✅ Connexion Établie

Le frontend est maintenant connecté au backend de production :
- **URL**: `https://discover-ht-production.up.railway.app`
- **Status**: ✅ En ligne et fonctionnel

## 🎯 Fonctionnalités Implémentées

### 1. Services API avec Cache
Tous les services sont disponibles dans `lib/services/`:

- **Établissements** (`establishments.ts`)
  - `getAll()` - Liste paginée
  - `getById(id)` - Détails d'un établissement
  - `search(query, filters)` - Recherche
  - `getByPartner(partnerId)` - Par partenaire
  - `create()`, `update()`, `delete()` - CRUD

- **Sites Touristiques** (`sites.ts`)
  - `getAll()` - Liste paginée
  - `getById(id)` - Détails d'un site
  - `search(query, filters)` - Recherche
  - `getByCategory(category)` - Par catégorie
  - `create()`, `update()`, `delete()` - CRUD

- **Promotions** (`promotions.ts`)
  - `getAll()` - Liste paginée
  - `getById(id)` - Détails d'une promotion
  - `getActive()` - Promotions actives
  - `getByEstablishment(id)` - Par établissement
  - `create()`, `update()`, `delete()` - CRUD

- **Avis** (`reviews.ts`)
  - `getAll()` - Liste paginée
  - `getById(id)` - Détails d'un avis
  - `getByEstablishment(id)` - Par établissement
  - `getPending()` - En attente de modération
  - `create()`, `moderate()`, `update()`, `delete()` - CRUD + Modération

### 2. Système de Cache Local
**Fichier**: `lib/cache.ts`

- Cache dans `localStorage` avec expiration (TTL)
- TTL par défaut: 5 minutes (établissements, sites, avis)
- TTL réduit: 3 minutes (promotions)
- Nettoyage automatique des entrées expirées
- Invalidation intelligente lors des modifications

**Utilisation**:
```typescript
import { LocalCache } from '@/lib/cache';

// Récupérer ou fetcher
const data = await LocalCache.getOrFetch(
  'key',
  async () => apiCall(),
  5 * 60 * 1000 // 5 minutes
);

// Invalider
LocalCache.remove('key');
LocalCache.clearExpired();
```

### 3. Hooks Personnalisés
**Fichier**: `lib/hooks/useApiQuery.ts`

#### `useApiQuery<T>`
Pour les requêtes GET:
```typescript
const { data, loading, error, isEmpty, refetch } = useApiQuery(
  () => establishmentsService.getAll(),
  {
    enabled: true, // Optionnel
    onSuccess: (data) => console.log(data),
    onError: (error) => console.error(error),
  }
);
```

#### `useApiMutation<TData, TVariables>`
Pour les mutations (POST, PUT, DELETE):
```typescript
const { mutate, loading, error, reset } = useApiMutation(
  (variables) => establishmentsService.create(variables)
);

// Utilisation
const { data, error } = await mutate(newData);
```

### 4. Composants UI
**Fichier**: `lib/components/ApiStates.tsx`

- `<Loading />` - Spinner de chargement
- `<ErrorMessage />` - Affichage d'erreurs avec bouton retry
- `<EmptyState />` - État vide personnalisable
- `<ApiStateWrapper />` - Wrapper intelligent qui gère tous les états

**Exemple**:
```typescript
<ApiStateWrapper
  data={data}
  loading={loading}
  error={error}
  isEmpty={isEmpty}
  onRetry={refetch}
>
  {data => <YourComponent data={data} />}
</ApiStateWrapper>
```

## 🧪 Tests de l'API

### Endpoint Testés ✅

1. **Établissements**: `/api/establishments`
   - ✅ Retourne 5 établissements (Hotels, Restaurants, Bars, Cafés, Shops)
   - ✅ Pagination fonctionnelle
   - ✅ Données complètes (images, prix, localisation)

2. **Sites**: `/api/sites`
   - ✅ Retourne les sites touristiques (Jardin du Luxembourg, Arc de Triomphe)
   - ✅ Catégories: PARK, MONUMENT
   - ✅ Données complètes (coordonnées GPS, horaires, tarifs)

3. **Avis**: `/api/reviews`
   - ✅ Retourne les avis avec informations utilisateur
   - ✅ Statuts: PENDING, APPROVED
   - ✅ Relations établissements fonctionnelles

4. **Promotions**: `/api/promotions/active`
   - ⚠️ Endpoint disponible mais aucune promotion active actuellement

### Page de Test
Visitez `/test-api` pour voir une démonstration complète de:
- Récupération des données
- Gestion du loading
- Gestion des erreurs réseau
- Affichage des états vides
- Cache local en action

## 📊 Gestion des Erreurs

Le système gère automatiquement:

1. **Erreurs Réseau**
   - Message: "Erreur réseau. Vérifiez votre connexion internet."
   - Détection: Pas de réponse du serveur

2. **Erreurs Serveur**
   - Message: Message du backend ou code d'erreur HTTP
   - Détection: Réponse avec code d'erreur (4xx, 5xx)

3. **Réponses Vides**
   - Détection automatique des arrays vides
   - Affichage d'un état vide personnalisé

4. **Timeout et Retry**
   - Bouton "Réessayer" sur les erreurs
   - Fonction `refetch()` disponible

## 🚀 Utilisation dans les Pages

**Exemple complet**:
```typescript
'use client';

import { useApiQuery } from '@/lib/hooks/useApiQuery';
import { ApiStateWrapper } from '@/lib/components/ApiStates';
import { establishmentsService } from '@/lib/services';

export default function EstablishmentsPage() {
  const { data, loading, error, isEmpty, refetch } = useApiQuery(
    () => establishmentsService.getAll({ page: 1, limit: 10 })
  );

  return (
    <div>
      <h1>Établissements</h1>
      <ApiStateWrapper
        data={data}
        loading={loading}
        error={error}
        isEmpty={isEmpty}
        onRetry={refetch}
      >
        {response => (
          <div>
            {response.data.map(est => (
              <div key={est.id}>{est.name}</div>
            ))}
          </div>
        )}
      </ApiStateWrapper>
    </div>
  );
}
```

## 🔧 Configuration

### Variables d'Environnement
Fichier `.env.local`:
```
NEXT_PUBLIC_API_URL=https://discover-ht-production.up.railway.app/api
```

### Client Axios
Configuré dans `lib/axios.ts`:
- Injection automatique du JWT
- Gestion des 401 (logout automatique)
- Base URL depuis les variables d'environnement

## 📦 Publication GitHub

Le code est maintenant disponible sur:
```
https://github.com/jcsoftlabs/front-discover.git
```

**Commit**: "Intégration backend production avec cache et gestion d'erreurs"

**Inclut**:
- Services API complets
- Système de cache
- Hooks personnalisés
- Composants UI
- Page de test
- Documentation

## 📈 Performances

**Optimisations**:
- ✅ Cache local pour réduire les requêtes
- ✅ TTL configuré pour chaque type de données
- ✅ Invalidation intelligente du cache
- ✅ Nettoyage automatique des anciennes entrées
- ✅ Support des connexions lentes

**TTL Recommandés**:
- Établissements et Sites: 5 minutes
- Promotions: 3 minutes (changent plus souvent)
- Avis: 5 minutes

## 🔐 Sécurité

- ✅ Pas de secrets exposés dans le code
- ✅ JWT géré via localStorage (client-side)
- ✅ Intercepteurs Axios pour l'authentification
- ✅ Validation des données via TypeScript

## 📝 Prochaines Étapes

Pour continuer le développement:

1. **Pages Admin**: Utiliser les services dans les pages admin
2. **Pages Partner**: Intégrer dans les pages partenaires
3. **Upload d'Images**: Implémenter l'upload de fichiers
4. **Authentification**: Connecter les pages login/register
5. **Favoris**: Ajouter la gestion des favoris
6. **Notifications**: Implémenter les notifications en temps réel

## 🆘 Support

En cas de problème:
1. Vérifier la connexion internet
2. Vérifier que le backend est en ligne: `https://discover-ht-production.up.railway.app`
3. Consulter la page `/test-api` pour diagnostiquer
4. Vérifier les logs de la console navigateur
5. Tester les endpoints directement avec curl

---

✨ **L'intégration est complète et fonctionnelle !**
