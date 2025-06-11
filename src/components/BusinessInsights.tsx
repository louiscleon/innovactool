"use client";

import React from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import { NetworkElement } from './NetworkElements';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  LightbulbIcon, 
  ChevronRight, 
  AreaChart,
  Zap,
  Clock
} from 'lucide-react';
import { Button } from './Button';

interface Insight {
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  category: 'financial' | 'operational' | 'market' | 'strategic';
  confidence: number;
  actionable: boolean;
}

interface Risk {
  name: string;
  impact: 'high' | 'medium' | 'low';
  probability?: string;
  indicators: string[];
  trend?: string;
}

interface Opportunity {
  name: string;
  potential_revenue: string;
  investment_required: number;
  time_to_market: string;
}

interface BusinessInsightsProps {
  insights?: Insight[];
  risks: Risk[];
  opportunities: Opportunity[];
  className?: string;
}

export const BusinessInsights: React.FC<BusinessInsightsProps> = ({
  insights = [],
  risks,
  opportunities,
  className
}) => {
  // Générer des insights si aucun n'est fourni
  const defaultInsights: Insight[] = [
    {
      title: "Marge brute supérieure à la moyenne sectorielle",
      description: "Votre marge brute de 48.7% dépasse la moyenne du secteur (45.5%), indiquant une bonne efficacité opérationnelle ou un positionnement premium.",
      impact: "positive",
      category: "financial",
      confidence: 95,
      actionable: false
    },
    {
      title: "Délai de paiement clients élevé",
      description: "Vos délais de recouvrement (52 jours) sont supérieurs à la moyenne sectorielle (45 jours), ce qui impacte votre trésorerie.",
      impact: "negative",
      category: "financial",
      confidence: 90,
      actionable: true
    },
    {
      title: "Potentiel de croissance dans le segment Cloud",
      description: "Basé sur l'analyse sectorielle, le segment Cloud présente un fort potentiel de croissance pour votre activité.",
      impact: "positive",
      category: "market",
      confidence: 85,
      actionable: true
    }
  ];
  
  const displayInsights = insights.length > 0 ? insights : defaultInsights;
  
  // Formater un montant en euros
  const formatEuros = (amount: number) => {
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(1) + ' M€';
    }
    return amount.toLocaleString('fr-FR') + ' €';
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Insights business */}
      <Card className="relative overflow-hidden">
        <NetworkElement 
          type="node" 
          size="xs" 
          position="top-right" 
          color="primary" 
          opacity={0.04} 
        />
        
        <div className="flex items-center justify-between p-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <LightbulbIcon className="h-4 w-4 text-primary-500" />
            <h2 className="text-sm font-semibold text-gray-800">Insights business</h2>
          </div>
          
          <Button variant="text" size="xs">
            Voir tous les insights
            <ChevronRight size={14} className="ml-1" />
          </Button>
        </div>
        
        <div className="p-0">
          <div className="divide-y divide-gray-100">
            {displayInsights.map((insight, index) => {
              const getImpactColor = () => {
                if (insight.impact === 'positive') return 'text-success-500';
                if (insight.impact === 'negative') return 'text-error-500';
                return 'text-gray-500';
              };
              
              const getImpactBadge = () => {
                if (insight.impact === 'positive') {
                  return <Badge color="success" variant="soft" size="xs">Positif</Badge>;
                }
                if (insight.impact === 'negative') {
                  return <Badge color="error" variant="soft" size="xs">À surveiller</Badge>;
                }
                return <Badge color="info" variant="soft" size="xs">Neutre</Badge>;
              };
              
              const getIcon = () => {
                if (insight.impact === 'positive') {
                  return <CheckCircle className="h-5 w-5 text-success-500" />;
                }
                if (insight.impact === 'negative') {
                  return <AlertTriangle className="h-5 w-5 text-error-500" />;
                }
                return <TrendingUp className="h-5 w-5 text-gray-500" />;
              };
              
              return (
                <div key={index} className="p-3">
                  <div className="flex gap-3">
                    <div className="mt-0.5">
                      {getIcon()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-medium text-gray-800">{insight.title}</h3>
                        {getImpactBadge()}
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{insight.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <Badge color="primary" variant="outline" size="xs">
                            {insight.category === 'financial' ? 'Finance' : 
                             insight.category === 'market' ? 'Marché' : 
                             insight.category === 'operational' ? 'Opérations' : 'Stratégie'}
                          </Badge>
                          <span className="text-xs text-gray-500">Confiance: {insight.confidence}%</span>
                        </div>
                        
                        {insight.actionable && (
                          <Button variant="text" size="xs">
                            Recommandations
                            <ChevronRight size={12} className="ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Alertes et risques */}
        <Card className="relative overflow-hidden">
          <NetworkElement 
            type="circle" 
            size="xs" 
            position="bottom-left" 
            color="secondary" 
            opacity={0.04} 
          />
          
          <div className="flex items-center justify-between p-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-primary-500" />
              <h2 className="text-sm font-semibold text-gray-800">Risques à surveiller</h2>
            </div>
          </div>
          
          <div className="p-2">
            <div className="space-y-2">
              {risks.map((risk, index) => (
                <div key={index} className="p-2 rounded-lg border border-gray-100 hover:bg-gray-50">
                  <div className="flex items-start gap-2">
                    <div className={`mt-0.5 w-3 h-3 rounded-full flex-shrink-0 ${
                      risk.impact === 'high' ? 'bg-error-500' : 
                      risk.impact === 'medium' ? 'bg-warning-500' : 'bg-info-500'
                    }`} />
                    <div>
                      <div className="text-sm font-medium text-gray-800">{risk.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5 flex items-center flex-wrap gap-x-3">
                        <span>
                          Impact: {risk.impact === 'high' ? 'Élevé' : risk.impact === 'medium' ? 'Moyen' : 'Faible'}
                        </span>
                        {risk.probability && (
                          <span>
                            Probabilité: {risk.probability === 'high' ? 'Élevée' : risk.probability === 'medium' ? 'Moyenne' : 'Faible'}
                          </span>
                        )}
                      </div>
                      
                      {risk.indicators && risk.indicators.length > 0 && (
                        <div className="mt-2 text-xs text-gray-600">
                          <div className="font-medium mb-1">Indicateurs:</div>
                          <ul className="list-disc pl-4 space-y-0.5">
                            {risk.indicators.slice(0, 2).map((indicator, i) => (
                              <li key={i}>{indicator}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {risk.trend && (
                        <div className="flex items-center mt-2">
                          <TrendingUp 
                            className={`h-3.5 w-3.5 mr-1 ${
                              risk.trend === 'decreasing' ? 'rotate-180 text-success-500' : 
                              risk.trend === 'increasing' ? 'text-error-500' : 'text-gray-500'
                            }`} 
                          />
                          <span className={`text-xs ${
                            risk.trend === 'decreasing' ? 'text-success-500' : 
                            risk.trend === 'increasing' ? 'text-error-500' : 'text-gray-500'
                          }`}>
                            {risk.trend === 'stable' ? 'Stable' : 
                            risk.trend === 'increasing' ? 'En augmentation' : 'En diminution'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
        
        {/* Opportunités de croissance */}
        <Card className="relative overflow-hidden">
          <NetworkElement 
            type="wave" 
            size="xs" 
            position="top-right" 
            color="primary" 
            opacity={0.04} 
          />
          
          <div className="flex items-center justify-between p-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <AreaChart className="h-4 w-4 text-primary-500" />
              <h2 className="text-sm font-semibold text-gray-800">Opportunités de croissance</h2>
            </div>
          </div>
          
          <div className="p-2">
            <div className="space-y-2">
              {opportunities.map((opportunity, index) => (
                <div key={index} className="p-2 rounded-lg border border-gray-100 hover:bg-gray-50">
                  <div className="flex justify-between mb-1.5">
                    <h3 className="text-sm font-medium text-gray-800">{opportunity.name}</h3>
                    <Badge color="success" variant="soft" size="xs">
                      +{opportunity.potential_revenue}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="flex items-start text-xs">
                      <Zap size={14} className="mr-1.5 text-warning-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium">Investissement requis</div>
                        <div className="text-gray-600">{formatEuros(opportunity.investment_required)}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start text-xs">
                      <Clock size={14} className="mr-1.5 text-info-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium">Délai de mise en marché</div>
                        <div className="text-gray-600">{opportunity.time_to_market}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-right">
                    <Button variant="primary" size="xs">
                      Analyser l'opportunité
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}; 