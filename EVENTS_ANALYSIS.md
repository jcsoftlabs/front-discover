# Analyse - Fonctionnalité Événements

## 📋 État Actuel

### Backend (listing-backend)
**❌ NON IMPLÉMENTÉ**

La base de données **NE contient PAS** de table `Events` ou `Événements`.

**Tables existantes** :
1. ✅ `users` - Utilisateurs
2. ✅ `partners` - Partenaires commerciaux
3. ✅ `establishments` - Établissements (hôtels, restaurants, etc.)
4. ✅ `sites` - Sites touristiques (monuments, parcs, plages, etc.)
5. ✅ `reviews` - Avis des utilisateurs
6. ✅ `promotions` - Promotions/offres spéciales

**Source** : `/Users/christopherjerome/listing-backend/create-tables-only.sql`

### Frontend (front-discover)
**❌ NON IMPLÉMENTÉ**

Aucune interface ou route pour les événements :
- ❌ Pas de page `/admin/events`
- ❌ Pas de page `/partner/events`
- ❌ Pas de type TypeScript `Event`
- ❌ Pas de composant lié aux événements

---

## 🎯 Comment Créer des Événements ?

### Option 1 : Ajouter une Table Events (Recommandé)

Si vous voulez une **fonctionnalité événements complète**, il faudrait :

#### A. Backend
1. **Créer la table `events` dans MySQL** :
```sql
CREATE TABLE events (
    id VARCHAR(191) NOT NULL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    address VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    start_date DATETIME(3) NOT NULL,
    end_date DATETIME(3) NOT NULL,
    images JSON,
    price DECIMAL(10, 2),
    category ENUM('CONCERT', 'FESTIVAL', 'CONFERENCE', 'SPORT', 'EXHIBITION', 'CULTURAL', 'OTHER'),
    max_capacity INT,
    is_active BOOLEAN DEFAULT true,
    organizer_id VARCHAR(191),
    created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    FOREIGN KEY (organizer_id) REFERENCES partners(id) ON DELETE CASCADE
);
```

2. **Créer les routes API** (`src/routes/events.js`) :
   - `GET /api/events` - Liste des événements
   - `GET /api/events/:id` - Détails d'un événement
   - `POST /api/events` - Créer un événement (admin/partner)
   - `PUT /api/events/:id` - Modifier un événement
   - `DELETE /api/events/:id` - Supprimer un événement

3. **Créer le contrôleur** (`src/controllers/eventsController.js`)

4. **Ajouter la validation** (`src/middleware/validation.js`)

#### B. Frontend

1. **Ajouter le type TypeScript** (`types/index.ts`) :
```typescript
export interface Event {
  id: string;
  title: string;
  description?: string;
  location?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  startDate: string;
  endDate: string;
  images?: string[];
  price?: number;
  category: 'CONCERT' | 'FESTIVAL' | 'CONFERENCE' | 'SPORT' | 'EXHIBITION' | 'CULTURAL' | 'OTHER';
  maxCapacity?: number;
  isActive: boolean;
  organizerId?: string;
  createdAt: string;
  updatedAt: string;
  // Relations
  organizer?: Partner;
}
```

2. **Créer les pages admin** :
   - `/app/admin/events/page.tsx` - Liste des événements
   - `/app/admin/events/new/page.tsx` - Créer un événement
   - `/app/admin/events/[id]/page.tsx` - Détails
   - `/app/admin/events/[id]/edit/page.tsx` - Modifier

3. **Créer les pages partner** :
   - `/app/partner/events/page.tsx` - Mes événements
   - `/app/partner/events/new/page.tsx` - Créer un événement
   - `/app/partner/events/[id]/page.tsx` - Détails
   - `/app/partner/events/[id]/edit/page.tsx` - Modifier

4. **Créer les pages publiques** :
   - `/app/events/page.tsx` - Liste publique des événements
   - `/app/events/[id]/page.tsx` - Page de détail d'un événement

---

### Option 2 : Utiliser les Promotions (Workaround)

Si vous voulez créer des événements **temporairement** sans modifier la base de données :

**Utiliser la table `promotions` existante** pour des "événements-promotions" :
- Le champ `title` = nom de l'événement
- Le champ `description` = description de l'événement
- Le champ `valid_from` = date de début
- Le champ `valid_until` = date de fin
- Le champ `discount` = prix (ou 0 si gratuit)

**Avantages** :
✅ Pas de modification de la base de données
✅ Interface déjà existante dans le frontend
✅ Fonctionne immédiatement

**Inconvénients** :
❌ Pas de champ spécifique pour la localisation
❌ Pas de catégorie d'événement
❌ Pas de capacité maximale
❌ Limité aux établissements (pas d'événements indépendants)

---

### Option 3 : Utiliser les Sites (Workaround alternatif)

Utiliser la table `sites` pour créer des "événements-sites" :
- Utiliser le champ `category` avec `ENTERTAINMENT`
- Le champ `description` pour les détails de l'événement
- Les champs `latitude`/`longitude` pour la localisation

**Avantages** :
✅ Géolocalisation incluse
✅ Catégorisation existante
✅ Formulaires déjà disponibles

**Inconvénients** :
❌ Pas de date de début/fin
❌ Pas de capacité
❌ Conçu pour des lieux permanents, pas des événements temporaires

---

## 🎯 Recommandation

### Pour une solution **professionnelle et complète** :
➡️ **Option 1** : Implémenter une vraie table Events avec toutes les fonctionnalités

**Temps estimé** : 4-6 heures
- Backend : 2-3 heures (table, routes, contrôleur, validation)
- Frontend : 2-3 heures (types, pages admin/partner, formulaires)

### Pour une solution **rapide** (temporaire) :
➡️ **Option 2** : Utiliser les Promotions en attendant

**Disponible** : Immédiatement
- Interface déjà en place
- Aucune modification nécessaire

---

## 📝 Si vous choisissez l'Option 1 (recommandé)

Je peux implémenter la fonctionnalité complète des événements en créant :

**Backend** :
1. ✅ Script SQL pour créer la table `events`
2. ✅ Routes API CRUD complètes
3. ✅ Contrôleur avec validation
4. ✅ Upload d'images via Cloudinary
5. ✅ Filtres (par date, catégorie, localisation)

**Frontend** :
1. ✅ Type TypeScript `Event`
2. ✅ Pages admin (liste, création, édition)
3. ✅ Pages partner (gestion de leurs événements)
4. ✅ Pages publiques (calendrier, détails)
5. ✅ Formulaires avec validation Zod
6. ✅ Composants réutilisables (sélecteur de date, carte, etc.)

**Voulez-vous que j'implémente cette fonctionnalité complète ?**
