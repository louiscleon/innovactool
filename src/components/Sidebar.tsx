"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  Shield, 
  PieChart, 
  MessageSquare, 
  Search, 
  Users, 
  Home,
  TrendingUp,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import Image from 'next/image';
import { ClientSelector } from './ClientSelector';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isExpanded: boolean;
}

function NavItem({ href, icon, label, isActive, isExpanded }: NavItemProps) {
  return (
    <Link href={href} className="relative w-full block">
      <div className={`
        flex items-center ${isExpanded ? 'justify-start pl-4' : 'justify-center'} 
        w-full h-12 rounded-lg transition-all duration-200
        ${isActive 
          ? 'bg-primary-100 text-primary-600 shadow-sm font-medium' 
          : 'text-gray-500 hover:text-primary-600 hover:bg-gray-50'
        }
      `}>
        <div className="w-5 h-5 flex-shrink-0">
          {icon}
        </div>
        {isExpanded && (
          <span className="text-sm ml-3 truncate">{label}</span>
        )}
      </div>
      
      {/* Tooltip (only shown when sidebar is collapsed) */}
      {!isExpanded && (
        <div className="absolute left-full ml-2 py-1.5 px-3 bg-gray-900 text-white text-xs rounded
                      opacity-0 invisible -translate-x-1
                      group-hover:opacity-100 group-hover:visible group-hover:translate-x-0
                      transition-all duration-150 z-50 whitespace-nowrap shadow-lg">
          {label}
        </div>
      )}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Store expansion state in localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-expanded');
    if (savedState) {
      setIsExpanded(savedState === 'true');
    }
  }, []);
  
  const toggleSidebar = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    localStorage.setItem('sidebar-expanded', String(newState));
    
    // Dispatch custom event for layout to listen
    const event = new CustomEvent('sidebarToggle', { 
      detail: { expanded: newState } 
    });
    window.dispatchEvent(event);
  };
  
  const modules = [
    { href: '/', icon: <Home size={18} />, label: 'Accueil' },
    { href: '/modules/data-guardian', icon: <Shield size={18} />, label: 'Protecteur de données' },
    { href: '/modules/pilotview', icon: <PieChart size={18} />, label: 'Tableau de bord' },
    { href: '/modules/cpa-copilot', icon: <MessageSquare size={18} />, label: 'Assistant Conseil' },
    { href: '/modules/reviewmaster-ai', icon: <Search size={18} />, label: 'Agent de révision' },
    { href: '/modules/forecaster', icon: <TrendingUp size={18} />, label: 'Prévisionniste' },
  ];
  
  return (
    <aside 
      className={`fixed top-0 left-0 h-full bg-white border-r border-gray-100 flex flex-col py-6 shadow-sm z-10 transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-64' : 'w-16'
      }`}
    >
      {/* Logo with network SVG on hover */}
      <div className="relative mb-6 flex justify-center">
        <Link href="/" className="block group">
          <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm overflow-hidden p-1.5">
            <Image 
              src="/ressources/logoblanc.svg" 
              alt="Innovac'tool"
              width={36}
              height={36}
              className="object-contain"
            />
          </div>
        </Link>
      </div>
      
      {/* Toggle button - fixed position and improved visibility */}
      <button 
        onClick={toggleSidebar}
        aria-label={isExpanded ? "Réduire le menu" : "Agrandir le menu"} 
        className="absolute top-6 -right-3 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:bg-gray-50 transition-all z-20"
      >
        {isExpanded ? 
          <ChevronLeft size={16} className="text-gray-600" /> : 
          <ChevronRight size={16} className="text-gray-600" />
        }
      </button>
      
      {/* Client Selector - Always display */}
      <div className={`px-3 mb-4 ${!isExpanded ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
        <ClientSelector />
      </div>
      
      {/* Navigation */}
      <nav className="flex flex-col space-y-1.5 px-2 flex-1 w-full">
        {modules.map((module) => (
          <NavItem
            key={module.href}
            href={module.href}
            icon={module.icon}
            label={module.label}
            isActive={pathname === module.href || 
                     (module.href !== '/' && pathname.startsWith(module.href))}
            isExpanded={isExpanded}
          />
        ))}
      </nav>
    </aside>
  );
}