# Système d'internationalisation (i18n)

Ce projet utilise `next-intl` pour gérer les traductions multilingues.

## Langues supportées

- 🇫🇷 **Français** (fr) - Langue par défaut
- 🇺🇸 **Anglais** (en)
- 🇪🇸 **Espagnol** (es)

## Fonctionnalités

### Détection automatique de la langue
- Le site détecte automatiquement la langue du navigateur de l'utilisateur
- Si la langue du navigateur est supportée, elle est appliquée automatiquement
- Sinon, le français est utilisé par défaut

### Sélecteur de langue
- Disponible dans la barre de navigation (desktop et mobile)
- Icône de globe avec drapeau et code de langue
- Menu déroulant avec les 3 langues disponibles
- La sélection est persistée via un cookie (`NEXT_LOCALE`)

### Traductions
Toutes les traductions sont stockées dans `i18n/messages/`:
- `fr.json` - Français
- `en.json` - Anglais
- `es.json` - Espagnol

## Structure des fichiers de traduction

```json
{
  "nav": {
    "favorites": "Favoris",
    "hello": "Bonjour",
    ...
  },
  "hero": {
    "welcome": "Bienvenue en Haïti",
    "title": "Découvrez la Perle des",
    ...
  },
  ...
}
```

## Utilisation dans les composants

### Dans un composant client ('use client')

```tsx
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations();
  
  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.subtitle')}</p>
    </div>
  );
}
```

### Dans un composant serveur

```tsx
import { useTranslations } from 'next-intl';

export default async function MyServerComponent() {
  const t = await useTranslations();
  
  return (
    <div>
      <h1>{t('hero.title')}</h1>
    </div>
  );
}
```

## Ajouter une nouvelle langue

1. Créer un nouveau fichier dans `i18n/messages/` (ex: `de.json` pour l'allemand)
2. Copier la structure de `fr.json` et traduire les textes
3. Ajouter la langue dans `i18n/request.ts`:
   ```ts
   export const locales = ['fr', 'en', 'es', 'de'] as const;
   ```
4. Ajouter la langue dans `components/ui/LanguageSwitcher.tsx`:
   ```ts
   const languages = [
     { code: 'fr', name: 'Français', flag: '🇫🇷' },
     { code: 'en', name: 'English', flag: '🇺🇸' },
     { code: 'es', name: 'Español', flag: '🇪🇸' },
     { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
   ];
   ```
5. Ajouter la langue dans `lib/useAutoDetectLocale.ts`:
   ```ts
   const supportedLocales = ['fr', 'en', 'es', 'de'];
   ```

## Ajouter de nouvelles traductions

Pour ajouter une nouvelle clé de traduction:

1. Ajouter la clé dans les 3 fichiers JSON (`fr.json`, `en.json`, `es.json`)
2. Utiliser la clé dans votre composant avec `t('votre.nouvelle.cle')`

Exemple:
```json
// Dans fr.json, en.json, es.json
{
  "common": {
    "loading": "Chargement..." // FR
    "loading": "Loading..." // EN
    "loading": "Cargando..." // ES
  }
}
```

```tsx
// Dans votre composant
{isLoading && <p>{t('common.loading')}</p>}
```

## Configuration technique

### next.config.ts
Le fichier `next.config.ts` utilise le plugin `next-intl`:
```ts
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');
export default withNextIntl(nextConfig);
```

### i18n/request.ts
Configuration de next-intl avec récupération de la locale depuis les cookies:
```ts
import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'fr';
  
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
```

## Corrections apportées

### Chevauchement mobile
Le problème de chevauchement entre le logo et le texte "Bienvenue en Haïti" a été corrigé avec:
- Réduction du padding horizontal sur mobile (`px-4 sm:px-6`)
- Réduction de la taille de police sur mobile (`text-xs sm:text-sm`)
- Ajustement de la taille du titre principal (`text-4xl sm:text-5xl md:text-7xl`)
- Ajout de padding horizontal et text-center pour le texte du sous-titre
