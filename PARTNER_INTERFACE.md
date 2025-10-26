# Interface Partenaire - Documentation

L'interface partenaire complète a été créée pour permettre aux établissements touristiques de gérer leur présence sur la plateforme Touris App.

## 🎯 Fonctionnalités Implémentées

### 1. Authentification (`/partner/login`)
- **Formulaire de connexion** avec validation Zod
- Vérification du rôle utilisateur (seuls les comptes partenaires peuvent se connecter)
- Gestion JWT avec stockage localStorage
- Redirection automatique vers le tableau de bord après connexion
- Message d'erreur clair en cas d'échec

### 2. Tableau de Bord (`/partner/dashboard`)
- **Statistiques en temps réel** :
  - Total des établissements
  - Établissements actifs
  - Total des vues
  - Note moyenne
- **Actions rapides** : Liens vers profil, promotions, avis
- **Avis récents** : Affichage des derniers avis avec possibilité de répondre directement

### 3. Profil Établissement (`/partner/profile`)
- **Formulaire complet** avec React Hook Form + Zod :
  - Informations de base (nom, type, email, téléphone)
  - Adresse complète (adresse, ville, pays)
  - Description détaillée
  - Upload de photos multiples avec prévisualisation
- **Types d'établissement** : Hôtel, Restaurant, Attraction, Opérateur de tours
- Validation côté client avec messages d'erreur clairs
- Upload d'images avec gestion multipart/form-data

### 4. Disponibilités/Horaires (`/partner/availability`)
- **Pour restaurants, attractions, opérateurs** :
  - Gestion des horaires hebdomadaires (7 jours)
  - Toggle ouvert/fermé par jour
  - Édition des heures d'ouverture/fermeture
  - Format HH:MM avec validation
- **Pour hôtels** :
  - Interface prévue pour gestion des disponibilités chambres
  - Calendrier interactif (à venir)
- **Fermetures exceptionnelles** : Section prévue pour jours fériés/vacances

### 5. Gestion des Promotions (`/partner/promotions`)
- **CRUD complet** :
  - Création de promotions avec titre, description, réduction (%)
  - Sélection de dates de début/fin
  - Association optionnelle à un établissement spécifique
  - Modification des promotions existantes
  - Suppression avec confirmation
- **États de promotion** :
  - Active (vert)
  - Inactive (jaune)
  - Expirée (gris)
- **Toggle activation/désactivation** rapide
- Liste visuelle avec badges de statut

### 6. Gestion des Avis (`/partner/reviews`)
- **Affichage des avis** :
  - Système d'étoiles (1-5)
  - Nom du client et date
  - Commentaire complet
- **Statistiques** :
  - Total des avis
  - Note moyenne avec étoiles visuelles
  - Nombre d'avis sans réponse
- **Réponses aux avis** :
  - Formulaire de réponse intégré
  - Modification de réponses existantes
  - Suppression de réponses
  - Affichage date de publication de la réponse
- **Filtres** :
  - Par note (1-5 étoiles)
  - Avis sans réponse uniquement
- **Highlight automatique** : Via URL query param `?reviewId=xxx`

## 🏗️ Architecture Technique

### Types TypeScript (`types/index.ts`)
Nouveaux types ajoutés :
```typescript
- Review : Avis clients avec réponses
- Promotion : Offres promotionnelles
- Availability : Disponibilités (hôtels)
- Schedule : Horaires d'ouverture
- PartnerStats : Statistiques du tableau de bord
```

### Validation Zod
Chaque formulaire utilise des schémas Zod stricts :
- `loginSchema` : Email + mot de passe (min 6 caractères)
- `profileSchema` : Tous les champs du profil
- `scheduleSchema` : Horaires au format HH:MM
- `promotionSchema` : Dates, réduction 1-100%
- `responseSchema` : Réponse min 10 caractères

### API Client (`lib/axios.ts`)
- Intercepteur JWT automatique
- Gestion 401 avec redirection
- Support multipart/form-data pour upload photos

### Middleware (`middleware.ts`)
- Protection des routes `/partner/*` (sauf `/partner/login`)
- Prêt pour vérification JWT en production
- Configuration matcher Next.js

