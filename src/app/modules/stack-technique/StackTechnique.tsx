"use client";

import React, { useState } from 'react';
import { Download, Info, GitBranch } from 'lucide-react';
import { InfoTooltip } from '@/components/Tooltip';
import { TechCard } from './TechCard';
import { PipelineDiagram } from './PipelineDiagram';

// Interface pour les technologies
interface Technology {
  component: string;
  tech: string;
  status: 'implemented' | 'simulated' | 'planned' | 'eventual';
  role: string;
  icon?: string;
  memoireRef?: string;
}

// Données des technologies
const technologies: Technology[] = [
  { 
    component: "Orchestration agentique", 
    tech: "AG2 + Python", 
    status: "implemented", 
    role: "Coordination des agents",
    memoireRef: "Chapitre 2 – Section 2.1"
  },
  { 
    component: "Moteurs IA", 
    tech: "OpenAI API, Azure OpenAI, Claude", 
    status: "implemented", 
    role: "Génération d'analyse et conseil",
    memoireRef: "Chapitre 2 – Section 2.1"
  },
  { 
    component: "Data Warehouse", 
    tech: "PostgreSQL (1250 FEC simulés)", 
    status: "simulated", 
    role: "Stockage structuré, accessible par les agents",
    memoireRef: "Chapitre 2 – Section 1"
  },
  { 
    component: "API externes", 
    tech: "SIRENE, INPI", 
    status: "implemented", 
    role: "Enrichissement des données",
    memoireRef: "Partie 2 – Chapitre 2 – Section 2.2.1"
  },
  { 
    component: "API Perplexity", 
    tech: "Perplexity API", 
    status: "implemented", 
    role: "Recherche contextuelle",
    memoireRef: "Partie 2 – Chapitre 2 – Section 2.2.1"
  },
  { 
    component: "Anonymisation", 
    tech: "Regex + règles métier (proxy simulé)", 
    status: "simulated", 
    role: "Protection RGPD, floutage local",
    memoireRef: "Partie 2 – Chapitre 1 – Section 2 – §§ 2.2 / 2.2.1"
  },
  { 
    component: "Back-end", 
    tech: "FastAPI (ou Flask selon votre stack)", 
    status: "implemented", 
    role: "Traitement des requêtes",
    memoireRef: "Partie 2 – Chapitre 2 – Section 2.2.1"
  },
  { 
    component: "Visualisation", 
    tech: "D3.js, Chart.js", 
    status: "implemented", 
    role: "Dashboards & schémas interactifs",
    memoireRef: "Partie 2 – Chapitre 2 – Section 1"
  },
  { 
    component: "Front-end", 
    tech: "Next.js", 
    status: "implemented", 
    role: "Interface réactive",
    memoireRef: "Partie 2 – Chapitre 2 – Section 1"
  },
  { 
    component: "Logs agents", 
    tech: "JSON historisé (simulé)", 
    status: "simulated", 
    role: "Traçabilité pédagogique",
    memoireRef: "Partie 2 – Chapitre 2 – Section 2.2 – § 2.2.2"
  },
  { 
    component: "ETL", 
    tech: "Python scripts simples", 
    status: "simulated", 
    role: "Pipeline Extract → Transform → Load",
    memoireRef: "Partie 2 – Chapitre 1 – Section 1.1 – § 1.1.4"
  },
  { 
    component: "Airflow-like (DAG ETL)", 
    tech: "Théorique", 
    status: "planned", 
    role: "Pipeline modulaire & maintenable",
    memoireRef: "Partie 2 – Chapitre 1 – Section 1.1 – § 1.1.4"
  },
  { 
    component: "NoSQL", 
    tech: "Évoqué mais non utilisé", 
    status: "eventual", 
    role: "Stockage non structuré si besoin",
    memoireRef: "Partie 1 – Chapitre 2 – Section 1.1"
  }
];

// Statuts traduits et formatés
const statusLabels = {
  implemented: { text: "✅ Implémenté", color: "bg-green-100 text-green-800" },
  simulated: { text: "🔄 Simulé (POC)", color: "bg-blue-100 text-blue-800" },
  planned: { text: "🚧 Prévu", color: "bg-yellow-100 text-yellow-800" },
  eventual: { text: "🌀 Éventuel", color: "bg-gray-100 text-gray-800" }
};

export function StackTechnique() {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  
  return (
    <div className="space-y-8 pb-12">
      {/* Introduction */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-gray-800">Architecture Technique</h2>
            <div className="ml-2 mt-1 px-2 py-0.5 bg-primary-50 text-primary-700 text-xs rounded-md">
              Session de mai 2025
            </div>
          </div>
          <button 
            className="flex items-center px-3 py-1.5 bg-primary-50 text-primary-700 rounded-md border border-primary-100 text-sm hover:bg-primary-100 transition-colors"
            title="Exporter en PDF"
          >
            <Download size={16} className="mr-1.5" />
            Exporter PDF
          </button>
        </div>
        <p className="text-gray-600">
          Ce module présente l'architecture technique complète d'Innovac'tool, telle que décrite dans le mémoire DEC.
          Chaque composant est étiqueté selon son statut d'implémentation réel.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries(statusLabels).map(([key, { text, color }]) => (
            <span 
              key={key} 
              className={`text-xs ${color} px-2.5 py-1 rounded-full inline-flex items-center`}
            >
              {text}
            </span>
          ))}
        </div>
      </div>
      
      {/* Bloc 1 - Stack Technique */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="flex items-center mb-5">
          <h2 className="text-xl font-semibold text-gray-800">Stack Technique</h2>
          <InfoTooltip 
            text="Chaque carte présente une technologie mentionnée dans le mémoire avec son état d'implémentation"
            position="right"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {technologies.map((tech) => (
            <TechCard 
              key={tech.component}
              technology={tech}
              status={statusLabels[tech.status]}
              isActive={activeNode === tech.component}
              onClick={() => setActiveNode(tech.component === activeNode ? null : tech.component)}
            />
          ))}
        </div>
      </div>
      
      {/* Bloc 2 - Diagramme de Pipeline */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="flex items-center mb-3">
          <GitBranch className="text-primary-500 mr-2" size={20} />
          <h2 className="text-xl font-semibold text-gray-800">Pipeline Agentique</h2>
          <InfoTooltip 
            text="Visualisation du flux de données et des interactions entre agents"
            position="right"
          />
        </div>
        
        <p className="text-gray-600 mb-4">
          Ce diagramme illustre le flux de données à travers l'architecture Innovac'tool, depuis l'ingestion initiale jusqu'à la visualisation finale.
          Les agents IA orchestrent ce processus grâce à l'utilisation d'AG2 (ex-AutoGen).
        </p>
        
        <div className="flex justify-end items-center text-sm text-gray-500 mb-2">
          <Info size={14} className="mr-1" />
          <span>Cliquez sur un nœud pour mettre en évidence les connexions</span>
        </div>
        
        <div className="w-full border border-gray-100 rounded-lg bg-gray-50 p-4 overflow-hidden">
          <div className="w-full h-[500px] pt-2">
            <PipelineDiagram 
              activeNode={activeNode} 
              setActiveNode={setActiveNode}
              technologies={technologies}
            />
          </div>
        </div>
        
        {activeNode && (
          <div className="mt-4 p-3 bg-primary-50 border border-primary-100 rounded-md">
            <div className="font-medium text-primary-700">{activeNode}</div>
            <div className="text-sm text-primary-600 mt-1">
              {technologies.find(t => t.component === activeNode)?.role || ""}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 