'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Construction, ArrowLeft, RefreshCcw } from 'lucide-react';

export default function NotFound() {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = '/';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-primary-500 p-6 flex items-center justify-center">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 relative"
          >
            <Construction className="w-24 h-24 text-white opacity-20 absolute" />
            <RefreshCcw className="w-12 h-12 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </motion.div>
        </div>
        
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Page en construction</h1>
          <p className="text-gray-600 mb-6">
            Cette fonctionnalité est actuellement en cours de développement dans notre version bêta. 
            Nous travaillons activement pour la rendre disponible très prochainement.
          </p>
          
          <div className="bg-primary-50 border border-primary-100 rounded-lg p-4 mb-6">
            <h2 className="text-sm font-medium text-primary-700 mb-2">À propos de cette démo</h2>
            <p className="text-sm text-primary-600">
              Innovac&apos;tool est une démonstration des possibilités offertes par la mutualisation des données 
              et l&apos;intelligence artificielle pour les cabinets d&apos;expertise comptable.
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-primary-600 hover:text-primary-800 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span>Retour à l&apos;accueil</span>
            </Link>
            
            <div className="text-sm text-gray-500">
              Redirection automatique dans <span className="font-medium">{countdown}s</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          © 2024 Innovac&apos;tool - Démonstration pour mémoire d&apos;expertise comptable
        </p>
      </div>
    </div>
  );
} 