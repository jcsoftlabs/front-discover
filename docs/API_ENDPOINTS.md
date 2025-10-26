# API Endpoints - Listing Backend

Documentation complète des endpoints disponibles dans le backend `listing-backend`.

## Base URL
```
http://localhost:3000/api
```

---

## 🔐 Authentication (`/api/auth`)

### Public Routes

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/auth/register` | Inscription utilisateur | `{ firstName, lastName, email, password, country? }` |
| POST | `/auth/login` | Connexion utilisateur normal | `{ email, password }` |
| POST | `/auth/login/admin` | Connexion administrateur | `{ email, password }` |
| POST | `/auth/login/partner` | Connexion partenaire | `{ email, password }` |
| POST | `/auth/refresh` | Rafraîchir l'access token | `{ refreshToken }` |
| POST | `/auth/logout` | Déconnexion | - |
| POST | `/auth/request-reset` | Demande réinitialisation mot de passe | `{ email }` |
| POST | `/auth/reset-password` | Réinitialiser le mot de passe | `{ token, newPassword }` |
| POST | `/auth/google` | Authentification Google OAuth | `{ idToken }` |

### Protected Routes (require authentication)

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/auth/me` | Récupérer le profil utilisateur | - |
| PUT | `/auth/change-password` | Changer le mot de passe | `{ currentPassword, newPassword }` |
| POST | `/auth/unlink-google` | Dissocier compte Google | - |

---

## 👥 Users (`/api/users`)

| Method | Endpoint | Description | Auth | Body |
|--------|----------|-------------|------|------|
| GET | `/users` | Liste tous les utilisateurs | ADMIN | - |
| GET | `/users/role/:role` | Utilisateurs par rôle | ADMIN | - |
| GET | `/users/:id` | Détails d'un utilisateur | Owner/ADMIN | - |
| POST | `/users` | Créer un utilisateur | ADMIN | `{ firstName, lastName, email, password, role? }` |
| PUT | `/users/:id` | Mettre à jour un utilisateur | Owner/ADMIN | `{ firstName?, lastName?, email?, country? }` |
| DELETE | `/users/:id` | Supprimer un utilisateur | ADMIN | - |

---

## 🏢 Establishments (`/api/establishments`)

### Public Routes

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| GET | `/establishments` | Liste des établissements | `?page=1&limit=10&type=HOTEL&ville=Port-au-Prince&isActive=true` |
| GET | `/establishments/:id` | Détails d'un établissement | - |

### Protected Routes

| Method | Endpoint | Description | Auth | Body/FormData |
|--------|----------|-------------|------|---------------|
| POST | `/establishments` | Créer un établissement | PARTNER/ADMIN | FormData: `name, description, type, price, address, ville?, departement?, phone?, email?, website?, latitude?, longitude?, amenities, menu, availability, images[]` |
| PUT | `/establishments/:id` | Mettre à jour un établissement | PARTNER/ADMIN | FormData (same as POST) |
| DELETE | `/establishments/:id` | Supprimer un établissement | ADMIN | - |

**Types disponibles:** `HOTEL`, `RESTAURANT`, `BAR`, `CAFE`, `ATTRACTION`, `SHOP`, `SERVICE`

---

## 🗺️ Sites (`/api/sites`)

### Public Routes

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| GET | `/sites` | Liste des sites touristiques | `?page=1&limit=10&category=BEACH&ville=Cap-Haitien` |
| GET | `/sites/:id` | Détails d'un site | - |
| GET | `/sites/stats` | Statistiques des sites | - |
| GET | `/sites/nearby` | Sites proches d'une position | `?latitude=18.5944&longitude=-72.3074&radius=10` |

### Protected Routes

| Method | Endpoint | Description | Auth | Body/FormData |
|--------|----------|-------------|------|---------------|
| POST | `/sites` | Créer un site touristique | ADMIN | FormData: `name, description, address, ville?, departement?, latitude, longitude, category, openingHours?, entryFee?, website?, phone?, images[]` |
| PUT | `/sites/:id` | Mettre à jour un site | ADMIN | FormData (same as POST) |
| DELETE | `/sites/:id` | Supprimer un site | ADMIN | - |

