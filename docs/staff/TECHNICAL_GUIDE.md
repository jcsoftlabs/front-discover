# 🔧 Guide Technique
## Système de Tourisme - Ministère du Tourisme d'Haïti

**Version:** 1.0  
**Date:** Janvier 2026

---

## 📋 Table des Matières

1. [Architecture Système](#1-architecture-système)
2. [Schéma de Base de Données](#2-schéma-de-base-de-données)
3. [Configuration Environnement](#3-configuration-environnement)
4. [API Endpoints](#4-api-endpoints)
5. [Intégrations Tierces](#5-intégrations-tierces)
6. [Sécurité](#6-sécurité)
7. [Déploiement](#7-déploiement)
8. [Maintenance](#8-maintenance)

---

## 1. Architecture Système

### Vue d'ensemble

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   touris-mobile │     │  front-discover │     │    Dashboard    │
│  (Flutter/Dart) │     │   (Next.js 16)  │     │   Admin/Partner │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │    listing-backend      │
                    │  (Node.js/Express 5)    │
                    │       Port 3000         │
                    └────────────┬────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
     ┌────────▼────────┐ ┌───────▼───────┐ ┌───────▼───────┐
     │  MySQL (Prisma) │ │   Cloudinary  │ │  SMTP Email   │
     │   Base données  │ │    Images     │ │   Nodemailer  │
     └─────────────────┘ └───────────────┘ └───────────────┘
```

### Technologies Utilisées

| Composant | Technologies |
|-----------|-------------|
| **Backend** | Node.js 18+, Express 5, Prisma 6, MySQL |
| **Frontend Web** | Next.js 16, React 19, TailwindCSS 4 |
| **Mobile** | Flutter 3.9+, Dart 3.9+, Riverpod |
| **Sécurité** | JWT, Helmet, bcrypt, Rate Limiting |
| **Storage** | Cloudinary (images) |
| **Email** | Nodemailer + Gmail SMTP |

---

## 2. Schéma de Base de Données

### Modèles Principaux (18 tables)

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│     User     │───▶│    Review    │◀───│ Establishment│
│   (users)    │    │  (reviews)   │    │(establishments)
└──────────────┘    └──────────────┘    └──────────────┘
       │                                       │
       │            ┌──────────────┐          │
       └───────────▶│   Favorite   │◀─────────┘
                    │  (favorites) │
                    └──────────────┘
                           ▲
       ┌───────────────────┼───────────────────┐
       │                   │                   │
┌──────▼──────┐    ┌───────▼──────┐    ┌───────▼──────┐
│    Site     │    │    Event     │    │   Partner    │
│   (sites)   │    │   (events)   │    │  (partners)  │
└─────────────┘    └──────────────┘    └──────────────┘
```

### Énumérations

```sql
-- Rôles utilisateur
UserRole: USER, ADMIN, PARTNER

-- Types d'établissement
EstablishmentType: HOTEL, RESTAURANT, BAR, CAFE, ATTRACTION, SHOP, SERVICE

-- Statuts partenaire
PartnerStatus: PENDING, APPROVED, REJECTED, SUSPENDED

-- Catégories de site
SiteCategory: MONUMENT, MUSEUM, PARK, BEACH, MOUNTAIN, CULTURAL, RELIGIOUS, NATURAL, HISTORICAL, ENTERTAINMENT

-- Catégories d'événement
EventCategory: CONCERT, FESTIVAL, CONFERENCE, SPORT, EXHIBITION, CULTURAL, RELIGIOUS, CARNIVAL, OTHER

-- Statuts d'avis
ReviewStatus: PENDING, APPROVED, REJECTED
```

### Module Télémétrie (6 tables)

| Table | Description |
|-------|-------------|
| `telemetry_sessions` | Sessions utilisateur |
| `telemetry_events` | Événements tracés |
| `telemetry_pageviews` | Pages visitées |
| `telemetry_devices` | Informations appareils |
| `telemetry_locations` | Géolocalisation |
| `telemetry_errors` | Erreurs et crashs |
| `api_metrics` | Métriques de performance API |

---

## 3. Configuration Environnement

### Backend (.env)

```bash
# Serveur
PORT=3000
NODE_ENV=production

# Base de données
DATABASE_URL="mysql://user:password@host:3306/listing_app"

# Sécurité JWT
JWT_SECRET=votre_clé_très_longue_et_sécurisée
JWT_EXPIRES_IN=24h

# Google OAuth
GOOGLE_CLIENT_ID_WEB=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_ID_IOS=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_ID_ANDROID=xxx.apps.googleusercontent.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

# Email SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=mot_de_passe_application

# Frontend URL
FRONTEND_URL=https://votre-domaine.com
```

### Frontend (.env.local)

```bash
NEXT_PUBLIC_API_URL=https://api.votre-domaine.com/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=votre_clé_google_maps
```

### Mobile (api_constants.dart)

```dart
static const String baseUrl = 'https://api.votre-domaine.com';
```

---

## 4. API Endpoints

### Authentification `/api/auth`

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/register` | Inscription |
| POST | `/login` | Connexion |
| POST | `/google` | OAuth Google |
| POST | `/refresh` | Rafraîchir token |
| POST | `/forgot-password` | Demande réinitialisation |
| POST | `/reset-password` | Réinitialiser mot de passe |

### Établissements `/api/establishments`

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/` | Liste tous les établissements |
| GET | `/:id` | Détails d'un établissement |
| POST | `/` | Créer (auth requise) |
| PUT | `/:id` | Modifier (auth requise) |
| DELETE | `/:id` | Supprimer (auth requise) |

### Sites `/api/sites`

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/` | Liste tous les sites |
| GET | `/:id` | Détails d'un site |
| POST | `/` | Créer (admin) |
| PUT | `/:id` | Modifier (admin) |
| DELETE | `/:id` | Supprimer (admin) |

### Événements `/api/events`

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/` | Liste tous les événements |
| GET | `/:id` | Détails d'un événement |
| POST | `/` | Créer (partenaire/admin) |
| PUT | `/:id` | Modifier (partenaire/admin) |

### Favoris `/api/favorites`

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/` | Mes favoris |
| POST | `/` | Ajouter favori |
| DELETE | `/:id` | Retirer favori |

### Autres routes

- `/api/reviews` - Gestion des avis
- `/api/partner` - Portail partenaire
- `/api/admin` - Administration
- `/api/users` - Gestion utilisateurs
- `/api/notifications` - Notifications
- `/api/promotions` - Promotions
- `/api/telemetry` - Télémétrie
- `/api/gdpr` - Conformité RGPD

---

## 5. Intégrations Tierces

### Google OAuth

**Console :** https://console.cloud.google.com

Configuration requise :
- Activer "Google Sign-In API"
- Créer des OAuth Client IDs pour Web, iOS, Android
- Ajouter les origines autorisées

### Cloudinary

**Console :** https://cloudinary.com/console

Utilisé pour :
- Stockage des images d'établissements
- Stockage des images d'événements et sites
- Transformations automatiques (redimensionnement)

### Google Maps

**Console :** https://console.cloud.google.com

APIs requises :
- Maps JavaScript API
- Geocoding API
- Places API

---

## 6. Sécurité

### Mesures Implémentées

| Mesure | Description |
|--------|-------------|
| **JWT** | Tokens d'authentification sécurisés |
| **bcrypt** | Hachage des mots de passe |
| **Helmet** | En-têtes HTTP de sécurité |
| **Rate Limiting** | 100 requêtes / 15 min par IP |
| **CORS** | Origines autorisées configurées |
| **HTTPS** | Chiffrement TLS en production |

### Rate Limiting

```javascript
// Limite générale
100 requêtes / 15 minutes

// Limite authentification
50 tentatives / 15 minutes
```

---

## 7. Déploiement

### Backend sur Railway

```bash
# Installation Railway CLI
npm install -g @railway/cli

# Connexion
railway login

# Déploiement
railway up
```

Variables à configurer dans Railway :
- `DATABASE_URL`
- `JWT_SECRET`
- `CLOUDINARY_*`
- `GOOGLE_CLIENT_ID_*`

### Frontend sur Vercel

```bash
# Installation Vercel CLI
npm install -g vercel

# Déploiement
vercel --prod
```

### Application Mobile

- **iOS :** Build via Xcode, distribution App Store Connect
- **Android :** Build Flutter, distribution Play Console

```bash
# Build Android
flutter build apk --release

# Build iOS
flutter build ios --release
```

---

## 8. Maintenance

### Commandes Utiles

```bash
# Backend - Régénérer Prisma Client
cd listing-backend
npx prisma generate

# Backend - Voir la base en interface
npx prisma studio

# Backend - Appliquer migrations
npx prisma db push

# Frontend - Build de production
npm run build

# Tests
npm test
```

### Logs

```bash
# Railway (production)
railway logs

# Local
npm run dev 2>&1 | tee server.log
```

### Monitoring

- Consulter `/api/telemetry` pour les métriques
- Dashboard admin pour les statistiques
- Railway/Vercel pour les logs déploiement

---

*Document généré le 8 janvier 2026*
