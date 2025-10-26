# Migration des Endpoints API

Ce document liste tous les changements d'endpoints nécessaires pour utiliser les portails dédiés `/api/partner/*` et `/api/admin/*`.

## 🎯 Objectif

Le backend a des endpoints dédiés pour les portails Partner et Admin qui offrent:
- Meilleure organisation du code
- Permissions intégrées
- Données filtrées automatiquement par contexte
- Réponses optimisées pour chaque rôle

## 📋 Portail Admin - Endpoints à migrer

### Dashboard

**Avant:**
```typescript
// Construire manuellement les stats
const usersResponse = await apiClient.get('/users');
const partnersResponse = await apiClient.get('/partners');
// ... combiner les données
```

**Après:**
```typescript
// Dashboard complet en un seul appel
const response = await apiClient.get<ApiResponse<AdminDashboard>>('/admin/dashboard');
const { stats, recentActivity } = response.data.data;
```

**Fichier:** `app/admin/dashboard/page.tsx` ou `app/admin/page.tsx`

---

### Statistiques

**Avant:**
```typescript
// Pas d'endpoint dédié
```

**Après:**
```typescript
// Statistiques détaillées avec période
const response = await apiClient.get<ApiResponse<Statistics>>(
  '/admin/statistics?period=30'
);
```

**Fichier:** `app/admin/statistics/page.tsx`

---

### Gestion des utilisateurs

**Avant:**
```typescript
// GET tous les utilisateurs
const response = await apiClient.get('/users');

// GET utilisateur par ID
const response = await apiClient.get(`/users/${userId}`);

// PUT mettre à jour rôle
const response = await apiClient.put(`/users/${userId}`, { role: 'PARTNER' });
```

**Après:**
```typescript
// GET avec pagination et filtres
const response = await apiClient.get<ApiResponse<User[]>>(
  '/admin/users?page=1&limit=10&role=USER'
);

// GET détails utilisateur
const response = await apiClient.get<ApiResponse<User>>(
  `/admin/users/${userId}`
);

// POST créer utilisateur (admin uniquement)
const response = await apiClient.post('/admin/users', {
  firstName,
  lastName,
  email,
  password,
  role
});

// PUT mettre à jour rôle (endpoint dédié)
const response = await apiClient.put(`/admin/users/${userId}/role`, {
  role: 'PARTNER'
});
```

**Fichiers:**
- `app/admin/users/page.tsx`
- `app/admin/users/[id]/page.tsx`
- `app/admin/users/new/page.tsx`

---

### Gestion des partenaires

**Avant:**
```typescript
// Pas d'endpoint admin dédié pour partenaires
const response = await apiClient.get('/partners');
```

**Après:**
```typescript
// GET liste avec filtres
const response = await apiClient.get<ApiResponse<Partner[]>>(
  '/admin/partners?status=PENDING&page=1&limit=10'
);

// GET détails partenaire
const response = await apiClient.get<ApiResponse<Partner>>(
  `/admin/partners/${partnerId}`
);

// PUT valider/rejeter partenaire
const response = await apiClient.put(`/admin/partners/${partnerId}/status`, {
  status: 'APPROVED' // ou 'REJECTED', 'SUSPENDED'
});
```

**Fichiers:**
- `app/admin/partners/page.tsx`
- `app/admin/partners/[id]/page.tsx`

---

### Modération des avis

**Avant:**
```typescript
// GET tous les avis
const response = await apiClient.get('/reviews');
```

**Après:**
```typescript
// GET avis en attente de modération
const response = await apiClient.get<ApiResponse<Review[]>>(
  '/admin/reviews/moderate'
);

// PUT modérer un avis
const response = await apiClient.put(`/admin/reviews/${reviewId}/moderate`, {
  status: 'APPROVED', // ou 'REJECTED'
  moderationNote: 'Optionnel pour APPROVED, requis pour REJECTED'
});
```

**Fichiers:**
- `app/admin/reviews/moderate/page.tsx` ✓ Déjà créé
- `app/admin/reviews/page.tsx`

---

### Gestion des sites touristiques

**Avant:**
```typescript
// GET sites
const response = await apiClient.get('/sites');

// POST créer site
const formData = new FormData();
formData.append('name', name);
// ...
const response = await apiClient.post('/sites', formData);
```

**Après:**
```typescript
// GET sites (via admin)
const response = await apiClient.get<ApiResponse<Site[]>>(
  '/admin/sites'
);

// POST créer site (via admin)
const formData = new FormData();
formData.append('name', name);
formData.append('description', description);
formData.append('address', address);
formData.append('ville', ville);
formData.append('departement', departement);
formData.append('latitude', latitude.toString());
formData.append('longitude', longitude.toString());
formData.append('category', category);
// images
for (const image of images) {
  formData.append('images', image);
}

const response = await apiClient.post('/admin/sites', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// PUT mettre à jour site
const response = await apiClient.put(`/admin/sites/${siteId}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// DELETE supprimer site
const response = await apiClient.delete(`/admin/sites/${siteId}`);
```

**Fichiers:**
- `app/admin/sites/page.tsx`
- `app/admin/sites/[id]/page.tsx`
- `app/admin/sites/new/page.tsx`

---

## 📋 Portail Partner - Endpoints à migrer

### Dashboard

**Avant:**
```typescript
// Construire manuellement les stats du partenaire
const establishmentsResponse = await apiClient.get('/establishments');
const reviewsResponse = await apiClient.get('/reviews');
// ... filtrer et combiner
```

**Après:**
```typescript
// Dashboard complet en un seul appel
const response = await apiClient.get<ApiResponse<PartnerDashboard>>(
  '/partner/dashboard'
);
const { partner, stats, recentReviews } = response.data.data;

