# Page d'Accueil Publique - Discover Haiti

## 🎯 Vue d'ensemble

Page d'accueil publique moderne et interactive pour la découverte du tourisme en Haïti, inspirée des meilleurs sites comme Airbnb, Booking et TripAdvisor.

## ✨ Fonctionnalités Implémentées

### 1. **Navigation et Header**
- ✅ Navbar sticky avec effet backdrop blur
- ✅ Logo "Discover Haiti" avec drapeau haïtien
- ✅ Navigation desktop et mobile responsive
- ✅ Authentification intégrée (Login/Register)
- ✅ Accès rapide aux espaces Admin et Partner
- ✅ Bouton favoris pour utilisateurs connectés

### 2. **Système d'Authentification**
- ✅ Modal d'authentification moderne avec animations Framer Motion
- ✅ Deux modes : Login et Register
- ✅ Choix de type de compte : Utilisateur ou Partenaire
- ✅ Validation avec React Hook Form + Zod
- ✅ **Connexion Google OAuth** avec `@react-oauth/google`
- ✅ Gestion d'état avec Context API (AuthContext)
- ✅ Stockage sécurisé dans localStorage
- ✅ Refresh automatique du token

**Client ID Google (Web):**
```
955108400371-uik3onuhrlibvaik5l6j0a28t8ajg0sd.apps.googleusercontent.com
```

### 3. **Recherche Intelligente**
- ✅ Barre de recherche avec 3 filtres :
  - Recherche par nom/description
  - Recherche par lieu
  - Filtre par catégorie
- ✅ Recherche en temps réel
- ✅ Design moderne avec icônes Lucide
- ✅ Bouton de réinitialisation

### 4. **Affichage des Établissements**
- ✅ Cartes modernes style Airbnb
- ✅ Images avec fallback
- ✅ Badge de catégorie
- ✅ **Bouton favori** (visible seulement pour utilisateurs connectés)
- ✅ Système d'étoiles (RatingStars component)
- ✅ Nombre d'avis
- ✅ Prix avec devise
- ✅ Animations au hover

### 5. **Système de Favoris**
- ✅ Toggle interactif avec animation
- ✅ Demande de connexion si non authentifié
- ✅ Intégration avec l'API backend `/favorites`
- ✅ État persistant

### 6. **Design et UX**
- ✅ Thème coloré : gradient bleu/violet
- ✅ Animations fluides avec Framer Motion
- ✅ Responsive mobile et desktop
- ✅ Loading states avec skeleton
- ✅ Messages d'erreur clairs
- ✅ Footer informatif

## 🛠️ Technologies Utilisées

| Technologie | Version | Usage |
|-------------|---------|-------|
| **Next.js** | 16.0.0 | Framework React avec App Router |
| **React** | 19.2.0 | Bibliothèque UI |
| **TypeScript** | 5.x | Typage statique |
| **Tailwind CSS** | 4.x | Styling |
| **Framer Motion** | 12.23.24 | Animations |
| **React Hook Form** | 7.65.0 | Gestion de formulaires |
| **Zod** | 4.1.12 | Validation de schémas |
| **@react-oauth/google** | 0.12.2 | Authentification Google |
| **Lucide React** | 0.546.0 | Icônes modernes |
| **Axios** | 1.12.2 | Requêtes HTTP |

## 📁 Structure des Fichiers

```
touris-app-web/
├── app/
│   ├── page.tsx                    # Page d'accueil principale ✨
│   ├── layout.tsx                  # Layout avec AuthProvider + GoogleOAuthProvider
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── SearchBar.tsx           # Barre de recherche intelligente
│   │   ├── ListingCard.tsx         # Carte d'établissement
│   │   ├── RatingStars.tsx         # Système d'étoiles
│   │   └── FavoriteButton.tsx      # Bouton favori avec toggle
│   └── modals/
│       └── AuthModal.tsx           # Modal Login/Register avec Google OAuth
├── lib/
│   ├── AuthContext.tsx             # Context d'authentification
│   └── axios.ts                    # Client API configuré
├── types/
│   └── index.ts                    # Interfaces TypeScript
├── .env.local                      # Variables d'environnement
└── package.json
```

## 🔧 Configuration

### Variables d'environnement (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyAvB1VMKoP20-kxdiZRfgPZYI0d8y7Sosw
```

### Backend Requis

Le backend `listing-backend` doit être démarré sur `http://localhost:3000`.

