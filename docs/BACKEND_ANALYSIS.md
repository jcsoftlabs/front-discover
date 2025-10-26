# Analyse Backend - Listing Backend

## 📊 Vue d'ensemble

Ce document résume l'analyse complète du backend `listing-backend` et les adaptations effectuées dans le frontend.

---

## 🏗️ Architecture Backend

### Stack Technique
- **Framework**: Express 5.1.0
- **Base de données**: MySQL (XAMPP) avec Prisma ORM
- **Authentification**: JWT (access + refresh tokens)
- **Upload**: Multer pour les fichiers images
- **Sécurité**: Helmet, rate limiting, CORS

### Structure des dossiers
```
listing-backend/
├── prisma/
│   └── schema.prisma          # Schéma de base de données
├── src/
│   ├── config/
│   │   └── database.js        # Configuration DB
│   ├── controllers/           # Logique métier
│   ├── middleware/            # Auth, validation, upload
│   ├── models/                # Modèles (legacy)
│   ├── routes/                # Définition des routes
│   └── services/              # Services (email, etc.)
├── public/uploads/            # Fichiers uploadés
└── server.js                  # Point d'entrée
```

---

## 📦 Modèles de données (Prisma Schema)

### User
```prisma
- id: String (cuid)
- firstName: String
- lastName: String
- email: String (unique)
- password: String?
- country: String?
- role: UserRole (USER, ADMIN, PARTNER)
- refreshToken: String?
- resetToken: String?
- resetTokenExpires: DateTime?
- googleId: String? (unique)
- provider: String? (default: "local")
- profilePicture: String?
- timestamps
```

**Relations**: reviews, favorites, validatedPartners, moderatedReviews, createdSites, notifications

### Partner
```prisma
- id: String (cuid)
- name: String
- email: String (unique)
- password: String?
- refreshToken: String?
- phone: String?
- description: String?
- website: String?
- address: String?
- status: PartnerStatus (PENDING, APPROVED, REJECTED, SUSPENDED)
- validatedBy: String?
- validatedAt: DateTime?
- timestamps
```

**Relations**: establishments, validator (User)

### Establishment
```prisma
- id: String (cuid)
- name: String
- description: String?
- type: EstablishmentType
- price: Decimal
- images: Json? (array)
- address: String?
- ville: String?
- departement: String?
- phone: String?
- email: String?
- website: String?
- latitude: Decimal?
- longitude: Decimal?
- amenities: Json? (array)
- menu: Json?
- availability: Json?
- isActive: Boolean
- partnerId: String?
- timestamps
```

**Relations**: partner, reviews, promotions, favorites

### Site
```prisma
- id: String (cuid)
- name: String
- description: String?
- address: String (required)
- ville: String?
- departement: String?
- latitude: Decimal (required)
- longitude: Decimal (required)
- images: Json? (array)
- category: SiteCategory
- openingHours: Json?
- entryFee: Decimal?
- website: String?
- phone: String?
- isActive: Boolean
- createdBy: String?
- timestamps
```

**Relations**: creator (User), favorites

### Review
```prisma
- id: String (cuid)
- rating: Int (1-5)
- comment: String?
- status: ReviewStatus (PENDING, APPROVED, REJECTED)
- moderatedBy: String?
- moderatedAt: DateTime?
- moderationNote: String?
- userId: String
- establishmentId: String
- timestamps
```

**Relations**: user, establishment, moderator (User)

### Promotion
```prisma
- id: String (cuid)
- title: String
- description: String?
- discount: Decimal (percentage)
- validFrom: DateTime
- validUntil: DateTime
- isActive: Boolean
- establishmentId: String
- timestamps
```

**Relations**: establishment

### Favorite
```prisma
- id: String (cuid)
- userId: String
- establishmentId: String? (XOR with siteId)
- siteId: String? (XOR with establishmentId)
- timestamps
```

**Relations**: user, establishment, site

### Notification
```prisma
- id: String (cuid)
- userId: String
- type: NotificationType (REVIEW_INVITATION, PROMOTION, SYSTEM, OTHER)
- title: String
- message: String
- establishmentId: String?
- isRead: Boolean
- readAt: DateTime?
- timestamps
```

