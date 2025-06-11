/**
 * Utilitaires pour le module Prévisionniste stratégique
 */

import { ForecasterAgent } from '@/agents/forecaster-agent';
import { Orchestrator } from '@/agents/orchestrator';

/**
 * Formatage des valeurs monétaires
 */
export const formatCurrency = (value: number, options: { locale?: string; currency?: string; compact?: boolean } = {}) => {
  const { locale = 'fr-FR', currency = 'EUR', compact = false } = options;
  
  if (compact) {
    if (value >= 1000000) {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        maximumFractionDigits: 1,
        notation: 'compact'
      }).format(value);
    }
    
    if (value >= 1000) {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
        notation: 'compact'
      }).format(value);
    }
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(value);
};

/**
 * Formatage des pourcentages
 */
export const formatPercent = (value: number, options: { locale?: string; decimals?: number; sign?: boolean } = {}) => {
  const { locale = 'fr-FR', decimals = 1, sign = false } = options;
  
  const percent = new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
  
  if (sign && value > 0) {
    return `+${percent}`;
  }
  
  return percent;
};

/**
 * Calcul des variations en pourcentage
 */
export const calculateVariation = (currentValue: number, previousValue: number): number => {
  if (previousValue === 0) return 0;
  return (currentValue - previousValue) / previousValue;
};

/**
 * Initialisation de l'agent prévisionniste
 */
export const initForecasterAgent = async (orchestrator: Orchestrator): Promise<ForecasterAgent> => {
  const agent = new ForecasterAgent({
    name: 'Prévisionniste Stratégique',
    description: 'Spécialiste en prévision financière et stratégique pour cabinet comptable',
    systemPrompt: `Tu es un expert en prévision financière et stratégique pour cabinet d'expertise comptable.
Ta mission est d'analyser les données financières et sectorielles pour produire des prévisions crédibles.
Tu génères 3 scénarios (neutre, optimisé, critique) et tu proposes des missions d'accompagnement adaptées.
Tu as accès aux données du cabinet et du secteur pour contextualiser tes analyses.
Tu sais identifier les risques financiers et les opportunités de croissance dès les premiers signaux.`
  });
  
  orchestrator.registerAgent(agent);
  
  return agent;
};

/**
 * Enrichissement des données financières avec des indicateurs calculés
 */
export const enrichFinancialData = (financialData: any): any => {
  if (!financialData || !financialData.financial_history) {
    return financialData;
  }
  
  // Copie profonde pour éviter de modifier l'original
  const enrichedData = JSON.parse(JSON.stringify(financialData));
  
  // Calcul des variations année par année
  enrichedData.financial_history.forEach((year: any, index: number) => {
    if (index > 0) {
      const prevYear = enrichedData.financial_history[index - 1];
      year.variations = {
        revenue: calculateVariation(year.data.revenue, prevYear.data.revenue),
        net_income: calculateVariation(year.data.net_income, prevYear.data.net_income),
        cash: calculateVariation(year.data.cash, prevYear.data.cash)
      };
    } else {
      year.variations = {
        revenue: 0,
        net_income: 0,
        cash: 0
      };
    }
  });
  
  // Calcul des moyennes mobiles
  enrichedData.moving_averages = {
    revenue_growth: 0,
    net_margin: 0,
    days_sales_outstanding: 0
  };
  
  // Utiliser les 3 dernières années ou moins si pas assez de données
  const recentYears = enrichedData.financial_history.slice(-3);
  
  if (recentYears.length > 1) {
    let totalRevenueGrowth = 0;
    let totalNetMargin = 0;
    let totalDSO = 0;
    
    recentYears.forEach((year: any, index: number) => {
      if (index > 0) {
        totalRevenueGrowth += year.variations.revenue;
      }
      
      totalNetMargin += year.data.net_income / year.data.revenue;
      totalDSO += enrichedData.key_ratios[year.year.toString()].days_sales_outstanding;
    });
    
    enrichedData.moving_averages.revenue_growth = totalRevenueGrowth / (recentYears.length - 1);
    enrichedData.moving_averages.net_margin = totalNetMargin / recentYears.length;
    enrichedData.moving_averages.days_sales_outstanding = totalDSO / recentYears.length;
  }
  
  return enrichedData;
}; 