**Endpoints utilisés:**
- `GET /api/establishments` - Liste des établissements ✅
- `POST /api/auth/login` - Connexion classique
- `POST /api/auth/register` - Inscription
- `POST /api/auth/google` - Connexion Google OAuth
- `GET /api/auth/me` - Profil utilisateur
- `POST /api/favorites` - Ajouter un favori
- `DELETE /api/favorites/user/:userId/establishment/:establishmentId` - Retirer un favori
- `GET /api/favorites/check` - Vérifier si un item est favori

## 🚀 Démarrage

### 1. Installation des dépendances
```bash
npm install
```

### 2. Démarrer le backend
```bash
cd ../listing-backend
npm run dev
```

### 3. Démarrer le frontend
```bash
npm run dev
```

Le site sera accessible sur **http://localhost:3001**

## 🎨 Design System

### Couleurs
- **Primary**: Gradient bleu (#2563eb) vers violet (#9333ea)
- **Success**: Vert (#16a34a) pour partenaires
- **Error**: Rouge (#dc2626)
- **Neutral**: Échelle de gris

### Composants

#### SearchBar
- 3 champs : nom, lieu, catégorie
- Bouton de recherche avec gradient
- Animations au focus

#### ListingCard
- Image principale avec hover scale
- Badge de catégorie
- Bouton favori en position absolue
- Étoiles + nombre d'avis
- Prix avec devise

#### RatingStars
- Affichage de 1 à 5 étoiles
- Support demi-étoiles
- Mode interactif optionnel
- 3 tailles : sm, md, lg

#### FavoriteButton
- Icône cœur avec animation
- Toggle rouge/blanc
- Gestion des états loading
- Demande de connexion si nécessaire

#### AuthModal
- Mode Login / Register
- Choix de rôle (User/Partner)
- Validation avec Zod
- Google OAuth button
- Switch mode fluide

## 🔐 Authentification

### Flux d'authentification classique

1. Utilisateur clique sur "Connexion" ou "Inscription"
2. Modal s'ouvre avec animations
3. Formulaire avec validation
4. Soumission à l'API
5. Stockage du token + user dans localStorage
6. Mise à jour du Context
7. Fermeture du modal

### Flux Google OAuth

1. Utilisateur clique sur "Sign in with Google"
2. Popup Google OAuth s'ouvre
3. Utilisateur se connecte avec Google
4. Google retourne un `idToken`
5. Frontend envoie `idToken` au backend `/api/auth/google`
6. Backend vérifie le token avec Google
7. Backend crée/récupère l'utilisateur
8. Backend retourne JWT + user
9. Frontend stocke et met à jour le Context

## 📱 Responsive Design

- **Mobile** (< 768px): Menu hamburger, cartes en colonne unique
- **Tablet** (768px - 1024px): 2 colonnes de cartes
- **Desktop** (> 1024px): 3 colonnes, navigation complète

## 🧪 Tests

Pour tester l'application :

```bash
# Linting
npm run lint

# Build production
npm run build
```

## 🔮 Améliorations Futures

### À implémenter :
- [ ] Google Maps avec marqueurs interactifs
- [ ] Page de détails d'établissement avec reviews
- [ ] Système de reviews complet (poster, modifier, supprimer)
- [ ] Page "Mes Favoris" pour utilisateurs connectés
- [ ] Filtres avancés (prix, note, amenities)
- [ ] Tri des résultats (pertinence, prix, note)
- [ ] Pagination ou scroll infini
- [ ] Images en carrousel sur les cartes
- [ ] Partage social
- [ ] Mode sombre

## 📞 Support

Pour toute question ou problème :
- Backend : Voir `/Users/christopherjerome/listing-backend/WARP.md`
- Frontend : Voir `/Users/christopherjerome/touris-app-web/WARP.md`

## 📝 Notes Importantes

⚠️ **Authentification Google**:
- Le Client ID Web est configuré dans `app/layout.tsx`
- Assurez-vous que le backend supporte l'endpoint `/api/auth/google`
- Les tokens Google expirent après 1 heure

⚠️ **API Backend**:
- Le frontend s'attend à ce que l'API retourne `{ success: true, data: ... }`
- Les images doivent être des URLs absolues ou relatives valides
- Les favoris nécessitent un utilisateur authentifié

⚠️ **Performance**:
- Les images utilisent Next.js Image avec lazy loading
- Les animations sont optimisées avec Framer Motion
- Le Context évite les re-renders inutiles

---

**Créé le:** 2025-10-23  
**Status:** ✅ Opérationnel  
**Version:** 1.0.0