**Relations**: user

---

## 🔐 Endpoints disponibles

### Résumé par catégorie

| Catégorie | Base Path | Endpoints | Auth |
|-----------|-----------|-----------|------|
| Authentication | `/api/auth` | 12 | Mixte |
| Users | `/api/users` | 6 | ADMIN |
| Establishments | `/api/establishments` | 5 | Public + PARTNER/ADMIN |
| Sites | `/api/sites` | 7 | Public + ADMIN |
| Reviews | `/api/reviews` | 7 | Mixte |
| Promotions | `/api/promotions` | 9 | Public + PARTNER |
| Favorites | `/api/favorites` | 6 | Public |
| Notifications | `/api/notifications` | 7 | Authenticated |
| Partner Portal | `/api/partner` | 13 | PARTNER |
| Admin Portal | `/api/admin` | 15 | ADMIN |
| GDPR | `/api/gdpr` | 2 | Owner/ADMIN |

**Total: ~89 endpoints**

Voir `docs/API_ENDPOINTS.md` pour la liste complète.

---

## ✅ Changements effectués dans le frontend

### 1. Types TypeScript (`types/index.ts`)

✓ **User interface** - Ajout de :
- `country?: string`
- `googleId?: string`
- `provider?: string`
- `profilePicture?: string`
- `refreshToken?: string`
- `resetToken?: string`
- `resetTokenExpires?: string`

✓ **Partner interface** - Ajout de :
- `password?: string`
- `refreshToken?: string`