**Catégories disponibles:** `MONUMENT`, `MUSEUM`, `PARK`, `BEACH`, `MOUNTAIN`, `CULTURAL`, `RELIGIOUS`, `NATURAL`, `HISTORICAL`, `ENTERTAINMENT`

---

## ⭐ Reviews (`/api/reviews`)

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reviews` | Liste tous les avis |
| GET | `/reviews/:id` | Détails d'un avis |
| GET | `/reviews/user/:userId` | Avis d'un utilisateur |
| GET | `/reviews/establishment/:establishmentId/stats` | Statistiques d'avis pour un établissement |

### Protected Routes

| Method | Endpoint | Description | Auth | Body |
|--------|----------|-------------|------|------|
| POST | `/reviews` | Créer un avis | USER | `{ rating, comment?, establishmentId }` |
| PUT | `/reviews/:id` | Mettre à jour un avis | Owner | `{ rating?, comment? }` |
| DELETE | `/reviews/:id` | Supprimer un avis | Owner/ADMIN | - |

**Status:** `PENDING`, `APPROVED`, `REJECTED`

---

## 🎁 Promotions (`/api/promotions`)

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/promotions` | Liste toutes les promotions |
| GET | `/promotions/:id` | Détails d'une promotion |
| GET | `/promotions/current` | Promotions actuellement valides |
| GET | `/promotions/expiring` | Promotions qui expirent bientôt |
| GET | `/promotions/stats` | Statistiques des promotions |

### Protected Routes (via Partner Portal)

| Method | Endpoint | Description | Auth | Body |
|--------|----------|-------------|------|------|
| POST | `/promotions` | Créer une promotion | PARTNER | `{ title, description?, discount, validFrom, validUntil, establishmentId }` |
| PUT | `/promotions/:id` | Mettre à jour une promotion | PARTNER | `{ title?, description?, discount?, validFrom?, validUntil?, isActive? }` |
| DELETE | `/promotions/:id` | Supprimer une promotion | PARTNER | - |

---

## ❤️ Favorites (`/api/favorites`)

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/favorites/user/:userId` | Favoris d'un utilisateur | - |
| GET | `/favorites/check` | Vérifier si un item est favori | Query: `userId, establishmentId?` or `siteId?` |
| POST | `/favorites` | Ajouter un favori | `{ userId, establishmentId? or siteId? }` |
| DELETE | `/favorites/:id` | Supprimer un favori par ID | - |
| DELETE | `/favorites/user/:userId/establishment/:establishmentId` | Supprimer favori establishment | - |
| DELETE | `/favorites/user/:userId/site/:siteId` | Supprimer favori site | - |

---

## 🔔 Notifications (`/api/notifications`)

**All routes require authentication**

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/notifications` | Notifications de l'utilisateur | - |
| GET | `/notifications/:id` | Détails d'une notification | - |
| GET | `/notifications/unread/count` | Nombre de notifications non lues | - |
| POST | `/notifications/review-invitation` | Inviter à laisser un avis | `{ userId, establishmentId, title, message }` |
| PATCH | `/notifications/:id/read` | Marquer comme lu | - |
| PATCH | `/notifications/mark-all-read` | Tout marquer comme lu | - |
| DELETE | `/notifications/:id` | Supprimer une notification | - |

**Types:** `REVIEW_INVITATION`, `PROMOTION`, `SYSTEM`, `OTHER`

---

## 👨‍💼 Partner Portal (`/api/partner`)

**All routes require PARTNER role authentication**

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/partner/dashboard` | Vue d'ensemble du partenaire |

### Establishments Management

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/partner/establishments` | Liste des établissements du partenaire | - |
| GET | `/partner/establishments/:establishmentId` | Détails d'un établissement | - |
| PUT | `/partner/establishments/:establishmentId` | Mettre à jour un établissement | `{ name?, description?, price?, ... }` |
| PUT | `/partner/establishments/:establishmentId/menu` | Mettre à jour le menu | `{ menu: {...} }` |
| PUT | `/partner/establishments/:establishmentId/availability` | Mettre à jour les disponibilités | `{ availability: {...} }` |
| PUT | `/partner/establishments/:establishmentId/images` | Mettre à jour les images | `{ images: [...] }` |

