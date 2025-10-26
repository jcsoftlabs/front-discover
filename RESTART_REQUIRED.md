# ⚠️ Redémarrage Requis

## Configuration des Images Mise à Jour

La configuration `next.config.ts` a été modifiée pour autoriser les images externes.

**Next.js nécessite un redémarrage complet pour prendre en compte les changements de configuration.**

## 🔄 Comment Redémarrer

### Option 1 : Arrêter et redémarrer

1. Dans le terminal où `npm run dev` tourne, appuyez sur `Ctrl+C`
2. Relancez : `npm run dev`

### Option 2 : Si le port est bloqué

```bash
# Tuer le processus sur le port 3001
lsof -ti:3001 | xargs kill -9

# Redémarrer
npm run dev
```

## ✅ Vérification

Une fois redémarré, ouvrez **http://localhost:3001**

Les images devraient maintenant s'afficher correctement, y compris :
- ✅ Images depuis `https://example.com`
- ✅ Images depuis `http://localhost:3000/uploads/`
- ✅ Images Google (profiles, etc.)

## 🎨 Fallback Élégant

Si une image ne charge pas (404, erreur réseau, etc.), un emoji 🏖️ s'affichera à la place avec un fond dégradé.

## 📋 Configuration Ajoutée

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'example.com',
      pathname: '/**',
    },
    {
      protocol: 'http',
      hostname: 'localhost',
      port: '3000',
      pathname: '/uploads/**',
    },
    {
      protocol: 'https',
      hostname: '**.googleusercontent.com',
      pathname: '/**',
    },
  ],
}
```

Cette configuration permet :
- Images de test sur `example.com`
- Images uploadées sur le backend local
- Photos de profil Google

---

**Après redémarrage, supprimez ce fichier.**
