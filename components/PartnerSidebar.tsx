'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Partner } from '@/types';

interface PartnerSidebarProps {
  user: User | Partner;
  onLogout: () => void;
}

interface MenuItem {
  icon: string;
  label: string;
  href: string;
  badge?: number;
}

export default function PartnerSidebar({ user, onLogout }: PartnerSidebarProps) {
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    { icon: '📊', label: 'Dashboard', href: '/partner/dashboard' },
    { icon: '🏨', label: 'Mes Établissements', href: '/partner/establishments' },
    { icon: '🎉', label: 'Mes Événements', href: '/partner/events' },
    { icon: '🎁', label: 'Promotions', href: '/partner/promotions' },
    { icon: '⭐', label: 'Avis Reçus', href: '/partner/reviews' },
    { icon: '📈', label: 'Statistiques', href: '/partner/statistics' },
    { icon: '👤', label: 'Mon Profil', href: '/partner/profile' },
  ];

  const isActive = (href: string) => {
    if (href === '/partner/dashboard') {
      return pathname === '/partner/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-green-900 to-green-800 text-white">
      {/* Header */}
      <div className="p-6 border-b border-green-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-3xl">🏨</div>
          <div>
            <h1 className="font-bold text-lg">Touris Haiti</h1>
            <p className="text-xs text-green-200">Espace Partenaire</p>
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
                  ? 'bg-green-700 shadow-lg'
                  : 'hover:bg-green-800/50'
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

        {/* Quick Actions */}
        <div className="mt-6 px-4 space-y-2">
          <p className="text-xs text-green-300 font-semibold mb-2 uppercase">Actions Rapides</p>
          <Link
            href="/partner/establishments/new"
            className="flex items-center gap-2 px-3 py-2 bg-green-700 hover:bg-green-600 rounded-lg text-sm transition-colors"
          >
            <span>➕</span>
            <span>Nouvel Établissement</span>
          </Link>
          <Link
            href="/partner/events/new"
            className="flex items-center gap-2 px-3 py-2 bg-green-700 hover:bg-green-600 rounded-lg text-sm transition-colors"
          >
            <span>🎉</span>
            <span>Nouvel Événement</span>
          </Link>
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-green-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center font-semibold">
            {('name' in user) 
              ? user.name.split(' ').map(n => n.charAt(0)).slice(0, 2).join('')
              : `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {('name' in user) ? user.name : `${user.firstName} ${user.lastName}`}
            </p>
            <p className="text-xs text-green-200 truncate">{user.email}</p>
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
