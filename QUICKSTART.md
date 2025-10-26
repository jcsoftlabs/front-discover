# 🚀 Guide de Démarrage Rapide - Discover Haiti

## Prérequis

- Node.js 18+ installé
- Backend `listing-backend` configuré et démarré sur `http://localhost:3000`
- Base de données avec des établissements

## 📦 Installation

```bash
# Cloner ou se positionner dans le projet
cd touris-app-web

# Installer les dépendances
npm install
```

## ⚙️ Configuration

Vérifiez que le fichier `.env.local` existe avec :

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyAvB1VMKoP20-kxdiZRfgPZYI0d8y7Sosw
```

## 🎯 Démarrage

### 1. Démarrer le Backend

Dans un terminal :

```bash
cd ../listing-backend
npm run dev
```

Le backend devrait démarrer sur `http://localhost:3000`

### 2. Vérifier que le Backend Fonctionne

```bash
curl http://localhost:3000/api/establishments
```

Vous devriez voir une réponse JSON avec `"success": true` et une liste d'établissements.

### 3. Démarrer le Frontend

Dans un nouveau terminal :

```bash
cd touris-app-web
npm run dev
```

Le frontend démarrera sur **http://localhost:3001**

## ✅ Vérifications

### Backend opérationnel
```bash
curl http://localhost:3000/api/establishments
# Devrait retourner: {"success":true,"data":[...],"count":X}
```

### Frontend accessible
Ouvrez votre navigateur : **http://localhost:3001**

Vous devriez voir :
- ✅ La page d'accueil "Discover Haiti"
- ✅ La barre de recherche
- ✅ Les établissements affichés en grille
- ✅ Les boutons "Connexion" et "Inscription"

## 🧪 Test des Fonctionnalités

### 1. Recherche
- Entrez un nom d'établissement dans la barre de recherche
- Testez les filtres par lieu et catégorie
- Cliquez sur "Rechercher"

### 2. Authentification

#### Connexion Classique
1. Cliquez sur "Connexion"
2. Entrez vos identifiants
3. Cliquez sur "Se connecter"

#### Connexion Google
1. Cliquez sur "Connexion"
2. Cliquez sur le bouton Google
3. Authentifiez-vous avec votre compte Google

#### Inscription
1. Cliquez sur "Inscription"
2. Choisissez "Utilisateur" ou "Partenaire"
3. Remplissez le formulaire
4. Cliquez sur "S'inscrire"

### 3. Favoris (Nécessite connexion)
1. Connectez-vous
2. Cliquez sur le cœur ♡ sur une carte d'établissement
3. Le cœur devient rouge ♥ = Favori ajouté
4. Cliquez à nouveau pour retirer des favoris

### 4. Navigation
- **Utilisateur** : Accès au lien "Favoris"
- **Partenaire** : Accès à "Mon espace" (dashboard partenaire)
- **Admin** : Accès à "Administration"

## 🐛 Dépannage

### Problème : "Aucun établissement trouvé"

**Solution :**
1. Vérifiez que le backend est démarré :
   ```bash
   curl http://localhost:3000/api/establishments
   ```

2. Vérifiez la base de données :
   ```bash
   cd ../listing-backend
   npx prisma studio
   ```
   → Ouvrez la table `Establishment` et vérifiez qu'il y a des données

3. Si la table est vide, seedez la base :
   ```bash
   cd ../listing-backend
   node quick-seed.js
   ```

### Problème : Erreur de connexion API

**Solution :**
1. Vérifiez `.env.local` :
   ```bash
   cat .env.local
   ```
   
2. Assurez-vous que `NEXT_PUBLIC_API_URL=http://localhost:3000/api`

3. Redémarrez le serveur frontend :
   ```bash
   npm run dev
   ```

### Problème : Google OAuth ne fonctionne pas

**Solution :**
1. Vérifiez que le backend supporte `/api/auth/google`
2. Vérifiez le Client ID dans `app/layout.tsx`
3. Assurez-vous que le domaine `localhost:3001` est autorisé dans Google Cloud Console

### Problème : Les images ne s'affichent pas

**Solution :**
1. Les images sont servies depuis le backend
2. Vérifiez que le dossier `listing-backend/uploads/establishments/` existe
3. Les images utilisent un fallback en cas d'erreur (emoji 🏖️)

## 📊 Données de Test

Si vous avez besoin de créer des données de test :

```bash
cd ../listing-backend

# Créer des établissements de test
node quick-seed.js

# Ou utiliser Prisma Studio
npx prisma studio
```

## 🎨 Interface Utilisateur

### Header
- Logo "Discover Haiti" 🇭🇹
- Barre de navigation (responsive)
- Boutons d'authentification

### Hero Section
- Titre accrocheur
- Sous-titre descriptif
- Barre de recherche avec 3 filtres

### Section Établissements
- Grille responsive (1/2/3 colonnes)
- Cartes avec image, note, avis, prix
- Bouton favori (si connecté)
- Animations au hover

### Footer
- Informations sur Discover Haiti
- Liens rapides
- Coordonnées

## 🔑 Comptes de Test

Pour tester l'application, créez des comptes via l'inscription ou utilisez Google OAuth.

**Rôles disponibles :**
- `USER` - Utilisateur normal (peut ajouter des favoris, laisser des avis)
- `PARTNER` - Propriétaire d'établissement (accès au dashboard partenaire)
- `ADMIN` - Administrateur (accès complet)

## 📱 Responsive Design

Testez sur différentes tailles d'écran :
- **Mobile** : < 768px (menu hamburger)
- **Tablet** : 768px - 1024px (2 colonnes)
- **Desktop** : > 1024px (3 colonnes)

## 🎯 Prochaines Étapes

Une fois l'application lancée avec succès :

1. ✅ Testez la recherche et les filtres
2. ✅ Créez un compte utilisateur
3. ✅ Ajoutez des favoris
4. 🔄 Implémentez les reviews (si souhaité)
5. 🔄 Ajoutez Google Maps
6. 🔄 Créez la page de détails d'établissement

## 📞 Support

- Documentation complète : `HOMEPAGE.md`
- Architecture backend : `../listing-backend/WARP.md`
- Questions ? Consultez les fichiers de documentation

---

**Status:** ✅ Opérationnel  
**Version:** 1.0.0  
**Dernière mise à jour:** 2025-10-23
