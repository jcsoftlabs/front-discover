# Configuration et Démarrage

## Prérequis
- Node.js 18+
- npm ou yarn
- Backend listing-backend en cours d'exécution

## Installation

```bash
cd /Users/christopherjerome/touris-app-web
npm install
```

## Configuration

Le fichier `.env.local` est déjà créé avec :
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

Modifiez l'URL selon votre configuration backend.

## Démarrage

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:3000`

## Structure des Interfaces

### 1. Administration (`/admin`)
- **Dashboard** : `/admin/dashboard` - Statistiques globales
- **Partenaires** : `/admin/partners` - Gestion des partenaires
- **Annonces** : `/admin/listings` - Validation des annonces
- **Utilisateurs** : `/admin/users` - Gestion des utilisateurs

### 2. Partenaire (`/partner`)
- **Dashboard** : `/partner/dashboard` - Statistiques personnelles
- **Mes annonces** : `/partner/listings` - Gestion des annonces
- **Profil** : `/partner/profile` - Informations de l'établissement

## Prochaines Étapes

1. Implémenter les pages manquantes
2. Ajouter l'authentification (JWT)
3. Créer les formulaires avec React Hook Form
4. Connecter les pages au backend listing-backend
5. Ajouter la gestion des images
6. Implémenter les validations avec Zod
