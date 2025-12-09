# Problème d'Authentification Partenaire

## 🐛 Problème Identifié

L'authentification des partenaires échoue avec une erreur 401 en raison d'une **incohérence architecturale** entre les tables User et Partner dans le backend.

## 📊 Analyse

### Architecture Actuelle

Le backend utilise **deux tables séparées** :

1. **Table `User`** (prisma/schema.prisma)
   - Contient les utilisateurs normaux ET les partenaires (role: PARTNER)
   - A un champ `password` hashé
   - Créé via `/api/auth/register`

2. **Table `Partner`** (prisma/schema.prisma)
   - Contient les informations d'établissement des partenaires
   - **N'a PAS de champ `password`** dans le seed actuel
   - Authentification via `/api/auth/login/partner`

### Le Problème

```javascript
// authController.js ligne 342-351
const partner = await prisma.partner.findUnique({
    where: { email },
    select: {
        id: true,
        email: true,
        password: true,  // ❌ Ce champ n'existe pas dans le seed
        name: true,
        status: true
    }
});

if (!partner || !partner.password) {  // ❌ Échoue car password est null
    return res.status(401).json({
        success: false,
        error: 'Email ou mot de passe incorrect.'
    });
}
```

### Seed Actuel

```javascript
// prisma/seed.js ligne 66-78
const partners = await prisma.partner.createMany({
  data: [
    {
      name: 'Luxe Hotels Paris',
      email: 'contact@luxehotels.com',
      phone: '+33 1 42 86 87 88',
      // ❌ PAS de champ password
      description: '...',
      status: 'APPROVED'
    }
  ]
});
```

## ✅ Solutions Possibles

### Solution 1: Ajouter le mot de passe dans le seed (RECOMMANDÉE)

Modifier `/Users/christopherjerome/listing-backend/prisma/seed.js` :

```javascript
// Hash password pour les partenaires
const hashedPassword = await bcrypt.hash('password123', 10);

const partners = await prisma.partner.createMany({
  data: [
    {
      name: 'Luxe Hotels Paris',
      email: 'contact@luxehotels.com',
      password: hashedPassword,  // ✅ Ajouter le mot de passe
      phone: '+33 1 42 86 87 88',
      description: '...',
      status: 'APPROVED'
    }
  ]
});
```

### Solution 2: Créer un endpoint d'inscription partenaire

Créer `/api/partners/register` qui :
1. Crée une entrée dans la table `Partner` avec mot de passe
2. Génère les tokens d'authentification
3. Retourne les credentials

### Solution 3: Unifier l'architecture

Faire que `/auth/login/partner` vérifie d'abord dans `User` avec `role === 'PARTNER'`, puis dans `Partner` si échec.

## 🧪 Test de Validation

Pour confirmer que le fix fonctionne :

```bash
# 1. Mettre à jour le seed avec password
# 2. Re-seeder la base de données Railway
# 3. Tester la connexion

curl -X POST https://discover-ht-production.up.railway.app/api/auth/login/partner \
  -H "Content-Type: application/json" \
  -d '{
    "email": "contact@luxehotels.com",
    "password": "password123"
  }'
```

**Résultat attendu** :
```json
{
  "success": true,
  "message": "Connexion réussie.",
  "data": {
    "partner": {
      "id": "...",
      "email": "contact@luxehotels.com",
      "name": "Luxe Hotels Paris",
      "status": "APPROVED"
    },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

## 📝 Workaround Temporaire

En attendant le fix, les partenaires peuvent :

1. S'inscrire comme utilisateur PARTNER via `/api/auth/register`:
   ```bash
   curl -X POST https://discover-ht-production.up.railway.app/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "firstName": "Jean",
       "lastName": "Partenaire",
       "email": "jean@monhotel.com",
       "password": "Password123!",
       "country": "Haiti",
       "role": "PARTNER"
     }'
   ```

2. Se connecter via `/api/auth/login` (endpoint utilisateur normal)

## 🎯 Prochaines Étapes

1. ✅ Documenter le problème
2. ⏳ Fixer le seed pour ajouter les mots de passe
3. ⏳ Re-déployer le seed sur Railway
4. ⏳ Tester la connexion partenaire
5. ⏳ Valider le flow complet dans le frontend
