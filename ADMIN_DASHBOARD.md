# Dashboard Administrateur - Touris Haiti

## Vue d'ensemble

Le tableau de bord administrateur est un système complet de gestion pour le Ministère du Tourisme d'Haïti. Il permet de gérer l'ensemble de la plateforme touristique via une interface web moderne et intuitive.

## Fonctionnalités implémentées

### 1. Dashboard principal (`/admin`)
- **Statistiques en temps réel** sur tous les modules
- **Cartes de métriques** : utilisateurs, partenaires, établissements, sites, avis, promotions
- **Indicateurs d'alertes** : partenaires et avis en attente de traitement
- **Activité récente** : derniers partenaires inscrits et avis à modérer
- **Navigation rapide** vers tous les modules de gestion

### 2. Gestion des utilisateurs (`/admin/users`)
- Liste paginée de tous les utilisateurs (20 par page)
- **Recherche** par nom ou email
- **Filtrage** par rôle (USER, PARTNER, ADMIN)
- **Modification des rôles** en direct via dropdown
- Affichage du nombre d'avis par utilisateur
- Lien vers les détails de chaque utilisateur

### 3. Gestion des partenaires (`/admin/partners`)
- Liste paginée avec filtres de statut
- **Validation en un clic** : Approuver / Rejeter / Suspendre
- Affichage du nombre d'établissements par partenaire
- Recherche par nom ou email
- Filtres : PENDING, APPROVED, REJECTED, SUSPENDED

### 4. Gestion des établissements (`/admin/establishments`)
- Vue en grille avec images
- **Filtrage par type** (Hôtel, Restaurant, Bar, etc.)
- **Recherche** par nom
- **Édition** et **suppression** en un clic
- Indicateur d'état actif/inactif
- Affichage de l'adresse et description

### 5. Gestion des sites touristiques (`/admin/sites`)
- Vue en grille similaire aux établissements
- Ajout, édition et suppression de sites
- Catégorisation des sites (Monument, Musée, Parc, etc.)
- Gestion des images et informations

### 6. Modération des avis (`/admin/reviews`)
- **File de modération** avec filtres de statut
- Visualisation complète : utilisateur, note, commentaire, établissement
- **Approbation/Rejet** avec notes de modération
- Système d'étoiles pour les notes
- Affichage de l'historique de modération

### 7. Gestion des promotions (`/admin/promotions`)
- Liste de toutes les promotions actives et inactives
- Affichage des dates de validité et réductions
- Vue d'ensemble des offres promotionnelles

### 8. Gestion des administrateurs (`/admin/administrators`)
- **Création de nouveaux comptes administrateurs**
- Formulaire de création avec validation
- Liste de tous les administrateurs existants
- Sécurité : mot de passe minimum 8 caractères

### 9. Statistiques détaillées (`/admin/statistics`)
- **Période sélectionnable** (7, 30, 90, 365 jours)
- Nouvelles inscriptions par catégorie
- **Distribution des types d'établissements** avec graphiques
- **Distribution des catégories de sites** avec barres de progression
- **Distribution des notes d'avis** visuelles

### 10. Configuration système (`/admin/settings`)
- Vue d'ensemble des **types d'établissements** configurés
- **Catégories de sites touristiques** disponibles
- **Services et équipements** (WiFi, Parking, Piscine, etc.)
- Documentation des **statuts** (partenaires, avis)
- Description des **rôles utilisateurs**

## Architecture technique

### Routes API utilisées

Toutes les routes sont préfixées par `/api/admin/` et nécessitent une authentification JWT avec rôle ADMIN.

```
GET  /api/admin/dashboard              # Statistiques globales
GET  /api/admin/statistics             # Statistiques détaillées
GET  /api/admin/users                  # Liste utilisateurs
PUT  /api/admin/users/:id/role         # Modifier rôle
POST /api/admin/users                  # Créer utilisateur/admin
GET  /api/admin/partners               # Liste partenaires
PUT  /api/admin/partners/:id/status    # Valider/Rejeter partenaire
GET  /api/admin/reviews/moderate       # Avis à modérer
PUT  /api/admin/reviews/:id/moderate   # Modérer avis
GET  /api/admin/sites                  # Liste sites
POST /api/admin/sites                  # Créer site
PUT  /api/admin/sites/:id              # Éditer site
DELETE /api/admin/sites/:id            # Supprimer site
GET  /api/establishments               # Liste établissements
DELETE /api/establishments/:id         # Supprimer établissement
GET  /api/promotions                   # Liste promotions
```

### Structure des fichiers

