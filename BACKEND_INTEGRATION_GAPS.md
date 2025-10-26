# Écarts d'Intégration Backend - Frontend

## ⚠️ Différences Critiques Identifiées

Après analyse du backend `listing-backend`, plusieurs différences importantes ont été identifiées entre la structure du backend et l'implémentation frontend.

---

## 🔴 Modèle de Données

### 1. **Nomenclature**
**Backend utilise** : `Establishment` (établissements)  
**Frontend utilise** : `Listing` (annonces)

**Impact** : Tous les types et endpoints doivent être renommés.

### 2. **Structure Review**
**Backend** :
```typescript
Review {
  id: string
  rating: number (1-5)
  comment: string?
  status: ReviewStatus (PENDING/APPROVED/REJECTED)
  userId: string
  establishmentId: string
  moderatedBy?: string
  moderatedAt?: DateTime
}
```

**Frontend attendu** :
```typescript
Review {
  response?: string        // ❌ N'existe pas dans le backend
  userName: string         // ❌ Doit être calculé depuis user relation
  respondedAt?: DateTime   // ❌ N'existe pas
}
```

**Solution** : Le backend doit ajouter un champ `partnerResponse` et `partnerRespondedAt` au modèle Review.

### 3. **Structure Promotion**
**Backend** :
```typescript
Promotion {
  validFrom: DateTime
  validUntil: DateTime
  discount: Decimal
  establishmentId: string  // ✅ Requis (pas optionnel)
}
```

**Frontend attendu** :
```typescript
Promotion {
  startDate: string
  endDate: string
  discount: number
  listingId?: string       // Optionnel
  partnerId: string        // ❌ N'existe pas dans backend
  status: 'active' | 'inactive' | 'expired'  // Backend utilise isActive (boolean)
}
```

### 4. **Types d'Établissement**
**Backend** : `EstablishmentType`
- HOTEL, RESTAURANT, BAR, CAFE, ATTRACTION, SHOP, SERVICE

**Frontend** : Partner `type`
- hotel, restaurant, attraction, tour_operator

**Différence** : `tour_operator` n'existe pas dans backend, manque BAR, CAFE, SHOP, SERVICE.

### 5. **Partner Status**
**Backend** : `PartnerStatus`
- PENDING, APPROVED, REJECTED, SUSPENDED

**Frontend** : Partner `status`
- active, inactive, pending

**Mapping requis** :
- APPROVED → active
- PENDING → pending
- REJECTED/SUSPENDED → inactive

---

## 🔴 Structure des Routes

### Routes Partner Existantes dans Backend

```javascript
GET    /api/partner/dashboard
GET    /api/partner/establishments
GET    /api/partner/establishments/:establishmentId
PUT    /api/partner/establishments/:establishmentId
PUT    /api/partner/establishments/:establishmentId/menu
PUT    /api/partner/establishments/:establishmentId/availability
PUT    /api/partner/establishments/:establishmentId/images
GET    /api/partner/establishments/:establishmentId/promotions
POST   /api/partner/establishments/:establishmentId/promotions
PUT    /api/partner/establishments/:establishmentId/promotions/:promotionId
DELETE /api/partner/establishments/:establishmentId/promotions/:promotionId
GET    /api/partner/reviews
GET    /api/partner/establishments/:establishmentId/reviews
```

### Routes Attendues par le Frontend (❌ Incorrectes)

```javascript
GET    /api/partner/stats                    // ❌ N'existe pas
GET    /api/partner/profile                  // ❌ N'existe pas
PUT    /api/partner/profile                  // ❌ N'existe pas
GET    /api/partner/listing                  // ❌ N'existe pas
GET    /api/partner/schedules                // ❌ N'existe pas
PUT    /api/partner/schedules                // ❌ N'existe pas
PATCH  /api/partner/schedules/:dayOfWeek     // ❌ N'existe pas
GET    /api/partner/promotions               // ❌ Structure différente
POST   /api/partner/promotions               // ❌ Structure différente
POST   /api/partner/reviews/:id/respond      // ❌ N'existe pas
DELETE /api/partner/reviews/:id/respond      // ❌ N'existe pas
```

---

## 🔴 Fonctionnalités Manquantes dans Backend

### 1. Réponses aux Avis
**Frontend attend** : Possibilité pour les partenaires de répondre aux avis  
**Backend actuel** : Aucun champ ni endpoint pour les réponses

**Solution** :
```sql
ALTER TABLE reviews 
ADD COLUMN partner_response TEXT,
ADD COLUMN partner_responded_at DATETIME;
```

