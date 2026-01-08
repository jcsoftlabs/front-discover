# 🔧 Guide d'Administration Système
## Système de Tourisme - Ministère du Tourisme d'Haïti

**Version:** 1.0  
**Date:** Janvier 2026

---

## 📋 Table des Matières

1. [Vue d'ensemble du Système](#1-vue-densemble-du-système)
2. [Démarrage des Services](#2-démarrage-des-services)
3. [Gestion des Utilisateurs](#3-gestion-des-utilisateurs)
4. [Gestion des Partenaires](#4-gestion-des-partenaires)
5. [Gestion des Établissements](#5-gestion-des-établissements)
6. [Gestion des Sites Touristiques](#6-gestion-des-sites-touristiques)
7. [Gestion des Événements](#7-gestion-des-événements)
8. [Modération des Avis](#8-modération-des-avis)
9. [Tableau de Bord Télémétrie](#9-tableau-de-bord-télémétrie)
10. [Sauvegardes](#10-sauvegardes)

---

## 1. Vue d'ensemble du Système

Le système se compose de **3 applications** :

| Application | Rôle | URL |
|-------------|------|-----|
| **listing-backend** | API REST centrale | `https://votre-domaine.railway.app` |
| **front-discover** | Portail web | `https://votre-domaine.vercel.app` |
| **touris-mobile** | Application mobile | App Store / Play Store |

### Rôles Utilisateurs

| Rôle | Permissions |
|------|-------------|
| **USER** | Consulter, ajouter favoris, laisser avis |
| **PARTNER** | Gérer ses établissements et événements |
| **ADMIN** | Accès complet à toutes les fonctionnalités |

---

## 2. Démarrage des Services

### Backend (listing-backend)

```bash
# Se positionner dans le dossier
cd listing-backend

# Mode développement
npm run dev

# Mode production
npm start
```

**Vérification :** Accéder à `http://localhost:3000` - Doit afficher "Touris API est en ligne"

### Frontend (front-discover)

```bash
# Se positionner dans le dossier
cd front-discover

# Mode développement
npm run dev

# Build production
npm run build && npm start
```

**Vérification :** Accéder à `http://localhost:3001`

### Application Mobile

L'application mobile se connecte automatiquement à l'API backend configurée.

---

## 3. Gestion des Utilisateurs

### Accéder à la gestion

1. Connectez-vous au portail web en tant qu'**Admin**
2. Cliquez sur **"Administration"** dans le menu
3. Sélectionnez **"Utilisateurs"**

### Actions disponibles

| Action | Description |
|--------|-------------|
| **Voir la liste** | Affiche tous les utilisateurs inscrits |
| **Modifier le rôle** | Changer USER → PARTNER ou ADMIN |
| **Désactiver** | Bloquer l'accès d'un utilisateur |
| **Supprimer** | Supprimer définitivement le compte |

### Créer un nouvel Admin

```bash
# Via l'API (remplacer les valeurs)
curl -X POST https://api.example.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Prénom",
    "lastName": "Nom",
    "email": "admin@example.com",
    "password": "MotDePasse123!",
    "role": "ADMIN"
  }'
```

---

## 4. Gestion des Partenaires

### Workflow de validation

```
Inscription → PENDING → Validation Admin → APPROVED
                      → Rejet → REJECTED
```

### Valider un partenaire

1. Accédez à **Administration → Partenaires**
2. Cliquez sur un partenaire avec statut **"En attente"**
3. Vérifiez les informations
4. Cliquez sur **"Approuver"** ou **"Rejeter"**

### Statuts des partenaires

| Statut | Description |
|--------|-------------|
| **PENDING** | En attente de validation |
| **APPROVED** | Validé, peut gérer ses établissements |
| **REJECTED** | Demande refusée |
| **SUSPENDED** | Compte suspendu temporairement |

---

## 5. Gestion des Établissements

### Types d'établissements

- 🏨 **HOTEL** - Hôtels et hébergements
- 🍽️ **RESTAURANT** - Restaurants
- 🍸 **BAR** - Bars et pubs
- ☕ **CAFE** - Cafés
- 🎢 **ATTRACTION** - Attractions touristiques
- 🛍️ **SHOP** - Boutiques
- 🛠️ **SERVICE** - Services divers

### Créer un établissement

1. **Administration → Établissements → Nouveau**
2. Remplir les champs obligatoires :
   - Nom
   - Type
   - Adresse
   - Ville / Département
3. Ajouter les informations optionnelles :
   - Description
   - Prix
   - Images (via Cloudinary)
   - Coordonnées GPS
   - Équipements
4. **Sauvegarder**

### Modifier / Supprimer

- Cliquez sur l'établissement dans la liste
- Utilisez les boutons **"Modifier"** ou **"Supprimer"**

---

## 6. Gestion des Sites Touristiques

### Catégories de sites

| Catégorie | Exemple |
|-----------|---------|
| **MONUMENT** | Citadelle Laferrière |
| **MUSEUM** | Musée du Panthéon National |
| **PARK** | Parc National La Visite |
| **BEACH** | Plage de Labadee |
| **MOUNTAIN** | Pic la Selle |
| **CULTURAL** | Sites culturels |
| **RELIGIOUS** | Églises, temples |
| **NATURAL** | Cascades, grottes |
| **HISTORICAL** | Sites historiques |
| **ENTERTAINMENT** | Parcs d'attractions |

### Ajouter un site

1. **Administration → Sites → Nouveau**
2. Remplir les informations
3. **Important :** Les coordonnées GPS sont requises pour l'affichage sur la carte

---

## 7. Gestion des Événements

### Types d'événements

- 🎵 **CONCERT** - Concerts et spectacles musicaux
- 🎉 **FESTIVAL** - Festivals
- 🎤 **CONFERENCE** - Conférences
- ⚽ **SPORT** - Événements sportifs
- 🎨 **EXHIBITION** - Expositions
- 🎭 **CULTURAL** - Événements culturels
- ⛪ **RELIGIOUS** - Événements religieux
- 🎊 **CARNIVAL** - Carnaval

### Créer un événement

1. **Administration → Événements → Nouveau**
2. Informations requises :
   - Titre
   - Date de début et fin
   - Lieu
   - Catégorie
3. Informations optionnelles :
   - Capacité maximale
   - Prix d'entrée
   - Images

---

## 8. Modération des Avis

### Statuts des avis

| Statut | Description |
|--------|-------------|
| **PENDING** | En attente de modération |
| **APPROVED** | Approuvé et visible |
| **REJECTED** | Rejeté (contenu inapproprié) |

### Processus de modération

1. **Administration → Avis**
2. Filtrez par **"En attente"**
3. Lisez le contenu de l'avis
4. Actions :
   - **Approuver** - L'avis sera visible publiquement
   - **Rejeter** - L'avis ne sera pas affiché (ajoutez une note de modération)

### Critères de rejet

- Langage offensant ou inapproprié
- Spam ou publicité
- Contenu sans rapport avec l'établissement
- Fausses informations

---

## 9. Tableau de Bord Télémétrie

### Accéder aux statistiques

1. **Administration → Statistiques**
2. Sélectionnez la période souhaitée

### Métriques disponibles

| Métrique | Description |
|----------|-------------|
| **Sessions** | Nombre de sessions utilisateur |
| **Pages vues** | Nombre de pages consultées |
| **Temps moyen** | Durée moyenne des sessions |
| **Géographie** | Répartition par pays/ville |
| **Appareils** | Mobile vs Desktop |
| **Erreurs** | Erreurs API et frontend |

---

## 10. Sauvegardes

### Base de données

```bash
# Exporter la base de données
cd listing-backend
npx prisma db pull

# Ou via MySQL dump
mysqldump -u root -p listing_app > backup_$(date +%Y%m%d).sql
```

### Images (Cloudinary)

Les images sont stockées sur Cloudinary et sauvegardées automatiquement.

### Recommandations

- ✅ Sauvegarde quotidienne de la base de données
- ✅ Conserver les 7 dernières sauvegardes
- ✅ Tester la restauration mensuellement

---

## 📞 Support Technique

En cas de problème technique :

1. Consultez le **Guide de Dépannage** (TROUBLESHOOTING.md)
2. Vérifiez les logs du serveur
3. Contactez l'équipe de développement

---

*Document généré le 8 janvier 2026*