// Retourne:
// - Infos du partenaire
// - Stats (total établissements, actifs, avis, note moyenne, promotions)
// - Avis récents
```

**Fichier:** `app/partner/dashboard/page.tsx` ou `app/partner/page.tsx`

---

### Gestion des établissements

**Avant:**
```typescript
// GET tous les établissements (public)
const response = await apiClient.get('/establishments');
// Puis filtrer côté client par partnerId
```

**Après:**
```typescript
// GET établissements du partenaire connecté uniquement
const response = await apiClient.get<ApiResponse<Establishment[]>>(
  '/partner/establishments'
);

// GET détails d'un établissement
const response = await apiClient.get<ApiResponse<Establishment>>(
  `/partner/establishments/${establishmentId}`
);

// PUT mettre à jour établissement
const response = await apiClient.put(
  `/partner/establishments/${establishmentId}`,
  {
    name,
    description,
    price,
    ville,
    departement,
    // ... autres champs
  }
);

// PUT mettre à jour le menu
const response = await apiClient.put(
  `/partner/establishments/${establishmentId}/menu`,
  {
    menu: {
      starters: [...],
      mains: [...],
      desserts: [...],
      drinks: [...]
    }
  }
);

// PUT mettre à jour les disponibilités
const response = await apiClient.put(
  `/partner/establishments/${establishmentId}/availability`,
  {
    availability: {
      monday: { open: '08:00', close: '22:00' },
      tuesday: { open: '08:00', close: '22:00' },
      // ...
    }
  }
);

// PUT mettre à jour les images
const response = await apiClient.put(
  `/partner/establishments/${establishmentId}/images`,
  {
    images: ['url1', 'url2', 'url3']
  }
);
```

**Fichiers:**
- `app/partner/establishments/page.tsx`
- `app/partner/establishments/[id]/page.tsx`
- `app/partner/establishments/[id]/edit/page.tsx`
- `app/partner/establishments/new/page.tsx`

---

### Gestion des promotions

**Avant:**
```typescript
// GET promotions (global)
const response = await apiClient.get('/promotions');

// POST créer promotion
const response = await apiClient.post('/promotions', {
  title,
  description,
  discount,
  validFrom,
  validUntil,
  establishmentId
});
```

**Après:**
```typescript
// GET promotions d'un établissement
const response = await apiClient.get<ApiResponse<Promotion[]>>(
  `/partner/establishments/${establishmentId}/promotions`
);

// POST créer promotion
const response = await apiClient.post(
  `/partner/establishments/${establishmentId}/promotions`,
  {
    title,
    description,
    discount,
    validFrom,
    validUntil
    // establishmentId automatiquement ajouté par le backend
  }
);

// PUT mettre à jour promotion
const response = await apiClient.put(
  `/partner/establishments/${establishmentId}/promotions/${promotionId}`,
  {
    title,
    discount,
    validFrom,
    validUntil,
    isActive
  }
);

// DELETE supprimer promotion
const response = await apiClient.delete(
  `/partner/establishments/${establishmentId}/promotions/${promotionId}`
);
```

**Fichiers:**
- `app/partner/promotions/page.tsx`
- `app/partner/establishments/[id]/promotions/page.tsx`

---

### Gestion des avis

**Avant:**
```typescript
// GET tous les avis
const response = await apiClient.get('/reviews');
// Filtrer côté client
```

**Après:**
```typescript
// GET tous les avis des établissements du partenaire
const response = await apiClient.get<ApiResponse<Review[]>>(
  '/partner/reviews'
);

