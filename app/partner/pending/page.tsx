'use client';

import { useRouter } from 'next/navigation';
import { logout } from '@/lib/auth';

export default function PartnerPendingPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/partner/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-yellow-500">
            <svg
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Compte en attente de validation
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Votre compte partenaire est en cours de vérification par le Ministère du Tourisme et des Industries Créatives.
          </p>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Prochaines étapes
            </h3>
            <div className="mt-4 text-sm text-gray-500">
              <ul className="list-disc pl-5 space-y-2">
                <li>Un administrateur examinera votre demande sous peu</li>
                <li>Vous recevrez un email dès que votre compte sera validé</li>
                <li>Une fois validé, vous pourrez accéder à votre espace partenaire</li>
              </ul>
            </div>
            <div className="mt-5">
              <p className="text-sm text-gray-500">
                Le processus de validation prend généralement 1 à 3 jours ouvrables.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center space-y-2">
          <button
            onClick={handleLogout}
            className="font-medium text-green-600 hover:text-green-500"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}
