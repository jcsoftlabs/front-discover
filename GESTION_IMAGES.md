# 🖼️ Gestion des Images - Documentation

## Problème résolu

Le problème d'affichage des images (point d'interrogation bleu) est causé par:
1. **Chemins de fichiers locaux** au lieu d'URLs HTTP
2. **Domaines externes non autorisés** dans Next.js
3. **Images manquantes** ou chemins incorrects

## Solution implémentée

### Composant `EstablishmentImage`

Un composant réutilisable qui gère automatiquement:
- ✅ Conversion des chemins locaux en URLs
- ✅ Fallback vers une icône si l'image n'existe pas
- ✅ Gestion des erreurs de chargement
- ✅ Lazy loading pour la performance

### Utilisation

```tsx
import EstablishmentImage from '@/components/EstablishmentImage';

<EstablishmentImage
  src={establishment.images?.[0]}
  alt={establishment.name}
  fallbackIcon="🏢"
  className="w-full h-48 object-cover"
/>
```

## Formats d'images supportés

Le composant gère automatiquement ces types de chemins:

### 1. Chemins relatifs (backend)
```
uploads/establishments/image.jpg
./uploads/establishments/image.jpg
/uploads/establishments/image.jpg
```
→ Converti en: `http://localhost:3000/uploads/establishments/image.jpg`

### 2. URLs complètes
```
http://localhost:3000/uploads/establishments/image.jpg
https://example.com/image.jpg
```
→ Utilisé tel quel

### 3. URLs de CDN
```
https://cloudinary.com/...
https://s3.amazonaws.com/...
```
→ Utilisé tel quel

## Configuration du backend

Pour que les images fonctionnent, le backend doit:

### 1. Servir les fichiers statiques

Dans `server-simple.js` ou `server.js`:

```javascript
const express = require('express');
const path = require('path');
const app = express();

// Servir les fichiers uploadés
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```

### 2. Structure des dossiers

```
listing-backend/
├── uploads/
│   ├── establishments/
│   │   ├── image1.jpg
│   │   └── image2.jpg
│   ├── sites/
│   └── partners/
└── server.js
```

### 3. Stocker les chemins dans la base

Les images doivent être stockées comme:
```javascript
// ✅ Bon
images: ['uploads/establishments/hotel1.jpg']

// ✅ Bon aussi
images: ['http://localhost:3000/uploads/establishments/hotel1.jpg']

// ❌ Mauvais (chemin absolu local)
images: ['/Users/chris/listing-backend/uploads/hotel1.jpg']
```

## Test rapide

### Vérifier si les images sont accessibles

```bash
# Backend doit être lancé sur port 3000
curl -I http://localhost:3000/uploads/establishments/image.jpg
```

Devrait retourner `200 OK` et pas `404 Not Found`

### Vérifier les chemins dans la base

```sql
-- Voir les images d'un établissement
SELECT id, name, images FROM establishments LIMIT 5;
```

Les images doivent être au format:
```json
["uploads/establishments/image1.jpg", "uploads/establishments/image2.jpg"]
```

## Fallback Icons

Le composant utilise des emojis comme fallback:

| Type | Icon |
|------|------|
| Établissement par défaut | 🏢 |
| Hôtel | 🏨 |
| Restaurant | 🍽️ |
| Site touristique | 🏛️ |
| Parc | 🌳 |
| Plage | 🏖️ |
| Monument | 🗿 |

### Personnaliser le fallback

```tsx
<EstablishmentImage
  src={undefined}
  alt="Hotel Paradise"
  fallbackIcon="🏨" // ← Icône personnalisée
/>
```

## Troubleshooting

### L'image ne s'affiche toujours pas

1. **Vérifiez la console navigateur** (F12)
   - Regardez les erreurs de chargement d'images
   - Vérifiez l'URL complète de l'image

2. **Testez l'URL directement**
   ```
   http://localhost:3000/uploads/establishments/image.jpg
   ```

3. **Vérifiez les permissions**
   ```bash
   cd listing-backend
   ls -la uploads/establishments/
   ```
   Les fichiers doivent être lisibles

4. **Vérifiez le chemin dans la base**
   ```javascript
   console.log('Image path:', establishment.images[0]);
   ```

### CORS errors

Si vous voyez des erreurs CORS, ajoutez dans le backend:

```javascript
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000'],
  credentials: true
}));
```

## Optimisations futures

### 1. Next.js Image Component

Pour de meilleures performances:

```tsx
import Image from 'next/image';

<Image
  src={imageUrl}
  alt={alt}
  width={400}
  height={300}
  className="w-full h-48 object-cover"
/>
```

Nécessite la configuration dans `next.config.js`:

```javascript
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
    ],
  },
};
```

### 2. Upload d'images

Pour permettre l'upload depuis l'admin:

```javascript
// Backend
const multer = require('multer');

const storage = multer.diskStorage({
  destination: 'uploads/establishments/',
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

app.post('/api/admin/upload', upload.single('image'), (req, res) => {
  res.json({ 
    success: true, 
    path: req.file.path 
  });
});
```

### 3. CDN / Cloud Storage

Pour la production, utilisez:
- **Cloudinary** (recommandé)
- **AWS S3**
- **Google Cloud Storage**

## Support

Pour tout problème d'images:
1. Vérifiez que le backend sert les fichiers statiques
2. Testez l'URL d'image directement dans le navigateur
3. Vérifiez les logs de la console navigateur
4. Assurez-vous que les chemins dans la base sont corrects