// GET avis d'un établissement spécifique
const response = await apiClient.get<ApiResponse<Review[]>>(
  `/partner/establishments/${establishmentId}/reviews`
);
```

**Fichiers:**
- `app/partner/reviews/page.tsx`
- `app/partner/establishments/[id]/reviews/page.tsx`

---

## 🔄 Endpoints qui restent inchangés

Ces endpoints sont publics ou déjà correctement structurés:

### Authentication (déjà OK)
- POST `/auth/register`
- POST `/auth/login`
- POST `/auth/login/admin`
- POST `/auth/login/partner`
- POST `/auth/google`
- GET `/auth/me`
- POST `/auth/logout`
- etc.

### Establishments publics (déjà OK)
- GET `/establishments` (liste publique)
- GET `/establishments/:id` (détails publics)

### Sites publics (déjà OK)
- GET `/sites` (liste publique)
- GET `/sites/:id` (détails publics)
- GET `/sites/nearby` (sites à proximité)

### Reviews publics (déjà OK)
- GET `/reviews` (liste publique)
- GET `/reviews/:id` (détails)
- GET `/reviews/establishment/:id/stats` (statistiques)
- POST `/reviews` (créer un avis - utilisateur normal)

### Promotions publiques (déjà OK)
- GET `/promotions` (liste)
- GET `/promotions/current` (promotions actives)
- GET `/promotions/expiring` (promotions qui expirent)

### Favoris (déjà OK)
- GET `/favorites/user/:userId`
- GET `/favorites/check`
- POST `/favorites`
- DELETE `/favorites/:id`

### Notifications (déjà OK)
- GET `/notifications`
- GET `/notifications/unread/count`
- PATCH `/notifications/:id/read`
- PATCH `/notifications/mark-all-read`
- DELETE `/notifications/:id`

---

## 📝 Checklist de migration

### Admin Portal

- [ ] `app/admin/dashboard/page.tsx` - Utiliser `/admin/dashboard`
- [ ] `app/admin/statistics/page.tsx` - Utiliser `/admin/statistics`
- [ ] `app/admin/users/page.tsx` - Utiliser `/admin/users`
- [ ] `app/admin/users/[id]/page.tsx` - Utiliser `/admin/users/:userId`
- [ ] `app/admin/users/new/page.tsx` - Utiliser `POST /admin/users`
- [ ] `app/admin/partners/page.tsx` - Utiliser `/admin/partners`
- [ ] `app/admin/partners/[id]/page.tsx` - Utiliser `/admin/partners/:partnerId`
- [x] `app/admin/reviews/moderate/page.tsx` - Utiliser `/admin/reviews/moderate` ✓
- [ ] `app/admin/reviews/page.tsx` - Afficher tous les avis avec statut
- [ ] `app/admin/sites/page.tsx` - Utiliser `/admin/sites`
- [ ] `app/admin/sites/[id]/page.tsx` - Utiliser `/admin/sites/:siteId`
- [ ] `app/admin/sites/new/page.tsx` - Utiliser `POST /admin/sites`

### Partner Portal

- [ ] `app/partner/dashboard/page.tsx` - Utiliser `/partner/dashboard`
- [ ] `app/partner/establishments/page.tsx` - Utiliser `/partner/establishments`
- [ ] `app/partner/establishments/[id]/page.tsx` - Utiliser `/partner/establishments/:id`
- [ ] `app/partner/establishments/[id]/edit/page.tsx` - Utiliser `PUT /partner/establishments/:id`
- [ ] `app/partner/promotions/page.tsx` - Utiliser `/partner/establishments/:id/promotions`
- [ ] `app/partner/reviews/page.tsx` - Utiliser `/partner/reviews`

---

## 💡 Bonnes pratiques

### 1. Types TypeScript

Toujours utiliser les types définis dans `types/index.ts`:

```typescript
import { AdminDashboard, PartnerDashboard, ApiResponse } from '@/types';
```

### 2. Gestion des erreurs

```typescript
try {
  const response = await apiClient.get('/admin/dashboard');
  if (response.data.success) {
    setData(response.data.data);
  }
} catch (error) {
  console.error('Error:', error);
  setError('Une erreur est survenue');
}
```

### 3. Loading states

```typescript
const [loading, setLoading] = useState(true);
const [data, setData] = useState<AdminDashboard | null>(null);

useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/dashboard');
      setData(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  loadData();
}, []);
```

### 4. Pagination

```typescript
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);

const response = await apiClient.get<PaginatedResponse<User>>(
  `/admin/users?page=${page}&limit=10`
);

if (response.data.success) {
  setUsers(response.data.data);
  setTotalPages(response.data.pagination.totalPages);
}
```

---

## 🚀 Avantages de la migration

1. **Performance**: Moins d'appels API, données optimisées
2. **Sécurité**: Permissions intégrées, pas de fuite de données
3. **Simplicité**: Code plus propre, moins de logique côté client
4. **Maintenance**: Plus facile à maintenir et tester
5. **Évolutivité**: Structure scalable pour futures fonctionnalités

---

## ⚠️ Points d'attention

1. **Authentication**: Tous les endpoints Partner/Admin nécessitent un token JWT valide
2. **Permissions**: Le backend vérifie automatiquement le rôle
3. **Pagination**: Penser à implémenter la pagination côté client
4. **FormData**: Pour les uploads d'images, utiliser `multipart/form-data`
5. **ville + departement**: Nouveaux champs à inclure dans les formulaires

---

## 📞 Besoin d'aide?

Voir:
- `docs/API_ENDPOINTS.md` - Documentation complète des endpoints
- `docs/MIGRATION_GUIDE.md` - Exemples de composants complets
- `types/index.ts` - Définitions TypeScript
- `lib/constants.ts` - Constantes et helpers
