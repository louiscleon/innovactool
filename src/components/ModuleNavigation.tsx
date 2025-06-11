import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Shield, 
  PieChart, 
  MessageSquare, 
  Search, 
  Users, 
  Home,
  TrendingUp,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

// Parcours de démonstration suggéré
const DEMO_FLOW = [
  { 
    path: '/', 
    icon: <Home size={16} />, 
    name: 'Accueil',
    description: 'Vue d\'ensemble de la plateforme'
  },
  { 
    path: '/modules/pilotview', 
    icon: <PieChart size={16} />, 
    name: 'Tableau de bord',
    description: 'Gestion clients et KPIs'
  },
  { 
    path: '/modules/data-guardian', 
    icon: <Shield size={16} />, 
    name: 'Protecteur de données',
    description: 'Analyse des risques RGPD'
  },
  { 
    path: '/modules/cpa-copilot', 
    icon: <MessageSquare size={16} />, 
    name: 'Assistant Conseil',
    description: 'Questions et conseils IA'
  },
  { 
    path: '/modules/forecaster', 
    icon: <TrendingUp size={16} />, 
    name: 'Prévisionniste',
    description: 'Projections business'
  },
  { 
    path: '/modules/reviewmaster-ai', 
    icon: <Search size={16} />, 
    name: 'Agent de révision',
    description: 'Détection d\'anomalies'
  }
];

export function ModuleNavigation() {
  const pathname = usePathname();
  
  // Trouver l'index du module actuel dans le flux de démo
  const currentIndex = DEMO_FLOW.findIndex(module => module.path === pathname);
  const nextModule = currentIndex >= 0 && currentIndex < DEMO_FLOW.length - 1 
    ? DEMO_FLOW[currentIndex + 1] 
    : null;
    
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-6">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
        <h3 className="text-sm font-medium text-gray-700">Parcours démonstration</h3>
      </div>
      
      <div className="p-1">
        {DEMO_FLOW.map((module, index) => {
          const isActive = pathname === module.path;
          const isPast = DEMO_FLOW.findIndex(m => m.path === pathname) > index;
          
          return (
            <Link 
              key={module.path} 
              href={module.path}
              className={`
                flex items-center p-2 rounded-md mb-1 relative
                ${isActive 
                  ? 'bg-primary-50 border-l-4 border-l-primary-500 pl-1' 
                  : isPast 
                    ? 'text-gray-400 hover:bg-gray-50' 
                    : 'text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              <div className={`
                flex items-center justify-center w-7 h-7 rounded-full mr-3
                ${isActive 
                  ? 'bg-primary-100 text-primary-600' 
                  : isPast 
                    ? 'bg-gray-100 text-gray-400' 
                    : 'bg-gray-100 text-gray-500'
                }
              `}>
                {module.icon}
              </div>
              <div className="flex-1">
                <div className={`text-sm ${isActive ? 'font-medium' : ''}`}>{module.name}</div>
                <div className="text-xs text-gray-500">{module.description}</div>
              </div>
              {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary-500 absolute right-3"></div>}
            </Link>
          );
        })}
      </div>
      
      {nextModule && (
        <div className="border-t border-gray-200 p-3">
          <Link 
            href={nextModule.path}
            className="flex items-center justify-between p-2 bg-primary-50 hover:bg-primary-100 rounded-md text-primary-700 transition-colors"
          >
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center mr-2">
                {nextModule.icon}
              </div>
              <span className="text-sm">Suite : {nextModule.name}</span>
            </div>
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
} 