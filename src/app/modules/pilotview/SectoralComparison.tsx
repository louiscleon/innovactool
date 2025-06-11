"use client";

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { NetworkElement } from '@/components/NetworkElements';
import { TrendingUp, AlertTriangle, BarChart, PieChart } from 'lucide-react';
import { getSectoralData } from '@/services/clientDataService';

// Types pour les données
interface SectoralComparisonProps {
  showAlerts?: boolean;
}

interface ComparisonItem {
  metric: string;
  formattedClientValue: string;
  formattedSectorValue: string;
  percentile: number;
  status: 'success' | 'warning';
  trend: 'increasing' | 'decreasing' | 'stable';
  unit?: string;
}

export const SectoralComparison: React.FC<SectoralComparisonProps> = ({ showAlerts = true }) => {
  const [sectoralComparison, setSectoralComparison] = useState<ComparisonItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Pour l'instant, nous utilisons les données de comparaison sectorielle existantes
        // À terme, ces données devraient être calculées dynamiquement à partir du service clientDataService
        
        // Exemple de données de comparaison sectorielle avec les nouveaux indicateurs demandés
        const comparisonData: ComparisonItem[] = [
          {
            metric: "Marge brute",
            formattedClientValue: "42.8%",
            formattedSectorValue: "38.7%",
            percentile: 68,
            status: "success",
            trend: "increasing",
            unit: "%"
          },
          {
            metric: "Nombre de salariés",
            formattedClientValue: "24",
            formattedSectorValue: "18",
            percentile: 75,
            status: "success",
            trend: "stable",
            unit: "personnes"
          },
          {
            metric: "Panier moyen",
            formattedClientValue: "3 450€",
            formattedSectorValue: "2 910€",
            percentile: 82,
            status: "success",
            trend: "increasing",
            unit: "€"
          },
          {
            metric: "Chiffre d'affaires",
            formattedClientValue: "337k€",
            formattedSectorValue: "285k€",
            percentile: 68,
            status: "success",
            trend: "stable",
            unit: "€"
          },
          {
            metric: "Endettement net",
            formattedClientValue: "120k€",
            formattedSectorValue: "95k€",
            percentile: 35,
            status: "warning",
            trend: "increasing",
            unit: "€"
          }
        ];
        
        setSectoralComparison(comparisonData);
      } catch (error) {
        console.error('Erreur lors de la récupération des données de comparaison:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-4">Chargement des données sectorielles...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
      {/* Panneau de comparaison principal */}
      <div className="md:col-span-2">
        <Card
          title="Positionnement sectoriel"
          icon={<BarChart className="h-4 w-4 text-primary-500" />}
          size="sm"
        >
          <NetworkElement 
            type="wave" 
            size="xs" 
            position="bottom-right" 
            color="primary" 
            opacity={0.04} 
          />
          
          <div className="p-3">
            <div className="grid grid-cols-1 gap-3">
              {sectoralComparison.map((item, index) => (
                <div 
                  key={index}
                  className="flex flex-col border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.metric}</span>
                    <Badge 
                      color={item.status === 'success' ? 'success' : 'warning'} 
                      variant="soft" 
                      size="xs"
                    >
                      {item.status === 'success' ? 'Point fort' : 'Point d\'attention'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center mb-2">
                    <div className="text-sm font-bold text-gray-900 mr-2">
                      {item.formattedClientValue}
                    </div>
                    <div className="text-xs text-gray-500">
                      vs {item.formattedSectorValue} (médiane sectorielle)
                    </div>
                  </div>
                  
                  <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
                    <div 
                      className={`absolute top-0 left-0 h-full rounded-full ${
                        item.status === 'success' ? 'bg-success-500' : 'bg-warning-500'
                      }`}
                      style={{ width: `${item.percentile}%` }}
                    ></div>
                    <div 
                      className="absolute top-0 left-1/2 h-full w-0.5 bg-gray-400"
                      style={{ transform: 'translateX(-50%)' }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0 {item.unit || ''}</span>
                    <span>Médiane</span>
                    <span>100{item.unit === "%" ? "%" : item.unit === "€" ? "k€" : item.unit === "personnes" ? "" : ""}</span>
                  </div>
                  
                  <div className="flex items-center mt-1 text-xs">
                    <TrendingUp 
                      className={`h-3 w-3 mr-1 ${
                        item.trend === 'decreasing' ? 'rotate-180 text-success-500' : 
                        item.trend === 'increasing' ? 'text-warning-500' : 'text-gray-500'
                      }`} 
                    />
                    {item.trend === 'stable' ? (
                      <span className="text-gray-500">Tendance stable</span>
                    ) : item.trend === 'increasing' ? (
                      <span className="text-warning-500">En augmentation</span>
                    ) : (
                      <span className="text-success-500">En diminution</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
      
      {/* Carte de distribution sectorielle */}
      <div className="md:col-span-1">
        <Card
          title="Analyse de performance"
          icon={<PieChart className="h-4 w-4 text-primary-500" />}
          size="sm"
        >
          <NetworkElement 
            type="circle" 
            size="xs" 
            position="bottom-left" 
            color="secondary" 
            opacity={0.04} 
          />
          
          <div className="p-3">
            <div className="text-sm font-medium text-gray-700 mb-3">
              Répartition de vos indicateurs
            </div>
            
            <div className="flex justify-center">
              <div className="relative w-40 h-40">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Background circle */}
                  <circle cx="50" cy="50" r="45" fill="#f3f4f6" />
                  
                  {/* Indicators */}
                  <path d="M50,50 L95,50 A45,45 0 0,1 87,73 Z" fill="#34d399" opacity="0.7" />
                  <path d="M50,50 L87,73 A45,45 0 0,1 65,87 Z" fill="#34d399" opacity="0.9" />
                  <path d="M50,50 L65,87 A45,45 0 0,1 35,87 Z" fill="#34d399" opacity="0.8" />
                  <path d="M50,50 L35,87 A45,45 0 0,1 13,73 Z" fill="#fbbf24" opacity="0.7" />
                  <path d="M50,50 L13,73 A45,45 0 0,1 5,50 Z" fill="#fbbf24" opacity="0.9" />
                  <path d="M50,50 L5,50 A45,45 0 0,1 13,27 Z" fill="#34d399" opacity="0.7" />
                  
                  {/* Center circle */}
                  <circle cx="50" cy="50" r="5" fill="#6366f1" />
                </svg>
                
                {/* Labels */}
                <div className="absolute text-xs text-gray-600 font-medium" style={{ top: '10%', right: '10%' }}>
                  Ratios
                </div>
                <div className="absolute text-xs text-gray-600 font-medium" style={{ bottom: '10%', right: '25%' }}>
                  Croissance
                </div>
                <div className="absolute text-xs text-gray-600 font-medium" style={{ bottom: '10%', left: '25%' }}>
                  Financement
                </div>
                <div className="absolute text-xs text-gray-600 font-medium" style={{ top: '25%', left: '10%' }}>
                  Trésorerie
                </div>
              </div>
            </div>
            
            <div className="mt-3 text-sm">
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 rounded-full bg-success-500 mr-2"></div>
                <span className="text-xs text-gray-700">Points forts</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-warning-500 mr-2"></div>
                <span className="text-xs text-gray-700">Points à améliorer</span>
              </div>
            </div>
            
            {showAlerts && (
              <div className="mt-4 p-2 bg-warning-50 border border-warning-200 rounded-lg flex items-start">
                <AlertTriangle size={16} className="text-warning-500 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-gray-700">
                  Votre endettement net est plus élevé que la médiane.
                  <span className="block mt-1 text-warning-700">
                    Réfléchissez à une stratégie pour réduire votre dette à moyen terme.
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}; 