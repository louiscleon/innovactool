import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronRight, Bell, User, ChevronUp, ChevronDown, LogOut, Settings } from 'lucide-react';
import Link from 'next/link';
import { useClient } from './ClientContext';
import { InfoTooltip } from './Tooltip';

// Mapping des chemins aux noms affichables
const pathNameMap: Record<string, string> = {
  '/': 'Accueil',
  '/modules': 'Modules',
  '/modules/data-guardian': 'Protecteur de données',
  '/modules/pilotview': 'Tableau de bord',
  '/modules/cpa-copilot': 'Assistant Conseil',
  '/modules/reviewmaster-ai': 'Agent de révision',
  '/modules/forecaster': 'Prévisionniste',
  '/modules/stack-technique': 'Stack Technique',
};

// Mapping des chemins aux descriptions
const pathDescriptionMap: Record<string, string> = {
  '/': 'Bienvenue sur Innovac\'tool, plateforme agentique pour experts-comptables',
  '/modules/data-guardian': 'Protection et conformité des données clients',
  '/modules/pilotview': 'Visualisation des KPIs et gestion du portefeuille client',
  '/modules/cpa-copilot': 'Assistant IA pour le conseil expert',
  '/modules/reviewmaster-ai': 'Détection des anomalies et revue des comptes',
  '/modules/forecaster': 'Projections et scénarios d\'affaires',
  '/modules/stack-technique': 'Architecture technique du démonstrateur',
};

interface MainNavigationProps {
  className?: string;
}

export function MainNavigation({ className = '' }: MainNavigationProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { activeClient } = useClient();

  // Construire les segments du chemin pour le fil d'Ariane
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    return {
      name: pathNameMap[path] || segment.charAt(0).toUpperCase() + segment.slice(1),
      path: path
    };
  });

  // Description de la page actuelle
  const pageDescription = pathDescriptionMap[pathname] || '';

  // Fermer les menus si on clique ailleurs
  const handleOutsideClick = () => {
    if (showUserMenu) setShowUserMenu(false);
  };

  return (
    <div className={`bg-white border-b border-gray-200 ${className} transition-all duration-300`}>
      {/* Barre supérieure avec notifications, etc. */}
      <div className="flex justify-between items-center py-2 px-6 border-b border-gray-100">
        <div className="flex items-center text-gray-600">
          <span className="mr-1 text-sm">Data Warehouse</span>
          <span className="h-4 w-4 rounded-full bg-green-400 flex-shrink-0 relative">
            <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"></span>
          </span>
          <span className="ml-1 text-xs text-gray-500">Connecté</span>
          <div 
            className="ml-4 bg-gray-100 hover:bg-gray-200 rounded-full p-1 cursor-pointer" 
            onClick={(e) => {
              e.stopPropagation();
              setIsCollapsed(!isCollapsed);
            }}
            title={isCollapsed ? "Déplier la navigation" : "Replier la navigation"}
          >
            {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            className="p-1.5 rounded-full text-gray-500 hover:text-primary-600 hover:bg-gray-50 relative"
            title="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" title="2 nouvelles notifications"></span>
          </button>
          
          <Link href="/modules/stack-technique" 
            className="p-1.5 rounded-full text-gray-500 hover:text-primary-600 hover:bg-gray-50"
            title="Stack Technique"
          >
            <Settings size={18} />
          </Link>
          
          <div className="relative">
            <button 
              className="p-1 rounded-full bg-gray-100 text-gray-700 flex items-center hover:bg-gray-200"
              onClick={(e) => {
                e.stopPropagation();
                setShowUserMenu(!showUserMenu);
              }}
              title="Profil utilisateur"
            >
              <User size={18} />
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <div className="text-sm font-medium text-gray-700">Louis Cléon</div>
                    <div className="text-xs text-gray-500">louis@cleon.app</div>
                  </div>
                  <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <LogOut className="w-4 h-4 mr-2 text-gray-500" />
                    Déconnexion
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Fil d'Ariane et titre - partie pliable */}
      <div 
        className={`px-6 py-4 transition-all duration-300 ${
          isCollapsed ? 'hidden' : 'block'
        }`}
      >
        {/* Fil d'Ariane */}
        <div className="flex flex-wrap items-center text-xs text-gray-500 mb-1">
          <Link href="/" className="hover:text-primary-600">
            Accueil
          </Link>
          
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.path}>
              <ChevronRight size={12} className="mx-1" />
              {index === breadcrumbs.length - 1 ? (
                <span className="font-medium text-gray-700">{crumb.name}</span>
              ) : (
                <Link href={crumb.path} className="hover:text-primary-600">
                  {crumb.name}
                </Link>
              )}
            </React.Fragment>
          ))}
        </div>
        
        {/* Titre et Description */}
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            {pathname === '/' ? 'Tableau de bord' : pathNameMap[pathname] || 'Page'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{pageDescription}</p>
        </div>
        
        {/* Information client */}
        {activeClient && pathname !== "/" && pathname !== "/modules/stack-technique" && (
          <div className="mt-3 p-3 bg-gray-50 border border-gray-100 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="flex items-center w-full sm:w-auto">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-700">Client actif : {activeClient.name}</div>
                <div className="text-xs text-gray-500 flex flex-wrap items-center">
                  {activeClient.siren && (
                    <>
                      <span className="inline-block mr-2">SIREN : {activeClient.siren}</span>
                      <InfoTooltip 
                        text="Numéro SIREN vérifié via l'API SIRENE de l'INSEE"
                        position="bottom"
                      />
                      <span className="mx-2 hidden sm:inline-block">|</span>
                    </>
                  )}
                  <span className="sm:inline-block mt-1 sm:mt-0">Secteur : {activeClient.sector}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Click handler pour fermer les menus */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={handleOutsideClick}
        ></div>
      )}
    </div>
  );
} 