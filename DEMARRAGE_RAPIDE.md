# 🚀 Démarrage Rapide - Dashboard Administrateur

## Problèmes résolus

✅ **Authentification requise** - Le dashboard est maintenant protégé  
✅ **Vérification du rôle** - Seuls les admins peuvent accéder  
✅ **Meilleurs messages d'erreur** - Debug facilité avec logs console  

## Étapes de connexion

### 1. Démarrer le backend

```bash
cd ../listing-backend
npm run dev
```

Le backend devrait démarrer sur `http://localhost:3000`

### 2. Démarrer le frontend

```bash
cd touris-app-web
npm run dev -- -p 3001
```

Le frontend démarre sur `http://localhost:3001`

### 3. Se connecter

1. Ouvrez votre navigateur sur `http://localhost:3001`
2. Cliquez sur **Administration** ou allez sur `/login`
3. Utilisez les identifiants admin:
   - **Email**: `admin@tourism.gov`
   - **Password**: `Test123!@#`

### 4. Accéder au dashboard

Une fois connecté, vous serez automatiquement redirigé vers `/admin`

## Que faire si le dashboard est vide ?

### Vérification 1: Backend en ligne

```bash
curl http://localhost:3000/api/
```

Devrait retourner: `"status": "API fonctionnelle"`

### Vérification 2: Authentification

Ouvrez la console du navigateur (F12) et vérifiez:
- `localStorage.getItem('token')` devrait retourner un token JWT
- `localStorage.getItem('user')` devrait retourner vos infos utilisateur

### Vérification 3: Données dans la base

Testez l'API directement avec un token:

```bash
# 1. Se connecter et obtenir le token
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tourism.gov","password":"Test123!@#"}' \
  | jq -r '.data.token')

# 2. Tester le dashboard
curl -X GET http://localhost:3000/api/admin/dashboard \
  -H "Authorization: Bearer $TOKEN" \
  | jq .
```

Si ça fonctionne, vous devriez voir:
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalUsers": X,
      "totalPartners": Y,
      ...
    }
  }
}
```

### Vérification 4: Variables d'environnement

Vérifiez `.env.local`:
```bash
cat .env.local
```

Devrait contenir:
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Debugging

### Activer les logs

Les logs de debug sont maintenant actifs dans la console du navigateur:
1. Ouvrez la console (F12)
2. Rechargez la page `/admin`
3. Regardez les messages:
   - `Fetching dashboard data...`
   - `API URL: ...`
   - `Token: Present/Missing`
   - `Dashboard response: ...`

### Erreurs communes

#### "Token d'authentification requis"
- Vous n'êtes pas connecté
- Solution: Allez sur `/login` et connectez-vous

#### "Accès réservé aux administrateurs"
- Vous êtes connecté mais pas avec un compte ADMIN
- Solution: Connectez-vous avec `admin@tourism.gov`

#### "Erreur lors du chargement du dashboard"
- Le backend ne répond pas
- Solution: Vérifiez que le backend est lancé sur port 3000

#### Dashboard vide (stats à 0)
- La base de données est vide
- Solution: 
  1. Vérifiez la connexion à la base de données dans le backend
  2. Créez des données de test
  3. Vérifiez les logs du backend

## Créer des données de test

Si votre base est vide, vous pouvez créer des données de test:

```bash
cd listing-backend

# Créer un partenaire
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "hotel@example.com",
    "password": "Test123!",
    "firstName": "Hotel",
    "lastName": "Paradise",
    "role": "PARTNER"
  }'

# Créer un utilisateur normal
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Test123!",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER"
  }'
```

## Structure du système

### Frontend (Port 3001)
```
/login              → Page de connexion
/admin              → Dashboard admin (protégé)
/admin/users        → Gestion utilisateurs
/admin/partners     → Gestion partenaires
/admin/establishments → Gestion établissements
/admin/sites        → Sites touristiques
/admin/reviews      → Modération avis
/admin/statistics   → Statistiques détaillées
```

### Backend (Port 3000)
```
POST /api/auth/login         → Connexion
GET  /api/admin/dashboard    → Stats dashboard
GET  /api/admin/users        → Liste utilisateurs
GET  /api/admin/partners     → Liste partenaires
...
```

## Fonctionnalités de sécurité

✅ Protection des routes admin  
✅ Vérification du rôle ADMIN  
✅ Token JWT dans les en-têtes  
✅ Redirection automatique si non authentifié  
✅ Logout avec nettoyage du localStorage  

## Support

Si vous rencontrez toujours des problèmes:

1. **Vérifiez les logs backend** dans le terminal où il tourne
2. **Vérifiez la console navigateur** (F12) pour les erreurs
3. **Testez l'API manuellement** avec curl
4. **Vérifiez la connexion MySQL** du backend

## Prochaines étapes

Une fois connecté et le dashboard qui fonctionne:

1. ✅ Explorez les différents modules
2. ✅ Créez un nouveau compte admin via `/admin/administrators`
3. ✅ Testez la validation des partenaires
4. ✅ Testez la modération des avis
5. ✅ Consultez les statistiques détaillées
