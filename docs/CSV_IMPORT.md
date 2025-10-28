# Import CSV - Documentation

## Vue d'ensemble

La fonctionnalité d'import CSV permet aux administrateurs et partenaires d'importer plusieurs établissements ou sites touristiques à la fois depuis un fichier CSV.

## Fonctionnalités

### Backend

**Endpoints API:**
- `POST /api/establishments/import-csv` - Importer des établissements (PARTNER ou ADMIN)
- `POST /api/sites/import-csv` - Importer des sites touristiques (ADMIN uniquement)

**Caractéristiques:**
- Parsing CSV avec validation ligne par ligne
- Gestion des erreurs détaillée
- Rapport d'import complet (succès/échecs)
- Support des images multiples (URLs séparées par `|`)
- Nettoyage automatique des fichiers temporaires

### Frontend

**Pages d'import:**
- `/admin/establishments/import` - Import pour administrateurs (établissements)
- `/admin/sites/import` - Import pour administrateurs (sites)
- `/partner/establishments/import` - Import pour partenaires (établissements)

**Composant réutilisable:**
- `CSVImporter` - Composant React avec upload, preview et rapport d'import

## Format CSV

### Établissements

**Champs obligatoires:**
- `name` - Nom de l'établissement
- `type` - Type (HOTEL, RESTAURANT, BAR, CAFE, ATTRACTION, SHOP, SERVICE)
- `price` - Prix (nombre décimal)

**Champs optionnels:**
- `description` - Description
- `images` - URLs des images (séparées par `|`)
- `address` - Adresse
- `ville` - Ville
- `departement` - Département
- `latitude` - Coordonnée GPS (nombre décimal)
- `longitude` - Coordonnée GPS (nombre décimal)
- `partnerId` - ID du partenaire (CUID) - **Optionnel: laissez vide si l'établissement n'est pas lié à un partenaire**

**Exemple:**
```csv
name,description,type,price,images,address,ville,departement,latitude,longitude,partnerId
Hotel Luxe Paris,Un hôtel 5 étoiles,HOTEL,250.00,https://example.com/img1.jpg|https://example.com/img2.jpg,123 Rue de Rivoli,Paris,Paris,48.8566,2.3522,
Restaurant Le Gourmet,Restaurant gastronomique,RESTAURANT,75.50,,45 Quai de la Seine,Paris,Paris,48.8584,2.3488,
```

**Note:** Le `partnerId` doit être laissé vide (dernière colonne vide) si l'établissement n'est pas lié à un partenaire spécifique. Si fourni, le système vérifiera que le partenaire existe dans la base de données.

### Sites Touristiques

**Champs obligatoires:**
- `name` - Nom du site
- `address` - Adresse complète
- `latitude` - Coordonnée GPS (-90 à 90)
- `longitude` - Coordonnée GPS (-180 à 180)

**Champs optionnels:**
- `description` - Description
- `ville` - Ville
- `departement` - Département
- `images` - URLs des images (séparées par `|`)

**Exemple:**
```csv
name,description,address,ville,departement,latitude,longitude,images
Tour Eiffel,Monument emblématique de Paris,Champ de Mars,Paris,Paris,48.8584,2.2945,https://example.com/eiffel.jpg
Sacré-Cœur,Basilique au sommet de Montmartre,35 Rue du Chevalier de la Barre,Paris,Paris,48.8867,2.3431,https://example.com/sacre-coeur.jpg|https://example.com/sacre-coeur2.jpg
```

## Modèles CSV

Les modèles CSV sont disponibles en téléchargement sur les pages d'import:
- `/templates/establishments-template.csv`
- `/templates/sites-template.csv`

## Utilisation

### Pour les Administrateurs

1. Naviguer vers "Gestion des établissements" ou "Sites touristiques"
2. Cliquer sur le bouton "Import CSV" (vert)
3. Télécharger le modèle CSV
4. Remplir le fichier avec vos données
5. Uploader le fichier
6. Vérifier le rapport d'import

