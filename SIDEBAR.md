# 📐 Menu Latéral (Sidebar) - Documentation

## Vue d'ensemble

Des menus latéraux modernes et intuitifs ont été ajoutés aux dashboards Admin et Partenaire.

## Fonctionnalités

### ✨ Design
- **Sidebar fixe** sur le côté gauche
- **Largeur**: 256px (w-64)
- **Hauteur**: Pleine hauteur de l'écran
- **Scroll**: Navigation scrollable si nécessaire
- **Couleurs**: 
  - Admin: Dégradé bleu (blue-900 → blue-800)
  - Partenaire: Dégradé vert (green-900 → green-800)

### 🎯 Composants

#### AdminSidebar (`components/AdminSidebar.tsx`)
Menu pour les administrateurs avec:
- 📊 Dashboard
- 👥 Utilisateurs
- 🏢 Partenaires
- 🏨 Établissements
- 🏛️ Sites Touristiques
- ⭐ Avis
- 🎁 Promotions
- 🔐 Administrateurs
- 📈 Statistiques
- ⚙️ Configuration

#### PartnerSidebar (`components/PartnerSidebar.tsx`)
Menu pour les partenaires avec:
- 📊 Dashboard
- 🏨 Mes Établissements
- 🎁 Promotions
- ⭐ Avis Reçus
- 📈 Statistiques
- 👤 Mon Profil
- **Action rapide**: Bouton "Nouvel Établissement"

## Caractéristiques

### 🎨 Indicateur de page active
La page courante est mise en évidence avec:
- Fond plus foncé
- Ombre portée (shadow-lg)
- Transition fluide

```tsx
// Page active
className="bg-blue-700 shadow-lg"

// Page inactive
className="hover:bg-blue-800/50"
```

### 👤 Section utilisateur
En bas de la sidebar:
- **Avatar** avec initiales (ex: JD pour John Doe)
- **Nom complet** de l'utilisateur
- **Email** de l'utilisateur
- **Bouton déconnexion** rouge

### 📱 Responsive
- **Desktop**: Sidebar visible (256px)
- **Mobile**: À implémenter (bouton hamburger)

## Structure HTML

```html
<div class="flex h-screen">
  <!-- Sidebar -->
  <aside class="w-64">
    <AdminSidebar />
  </aside>
  
  <!-- Contenu principal -->
  <main class="flex-1 overflow-y-auto">
    {children}
  </main>
</div>
```

## Layout modifié

### Admin (`app/admin/layout.tsx`)
```tsx
return (
  <div className="flex h-screen overflow-hidden bg-gray-50">
    <aside className="w-64 flex-shrink-0">
      <AdminSidebar user={user} onLogout={logout} />
    </aside>
    <main className="flex-1 overflow-y-auto">
      {children}
    </main>
  </div>
);
```

### Partner (`app/partner/layout.tsx`)
```tsx
return (
  <div className="flex h-screen overflow-hidden bg-gray-50">
    <aside className="w-64 flex-shrink-0">
      <PartnerSidebar user={user} onLogout={logout} />
    </aside>
    <main className="flex-1 overflow-y-auto">
      {children}
    </main>
  </div>
);
```

## Navigation

### Détection de la page active

```tsx
const isActive = (href: string) => {
  if (href === '/admin') {
    return pathname === '/admin';
  }
  return pathname.startsWith(href);
};
```

Utilise `usePathname()` de Next.js pour détecter la route actuelle.

## Personnalisation

### Changer les icônes

```tsx
const menuItems: MenuItem[] = [
  { icon: '📊', label: 'Dashboard', href: '/admin' },
  { icon: '🎨', label: 'Nouveau', href: '/admin/new' }, // ← Nouvelle icône
];
```

### Ajouter un badge de notification

```tsx
{ 
  icon: '⭐', 
  label: 'Avis', 
  href: '/admin/reviews',
  badge: 5 // ← Nombre en rouge
}
```

Le badge s'affiche automatiquement:
```html
<span class="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
  5
</span>
```

### Changer les couleurs

Pour un nouveau rôle (ex: Modérateur en orange):

```tsx
// ModeratorSidebar.tsx
<div className="flex flex-col h-full bg-gradient-to-b from-orange-900 to-orange-800 text-white">
  {/* ... */}
</div>
```

## Améliorations futures

### Version mobile
Ajouter un bouton hamburger pour afficher/masquer la sidebar:

```tsx
const [sidebarOpen, setSidebarOpen] = useState(false);

// Bouton mobile
<button onClick={() => setSidebarOpen(!sidebarOpen)}>
  ☰
</button>

// Sidebar avec condition
{sidebarOpen && (
  <aside className="fixed inset-0 z-50 lg:relative lg:z-0">
    <Sidebar />
  </aside>
)}
```

### Badges dynamiques
Récupérer les badges depuis l'API:

```tsx
const [badges, setBadges] = useState({ reviews: 0, partners: 0 });

useEffect(() => {
  apiClient.get('/admin/badges').then(res => {
    setBadges(res.data.data);
  });
}, []);
```

### Sidebar pliable
Permettre de réduire la sidebar à juste des icônes:

```tsx
const [collapsed, setCollapsed] = useState(false);

<aside className={collapsed ? 'w-16' : 'w-64'}>
  {/* Afficher juste les icônes si collapsed */}
</aside>
```

## Avantages

✅ **Navigation rapide** - Tous les modules accessibles en un clic  
✅ **Visibilité** - L'utilisateur sait toujours où il se trouve  
✅ **Espace** - Plus d'espace pour le contenu principal  
✅ **UX moderne** - Design professionnel et élégant  
✅ **Branding** - Logo et titre visibles en permanence  
✅ **Profil** - Infos utilisateur toujours accessibles  

## Avant / Après

### Avant
```
┌─────────────────────────────────┐
│  Nav horizontale + contenu      │
└─────────────────────────────────┘
```

### Après
```
┌──────┬──────────────────────────┐
│      │                          │
│ Side │     Contenu principal    │
│ bar  │                          │
│      │                          │
└──────┴──────────────────────────┘
```

Beaucoup plus professionnel et intuitif! 🎨