✓ **Establishment interface** - Ajout de :
- `ville?: string`
- `departement?: string`
- Relations: `partner?`, `reviews?[]`, `promotions?[]`
- Suppression de `openingHours` (n'existe pas dans le backend)

✓ **Site interface** - Modifications :
- `address: string` (required)
- `latitude: number` (required)
- `longitude: number` (required)
- `ville?: string`
- `departement?: string`
- `category` avec types stricts (MONUMENT, MUSEUM, etc.)
- Relation: `creator?: User`

✓ **Review interface** - Ajout de :
- `status: 'PENDING' | 'APPROVED' | 'REJECTED'`
- `moderatedBy?: string`
- `moderatedAt?: string`
- `moderationNote?: string`
- Relation: `moderator?: User`

✓ **Notification interface** - Nouvelle interface complète

### 2. Documentation créée

✓ `docs/API_ENDPOINTS.md` - Documentation exhaustive de tous les endpoints  
✓ `docs/MIGRATION_GUIDE.md` - Guide de migration avec exemples de code  
✓ `docs/BACKEND_ANALYSIS.md` - Ce document  

### 3. Constantes (`lib/constants.ts`)

✓ Nouveau fichier avec :
- `DEPARTMENTS` - Les 10 départements d'Haïti
- `CITIES_BY_DEPARTMENT` - Villes principales par département
- `ESTABLISHMENT_TYPES` - Types avec labels français
- `SITE_CATEGORIES` - Catégories avec labels français
- `PARTNER_STATUS` - Statuts avec couleurs
- `REVIEW_STATUS` - Statuts avec couleurs
- `NOTIFICATION_TYPES` - Types de notifications
- `USER_ROLES` - Rôles utilisateur
- `COMMON_AMENITIES` - Équipements courants
- Fonctions helper pour obtenir labels et couleurs

---

## 🚀 Prochaines étapes

### Phase 1: Authentification
1. Implémenter Google Sign-In
2. Ajouter champ pays au formulaire d'inscription
3. Tester le flow complet

### Phase 2: Établissements et Sites
1. Ajouter champs `ville` et `departement` aux formulaires
2. Mettre à jour les filtres de recherche
3. Utiliser les constantes pour les dropdowns

### Phase 3: Modération
1. Créer `app/admin/reviews/moderate/page.tsx`
2. Créer `components/admin/ReviewModerationCard.tsx`
3. Afficher le statut des avis partout

### Phase 4: Notifications
1. Créer `components/NotificationBell.tsx`
2. Intégrer dans les layouts
3. Créer `app/notifications/page.tsx`

### Phase 5: Favoris
1. Créer `components/FavoriteButton.tsx`
2. Intégrer dans les cartes d'établissements/sites
3. Créer `app/favorites/page.tsx`

### Phase 6: Migration des portails
1. Adapter tous les appels API Partner vers `/api/partner/*`
2. Adapter tous les appels API Admin vers `/api/admin/*`
3. Tester les permissions

---

## 🔍 Différences importantes identifiées

### 1. Authentification
- **Backend**: Supporte Google OAuth via `/api/auth/google`
- **Frontend**: À implémenter

### 2. Structure géographique
- **Backend**: Utilise `ville` + `departement` (champs séparés)
- **Frontend**: Besoin d'ajouter ces champs aux formulaires

### 3. Modération des avis
- **Backend**: Système complet de modération avec statuts
- **Frontend**: À implémenter dans le portail admin

### 4. Upload d'images
- **Backend**: Support multipart/form-data via Multer
- **Frontend**: Déjà en place via les formulaires

### 5. Portails dédiés
- **Backend**: Endpoints spécifiques `/api/partner/*` et `/api/admin/*`
- **Frontend**: Besoin de migrer les appels API

### 6. Notifications
- **Backend**: Système complet de notifications
- **Frontend**: À implémenter

### 7. Favoris
- **Backend**: Support establishments ET sites
- **Frontend**: À implémenter

---

## 📝 Notes techniques

### Authentification JWT
- Access token stocké dans `localStorage`
- Refresh token stocké en cookie HTTP-only
- Intercepteur Axios gère le refresh automatique
- Expiration access token: 15 minutes
- Expiration refresh token: 7 jours

### Upload de fichiers
- Formats acceptés: JPG, JPEG, PNG, GIF, WEBP
- Taille max: 10MB par fichier
- Nombre max: 10 fichiers par requête
- Stockage: `public/uploads/` (backend)
- URL d'accès: `http://localhost:3000/uploads/<filename>`

### Pagination
- Paramètres: `?page=1&limit=10`
- Défaut: page=1, limit=10
- Response: inclut `pagination` object

### Rate Limiting
- Routes standard: 100 requêtes / 15 minutes
- Routes auth: 5 requêtes / 15 minutes
- Protection contre force brute

### CORS
- Configuré pour accepter les requêtes depuis:
  - `http://localhost:3000` (backend)
  - `http://localhost:3001` (frontend - recommandé)
  - Configurable via `CORS_ORIGIN` env var

---

## 🆘 Ressources

### Documentation backend
- Schéma Prisma: `listing-backend/prisma/schema.prisma`
- Routes: `listing-backend/src/routes/*.js`
- Controllers: `listing-backend/src/controllers/*.js`
- Middleware: `listing-backend/src/middleware/*.js`

### Documentation frontend
- API Endpoints: `docs/API_ENDPOINTS.md`
- Migration Guide: `docs/MIGRATION_GUIDE.md`
- Types: `types/index.ts`
- Constantes: `lib/constants.ts`

### Commandes utiles

**Backend:**
```bash
cd listing-backend
npm run dev              # Démarrer en mode dev
npm run prisma:studio    # Interface Prisma Studio
npm run prisma:seed      # Seeder la base de données
```

**Frontend:**
```bash
cd touris-app-web
npm run dev -- -p 3001   # Démarrer sur port 3001
npm run build            # Build production
npm run lint             # Vérifier le code
```

---

## ✨ Conclusion

Le backend `listing-backend` est bien structuré avec :
- ✅ Architecture claire et modulaire
- ✅ Authentification robuste (JWT + OAuth)
- ✅ Système de modération des avis
- ✅ Gestion complète des établissements et sites
- ✅ Support des notifications
- ✅ Système de favoris
- ✅ Portails dédiés Partner et Admin
- ✅ Upload de fichiers
- ✅ Sécurité (Helmet, rate limiting, CORS)

Le frontend a été adapté avec :
- ✅ Types TypeScript à jour
- ✅ Documentation complète
- ✅ Constantes et helpers
- ⏳ Fonctionnalités à implémenter (voir checklist)

Le guide de migration `MIGRATION_GUIDE.md` fournit des exemples de code concrets pour implémenter toutes les fonctionnalités manquantes.
