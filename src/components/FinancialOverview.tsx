"use client";

import React, { useState } from 'react';
import { BarChart, TrendingUp, FileText, DollarSign, Percent, RefreshCw, Download, InfoIcon } from 'lucide-react';
import { FinancialMetricsCard } from './FinancialMetricsCard';
import { DataVisualizationCard } from './DataVisualizationCard';
import { FinancialHistory, KeyRatio } from '@/services/clientDataService';
import { Tooltip } from './Tooltip';

interface FinancialOverviewProps {
  financialHistory: FinancialHistory;
  keyRatios: {
    [year: string]: KeyRatio;
  };
  className?: string;
  periodRatio?: number; // Ratio pour le prorata des données (0-1)
  showSources?: boolean; // Afficher les sources des données
}

export const FinancialOverview: React.FC<FinancialOverviewProps> = ({
  financialHistory,
  keyRatios,
  className,
  periodRatio = 1, // Valeur par défaut = année complète
  showSources = true
}) => {
  // Add state for button loading indicators
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  
  // Function to handle refresh action
  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate API call with shorter timeout (300ms instead of 500ms)
    setTimeout(() => {
      setRefreshing(false);
    }, 300);
  };
  
  // Function to handle export action
  const handleExport = () => {
    setExporting(true);
    // Simulate export operation
    setTimeout(() => {
      setExporting(false);
      // Here you would trigger the actual export logic
    }, 300);
  };

  // Obtenir les années des données financières, triées
  const years = Object.keys(financialHistory).sort();
  const latestYear = years[years.length - 1];
  const previousYear = years[years.length - 2];
  
  // Fonctions de formatage
  const formatEuros = (amount: number) => {
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(1) + ' M€';
    }
    return amount.toLocaleString('fr-FR') + ' €';
  };
  
  const formatPercent = (value: number) => {
    return value.toFixed(1) + '%';
  };
  
  // Calculer les variations
  const calculateVariation = (current: number, previous: number) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };
  
  // Appliquer le prorata aux données selon la période sélectionnée
  const applyPeriodRatio = (value: number, type: 'flow' | 'stock' = 'flow') => {
    // Les données de type flux (CA, résultat...) sont proportionnelles à la période
    if (type === 'flow') {
      return value * periodRatio;
    }
    // Les données de type stock (bilan) ne sont pas affectées par la période
    return value;
  };
  
  // Préparer les données pour les graphiques avec prorata
  const revenueChartData = years.map(year => ({
    label: year,
    value: applyPeriodRatio(financialHistory[year].revenue)
  }));
  
  const profitChartData = years.map(year => ({
    label: year,
    value: applyPeriodRatio(financialHistory[year].net_income)
  }));
  
  const marginData = [
    { 
      label: 'Marge brute', 
      value: keyRatios[latestYear].gross_margin * 100, 
      benchmark: 45.5,
      unit: '%',
      status: keyRatios[latestYear].gross_margin > 0.45 ? 'positive' : 'negative' 
    },
    { 
      label: 'Marge nette', 
      value: keyRatios[latestYear].net_margin * 100, 
      benchmark: 12.3,
      unit: '%',
      status: keyRatios[latestYear].net_margin > 0.1 ? 'positive' : 'negative'
    },
    { 
      label: 'Ratio courant', 
      value: keyRatios[latestYear].current_ratio, 
      benchmark: 1.5,
      status: keyRatios[latestYear].current_ratio > 1.2 ? 'positive' : 'negative'
    }
  ];
  
  // Données pour le bilan simplifié
  const balanceSheetData = [
    { 
      name: 'Trésorerie', 
      value: applyPeriodRatio(financialHistory[latestYear].cash, 'stock'),
      previousValue: previousYear ? applyPeriodRatio(financialHistory[previousYear].cash, 'stock') : 0,
      type: 'stock'
    },
    { 
      name: 'Créances clients', 
      value: applyPeriodRatio(financialHistory[latestYear].accounts_receivable, 'stock'),
      previousValue: previousYear ? applyPeriodRatio(financialHistory[previousYear].accounts_receivable, 'stock') : 0,
      type: 'stock'
    },
    { 
      name: 'Dettes fournisseurs', 
      value: applyPeriodRatio(financialHistory[latestYear].accounts_payable, 'stock'),
      previousValue: previousYear ? applyPeriodRatio(financialHistory[previousYear].accounts_payable, 'stock') : 0,
      type: 'stock'
    },
    { 
      name: 'Capitaux propres', 
      value: applyPeriodRatio(financialHistory[latestYear].equity, 'stock'),
      previousValue: previousYear ? applyPeriodRatio(financialHistory[previousYear].equity, 'stock') : 0,
      type: 'stock'
    }
  ];
  
  // Données pour les ratios clés
  const keyRatiosTableData = [
    {
      'Ratio': 'BFR en jours de CA',
      'Valeur': Math.round(keyRatios[latestYear].days_sales_outstanding) + ' jours',
      'Tendance': calculateVariation(
        keyRatios[latestYear].days_sales_outstanding,
        previousYear ? keyRatios[previousYear].days_sales_outstanding : 0
      ) > 0 ? '↑' : '↓',
      'Secteur': '45 jours'
    },
    {
      'Ratio': 'Dette / Capitaux propres',
      'Valeur': keyRatios[latestYear].debt_to_equity.toFixed(2),
      'Tendance': calculateVariation(
        keyRatios[latestYear].debt_to_equity,
        previousYear ? keyRatios[previousYear].debt_to_equity : 0
      ) > 0 ? '↑' : '↓',
      'Secteur': '0.8'
    }
  ];
  
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Info sur la période */}
      {periodRatio < 1 && (
        <div className="bg-blue-50 border border-blue-100 rounded-md p-3 flex items-start text-sm text-blue-700">
          <InfoIcon className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Données financières ajustées</p>
            <p className="text-blue-600 mt-0.5">
              Les indicateurs de type "flux" (CA, résultat...) sont affichés au prorata de la période sélectionnée ({(periodRatio * 100).toFixed(0)}% de l'année).
              Les données de type "stock" (bilan) ne sont pas impactées.
            </p>
          </div>
        </div>
      )}
      
      {/* Action buttons */}
      <div className="flex justify-between items-center">
        {showSources && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500">Sources:</span>
            <span className="px-1.5 py-0.5 rounded-full bg-primary-50 text-primary-600 text-xs font-medium">Liasse fiscale</span>
            <span className="px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">Tableau de bord</span>
          </div>
        )}
        
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center justify-center py-1.5 px-3 text-xs font-medium rounded-md text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            {refreshing ? (
              <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            )}
            Actualiser
          </button>
          
          <button
            onClick={handleExport}
            disabled={exporting}
            className="inline-flex items-center justify-center py-1.5 px-3 text-xs font-medium rounded-md text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            {exporting ? (
              <Download className="h-3.5 w-3.5 mr-1.5 animate-pulse" />
            ) : (
              <Download className="h-3.5 w-3.5 mr-1.5" />
            )}
            Exporter
          </button>
        </div>
      </div>
      
      {/* Métriques principales - Utilisation de cartes indépendantes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <FinancialMetricsCard
          title="Chiffre d'affaires"
          icon={<BarChart size={16} />}
          metrics={[
            {
              label: latestYear,
              value: formatEuros(applyPeriodRatio(financialHistory[latestYear].revenue)),
              trend: calculateVariation(
                financialHistory[latestYear].revenue,
                previousYear ? financialHistory[previousYear].revenue : 0
              ),
              status: financialHistory[latestYear].revenue > (previousYear ? financialHistory[previousYear].revenue : 0) ? 'positive' : 'negative'
            },
            {
              label: 'Dépenses',
              value: formatEuros(applyPeriodRatio(financialHistory[latestYear].expenses)),
              trend: calculateVariation(
                financialHistory[latestYear].expenses,
                previousYear ? financialHistory[previousYear].expenses : 0
              ),
              status: financialHistory[latestYear].expenses < (previousYear ? financialHistory[previousYear].expenses : 0) ? 'positive' : 'negative'
            }
          ]}
          chartData={{
            type: 'bar',
            data: years.map(year => applyPeriodRatio(financialHistory[year].revenue)),
            labels: years,
            colors: ['bg-primary-500', 'bg-primary-400', 'bg-primary-300']
          }}
          info="Évolution du chiffre d'affaires sur les dernières années"
        />
      
        <FinancialMetricsCard
          title="Résultat net"
          icon={<TrendingUp size={16} />}
          metrics={[
            {
              label: latestYear,
              value: formatEuros(applyPeriodRatio(financialHistory[latestYear].net_income)),
              trend: calculateVariation(
                financialHistory[latestYear].net_income,
                previousYear ? financialHistory[previousYear].net_income : 0
              ),
              status: financialHistory[latestYear].net_income > (previousYear ? financialHistory[previousYear].net_income : 0) ? 'positive' : 'negative'
            },
            {
              label: 'Marge nette',
              value: formatPercent(keyRatios[latestYear].net_margin * 100),
              trend: calculateVariation(
                keyRatios[latestYear].net_margin,
                previousYear ? keyRatios[previousYear].net_margin : 0
              ),
              status: keyRatios[latestYear].net_margin > (previousYear ? keyRatios[previousYear].net_margin : 0) ? 'positive' : 'negative'
            }
          ]}
          chartData={{
            type: 'line',
            data: years.map(year => applyPeriodRatio(financialHistory[year].net_income)),
            labels: years,
            colors: ['#34D399']
          }}
          info="Évolution du résultat net sur les dernières années"
        />
      
        <div className="lg:col-span-1">
          <FinancialMetricsCard
            title="Ratios"
            icon={<Percent size={16} />}
            metrics={[
              {
                label: 'Marge brute',
                value: formatPercent(keyRatios[latestYear].gross_margin * 100),
                trend: calculateVariation(
                  keyRatios[latestYear].gross_margin,
                  previousYear ? keyRatios[previousYear].gross_margin : 0
                ),
                status: keyRatios[latestYear].gross_margin > (previousYear ? keyRatios[previousYear].gross_margin : 0) ? 'positive' : 'negative',
                comparison: {
                  label: 'Secteur',
                  value: '45.5%'
                }
              },
              {
                label: 'BFR en jours',
                value: Math.round(keyRatios[latestYear].days_sales_outstanding) + ' j',
                trend: calculateVariation(
                  keyRatios[latestYear].days_sales_outstanding,
                  previousYear ? keyRatios[previousYear].days_sales_outstanding : 0
                ) * -1, // Inverser car un BFR en diminution est positif
                status: keyRatios[latestYear].days_sales_outstanding < (previousYear ? keyRatios[previousYear].days_sales_outstanding : 0) ? 'positive' : 'negative',
                comparison: {
                  label: 'Secteur',
                  value: '45 j'
                }
              }
            ]}
            chartData={{
              type: 'area',
              data: years.map(year => keyRatios[year].gross_margin * 100),
              labels: years,
              colors: ['rgba(99, 102, 241, 0.6)']
            }}
            info="Indicateurs clés de rentabilité comparés au secteur"
          />
        </div>
        
        {/* Graphiques financiers */}
        <div className="lg:col-span-2">
          <DataVisualizationCard
            title="Positionnement sectoriel"
            description="Indicateurs financiers comparés à la moyenne du secteur"
            icon={<FileText size={16} />}
            type="comparison"
            data={marginData}
            showControls={true}
            info="Données sectorielles basées sur un échantillon de 1160 entreprises similaires"
          />
        </div>
        
        <div className="lg:col-span-1">
          <DataVisualizationCard
            title="Bilan simplifié"
            description={`Situation au 31/12/${latestYear}`}
            icon={<DollarSign size={16} />}
            type="table"
            data={balanceSheetData.map(item => ({
              'Poste': item.name,
              'Valeur': formatEuros(item.value),
              'Var': calculateVariation(item.value, item.previousValue) > 0 ? '↑' : '↓'
            }))}
            info="Postes principaux du bilan"
          />
        </div>
      </div>
    </div>
  );
};