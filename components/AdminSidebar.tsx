'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from '@/types';

interface AdminSidebarProps {
  user: User;
  onLogout: () => void;
}

interface MenuItem {
  icon: string;
  label: string;
  href: string;
  badge?: number;
}

export default function AdminSidebar({ user, onLogout }: AdminSidebarProps) {
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    { icon: '📊', label: 'Dashboard', href: '/admin' },
    { icon: '👥', label: 'Utilisateurs', href: '/admin/users' },
    { icon: '🏢', label: 'Partenaires', href: '/admin/partners' },
    { icon: '🏨', label: 'Établissements', href: '/admin/establishments' },
    { icon: '🏛️', label: 'Sites Touristiques', href: '/admin/sites' },
    { icon: '🎉', label: 'Événements', href: '/admin/events' },
    { icon: '⭐', label: 'Avis', href: '/admin/reviews' },
    { icon: '🎁', label: 'Promotions', href: '/admin/promotions' },
    { icon: '🔐', label: 'Administrateurs', href: '/admin/administrators' },
    { icon: '📈', label: 'Statistiques', href: '/admin/statistics' },
    { icon: '⚙️', label: 'Configuration', href: '/admin/settings' },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-blue-900 to-blue-800 text-white">
      {/* Header */}
      <div className="p-6 border-b border-blue-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-3xl">🏛️</div>
          <div>
            <h1 className="font-bold text-lg">Touris Haiti</h1>
            <p className="text-xs text-blue-200">Administration</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive(item.href)
                  ? 'bg-blue-700 shadow-lg'
                  : 'hover:bg-blue-800/50'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-blue-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center font-semibold">
            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-blue-200 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
        >
          🚪 Déconnexion
        </button>
      </div>
    </div>
  );
}