### Promotions Management

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/partner/establishments/:establishmentId/promotions` | Promotions d'un établissement | - |
| POST | `/partner/establishments/:establishmentId/promotions` | Créer une promotion | `{ title, description?, discount, validFrom, validUntil }` |
| PUT | `/partner/establishments/:establishmentId/promotions/:promotionId` | Mettre à jour une promotion | `{ title?, discount?, ... }` |
| DELETE | `/partner/establishments/:establishmentId/promotions/:promotionId` | Supprimer une promotion | - |

### Reviews

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/partner/reviews` | Tous les avis des établissements |
| GET | `/partner/establishments/:establishmentId/reviews` | Avis d'un établissement spécifique |

---

## 🛡️ Admin Portal (`/api/admin`)

**All routes require ADMIN role authentication**

### Dashboard & Statistics

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| GET | `/admin/dashboard` | Vue d'ensemble administrative | - |
| GET | `/admin/statistics` | Statistiques détaillées | `?period=30` |

### Users Management

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/admin/users` | Liste des utilisateurs | Query: `?page=1&limit=10&role=USER` |
| GET | `/admin/users/:userId` | Détails d'un utilisateur | - |
| POST | `/admin/users` | Créer un utilisateur | `{ firstName, lastName, email, password, role }` |
| PUT | `/admin/users/:userId/role` | Changer le rôle | `{ role: 'USER' | 'ADMIN' | 'PARTNER' }` |

### Partners Management

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/admin/partners` | Liste des partenaires | Query: `?status=PENDING&page=1` |
| GET | `/admin/partners/:partnerId` | Détails d'un partenaire | - |
| PUT | `/admin/partners/:partnerId/status` | Valider/Rejeter partenaire | `{ status: 'APPROVED' | 'REJECTED' | 'SUSPENDED' }` |

### Reviews Moderation

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/admin/reviews/moderate` | Avis en attente de modération | - |
| PUT | `/admin/reviews/:reviewId/moderate` | Modérer un avis | `{ status: 'APPROVED' | 'REJECTED', moderationNote? }` |

### Sites Management

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/admin/sites` | Liste des sites touristiques | - |
| POST | `/admin/sites` | Créer un site | `{ name, description, address, latitude, longitude, category, ... }` |
| PUT | `/admin/sites/:siteId` | Mettre à jour un site | `{ name?, description?, ... }` |
| DELETE | `/admin/sites/:siteId` | Supprimer un site | - |

---

## 📄 GDPR (`/api/gdpr`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/gdpr/data/:userId` | Exporter données utilisateur | Owner/ADMIN |
| DELETE | `/gdpr/delete/:userId` | Supprimer compte et données | Owner/ADMIN |

---

## 📝 Legacy Listings (`/api/listings`)

**Note:** Ces endpoints sont legacy. Utilisez `/api/establishments` à la place.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/listings` | Liste toutes les annonces |
| GET | `/listings/:id` | Détails d'une annonce |
| POST | `/listings` | Créer une annonce |
| PUT | `/listings/:id` | Mettre à jour une annonce |
| DELETE | `/listings/:id` | Supprimer une annonce |

---

## 🔄 Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## 🔐 Authentication

Le backend utilise JWT tokens avec refresh tokens stockés en cookies HTTP-only.

**Headers requis pour les routes protégées:**
```
Authorization: Bearer <access_token>
```

**Cookies automatiques:**
- `refreshToken` (HTTP-only, Secure, SameSite=Strict)

---

## 📁 File Upload

Les endpoints qui supportent l'upload de fichiers acceptent `multipart/form-data` avec le champ `images[]`.

**Fichiers supportés:** JPG, JPEG, PNG, GIF, WEBP  
**Taille max:** 10MB par fichier  
**Nombre max:** 10 fichiers par requête

**URL des images uploadées:**
```
http://localhost:3000/uploads/<filename>
```
