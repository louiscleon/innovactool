"use client";

import React from 'react';

// Types pour les technologies
interface Technology {
  component: string;
  tech: string;
  status: 'implemented' | 'simulated' | 'planned' | 'eventual';
  role: string;
  icon?: string;
  memoireRef?: string;
}

interface PipelineDiagramProps {
  activeNode: string | null;
  setActiveNode: (node: string | null) => void;
  technologies: Technology[];
}

// Structure des noeuds du pipeline
const pipelineNodes = [
  { id: "input", label: "Données d'entrée", type: "source", connects: ["extraction"] },
  { id: "extraction", label: "ETL", type: "process", connects: ["db", "anonymisation"] },
  { id: "db", label: "Data Warehouse", type: "storage", connects: ["agents"] },
  { id: "anonymisation", label: "Anonymisation", type: "process", connects: ["db"] },
  { id: "agents", label: "Orchestration agentique", type: "process", connects: ["api", "moteurs", "visualisation"] },
  { id: "api", label: "API externes", type: "api", connects: ["agents"] },
  { id: "moteurs", label: "Moteurs IA", type: "ai", connects: ["visualisation"] },
  { id: "visualisation", label: "Visualisation", type: "output", connects: [] },
];

export function PipelineDiagram({ activeNode, setActiveNode, technologies }: PipelineDiagramProps) {
  // Fonction pour obtenir les technologies liées à un noeud du pipeline
  const getTechForNode = (nodeId: string) => {
    const techMap: Record<string, string[]> = {
      "input": ["NoSQL"],
      "extraction": ["ETL", "Airflow-like (DAG ETL)"],
      "db": ["Data Warehouse"],
      "anonymisation": ["Anonymisation"],
      "agents": ["Orchestration agentique", "Logs agents"],
      "api": ["API externes", "API Perplexity"],
      "moteurs": ["Moteurs IA"],
      "visualisation": ["Visualisation", "Front-end", "Back-end"],
    };
    
    return techMap[nodeId] || [];
  };
  
  // Définition des couleurs directement sans classes Tailwind
  const nodeColors: Record<string, { bg: string, border: string, text: string }> = {
    source: { bg: "#EFF6FF", border: "#BFDBFE", text: "#1D4ED8" },
    process: { bg: "#F5F3FF", border: "#DDD6FE", text: "#7E22CE" },
    storage: { bg: "#ECFDF5", border: "#A7F3D0", text: "#047857" },
    api: { bg: "#FFFBEB", border: "#FDE68A", text: "#B45309" },
    ai: { bg: "#FFF1F2", border: "#FECDD3", text: "#BE123C" },
    output: { bg: "#F0FDFA", border: "#99F6E4", text: "#0F766E" },
  };
  
  // Fonction pour positionner les noeuds dans le SVG
  function getNodePosition(id: string): { x: number, y: number } {
    const positions: Record<string, { x: number, y: number }> = {
      "input": { x: 50, y: 50 },
      "extraction": { x: 220, y: 50 },
      "anonymisation": { x: 220, y: 160 },
      "db": { x: 400, y: 50 },
      "agents": { x: 580, y: 50 },
      "api": { x: 760, y: 0 },
      "moteurs": { x: 760, y: 100 },
      "visualisation": { x: 940, y: 50 },
    };
    
    return positions[id] || { x: 0, y: 0 };
  }
  
  // Fonction pour déterminer si un chemin doit être mis en surbrillance
  function isPathHighlighted(sourceId: string, targetId: string): boolean {
    if (!activeNode) return false;
    
    const sourceTech = getTechForNode(sourceId);
    const targetTech = getTechForNode(targetId);
    
    return (
      sourceTech.includes(activeNode) || 
      targetTech.includes(activeNode)
    );
  }
  
  // SVG pour les flèches et connexions
  const arrows = pipelineNodes.flatMap(node => 
    node.connects.map(targetId => {
      const target = pipelineNodes.find(n => n.id === targetId);
      if (!target) return null;
      
      return (
        <path 
          key={`${node.id}-${targetId}`}
          d={`M ${getNodePosition(node.id).x + 75} ${getNodePosition(node.id).y + 35} 
             C ${getNodePosition(node.id).x + 150} ${getNodePosition(node.id).y + 35},
               ${getNodePosition(targetId).x} ${getNodePosition(targetId).y + 35},
               ${getNodePosition(targetId).x + 30} ${getNodePosition(targetId).y + 35}`}
          stroke="#CBD5E1"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrowhead)"
          style={{
            transition: "all 0.3s ease",
            strokeDasharray: isPathHighlighted(node.id, targetId) ? "0" : "5,5",
            opacity: isPathHighlighted(node.id, targetId) ? 1 : 0.5
          }}
        />
      );
    })
  ).filter(Boolean);
  
  return (
    <div className="overflow-x-auto pb-4">
      <svg width="100%" height="250" viewBox="0 0 1100 250" preserveAspectRatio="xMidYMid meet" className="mx-auto">
        {/* Définition de la flèche */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="0"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#94A3B8" />
          </marker>
        </defs>
        
        {/* Connexions entre les noeuds */}
        <g>
          {arrows}
        </g>
        
        {/* Noeuds du pipeline */}
        {pipelineNodes.map((node) => {
          const nodeColor = nodeColors[node.type];
          const nodeTechs = getTechForNode(node.id);
          const isActive = nodeTechs.includes(activeNode as string);
          
          return (
            <g 
              key={node.id} 
              transform={`translate(${getNodePosition(node.id).x}, ${getNodePosition(node.id).y})`}
              onClick={() => {
                // Activer/désactiver le noeud
                if (nodeTechs.length > 0) {
                  setActiveNode(activeNode === nodeTechs[0] ? null : nodeTechs[0]);
                }
              }}
              style={{ cursor: "pointer" }}
            >
              {/* Rectangle de fond avec animation */}
              <rect
                x="0"
                y="0"
                width="150"
                height="70"
                rx="8"
                fill={nodeColor.bg}
                stroke={nodeColor.border}
                strokeWidth={isActive ? 2 : 1}
                style={{
                  transition: "all 0.3s ease",
                  filter: isActive ? "drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1))" : "none"
                }}
              />
              
              {/* Label du noeud */}
              <text
                x="75"
                y="30"
                textAnchor="middle"
                fill={nodeColor.text}
                style={{ 
                  fontWeight: 500,
                  fontSize: "0.875rem"
                }}
              >
                {node.label}
              </text>
              
              {/* Technologies associées */}
              <text
                x="75"
                y="50"
                textAnchor="middle"
                fill="#64748B"
                style={{ fontSize: "0.75rem" }}
              >
                {nodeTechs.join(", ")}
              </text>
            </g>
          );
        })}
      </svg>
      
      {/* Légende du diagramme */}
      <div className="flex flex-wrap justify-center gap-4 mt-8">
        {Object.entries(nodeColors).map(([type, colors]) => (
          <div key={type} className="flex items-center">
            <div 
              style={{ 
                width: "1rem", 
                height: "1rem", 
                borderRadius: "0.25rem",
                backgroundColor: colors.bg,
                borderColor: colors.border,
                borderWidth: "1px",
                marginRight: "0.25rem"
              }}
            ></div>
            <span className="text-xs text-gray-600 capitalize">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 