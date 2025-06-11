"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { PageAnimationWrapper } from "./AppearanceAnimations";
import { useClient } from "./ClientContext";
import { MainNavigation } from "./MainNavigation";
import { InfoTooltip } from "./Tooltip";
import { Database, Shield, Server } from "lucide-react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { activeClient } = useClient();
  const pathname = usePathname();
  
  // Extraire le nom du module actuel du pathname
  const getModuleTitle = () => {
    if (pathname === "/") return "Accueil";
    
    const modulePath = pathname.split("/").filter(Boolean);
    if (modulePath.length >= 2 && modulePath[0] === "modules") {
      // Convertir le format kebab-case en titre
      const moduleId = modulePath[1];
      switch (moduleId) {
        case "data-guardian": return "Protecteur de données";
        case "pilotview": return "Tableau de bord";
        case "cpa-copilot": return "Assistant Conseil";
        case "reviewmaster-ai": return "Agent de révision";
        case "forecaster": return "Prévisionniste";
        default: return moduleId;
      }
    }
    
    return "Module inconnu";
  };
  
  // On utilise simplement le titre du module
  const displayTitle = getModuleTitle();
  
  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Nouvelle barre de navigation avec fil d'Ariane */}
      <MainNavigation />
      
      {/* Contenu principal avec défilement - full width et centré */}
      <main className="flex-1 p-4 md:px-6 overflow-y-auto w-full">
        <div className="max-w-7xl mx-auto">
          <PageAnimationWrapper transitionKey={pathname}>
            {children}
          </PageAnimationWrapper>
        </div>
      </main>
    </div>
  );
} 