### Pour les Partenaires

1. Naviguer vers "Mes Établissements"
2. Cliquer sur le bouton "Import CSV" (bleu)
3. Suivre les mêmes étapes que les administrateurs

## Validation

### Backend

- **Champs obligatoires:** Vérifie la présence de tous les champs requis
- **Format des données:** Valide les types (nombres, coordonnées GPS)
- **Relations:** Vérifie l'existence des entités liées (partnerId)
- **Coordonnées GPS:** Valide les plages (-90/90 pour latitude, -180/180 pour longitude)

### Frontend

- **Type de fichier:** Accepte uniquement les fichiers `.csv`
- **Taille:** Maximum 10 MB
- **Format:** Affiche des erreurs si le format est invalide

## Réponse API

```json
{
  "success": true,
  "message": "Import terminé: 2 établissements créés, 1 erreurs",
  "data": {
    "created": [
      {
        "line": 2,
        "success": true,
        "id": "clxxx...",
        "name": "Hotel Luxe Paris"
      }
    ],
    "errors": [
      {
        "line": 3,
        "error": "Champs obligatoires manquants (name, type, price)",
        "data": { ... }
      }
    ],
    "summary": {
      "total": 3,
      "success": 2,
      "failed": 1
    }
  }
}
```

## Gestion des erreurs

### Erreurs courantes

1. **Fichier CSV manquant:** Status 400
2. **Champs obligatoires manquants:** Ligne ignorée, ajoutée aux erreurs
3. **Partenaire introuvable:** Ligne ignorée (si partnerId fourni mais n'existe pas)
4. **Coordonnées GPS invalides:** Ligne ignorée
5. **Type d'établissement invalide:** Ligne ignorée
6. **Erreur base de données:** Ligne ignorée, erreur enregistrée

### Comportement

- Les lignes avec erreurs sont **ignorées** (pas d'arrêt complet)
- Les lignes valides sont **toujours créées**
- Un rapport détaillé est retourné avec toutes les erreurs

## Sécurité

- **Authentification:** JWT token requis
- **Autorisation:** Role-based (ADMIN, PARTNER)
- **Nettoyage:** Fichiers temporaires supprimés automatiquement
- **Validation:** Toutes les entrées sont validées et sanitizées

## Performances

- **Taille maximum:** 10 MB par fichier
- **Processing:** Asynchrone avec stream
- **Timeout:** Géré par le serveur
- **Optimisation:** Traitement ligne par ligne pour économiser la mémoire

## Dépendances

### Backend
- `csv-parser` - Parsing des fichiers CSV
- `multer` - Upload de fichiers
- `prisma` - ORM pour la base de données

### Frontend
- `react` - Framework UI
- `next.js` - Framework React
- `lucide-react` - Icônes
- UI components from `@/components/ui`

## Fichiers Modifiés/Créés

### Backend
- `src/controllers/establishmentsController.js` - Méthode `importFromCSV`
- `src/controllers/sitesController.js` - Méthode `importFromCSV`
- `src/middleware/upload.js` - Middleware `uploadCSV`
- `src/routes/establishments.js` - Route `/import-csv`
- `src/routes/sites.js` - Route `/import-csv`
- `public/templates/*.csv` - Modèles CSV

### Frontend
- `components/CSVImporter.tsx` - Composant d'import
- `app/admin/establishments/import/page.tsx` - Page admin établissements
- `app/admin/sites/import/page.tsx` - Page admin sites
- `app/partner/establishments/import/page.tsx` - Page partner
- `public/templates/*.csv` - Modèles CSV copiés

## Support

Pour toute question ou problème:
1. Vérifier que le format CSV est correct
2. Vérifier les logs du serveur pour les erreurs détaillées
3. Consulter le rapport d'import pour les détails des échecs
