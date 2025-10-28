# Configuration Facebook Login

## 📱 État actuel

L'authentification Facebook est **implémentée** avec des clés placeholder. Pour l'activer en production, suivez les étapes ci-dessous pour obtenir vos propres clés API Facebook.

---

## 🔑 Obtenir les clés API Facebook

### 1. Créer une application Facebook

1. Allez sur [Facebook Developers](https://developers.facebook.com/)
2. Cliquez sur **"Mes apps"** puis **"Créer une app"**
3. Sélectionnez **"Consommateur"** comme type d'app
4. Remplissez les informations :
   - **Nom de l'app** : Discover Haiti (ou votre nom)
   - **Email de contact** : Votre email
   - **Objectif de l'app** : Authentification

### 2. Configurer Facebook Login

1. Dans le tableau de bord de votre app, cliquez sur **"Ajouter un produit"**
2. Trouvez **"Facebook Login"** et cliquez sur **"Configurer"**
3. Sélectionnez **"Web"** comme plateforme
4. Entrez l'URL de votre site : `http://localhost:3001` (développement)

### 3. Configurer les paramètres OAuth

1. Allez dans **"Facebook Login"** > **"Paramètres"**
2. Ajoutez les URI de redirection OAuth valides :
   ```
   http://localhost:3001
   https://votre-domaine.com
   ```
3. Activez **"Connexion avec Facebook"**
4. Dans **"Paramètres avancés"**, activez :
   - ✅ Connexion avec le SDK JavaScript
   - ✅ Autoriser les connexions depuis les navigateurs

### 4. Récupérer l'App ID

1. Allez dans **"Paramètres"** > **"Basique"**
2. Copiez l'**ID de l'app** (c'est votre `FACEBOOK_APP_ID`)

---

## ⚙️ Configuration dans votre projet

### Frontend (touris-app-web)

Modifiez le fichier `.env.local` :

```env
# Facebook OAuth
NEXT_PUBLIC_FACEBOOK_APP_ID=votre_app_id_facebook
```

**Fichier modifié** : `/Users/christopherjerome/touris-app-web/.env.local`

### Backend (listing-backend)

Aucune configuration supplémentaire n'est nécessaire côté backend. Le contrôleur vérifie automatiquement les tokens avec l'API Graph de Facebook.

---

## 🧪 Tester l'authentification

### 1. Démarrer les serveurs

**Backend :**
```bash
cd /Users/christopherjerome/listing-backend
npm run dev
```

**Frontend :**
```bash
cd /Users/christopherjerome/touris-app-web
npm run dev
```

### 2. Tester la connexion

1. Ouvrez `http://localhost:3001`
2. Cliquez sur **"Connexion"** ou **"Inscription"**
3. Cliquez sur le bouton **"Continuer avec Facebook"**
4. Connectez-vous avec votre compte Facebook de test

---

## 📊 Architecture du flux d'authentification

```
┌─────────────┐         ┌──────────┐         ┌─────────────┐
│   Frontend  │         │ Facebook │         │   Backend   │
│   (Next.js) │         │   OAuth  │         │  (Express)  │
└──────┬──────┘         └────┬─────┘         └──────┬──────┘
       │                     │                       │
       │ 1. Clic sur "Facebook Login"               │
       │────────────────────>│                       │
       │                     │                       │
       │ 2. Popup Facebook   │                       │
       │<────────────────────│                       │
       │                     │                       │
       │ 3. Retour accessToken + user info          │
       │<────────────────────│                       │
       │                                             │
       │ 4. POST /api/auth/facebook                 │
       │    {accessToken, facebookId, email...}     │
       │────────────────────────────────────────────>│
       │                                             │
       │                     5. Vérifie token        │
       │                     <──────────────────────>│
       │                                             │
       │                     6. Crée/Trouve user     │
       │                                             │
       │ 7. Retourne JWT + user data                │
       │<────────────────────────────────────────────│
       │                                             │
```

---

## 🗄️ Structure de la base de données

Le champ `facebook_id` a été ajouté à la table `users` :

```sql
CREATE TABLE users (
  id VARCHAR(191) PRIMARY KEY,
  email VARCHAR(191) UNIQUE NOT NULL,
  first_name VARCHAR(191) NOT NULL,
  last_name VARCHAR(191) NOT NULL,
  password VARCHAR(255) NULL,           -- Nullable pour OAuth
  google_id VARCHAR(255) UNIQUE NULL,   -- ID Google
  facebook_id VARCHAR(255) UNIQUE NULL, -- ID Facebook
  provider VARCHAR(50) DEFAULT 'local', -- 'local', 'google' ou 'facebook'
  profile_picture VARCHAR(500) NULL,    -- URL photo de profil
  role ENUM('USER', 'ADMIN', 'PARTNER') DEFAULT 'USER',
  created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) ON UPDATE CURRENT_TIMESTAMP(3)
);
```

---

## 📝 Endpoints API créés

### POST `/api/auth/facebook`

Authentifie un utilisateur avec Facebook.

**Request:**
```json
{
  "accessToken": "facebook_access_token",
  "facebookId": "12345678901234567",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "profilePicture": "https://graph.facebook.com/.../picture"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "isNewUser": false,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clxxx123456",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER",
    "profilePicture": "https://graph.facebook.com/.../picture",
    "provider": "facebook",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### POST `/api/auth/unlink-facebook`

Dissocie un compte Facebook (nécessite authentification).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

---

## 🔐 Sécurité

### ✅ Implémenté

- ✅ Vérification des tokens côté serveur via Facebook Graph API
- ✅ Validation de l'ID Facebook
- ✅ JWT avec expiration (7 jours)
- ✅ Gestion des erreurs détaillée
- ✅ Support du linking de comptes existants

### ⚠️ Notes importantes

1. **Email obligatoire** : L'utilisateur doit autoriser l'accès à son email
2. **Token verification** : Le backend vérifie que le token est valide auprès de Facebook
3. **Compte unique** : Un facebookId ne peut être lié qu'à un seul compte

---

## 🧪 Mode développement

En attendant les vraies clés, le système utilise :
- **App ID placeholder** : `your_facebook_app_id_placeholder`
- Le SDK Facebook se charge mais ne fonctionnera pas sans vraies clés
- Un message "Chargement du SDK Facebook..." s'affiche pendant le chargement

---

## 🚀 Passage en production

### Avant de déployer :

1. ✅ Obtenir un vrai Facebook App ID
2. ✅ Configurer les domaines autorisés dans Facebook Developers
3. ✅ Mettre à jour `.env.local` avec le vrai App ID
4. ✅ Tester sur l'environnement de production
5. ✅ Soumettre l'app pour révision Facebook (si nécessaire)

### Domaines à configurer :

Dans Facebook Developers > Paramètres > Basique :
- **Domaines de l'application** : `votre-domaine.com`
- **URL de la politique de confidentialité**
- **URL des conditions d'utilisation**

Dans Facebook Login > Paramètres :
- **URI de redirection OAuth valides** : 
  - `https://votre-domaine.com`
  - `https://www.votre-domaine.com`

---

## 📚 Fichiers modifiés

### Frontend
- ✅ `/lib/useFacebookAuth.ts` - Hook personnalisé Facebook
- ✅ `/lib/AuthContext.tsx` - Ajout de `loginWithFacebook`
- ✅ `/components/modals/AuthModal.tsx` - Bouton Facebook Login
- ✅ `.env.local` - Variables d'environnement

### Backend
- ✅ `/src/controllers/oauthController.js` - Contrôleurs Facebook
- ✅ `/src/routes/auth.js` - Routes Facebook
- ✅ `/prisma/schema.prisma` - Champ `facebookId`
- ✅ Base de données - Colonne `facebook_id`

---

## 🆘 Dépannage

### Le bouton Facebook ne s'affiche pas
- Vérifiez que le SDK Facebook est chargé (console du navigateur)
- Vérifiez que `NEXT_PUBLIC_FACEBOOK_APP_ID` est défini

### Erreur "SDK Facebook non chargé"
- Attendez quelques secondes pour que le SDK se charge
- Vérifiez votre connexion internet

### Erreur "Token Facebook invalide"
- Vérifiez que l'App ID est correct
- Vérifiez que le domaine est autorisé dans Facebook Developers

### Erreur "Email requis"
- L'utilisateur doit autoriser l'accès à son email
- Vérifiez les permissions demandées : `public_profile,email`

---

## ✅ Checklist finale

- [x] SDK Facebook intégré
- [x] Hook `useFacebookAuth` créé
- [x] Bouton Facebook dans AuthModal
- [x] Endpoint `/api/auth/facebook` créé
- [x] Endpoint `/api/auth/unlink-facebook` créé
- [x] Champ `facebook_id` ajouté à la DB
- [x] Prisma client regénéré
- [ ] Obtenir les vraies clés Facebook (À FAIRE)
- [ ] Tester avec vraies clés (À FAIRE)
- [ ] Déployer en production (À FAIRE)

---

## 🎉 Prêt pour les vraies clés !

Dès que vous aurez obtenu votre Facebook App ID, remplacez simplement `your_facebook_app_id_placeholder` dans `.env.local` et l'authentification Facebook sera entièrement fonctionnelle !
