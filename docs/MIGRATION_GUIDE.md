# Migration Guide - Frontend Adaptation

Ce document détaille les changements nécessaires pour adapter le frontend aux modifications du backend `listing-backend`.

## 📋 Vue d'ensemble des changements

### Changements majeurs identifiés

1. **Nouveaux champs dans les modèles**
   - `User`: Ajout de `country`, `googleId`, `provider`, `profilePicture`
   - `Establishment`: Ajout de `ville`, `departement` (remplace l'ancien champ `openingHours`)
   - `Site`: Ajout de `ville`, `departement`, catégories typées strictement
   - `Review`: Ajout de système de modération (`status`, `moderatedBy`, `moderatedAt`, `moderationNote`)

2. **Nouveaux endpoints**
   - Authentication Google OAuth (`/api/auth/google`)
   - Gestion des notifications (`/api/notifications`)
   - Endpoints favoris (`/api/favorites`)
   - Portails Partner et Admin dédiés

3. **Architecture des portails**
   - `/api/partner/*` - Interface partenaire complète
   - `/api/admin/*` - Interface admin complète avec modération

---

## ✅ Changements déjà effectués

### 1. Types TypeScript mis à jour

✓ Fichier `types/index.ts` mis à jour avec :
- Tous les nouveaux champs des modèles backend
- Interface `Notification` ajoutée
- Types stricts pour les enums (`SiteCategory`, `ReviewStatus`, etc.)
- Relations optionnelles pour les données populées

### 2. Documentation créée

✓ `docs/API_ENDPOINTS.md` - Documentation complète des endpoints  
✓ `docs/MIGRATION_GUIDE.md` - Ce document

---

## 🔧 Changements à implémenter

### 1. Authentification

#### A. Ajouter Google Sign-In

**Fichiers à créer/modifier:**
- `app/login/page.tsx` - Ajouter bouton Google Sign-In
- `app/register/page.tsx` - Ajouter option Google Sign-In
- `lib/auth.ts` - Ajouter logique Google OAuth

**Exemple d'implémentation:**

```typescript
// lib/auth.ts
import apiClient from './axios';

export async function loginWithGoogle(idToken: string) {
  const response = await apiClient.post<ApiResponse<{
    user: User;
    accessToken: string;
    refreshToken: string;
  }>>('/auth/google', { idToken });
  
  // Stocker le token
  localStorage.setItem('accessToken', response.data.data.accessToken);
  
  return response.data.data.user;
}
```

**Composant Google Sign-In:**

```tsx
// components/GoogleSignIn.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginWithGoogle } from '@/lib/auth';

export function GoogleSignInButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      // Utiliser Google Identity Services
      const { GoogleAuth } = await import('@react-oauth/google');
      // Implementation...
    } catch (error) {
      console.error('Google sign-in error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
    >
      {/* Google Icon */}
      <span>Continuer avec Google</span>
    </button>
  );
}
```

#### B. Ajouter gestion du champ "Pays"

**Fichiers à modifier:**
- `app/register/page.tsx` - Ajouter dropdown pays
- `types/index.ts` - ✓ Déjà ajouté

**Exemple:**

```tsx
// components/CountrySelect.tsx
import { countries } from '@/lib/countries'; // À créer

export function CountrySelect({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
    >
      <option value="">Sélectionnez un pays</option>
      {countries.map((country) => (
        <option key={country.code} value={country.code}>
          {country.name}
        </option>
      ))}
    </select>
  );
}
```

---

### 2. Gestion des établissements

#### A. Ajouter champs `ville` et `departement`

**Fichiers à modifier:**
- `app/partner/establishments/new/page.tsx` - Formulaire création
- `app/partner/establishments/[id]/edit/page.tsx` - Formulaire édition
- `app/admin/establishments/page.tsx` - Vue liste

**Exemple formulaire:**

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <label className="block text-sm font-medium text-gray-700">
      Ville
    </label>
    <input
      type="text"
      {...register('ville')}
      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
      placeholder="Port-au-Prince"
    />
  </div>
  
  <div>
    <label className="block text-sm font-medium text-gray-700">
      Département
    </label>
    <select
      {...register('departement')}
      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
    >
      <option value="">Sélectionnez un département</option>
      <option value="Ouest">Ouest</option>
      <option value="Nord">Nord</option>
      <option value="Sud">Sud</option>
      <option value="Artibonite">Artibonite</option>
      <option value="Centre">Centre</option>
      <option value="Grand'Anse">Grand'Anse</option>
      <option value="Nippes">Nippes</option>
      <option value="Nord-Est">Nord-Est</option>
      <option value="Nord-Ouest">Nord-Ouest</option>
      <option value="Sud-Est">Sud-Est</option>
    </select>
  </div>
</div>
```

---

### 3. Système de modération des avis

#### A. Créer interface admin de modération

**Fichiers à créer:**
- `app/admin/reviews/moderate/page.tsx` - Page de modération
- `components/admin/ReviewModerationCard.tsx` - Carte d'avis à modérer

**Exemple:**

```tsx
// app/admin/reviews/moderate/page.tsx
'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';
import { Review, ApiResponse } from '@/types';

export default function ReviewModerationPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingReviews();
  }, []);

  const loadPendingReviews = async () => {
    try {
      const response = await apiClient.get<ApiResponse<Review[]>>(
        '/admin/reviews/moderate'
      );
      setReviews(response.data.data);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const moderateReview = async (
    reviewId: string,
    status: 'APPROVED' | 'REJECTED',
    moderationNote?: string
  ) => {
    try {
      await apiClient.put(`/admin/reviews/${reviewId}/moderate`, {
        status,
        moderationNote
      });
      
      // Retirer de la liste
      setReviews(reviews.filter(r => r.id !== reviewId));
    } catch (error) {
      console.error('Error moderating review:', error);
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Modération des avis</h1>
      
      {reviews.length === 0 ? (
        <p>Aucun avis en attente de modération</p>
      ) : (
        reviews.map(review => (
          <ReviewModerationCard
            key={review.id}
            review={review}
            onModerate={moderateReview}
          />
        ))
      )}
    </div>
  );
}
```

---

### 4. Système de notifications

#### A. Créer composant notifications

**Fichiers à créer:**
- `components/NotificationBell.tsx` - Icône avec badge
- `components/NotificationList.tsx` - Liste déroulante
- `app/notifications/page.tsx` - Page complète des notifications

**Exemple NotificationBell:**

```tsx
// components/NotificationBell.tsx
'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';
import { Notification, ApiResponse } from '@/types';

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    loadUnreadCount();
  }, []);

  const loadUnreadCount = async () => {
    try {
      const response = await apiClient.get<ApiResponse<{ count: number }>>(
        '/notifications/unread/count'
      );
      setUnreadCount(response.data.data.count);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const response = await apiClient.get<ApiResponse<Notification[]>>(
        '/notifications'
      );
      setNotifications(response.data.data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await apiClient.patch(`/notifications/${notificationId}/read`);
      setUnreadCount(Math.max(0, unreadCount - 1));
      loadNotifications();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          setShowDropdown(!showDropdown);
          if (!showDropdown) loadNotifications();
        }}
        className="relative p-2 rounded-full hover:bg-gray-100"
      >
        {/* Bell Icon */}
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold">Notifications</h3>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-gray-500 text-center">
                Aucune notification
              </p>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <h4 className="font-medium text-sm">{notification.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

### 5. Système de favoris

#### A. Créer composants favoris

**Fichiers à créer:**
- `components/FavoriteButton.tsx` - Bouton toggle favori
- `app/favorites/page.tsx` - Page des favoris utilisateur

**Exemple FavoriteButton:**

```tsx
// components/FavoriteButton.tsx
'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';

interface FavoriteButtonProps {
  userId: string;
  establishmentId?: string;
  siteId?: string;
}

export function FavoriteButton({ userId, establishmentId, siteId }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkFavorite();
  }, [userId, establishmentId, siteId]);

  const checkFavorite = async () => {
    try {
      const params = new URLSearchParams({ userId });
      if (establishmentId) params.append('establishmentId', establishmentId);
      if (siteId) params.append('siteId', siteId);

      const response = await apiClient.get(`/favorites/check?${params}`);
      setIsFavorite(response.data.data.isFavorite);
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const toggleFavorite = async () => {
    setLoading(true);
    try {
      if (isFavorite) {
        // Remove favorite
        const endpoint = establishmentId
          ? `/favorites/user/${userId}/establishment/${establishmentId}`
          : `/favorites/user/${userId}/site/${siteId}`;
        await apiClient.delete(endpoint);
        setIsFavorite(false);
      } else {
        // Add favorite
        await apiClient.post('/favorites', {
          userId,
          establishmentId,
          siteId
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`p-2 rounded-full transition-colors ${
        isFavorite
          ? 'text-red-500 hover:text-red-600'
          : 'text-gray-400 hover:text-red-500'
      }`}
      aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <svg
        className="w-6 h-6"
        fill={isFavorite ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}
```

---

### 6. Endpoints Partner Portal

Le backend a des endpoints dédiés pour les partenaires sous `/api/partner/*`. Adapter les appels API existants :

**Avant:**
```typescript
apiClient.get('/establishments'); // Tous les établissements
```

**Après:**
```typescript
// Pour le partenaire - ses établissements uniquement
apiClient.get('/partner/establishments');

// Dashboard du partenaire
apiClient.get('/partner/dashboard');
```

**Fichiers à modifier:**
- `app/partner/dashboard/page.tsx` - Utiliser `/partner/dashboard`
- `app/partner/establishments/page.tsx` - Utiliser `/partner/establishments`
- `app/partner/reviews/page.tsx` - Utiliser `/partner/reviews`

---

### 7. Endpoints Admin Portal

Adapter les appels API admin pour utiliser les endpoints dédiés :

**Fichiers à modifier:**
- `app/admin/dashboard/page.tsx` - Utiliser `/admin/dashboard`
- `app/admin/users/page.tsx` - Utiliser `/admin/users`
- `app/admin/partners/page.tsx` - Utiliser `/admin/partners`
- `app/admin/statistics/page.tsx` - Utiliser `/admin/statistics`

---

## 📦 Dépendances à ajouter

```bash
# Pour Google OAuth
npm install @react-oauth/google

# Pour la gestion des formulaires (si pas déjà installé)
npm install react-hook-form @hookform/resolvers zod

# Pour les notifications toast
npm install react-hot-toast
```

---

## 🔄 Checklist de migration

### Phase 1 - Authentification
- [ ] Implémenter Google Sign-In
- [ ] Ajouter champ pays au formulaire d'inscription
- [ ] Tester flow d'authentification complet

### Phase 2 - Établissements et Sites
- [ ] Ajouter champs `ville` et `departement` aux formulaires
- [ ] Mettre à jour les filtres de recherche
- [ ] Adapter les validations

### Phase 3 - Modération
- [ ] Créer page de modération des avis
- [ ] Afficher statut des avis partout
- [ ] Tester workflow de modération

### Phase 4 - Notifications
- [ ] Implémenter NotificationBell dans la navigation
- [ ] Créer page des notifications
- [ ] Tester réception et marquage comme lu

### Phase 5 - Favoris
- [ ] Ajouter boutons favoris sur les cartes
- [ ] Créer page "Mes favoris"
- [ ] Tester ajout/suppression

### Phase 6 - Portails Partner & Admin
- [ ] Migrer tous les appels API vers les endpoints dédiés
- [ ] Tester toutes les fonctionnalités des portails
- [ ] Vérifier les permissions

---

## 🧪 Tests recommandés

Après chaque phase de migration :

1. **Tests fonctionnels**
   - Parcourir chaque page modifiée
   - Tester tous les formulaires
   - Vérifier les appels API dans DevTools

2. **Tests d'authentification**
   - Connexion normale
   - Connexion Google
   - Gestion des tokens
   - Redirection après expiration

3. **Tests de permissions**
   - Accès portail admin (ADMIN seulement)
   - Accès portail partner (PARTNER seulement)
   - Modifications (ownership + rôles)

---

## 📝 Notes importantes

1. **Tokens JWT**: Le backend utilise des access tokens (localStorage) + refresh tokens (HTTP-only cookies). L'intercepteur Axios gère déjà le refresh automatique.

2. **Upload d'images**: Les endpoints qui acceptent des images utilisent `multipart/form-data`. Voir `middleware/upload.js` du backend.

3. **Pagination**: Tous les endpoints de liste supportent `?page=1&limit=10`.

4. **Filtres**: Les endpoints supportent divers filtres via query params. Voir `API_ENDPOINTS.md`.

5. **CORS**: Le backend est configuré pour accepter les requêtes depuis `localhost:3001`.

---

## 🆘 Aide supplémentaire

Pour plus d'informations :
- Voir `docs/API_ENDPOINTS.md` pour la documentation complète
- Voir `listing-backend/prisma/schema.prisma` pour les modèles de données
- Voir `listing-backend/src/routes/*.js` pour les routes disponibles
