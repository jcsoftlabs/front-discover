# 🚀 Guide de Démarrage - Développement Local

## 📋 Configuration des Ports

Pour éviter les conflits, les deux applications tournent sur des **ports différents** :

```
Backend (listing-backend)  → http://localhost:3000
Frontend (touris-app-web)  → http://localhost:3001
```

---

## ⚙️ Configuration Actuelle

### Backend
- **Port** : 3000
- **Base de données** : MySQL (XAMPP)
- **API Base URL** : `http://localhost:3000/api`

### Frontend
- **Port** : 3001 ✅ (configuré dans package.json)
- **API URL** : `http://localhost:3000/api` ✅ (configuré dans .env.local)

---

## 🔧 Démarrage Rapide

### 1. Démarrer le Backend

```bash
# Terminal 1
cd ~/listing-backend

# S'assurer que MySQL (XAMPP) est démarré
# Puis démarrer le serveur
npm run dev
```

**Vérification** : Backend disponible sur `http://localhost:3000`

---

### 2. Démarrer le Frontend

```bash
# Terminal 2
cd ~/touris-app-web

# Démarrer le serveur frontend
npm run dev
```

**Vérification** : Frontend disponible sur `http://localhost:3001`

---

## 🌐 URLs d'Accès

### Espace Public
```
http://localhost:3001/
```

### Espace Partenaire
```
http://localhost:3001/partner/login     → Login partenaire
http://localhost:3001/partner/dashboard → Tableau de bord
http://localhost:3001/partner/profile   → Mes établissements
http://localhost:3001/partner/reviews   → Avis clients
```

### Espace Administrateur
```
http://localhost:3001/admin/login       → Login administrateur
http://localhost:3001/admin/dashboard   → Tableau de bord admin
```

---

## 🔍 Vérification de la Configuration

### Backend
```bash
# Tester que l'API répond
curl http://localhost:3000/api/health

# Ou ouvrir dans le navigateur
open http://localhost:3000/api/health
```

### Frontend
```bash
# Vérifier que le serveur démarre
npm run dev

# Devrait afficher :
# ▲ Next.js 16.0.0
# - Local:        http://localhost:3001
# - Ready in X.Xs
```

---

## 📝 Variables d'Environnement

### Backend (.env)
```env
DATABASE_URL="mysql://user:password@localhost:3306/touris_db"
JWT_SECRET="your-secret-key"
PORT=3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## 🐛 Dépannage

### Problème : "Port 3000 already in use"

**Cause** : Le backend ou un autre processus utilise déjà le port 3000.

**Solution** :
```bash
# Trouver le processus utilisant le port 3000
lsof -ti:3000

# Tuer le processus
kill -9 $(lsof -ti:3000)

# Ou changer le port du backend dans .env
PORT=3002
```

---

### Problème : "Port 3001 already in use"

**Cause** : Un autre processus Next.js tourne déjà.

**Solution** :
```bash
# Trouver et tuer le processus
kill -9 $(lsof -ti:3001)

# Ou utiliser un autre port temporairement
npm run dev -- -p 3002
```

---

### Problème : CORS Error

**Symptôme** : 
```
Access to XMLHttpRequest at 'http://localhost:3000/api/...' 
from origin 'http://localhost:3001' has been blocked by CORS policy
```

**Solution** : Vérifier que le backend a la configuration CORS correcte.

Dans `listing-backend/server.js` :
```javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
```

---

### Problème : "Cannot connect to database"

**Causes possibles** :
1. MySQL (XAMPP) n'est pas démarré
2. Mauvaises credentials dans DATABASE_URL
3. Base de données n'existe pas

**Solution** :
```bash
# 1. Démarrer XAMPP
# 2. Vérifier que MySQL tourne sur port 3306
# 3. Créer la base de données si nécessaire
mysql -u root -p
CREATE DATABASE touris_db;

# 4. Lancer les migrations Prisma
cd ~/listing-backend
npx prisma migrate dev
```

---

## 🎯 Workflow de Développement

### Développement Normal

```bash
# 1. Démarrer XAMPP (MySQL)
# 2. Terminal 1 : Backend
cd ~/listing-backend && npm run dev

# 3. Terminal 2 : Frontend  
cd ~/touris-app-web && npm run dev

# 4. Développer !
# Frontend: http://localhost:3001
```

### Avec Hot Reload

Les deux serveurs supportent le hot reload :
- ✅ **Backend** : Redémarre automatiquement (nodemon)
- ✅ **Frontend** : Hot Module Replacement (Next.js)

---

## 📊 Ports Utilisés - Résumé

| Service | Port | URL |
|---------|------|-----|
| MySQL (XAMPP) | 3306 | localhost:3306 |
| Backend API | 3000 | http://localhost:3000 |
| Frontend Web | 3001 | http://localhost:3001 |

---

## ✅ Checklist Pré-Développement

Avant de commencer à développer :

- [ ] XAMPP démarré (MySQL actif)
- [ ] Base de données `touris_db` créée
- [ ] Backend `npm install` effectué
- [ ] Frontend `npm install` effectué
- [ ] Backend tourne sur port 3000
- [ ] Frontend tourne sur port 3001
- [ ] `.env` et `.env.local` configurés
- [ ] Migrations Prisma appliquées

---

## 🚀 Commandes Utiles

### Backend
```bash
npm run dev          # Démarrer en mode développement
npm run build        # Build pour production
npm start            # Démarrer en production
npx prisma studio    # Interface DB graphique
npx prisma migrate dev  # Appliquer migrations
```

### Frontend
```bash
npm run dev          # Démarrer sur port 3001
npm run build        # Build Next.js
npm start            # Démarrer en production
npm run lint         # Vérifier erreurs ESLint
```

---

## 📞 Besoin d'Aide ?

- **Documentation Backend** : `~/listing-backend/README.md`
- **Documentation Frontend** : `~/touris-app-web/INTEGRATION_READY.md`
- **Problèmes d'intégration** : `~/touris-app-web/BACKEND_INTEGRATION_GAPS.md`

---

**Dernière mise à jour** : 2025-10-23  
**Configuration testée** : ✅ macOS, Node.js 18+, MySQL 8.0+