```
app/admin/
├── page.tsx                    # Dashboard principal
├── users/
│   └── page.tsx               # Gestion utilisateurs
├── partners/
│   └── page.tsx               # Gestion partenaires
├── establishments/
│   └── page.tsx               # Gestion établissements
├── sites/
│   └── page.tsx               # Gestion sites touristiques
├── reviews/
│   └── page.tsx               # Modération avis
├── promotions/
│   └── page.tsx               # Gestion promotions
├── administrators/
│   └── page.tsx               # Gestion admins
├── statistics/
│   └── page.tsx               # Statistiques détaillées
└── settings/
    └── page.tsx               # Configuration système
```

### Types TypeScript

Les types sont définis dans `types/index.ts`:

- `User` - Utilisateurs avec rôles
- `Partner` - Partenaires commerciaux
- `Establishment` - Établissements touristiques
- `Site` - Sites touristiques
- `Review` - Avis avec modération
- `Promotion` - Offres promotionnelles
- `AdminStats` - Statistiques dashboard
- `AdminDashboard` - Données dashboard complet
- `Statistics` - Statistiques détaillées

## Fonctionnalités de sécurité

1. **Authentification JWT** : Toutes les routes sont protégées
2. **Vérification du rôle ADMIN** : Middleware backend
3. **Gestion des tokens** : Intercepteur Axios automatique
4. **Redirection sur 401** : Logout automatique
5. **Validation des données** : Côté client et serveur

## Interface utilisateur

### Design System

- **Couleur principale** : Bleu (blue-600) pour admin
- **Palette secondaire** : Vert, Violet, Orange, Jaune, Rose
- **États visuels** :
  - Pending: Jaune
  - Approved: Vert
  - Rejected: Rouge
  - Suspended: Gris

### Composants réutilisables

- **StatCard** : Cartes de statistiques avec icônes
- **ModuleCard** : Cartes de navigation vers modules
- **Tables** : Tableaux responsive avec hover
- **Badges** : Statuts colorés
- **Filtres** : Recherche et sélection
- **Pagination** : Navigation entre pages

## Utilisation

### Démarrage

1. S'assurer que le backend est lancé sur `http://localhost:3000`
2. Démarrer le frontend sur le port 3001:
   ```bash
   npm run dev -- -p 3001
   ```
3. Se connecter avec un compte ADMIN
4. Accéder au dashboard via `/admin`

### Compte de test

Selon le backend, le compte admin par défaut est:
- Email: `admin@tourism.gov`
- Password: `Test123!@#`

## Prochaines améliorations

### À implémenter

1. **Pages de détails** : 
   - `/admin/users/[id]` - Profil utilisateur détaillé
   - `/admin/partners/[id]` - Détails partenaire
   - `/admin/establishments/[id]` - Édition établissement

2. **Formulaires de création** :
   - `/admin/establishments/new` - Créer établissement
   - `/admin/sites/new` - Créer site

3. **Fonctionnalités avancées** :
   - Export de données (CSV, PDF)
   - Graphiques interactifs (Charts.js, Recharts)
   - Notifications en temps réel
   - Upload d'images avec preview
   - Système de recherche avancée
   - Filtres multiples combinés

4. **Performance** :
   - Mise en cache des données
   - Lazy loading des images
   - Optimisation des requêtes API
   - Server-side rendering pour SEO

5. **UX** :
   - Toasts pour les notifications
   - Modals de confirmation
   - Skeleton loaders
   - Messages d'erreur améliorés

## Structure de données

### Dashboard Response
```typescript
{
  stats: {
    totalUsers: number,
    totalPartners: number,
    totalEstablishments: number,
    totalSites: number,
    totalReviews: number,
    totalPromotions: number,
    pendingPartners: number,
    pendingReviews: number,
    activeEstablishments: number,
    activeSites: number
  },
  recentActivity: {
    recentPartners: Partner[],
    recentPendingReviews: Review[]
  }
}
```

### Statistics Response
```typescript
{
  period: number,
  newUsers: number,
  newPartners: number,
  newEstablishments: number,
  newReviews: number,
  distributions: {
    establishmentTypes: { type: string, _count: { type: number } }[],
    siteCategories: { category: string, _count: { category: number } }[],
    reviewRatings: { rating: number, _count: { rating: number } }[]
  }
}
```

## Support

Pour toute question ou problème:
1. Vérifier que le backend est bien lancé
2. Vérifier les logs du navigateur (Console)
3. Vérifier les logs du serveur backend
4. S'assurer d'être authentifié avec un compte ADMIN

## Licence

Propriété du Ministère du Tourisme d'Haïti - Usage interne uniquement.
