"use client";

import React from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { NetworkElement } from './NetworkElements';
import { 
  TrendingUp, 
  ChevronRight, 
  Globe, 
  Newspaper, 
  ExternalLink, 
  Filter,
  BarChart4,
  LineChart,
  Activity,
  ArrowUpRight,
  Building2
} from 'lucide-react';

interface MarketTrend {
  name: string;
  trend: string;
  impact_on_revenue: string;
  impact_on_margins: string;
}

interface NewsItem {
  title: string;
  summary: string;
  source: string;
  date: string;
  url: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  tags: string[];
  sector?: string;
}

interface MarketTrendsSectionProps {
  sectorName: string;
  trends: MarketTrend[];
  news?: NewsItem[];
  className?: string;
}

export const MarketTrendsSection: React.FC<MarketTrendsSectionProps> = ({
  sectorName,
  trends,
  news = [],
  className
}) => {
  // Convertir les tendances en style de flèche
  const getTrendArrow = (trend: string) => {
    switch (trend) {
      case 'strong_increase': return '↑↑';
      case 'increase': return '↑';
      case 'moderate_increase': return '↗';
      case 'stable': return '→';
      case 'decrease': return '↓';
      case 'strong_decrease': return '↓↓';
      default: return '→';
    }
  };
  
  // Convertir l'impact en badge
  const getImpactBadge = (impact: string) => {
    if (impact === 'positive') {
      return <Badge color="success" variant="soft" size="xs">Positif</Badge>;
    }
    if (impact === 'negative') {
      return <Badge color="error" variant="soft" size="xs">Négatif</Badge>;
    }
    return <Badge color="info" variant="soft" size="xs">Neutre</Badge>;
  };
  
  // Déterminer la couleur de l'impact
  const getImpactColor = (impact: string) => {
    if (impact === 'positive') return 'text-success-500';
    if (impact === 'negative') return 'text-error-500';
    return 'text-gray-500';
  };

  // Générer des actualités si aucune n'est fournie
  const defaultNews: NewsItem[] = [
    {
      title: "L'IA transforme le secteur IT, accélération des investissements",
      summary: "Les entreprises augmentent leurs budgets dans l'intelligence artificielle, créant de nouvelles opportunités pour les prestataires de services IT.",
      source: "Les Echos",
      date: "2024-07-15",
      url: "#",
      impact: "HIGH",
      tags: ["IA", "Innovation", "Investissements"],
      sector: "Programmation informatique"
    },
    {
      title: "Nouvelles réglementations RGPD impactant le Cloud Computing",
      summary: "Les nouvelles directives européennes renforcent les exigences de sécurité et de conformité pour les services cloud.",
      source: "Le Monde",
      date: "2024-07-10",
      url: "#",
      impact: "MEDIUM",
      tags: ["RGPD", "Cloud", "Réglementation"],
      sector: "Programmation informatique"
    },
    {
      title: "Pénurie de talents IT : les salaires continuent d'augmenter",
      summary: "Le secteur fait face à une compétition accrue pour recruter des profils spécialisés, entraînant une hausse des coûts salariaux.",
      source: "Capital",
      date: "2024-07-05",
      url: "#",
      impact: "MEDIUM",
      tags: ["RH", "Coûts", "Recrutement"],
      sector: "Programmation informatique"
    }
  ];
  
  const displayNews = news.length > 0 ? news : defaultNews;
  
  // Formater la date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      return dateStr;
    }
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Tendances sectorielles */}
      <Card className="relative overflow-hidden">
        <NetworkElement 
          type="circle" 
          size="xs" 
          position="top-right" 
          color="primary" 
          opacity={0.04} 
        />
        
        <div className="flex items-center justify-between p-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <LineChart className="h-4 w-4 text-primary-500" />
            <h2 className="text-sm font-semibold text-gray-800">Tendances du secteur {sectorName}</h2>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="xs" 
              icon={<Filter size={14} />}
            >
              Filtrer
            </Button>
            <Button 
              variant="outline" 
              size="xs" 
              icon={<BarChart4 size={14} />}
            >
              Comparaison
            </Button>
          </div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {trends.map((trend, index) => (
            <div key={index} className="p-3 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-gray-800">{trend.name}</h3>
                <div className="text-xl font-bold">
                  {getTrendArrow(trend.trend)}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500">Impact revenus:</span>
                  <span className={`text-xs font-medium ${getImpactColor(trend.impact_on_revenue)}`}>
                    {trend.impact_on_revenue === 'positive' ? 'Positif' : 
                     trend.impact_on_revenue === 'negative' ? 'Négatif' : 'Neutre'}
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500">Impact marges:</span>
                  <span className={`text-xs font-medium ${getImpactColor(trend.impact_on_margins)}`}>
                    {trend.impact_on_margins === 'positive' ? 'Positif' : 
                     trend.impact_on_margins === 'negative' ? 'Négatif' : 'Neutre'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-3 border-t border-gray-100 bg-gray-50">
          <Button variant="text" size="xs" className="w-full justify-center">
            Voir toutes les tendances
            <ChevronRight size={14} className="ml-1" />
          </Button>
        </div>
      </Card>
      
      {/* Actualités sectorielles */}
      <Card className="relative overflow-hidden">
        <NetworkElement 
          type="node" 
          size="xs" 
          position="bottom-left" 
          color="secondary" 
          opacity={0.04} 
        />
        
        <div className="flex items-center justify-between p-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary-500" />
            <h2 className="text-sm font-semibold text-gray-800">Actualités sectorielles</h2>
          </div>
          
          <Badge color="success" variant="soft" size="xs" className="flex items-center">
            <Building2 className="h-3 w-3 mr-1" />
            {sectorName}
          </Badge>
        </div>
        
        <div className="divide-y divide-gray-100">
          {displayNews.map((item, index) => (
            <div key={index} className="p-3 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-sm font-medium text-gray-800 flex-1">{item.title}</h3>
                <Badge 
                  color={
                    item.impact === 'HIGH' ? 'error' : 
                    item.impact === 'MEDIUM' ? 'warning' : 'success'
                  } 
                  variant="soft" 
                  size="xs"
                  className="ml-2 flex-shrink-0"
                >
                  Impact {item.impact === 'HIGH' ? 'Fort' : item.impact === 'MEDIUM' ? 'Moyen' : 'Faible'}
                </Badge>
              </div>
              
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">{item.summary}</p>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center text-xs text-gray-500">
                  <span className="mr-2">{item.source}</span>
                  <span>{formatDate(item.date)}</span>
                </div>
                
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs text-primary-500 hover:text-primary-700 font-medium"
                >
                  Lire l'article
                  <ArrowUpRight size={12} className="ml-1" />
                </a>
              </div>
              
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.tags.map((tag, i) => (
                    <Badge key={i} color="primary" variant="outline" size="xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="p-3 border-t border-gray-100 bg-gray-50">
          <Button variant="text" size="xs" className="w-full justify-center">
            Voir toutes les actualités
            <ChevronRight size={14} className="ml-1" />
          </Button>
        </div>
      </Card>
    </div>
  );
}; 