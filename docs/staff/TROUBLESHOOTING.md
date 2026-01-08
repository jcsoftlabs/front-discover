# ❓ FAQ et Guide de Dépannage
## Système de Tourisme - Ministère du Tourisme d'Haïti

**Version:** 1.0  
**Date:** Janvier 2026

---

## 📋 Table des Matières

1. [Problèmes de Connexion](#1-problèmes-de-connexion)
2. [Problèmes d'Affichage](#2-problèmes-daffichage)
3. [Problèmes de Données](#3-problèmes-de-données)
4. [Problèmes Serveur](#4-problèmes-serveur)
5. [Application Mobile](#5-application-mobile)
6. [FAQ Générale](#6-faq-générale)
7. [Contacts Support](#7-contacts-support)

---

## 1. Problèmes de Connexion

### ❌ "Identifiants incorrects"

**Causes possibles :**
- Email ou mot de passe erroné
- Compte désactivé

**Solutions :**
1. Vérifiez la saisie (majuscules, espaces)
2. Utilisez "Mot de passe oublié"
3. Contactez un administrateur

### ❌ "Session expirée"

**Cause :** Token JWT expiré (après 24h)

**Solution :** Reconnectez-vous

### ❌ Connexion Google ne fonctionne pas

**Solutions :**
1. Vérifiez votre connexion Internet
2. Autorisez les pop-ups dans le navigateur
3. Essayez un autre navigateur
4. Vérifiez que le domaine est autorisé dans Google Cloud Console

### ❌ Page blanche après connexion

**Solutions :**
1. Videz le cache du navigateur (Ctrl+Shift+R)
2. Supprimez les cookies du site
3. Essayez en navigation privée

---

## 2. Problèmes d'Affichage

### ❌ Images non affichées

**Causes possibles :**
- Service Cloudinary indisponible
- Image supprimée

**Solutions :**
1. Rafraîchissez la page
2. Vérifiez la configuration Cloudinary dans .env
3. Réuploadez les images

### ❌ Carte Google Maps non visible

**Causes possibles :**
- Clé API invalide ou expirée
- Quota dépassé

**Solutions :**
1. Vérifiez GOOGLE_MAPS_API_KEY
2. Consultez Google Cloud Console pour les erreurs
3. Vérifiez que l'API Maps est activée

### ❌ Mise en page cassée

**Solutions :**
1. Videz le cache (Ctrl+Shift+R)
2. Essayez un autre navigateur
3. Vérifiez la taille de l'écran (certaines vues sont optimisées desktop)

---

## 3. Problèmes de Données

### ❌ "Aucun établissement trouvé"

**Vérifications :**

```bash
# Tester l'API
curl https://api.votre-domaine.com/api/establishments

# Résultat attendu
{"success":true,"data":[...],"count":X}
```

**Solutions :**
1. Vérifiez que le backend est démarré
2. Vérifiez la connexion base de données
3. Seed la base si vide : `node quick-seed.js`

### ❌ Modifications non sauvegardées

**Causes possibles :**
- Session expirée
- Erreur de validation
- Problème réseau

**Solutions :**
1. Vérifiez les messages d'erreur
2. Reconnectez-vous
3. Réessayez

### ❌ Données anciennes affichées (cache)

**Solutions :**
1. Rafraîchissez la page
2. Videz le cache du navigateur
3. Pour l'API : attendez 5 minutes ou redémarrez

---

## 4. Problèmes Serveur

### ❌ "Erreur 500 - Erreur serveur"

**Diagnostics :**

```bash
# Vérifier les logs Railway
railway logs

# Ou logs locaux
cat server.log | tail -50
```

**Solutions courantes :**
1. Redémarrez le serveur
2. Vérifiez la connexion base de données
3. Vérifiez les variables d'environnement

### ❌ "Erreur 429 - Trop de requêtes"

**Cause :** Rate limiting activé (100 req/15 min)

**Solution :** Attendez 15 minutes ou contactez l'admin

### ❌ Backend injoignable

**Vérifications :**

```bash
# Test de connectivité
curl https://api.votre-domaine.com

# Résultat attendu
{"message":"Touris API est en ligne"...}
```

**Solutions :**
1. Vérifiez le statut Railway/hébergeur
2. Redémarrez le service
3. Vérifiez les logs pour les erreurs

### ❌ Erreur de base de données

**Symptômes :** Erreurs Prisma, connexion refusée

**Solutions :**

```bash
# Vérifier la connexion
cd listing-backend
npx prisma db pull

# Si erreur, vérifier DATABASE_URL dans .env
```

---

## 5. Application Mobile

### ❌ App ne se connecte pas à l'API

**Vérifications :**
1. L'appareil a accès à Internet
2. L'URL API est correcte dans les paramètres
3. Le backend est accessible

**Solution :** Vérifiez `api_constants.dart` :
```dart
static const String baseUrl = 'https://api.votre-domaine.com';
```

### ❌ Images ne chargent pas

**Solutions :**
1. Vérifiez la connexion Internet
2. Videz le cache de l'application
3. Réinstallez l'application

### ❌ GPS ne fonctionne pas

**Solutions :**
1. Autorisez la localisation dans les paramètres
2. Activez le GPS de l'appareil
3. Redémarrez l'application

### ❌ Notifications non reçues

**iOS :** Paramètres → Notifications → Touris → Autoriser
**Android :** Paramètres → Apps → Touris → Notifications

---

## 6. FAQ Générale

### 🔵 Comment créer un compte Admin ?

Via l'API (administrateur existant requis) :
```bash
curl -X POST https://api.example.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Prénom","lastName":"Nom","email":"admin@example.com","password":"MotDePasse123!","role":"ADMIN"}'
```

### 🔵 Comment réinitialiser la base de données ?

⚠️ **Attention : Cette action supprime toutes les données**

```bash
cd listing-backend
npx prisma migrate reset
npm run prisma:seed
```

### 🔵 Comment sauvegarder la base ?

```bash
mysqldump -u root -p listing_app > backup_$(date +%Y%m%d).sql
```

### 🔵 Comment voir les statistiques détaillées ?

Utilisez Prisma Studio :
```bash
cd listing-backend
npx prisma studio
```

### 🔵 Comment ajouter un nouveau type d'établissement ?

1. Modifier `prisma/schema.prisma`
2. Ajouter le type dans l'enum `EstablishmentType`
3. Exécuter `npx prisma generate`
4. Redémarrer le serveur

### 🔵 Comment changer le logo ou les couleurs ?

**Frontend :** Modifier `app/globals.css` et `public/`
**Mobile :** Modifier `lib/core/constants/` et `assets/`

### 🔵 Quelle est la durée de session ?

- Token JWT : 24 heures
- Refresh token : 7 jours

---

## 7. Contacts Support

### Niveaux de Support

| Niveau | Problème | Contact |
|--------|----------|---------|
| 🟢 Niveau 1 | Utilisation, questions | Superviseur équipe |
| 🟡 Niveau 2 | Configuration, données | Administrateur système |
| 🔴 Niveau 3 | Bugs, développement | Équipe technique |

### Informations à Fournir

Pour accélérer le diagnostic, fournissez :

1. **Description** du problème
2. **Étapes** pour reproduire
3. **Messages d'erreur** (copier-coller exact)
4. **Captures d'écran** si possible
5. **Navigateur/Appareil** utilisé
6. **Date et heure** du problème

### Commandes de Diagnostic

```bash
# Statut du backend
curl https://api.votre-domaine.com

# Version Node.js
node --version

# Statut Prisma
cd listing-backend && npx prisma version

# Logs récents (Railway)
railway logs --num 100
```

---

## 🔧 Checklist de Dépannage Rapide

Avant de contacter le support :

- [ ] Page rafraîchie (F5 ou Ctrl+R)
- [ ] Cache vidé (Ctrl+Shift+R)
- [ ] Reconnexion effectuée
- [ ] Autre navigateur testé
- [ ] Connexion Internet vérifiée
- [ ] Logs consultés si accès technique

---

*Document généré le 8 janvier 2026*
