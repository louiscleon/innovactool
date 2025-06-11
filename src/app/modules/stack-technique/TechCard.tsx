"use client";

import React from 'react';
import { InfoTooltip } from '@/components/Tooltip';
import { Database, Server, Shield, Code, LineChart, Layers, BrainCog, Globe, HardDrive } from 'lucide-react';

// Types pour les technologies
interface Technology {
  component: string;
  tech: string;
  status: 'implemented' | 'simulated' | 'planned' | 'eventual';
  role: string;
  icon?: string;
  memoireRef?: string;
}

// Types pour les statuts
interface StatusLabel {
  text: string;
  color: string;
}

interface TechCardProps {
  technology: Technology;
  status: StatusLabel;
  isActive?: boolean;
  onClick?: () => void;
}

// Map des icônes par composant
const iconMap: Record<string, React.ReactNode> = {
  "Orchestration agentique": <BrainCog size={18} className="text-indigo-500" />,
  "Moteurs IA": <BrainCog size={18} className="text-rose-500" />,
  "Data Warehouse": <HardDrive size={18} className="text-green-500" />,
  "API externes": <Globe size={18} className="text-amber-500" />,
  "API Perplexity": <Globe size={18} className="text-amber-500" />,
  "Anonymisation": <Shield size={18} className="text-blue-500" />,
  "Back-end": <Server size={18} className="text-purple-500" />,
  "Visualisation": <LineChart size={18} className="text-teal-500" />,
  "Front-end": <Code size={18} className="text-cyan-500" />,
  "Logs agents": <Layers size={18} className="text-indigo-500" />,
  "ETL": <Layers size={18} className="text-blue-500" />,
  "Airflow-like (DAG ETL)": <Layers size={18} className="text-blue-500" />,
  "NoSQL": <Database size={18} className="text-orange-500" />,
};

export function TechCard({ technology, status, isActive = false, onClick }: TechCardProps) {
  const { component, tech, role, memoireRef } = technology;
  
  return (
    <div 
      className={`
        p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md
        ${isActive ? 'border-primary-400 shadow-md bg-primary-50' : 'border-gray-200 hover:border-gray-300'}
      `}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <div className="mr-2">
            {iconMap[component] || <Layers size={18} className="text-gray-400" />}
          </div>
          <h3 className="font-medium text-gray-800">{component}</h3>
        </div>
        <span 
          className={`text-xs ${status.color} px-2 py-0.5 rounded-full inline-flex items-center`}
        >
          {status.text}
        </span>
      </div>
      
      <div className="text-sm text-gray-600 mb-2 pl-7">
        <span className="font-medium">Tech : </span>{tech}
      </div>
      
      <div className="text-sm text-gray-500 pl-7">
        <span className="font-medium">Fonction : </span>{role}
      </div>
      
      {memoireRef && (
        <div className="mt-3 text-xs border-t border-dashed border-gray-200 pt-2 text-primary-700 flex items-center pl-7">
          <span>{memoireRef}</span>
          {isActive && (
            <InfoTooltip 
              text="Cette référence correspond à une section du mémoire DEC où ce concept est développé"
              position="bottom"
            />
          )}
        </div>
      )}
    </div>
  );
} 