Endpoints à ajouter :
```javascript
POST   /api/partner/reviews/:reviewId/respond
PUT    /api/partner/reviews/:reviewId/respond
DELETE /api/partner/reviews/:reviewId/respond
```

### 2. Gestion des Horaires (Schedules)
**Frontend attend** : Système de gestion des horaires d'ouverture  
**Backend actuel** : Champ JSON `availability` dans Establishment

**Solution** : Le backend utilise déjà `availability` (JSON). Frontend doit s'adapter ou backend doit créer un modèle Schedule séparé.

### 3. Statistiques Dashboard
**Frontend attend** : `/api/partner/stats`  
**Backend actuel** : `/api/partner/dashboard` (contient déjà les stats)

**Solution** : Frontend doit utiliser `/api/partner/dashboard` au lieu de `/api/partner/stats`.

---

## ✅ Ce Qui Fonctionne Déjà

1. **Authentification** : `/api/auth/login` existe et retourne JWT
2. **Dashboard** : `/api/partner/dashboard` fournit statistiques complètes
3. **Establishments** : CRUD complet avec upload d'images
4. **Promotions** : CRUD via establishments (structure différente)
5. **Reviews** : Liste et statistiques disponibles

---

## 🛠️ Actions Correctives Requises

### Option A : Adapter le Frontend (Recommandé)

1. **Renommer les types**
   - `Listing` → `Establishment`
   - Adapter tous les imports et interfaces

2. **Ajuster les endpoints**
   ```typescript
   // Ancien
   GET /api/partner/stats
   // Nouveau
   GET /api/partner/dashboard
   ```

3. **Adapter la structure Promotion**
   ```typescript
   // Frontend doit envoyer
   {
     title: string,
     description: string,
     discount: number,
     validFrom: Date,        // au lieu de startDate
     validUntil: Date,       // au lieu de endDate
     establishmentId: string // requis
   }
   ```

4. **Gérer availability en JSON**
   ```typescript
   // Au lieu de schedules séparés, utiliser:
   availability: {
     schedule: {
       monday: { open: "09:00", close: "17:00", isOpen: true },
       tuesday: { open: "09:00", close: "17:00", isOpen: true },
       // ...
     }
   }
   ```

5. **Adapter Partner Status**
   ```typescript
   // Mapping
   const mapStatus = (backendStatus: string) => {
     switch(backendStatus) {
       case 'APPROVED': return 'active';
       case 'PENDING': return 'pending';
       default: return 'inactive';
     }
   };
   ```

### Option B : Modifier le Backend

1. **Ajouter champs Review**
   ```sql
   ALTER TABLE reviews 
   ADD COLUMN partner_response TEXT,
   ADD COLUMN partner_responded_at DATETIME;
   ```

2. **Créer endpoints de réponse aux avis**

3. **Ajouter endpoints alias**
   ```javascript
   GET /api/partner/stats → redirect to /api/partner/dashboard
   GET /api/partner/profile → return partner info
   ```

4. **Ajouter modèle Schedule** (optionnel)

---

## 📋 Plan d'Action Recommandé

### Phase 1 : Corrections Urgentes Frontend (2-3h)

1. ✅ Renommer `Listing` → `Establishment` dans types
2. ✅ Corriger tous les endpoints API
3. ✅ Adapter structure Promotion
4. ✅ Mapper Partner Status
5. ✅ Utiliser `availability` JSON pour horaires

### Phase 2 : Backend - Réponses aux Avis (1-2h)

1. Migration Prisma pour ajouter `partnerResponse`
2. Créer endpoints de réponse
3. Mise à jour controller reviews

### Phase 3 : Tests d'Intégration (1-2h)

1. Tester login → dashboard
2. Tester CRUD establishments
3. Tester promotions
4. Tester avis et réponses

---

## 📝 Notes Importantes

- **Images** : Backend utilise déjà upload multipart, compatible
- **JWT** : Compatible, token dans header Authorization
- **Validation** : Backend a sa propre validation (express-validator)
- **Roles** : Backend utilise PARTNER (uppercase), frontend 'partner' (lowercase)

---

## 🎯 Prochaines Étapes

1. Créer les fichiers de correction pour le frontend
2. Documenter les changements dans schema Prisma pour backend
3. Mettre à jour PARTNER_INTERFACE.md avec vraie structure
4. Tester l'intégration complète

**Priorité** : Corriger le frontend d'abord (Option A), puis améliorer le backend pour les fonctionnalités manquantes (Option B).
