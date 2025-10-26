'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import PartnerSidebar from '@/components/PartnerSidebar';

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Pages publiques qui n'ont pas besoin d'authentification
  const publicPages = ['/partner/login', '/partner/register', '/partner/pending'];
  const isPublicPage = publicPages.includes(pathname);

  // Si page publique, afficher sans vérification
  if (isPublicPage) {
    return <>{children}</>;
  }

  // Pour les pages protégées, vérifier l'authentification
  const { user, loading, logout } = useAuth('PARTNER');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0">
        <PartnerSidebar user={user} onLogout={logout} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
