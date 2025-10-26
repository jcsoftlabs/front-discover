# 📄 Titres de Pages - Documentation

## Système implémenté

Tous les titres de pages suivent maintenant le format:
```
[Nom de la Page] | Discover Haiti
```

## Configuration

### Layout racine (`app/layout.tsx`)
```typescript
export const metadata: Metadata = {
  title: {
    template: '%s | Discover Haiti',
    default: 'Discover Haiti - Tourisme en Haïti',
  },
  description: 'Découvrez les merveilles d\'Haïti...',
};
```

### Hook personnalisé (`hooks/usePageTitle.ts`)
```typescript
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} | Discover Haiti`;
  }, [title]);
}
```

## Titres par page

### Pages admin
| Route | Titre |
|-------|-------|
| `/admin` | Dashboard Administrateur \| Discover Haiti |
| `/admin/users` | Gestion des Utilisateurs \| Discover Haiti |
| `/admin/partners` | Gestion des Partenaires \| Discover Haiti |
| `/admin/establishments` | Gestion des Établissements \| Discover Haiti |
| `/admin/sites` | Sites Touristiques \| Discover Haiti |
| `/admin/reviews` | Modération des Avis \| Discover Haiti |
| `/admin/promotions` | Gestion des Promotions \| Discover Haiti |
| `/admin/administrators` | Gestion des Administrateurs \| Discover Haiti |
| `/admin/statistics` | Statistiques Détaillées \| Discover Haiti |
| `/admin/settings` | Configuration Système \| Discover Haiti |

### Autres pages
| Route | Titre |
|-------|-------|
| `/login` | Connexion \| Discover Haiti |
| `/` | Discover Haiti - Tourisme en Haïti |

## Ajouter un titre à une nouvelle page

Pour ajouter un titre dynamique à une nouvelle page:

```tsx
'use client';

import { usePageTitle } from '@/hooks/usePageTitle';

export default function MaNouvellePage() {
  usePageTitle('Ma Nouvelle Page');
  
  return (
    <div>
      {/* Contenu de la page */}
    </div>
  );
}
```

## SEO et métadonnées

Le système supporte également:
- **Description**: Description du site pour les moteurs de recherche
- **Keywords**: Mots-clés pour le SEO
- **Template**: Suffixe automatique "| Discover Haiti"

### Personnaliser pour une page spécifique

Pour les pages Server Component (sans 'use client'), vous pouvez exporter des métadonnées:

```tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ma Page Spéciale',
  description: 'Description personnalisée',
};

export default function MaPage() {
  return <div>Contenu</div>;
}
```

Le titre sera automatiquement: `Ma Page Spéciale | Discover Haiti`

## Avantages du système

✅ **Cohérence**: Tous les titres suivent le même format  
✅ **SEO**: Meilleur référencement avec des titres descriptifs  
✅ **UX**: L'utilisateur sait toujours où il se trouve  
✅ **Branding**: "Discover Haiti" apparaît sur tous les onglets  
✅ **Facilité**: Simple hook réutilisable  

## Onglets du navigateur

Avant:
```
Create Next App
```

Après:
```
Dashboard Administrateur | Discover Haiti
Gestion des Utilisateurs | Discover Haiti
Connexion | Discover Haiti
```

Beaucoup plus professionnel! 🎯
