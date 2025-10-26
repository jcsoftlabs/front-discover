# Système d'Authentification - Frontend

## Vue d'ensemble

Le système d'authentification de Touris App Web utilise des JWT (JSON Web Tokens) pour sécuriser l'accès aux portails administrateur et partenaire. Il s'intègre avec l'API `listing-backend`.

## Architecture

### Composants principaux

1. **Service d'authentification** (`lib/auth.ts`)
   - Gestion des tokens (access et refresh)
   - Stockage sécurisé dans localStorage
   - Fonctions de login/logout pour admin et partenaires

2. **Client API** (`lib/axios.ts`)
   - Injection automatique des tokens
   - Rafraîchissement automatique des tokens expirés
   - Gestion des erreurs 401/403

3. **Middleware Next.js** (`middleware.ts`)
   - Protection des routes côté serveur
   - Redirection automatique vers les pages de login
   - Vérification des tokens via cookies

4. **Hook personnalisé** (`hooks/useAuth.ts`)
   - Vérification de l'authentification côté client
   - Gestion de l'état utilisateur
   - Fonction de déconnexion

## Flux d'authentification

### Connexion administrateur

```
1. Utilisateur soumet email/mot de passe sur /admin/login
2. POST /api/auth/login/admin vers le backend
3. Backend valide les credentials et vérifie role === 'ADMIN'
4. Backend retourne accessToken + refreshToken + données utilisateur
5. Frontend stocke les tokens dans localStorage
6. Redirection vers /admin/dashboard
```

### Connexion partenaire

```
1. Utilisateur soumet email/mot de passe sur /partner/login
2. POST /api/auth/login/partner vers le backend
3. Backend valide les credentials et vérifie status === 'APPROVED'
4. Backend retourne accessToken + refreshToken + données partenaire
5. Frontend stocke les tokens dans localStorage
6. Si status !== 'APPROVED', redirection vers /partner/pending
7. Sinon, redirection vers /partner/dashboard
```

### Rafraîchissement du token

```
1. Requête API échoue avec 401
2. Intercepteur Axios détecte l'erreur
3. POST /api/auth/refresh avec refreshToken
4. Backend retourne nouveau accessToken
5. Mise à jour du localStorage
6. Ré-exécution de la requête originale
```

### Déconnexion

```
1. Utilisateur clique sur "Déconnexion"
2. POST /api/auth/logout vers le backend
3. Backend invalide le refreshToken dans la DB
4. Frontend supprime tous les tokens du localStorage
5. Redirection vers /admin/login ou /partner/login
```

## Sécurité

### Stockage des tokens

- **Access Token** : localStorage (`accessToken`)
- **Refresh Token** : localStorage (`refreshToken`)
- **User Type** : localStorage (`userType`)
- **User Data** : localStorage (`userData`)

> ⚠️ **Note**: En production, considérer l'utilisation de cookies httpOnly pour les tokens si possible.

### Durée de vie des tokens

- **Access Token** : 15 minutes
- **Refresh Token** : 7 jours

### Protection des routes

#### Côté serveur (Middleware)
- Vérifie la présence des cookies `accessToken` et `userType`
- Redirige vers login si tokens manquants
- Vérifie que le userType correspond au portail

#### Côté client (useAuth hook)
- Vérifie les tokens dans localStorage
- Valide le rôle de l'utilisateur
- Redirige si authentification invalide

## Points d'entrée

### Pages de connexion

- **Admin** : `/admin/login`
- **Partenaire** : `/partner/login`

### Routes protégées

- **Admin** : `/admin/*` (sauf `/admin/login`)
- **Partenaire** : `/partner/*` (sauf `/partner/login`, `/partner/register`, `/partner/pending`)

## Gestion des erreurs

### Erreur 401 (Non autorisé)
- Token expiré ou invalide
- Tentative de refresh automatique
- Redirection vers login si échec

### Erreur 403 (Accès refusé)
- Partenaire non validé : redirection vers `/partner/pending`
- Rôle insuffisant : message d'erreur

### Erreur de connexion
- Credentials invalides : message d'erreur sur la page de login
- Backend indisponible : message d'erreur générique

## Utilisation dans les composants

### Protection d'une page

```typescript
'use client';

import { useAuth } from '@/hooks/useAuth';

export default function AdminPage() {
  const { user, loading, logout } = useAuth('ADMIN');

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h1>Bienvenue, {user?.firstName}</h1>
      <button onClick={logout}>Déconnexion</button>
    </div>
  );
}
```

### Appel API authentifié

```typescript
import apiClient from '@/lib/axios';

// Le token est automatiquement ajouté à chaque requête
const response = await apiClient.get('/admin/dashboard');
```

### Vérification du rôle

```typescript
import { hasRole } from '@/lib/auth';

if (hasRole('admin')) {
  // Afficher contenu admin
}
```

## Compatibilité avec le backend

### Endpoints utilisés

- `POST /api/auth/login/admin` - Connexion admin
- `POST /api/auth/login/partner` - Connexion partenaire
- `POST /api/auth/refresh` - Rafraîchissement token
- `POST /api/auth/logout` - Déconnexion

### Structure de réponse attendue

```typescript
interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user?: User;
    partner?: Partner;
    accessToken: string;
    refreshToken: string;
  };
}
```

## Tests

Pour tester l'authentification :

1. **Admin** : Utiliser un compte avec `role: 'ADMIN'` dans la DB
2. **Partenaire** : Utiliser un compte avec `status: 'APPROVED'` dans la table `Partner`

## Prochaines améliorations

- [ ] Implémenter cookies httpOnly pour plus de sécurité
- [ ] Ajouter page de réinitialisation de mot de passe
- [ ] Implémenter 2FA pour les administrateurs
- [ ] Ajouter logs d'audit pour les connexions
- [ ] Implémenter refresh token rotation