### Layout Partenaire
- Navigation dynamique avec état actif
- Fonction de déconnexion intégrée
- Responsive avec thème vert (green-600)
- Liens vers toutes les sections

## 🎨 Design & UX

### Thème
- **Couleur principale** : Vert (green-600) pour différencier de l'admin (bleu)
- **Cards** : `bg-white p-6 rounded-lg shadow`
- **États visuels** : Loading, erreur, succès
- Feedback utilisateur : Messages temporaires (3 secondes)

### Responsive
- Grid adaptatif (1 colonne mobile, 2-4 desktop)
- Navigation collapse sur mobile (hidden md:flex)
- Formulaires optimisés touch

### Accessibilité
- Labels explicites sur tous les inputs
- Messages d'erreur clairs et contextuels
- Confirmations pour actions destructives
- Focus states visibles

## 🔌 Intégration Backend

### Endpoints Attendus
```
POST   /api/auth/login
GET    /api/partner/profile
PUT    /api/partner/profile
GET    /api/partner/listing
GET    /api/partner/stats
GET    /api/partner/schedules
PUT    /api/partner/schedules
PATCH  /api/partner/schedules/:dayOfWeek
GET    /api/partner/promotions
POST   /api/partner/promotions
PUT    /api/partner/promotions/:id
PATCH  /api/partner/promotions/:id
DELETE /api/partner/promotions/:id
GET    /api/partner/reviews
POST   /api/partner/reviews/:id/respond
DELETE /api/partner/reviews/:id/respond
GET    /api/partner/listings
```

### Format Réponses
```typescript
ApiResponse<T> : { success: boolean, data: T, message?: string }
PaginatedResponse<T> : { success: boolean, data: T[], pagination: {...} }
```

## 🚀 Prochaines Étapes

### Fonctionnalités à Implémenter
1. **Calendrier de disponibilités** pour hôtels (react-calendar ou similaire)
2. **Fermetures exceptionnelles** avec sélection de dates
3. **Gestion des listings** (CRUD complet établissements)
4. **Statistiques avancées** (graphiques, exports)
5. **Notifications** en temps réel pour nouveaux avis
6. **Chat/Messagerie** avec clients

### Améliorations Techniques
1. **Middleware JWT** : Implémenter vérification token réelle
2. **React Query** : Cache et synchronisation données
3. **Optimistic Updates** : Meilleure UX sur mutations
4. **Image Optimization** : Next.js Image component
5. **Tests** : Unit tests (Jest) + E2E (Playwright)
6. **i18n** : Support multilingue (FR/EN/Créole)

### Backend API
Le backend **listing-backend** doit implémenter tous les endpoints listés ci-dessus pour que l'interface soit pleinement fonctionnelle.

## 📝 Notes Importantes

- **Validation partenaire** : L'administrateur doit valider le compte partenaire (`status: 'active'`) avant accès
- **JWT Token** : Stocké dans localStorage, à migrer vers cookies httpOnly pour plus de sécurité
- **Photos** : Format multipart/form-data, validation taille/format côté backend recommandée
- **Horaires** : Format 24h (HH:MM), validation regex côté client

## 🎓 Exemples d'Utilisation

### Tester l'Interface
1. Démarrer le serveur : `npm run dev -- -p 3001`
2. Naviguer vers : `http://localhost:3001/partner/login`
3. Se connecter avec un compte partenaire
4. Explorer toutes les sections via la navigation

### Connecter au Backend
1. S'assurer que `listing-backend` tourne sur port 3000
2. Vérifier `.env.local` : `NEXT_PUBLIC_API_URL=http://localhost:3000/api`
3. Les appels API se font automatiquement via `apiClient`

---

**Interface créée avec** : Next.js 16, React 19, TypeScript, Tailwind CSS, React Hook Form, Zod

**Status** : ✅ Toutes les sections demandées sont implémentées et prêtes pour intégration backend.

<citations>
<document>
    <document_type>RULE</document_type>
    <document_id>/Users/christopherjerome/touris-app-web/WARP.md</document_id>
</document>
</citations>
