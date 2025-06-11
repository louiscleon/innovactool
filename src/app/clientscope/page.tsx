"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientScopeRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Rediriger vers le tableau de bord
    router.replace('/modules/pilotview');
  }, [router]);

  return (
    <div className="p-8 flex flex-col items-center justify-center">
      <h1 className="text-xl font-semibold mb-4">Redirection...</h1>
      <p className="text-gray-600">
        Le module Profil client a été fusionné avec le tableau de bord.
        Vous allez être redirigé automatiquement.
      </p>
    </div>
  );
} 