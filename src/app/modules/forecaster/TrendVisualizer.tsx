'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Info, HelpCircle, DollarSign, BarChart3, LineChart, PieChart } from 'lucide-react';
import { ScenarioData } from './ScenarioResults';
import { Tooltip } from '@/components/Tooltip';

interface TrendVisualizerProps {
  hypothesis: string;
  scenarioData: ScenarioData;
  scenarioType: 'optimiste' | 'neutre' | 'pessimiste';
  companyName?: string;
  baseRevenue?: number;
  baseMargin?: number;
}

export default function TrendVisualizer({
  hypothesis,
  scenarioData,
  scenarioType,
  companyName = 'InfoTech Solutions',
  baseRevenue = 920000,
  baseMargin = 10.0
}: TrendVisualizerProps) {
  const [activeTab, setActiveTab] = useState<'revenue' | 'margin' | 'cashflow'>('revenue');
  
  // Extraire les valeurs numériques (enlever les symboles +, %, €, etc.)
  const getNumericValue = (value: string): number => {
    if (!value) return 0;
    // Extraire le pourcentage
    if (value.includes('%')) {
      const percentMatch = value.match(/([+-]?\d+[.,]?\d*)%/);
      if (percentMatch) return parseFloat(percentMatch[1].replace(',', '.'));
    }
    // Extraire les valeurs monétaires (k€, M€)
    if (value.includes('k€')) {
      const keurosMatch = value.match(/([+-]?\d+[.,]?\d*)k€/);
      if (keurosMatch) return parseFloat(keurosMatch[1].replace(',', '.')) * 1000;
    }
    if (value.includes('M€')) {
      const meuroMatch = value.match(/([+-]?\d+[.,]?\d*)M€/);
      if (meuroMatch) return parseFloat(meuroMatch[1].replace(',', '.')) * 1000000;
    }
    // Extraire les nombres simples
    const numMatch = value.match(/([+-]?\d+[.,]?\d*)/);
    if (numMatch) return parseFloat(numMatch[1].replace(',', '.'));
    
    return 0;
  };

  // Extraire la variation de CA en pourcentage
  const revenueChangePercent = getNumericValue(scenarioData.CA);
  
  // Calculer le CA projeté si CA_absolu n'est pas directement fourni
  let projectedRevenue = baseRevenue;
  if (scenarioData.CA_absolu) {
    // Extraire la valeur de CA_absolu si elle est fournie
    const caAbsoluMatch = scenarioData.CA_absolu.match(/(\d+[.,]?\d*)M€/);
    if (caAbsoluMatch) {
      projectedRevenue = parseFloat(caAbsoluMatch[1].replace(',', '.')) * 1000000;
    } else {
      const caAbsoluKMatch = scenarioData.CA_absolu.match(/(\d+[.,]?\d*)k€/);
      if (caAbsoluKMatch) {
        projectedRevenue = parseFloat(caAbsoluKMatch[1].replace(',', '.')) * 1000;
      }
    }
  } else if (revenueChangePercent) {
    // Calculer en fonction du pourcentage si CA_absolu n'est pas fourni
    projectedRevenue = baseRevenue * (1 + revenueChangePercent / 100);
  }
  
  // Extraire la marge projetée
  const projectedMargin = getNumericValue(scenarioData.marge);
  
  // Générer des projections sur 3 ans
  const generateProjections = () => {
    const years = ['2024', '2025', '2026', '2027'];
    let currentRevenue = baseRevenue;
    let currentMargin = baseMargin;
    
    const projections = years.map((year, index) => {
      if (index === 0) {
        return {
          year,
          revenue: baseRevenue,
          margin: baseMargin,
          profit: baseRevenue * (baseMargin / 100)
        };
      } else if (index === 1) {
        return {
          year,
          revenue: projectedRevenue,
          margin: projectedMargin,
          profit: projectedRevenue * (projectedMargin / 100)
        };
      } else {
        // Croissance continue pour les années suivantes, mais à un rythme plus modéré
        const growthFactor = scenarioType === 'optimiste' ? 1.12 : 
                          scenarioType === 'neutre' ? 1.08 : 1.03;
        
        currentRevenue = currentRevenue * growthFactor;
        // La marge s'améliore légèrement chaque année dans le scénario optimiste
        if (scenarioType === 'optimiste') {
          currentMargin = Math.min(currentMargin + 0.5, 22); // Plafonner à 22%
        } else if (scenarioType === 'pessimiste') {
          currentMargin = Math.max(currentMargin - 0.3, 5); // Plancher à 5%
        }
        
        return {
          year,
          revenue: currentRevenue,
          margin: currentMargin,
          profit: currentRevenue * (currentMargin / 100)
        };
      }
    });
    
    return projections;
  };
  
  const projections = generateProjections();
  
  // Formatter les montants en euros de manière lisible
  const formatCurrency = (amount: number): string => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(2)} M€`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)} k€`;
    }
    return `${amount.toFixed(0)} €`;
  };
  
  // Calculer les dimensions du graphique
  const chartHeight = 400;
  const chartWidth = 500;
  const barWidth = 90;
  const barGap = 20;
  const maxValue = Math.max(...projections.map(p => activeTab === 'revenue' ? p.revenue : 
                                              activeTab === 'margin' ? p.margin * 20000 : p.profit));
  
  // Hauteur fixe plus raisonnable pour le conteneur
  const containerHeight = 500;
  const effectiveChartHeight = containerHeight - 120; // Hauteur utile pour le graphique
  
  // Calculer les points pour la ligne de tendance
  const trendLinePoints = projections.map((proj, index) => {
    const value = activeTab === 'revenue' ? proj.revenue : 
                activeTab === 'margin' ? proj.margin * 20000 : proj.profit;
    const x = index * (barWidth + barGap) + barWidth / 2;
    const y = (containerHeight - 80) - ((value / maxValue) * effectiveChartHeight);
    return `${x},${y}`;
  }).join(' ');
  
  // Obtenir la couleur selon le scénario
  const getScenarioColor = () => {
    switch (scenarioType) {
      case 'optimiste': return { bar: 'rgba(16, 185, 129, 0.7)', text: 'text-success-600', bg: 'bg-success-100', line: '#10b981' };
      case 'pessimiste': return { bar: 'rgba(239, 68, 68, 0.7)', text: 'text-error-600', bg: 'bg-error-100', line: '#ef4444' };
      default: return { bar: 'rgba(59, 130, 246, 0.7)', text: 'text-primary-600', bg: 'bg-primary-100', line: '#3b82f6' };
    }
  };
  
  const colors = getScenarioColor();
  
  // Calculer les dimensions du conteneur en fonction de la hauteur de la fenêtre
  // Utiliser une hauteur fixe beaucoup plus grande
  
  // Calculer les données du graphique en camembert pour la rentabilité
  const calculatePieChartData = () => {
    // On prend la dernière année projetée
    const lastYearData = projections[projections.length - 1];
    const profit = lastYearData.profit;
    const costs = lastYearData.revenue - profit;
    
    return {
      profit,
      costs,
      profitPercentage: (profit / lastYearData.revenue) * 100,
      costsPercentage: 100 - (profit / lastYearData.revenue) * 100
    };
  };
  
  const pieData = calculatePieChartData();
  
  // Calculer les indicateurs de performance financière
  const calculateFinancialIndicators = () => {
    // Calculer le ROI (Return on Investment)
    let roi = 0;
    let paybackPeriod = 0;
    
    // Extraire l'investissement initial
    const investmentMatch = scenarioData.investissements?.match(/(\d+[.,]?\d*)k€/);
    let investment = 0;
    if (investmentMatch) {
      investment = parseFloat(investmentMatch[1].replace(',', '.')) * 1000;
    }
    
    if (investment > 0) {
      // Calculer le profit cumulé sur 3 ans
      const cumulatedProfit = projections.reduce((sum, proj, index) => {
        if (index > 0) { // Exclure l'année de base (2024)
          return sum + proj.profit;
        }
        return sum;
      }, 0);
      
      // ROI sur 3 ans
      roi = ((cumulatedProfit - investment) / investment) * 100;
      
      // Période de remboursement simplifiée
      const averageAnnualProfit = cumulatedProfit / (projections.length - 1);
      paybackPeriod = investment / averageAnnualProfit;
    }
    
    return {
      roi,
      paybackPeriod,
      irr: roi > 30 ? 22.5 : roi > 15 ? 15.8 : 9.4 // IRR simplifié
    };
  };
  
  const financialIndicators = calculateFinancialIndicators();
  
  // Rendre le graphique sélectionné
  const renderChart = () => {
    switch (activeTab) {
      case 'revenue':
        return (
          <div className="my-6" style={{ height: `${containerHeight}px` }}>
            <svg width={chartWidth} height={containerHeight - 40} className="mx-auto">
              {/* Axe des abscisses */}
              <line x1="0" y1={containerHeight - 80} x2={chartWidth} y2={containerHeight - 80} stroke="#e5e7eb" strokeWidth="1" />
              
              {/* Barres pour chaque année */}
              {projections.map((proj, index) => {
                const barHeight = (proj.revenue / maxValue) * effectiveChartHeight;
                const x = index * (barWidth + barGap);
                return (
                  <g key={index}>
                    <rect
                      x={x}
                      y={(containerHeight - 80) - barHeight}
                      width={barWidth}
                      height={barHeight}
                      fill={colors.bar}
                      rx="2"
                    />
                    <text
                      x={x + barWidth / 2}
                      y={(containerHeight - 80) + 20}
                      textAnchor="middle"
                      className="text-xs font-medium"
                    >
                      {proj.year}
                    </text>
                    <text
                      x={x + barWidth / 2}
                      y={(containerHeight - 80) - barHeight - 5}
                      textAnchor="middle"
                      className="text-xs font-medium"
                    >
                      {formatCurrency(proj.revenue)}
                    </text>
                  </g>
                );
              })}
              
              {/* Ligne de tendance */}
              <polyline
                points={trendLinePoints}
                fill="none"
                stroke={colors.line}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-center mt-2">
              <span className={`${colors.text} font-medium`}>
                {revenueChangePercent > 0 ? `+${revenueChangePercent.toFixed(1)}%` : `${revenueChangePercent.toFixed(1)}%`}
              </span>
              <span className="text-sm text-gray-500 ml-1">vs année précédente</span>
            </div>
          </div>
        );
        
      case 'margin':
        return (
          <div className="my-6" style={{ height: `${containerHeight}px` }}>
            <svg width={chartWidth} height={containerHeight - 40} className="mx-auto">
              {/* Axe des abscisses */}
              <line x1="0" y1={containerHeight - 80} x2={chartWidth} y2={containerHeight - 80} stroke="#e5e7eb" strokeWidth="1" />
              
              {/* Barres pour chaque année */}
              {projections.map((proj, index) => {
                const barHeight = (proj.margin * 20000 / maxValue) * effectiveChartHeight; // Facteur pour rendre la marge visible
                const x = index * (barWidth + barGap);
                return (
                  <g key={index}>
                    <rect
                      x={x}
                      y={(containerHeight - 80) - barHeight}
                      width={barWidth}
                      height={barHeight}
                      fill={colors.bar}
                      rx="2"
                    />
                    <text
                      x={x + barWidth / 2}
                      y={(containerHeight - 80) + 20}
                      textAnchor="middle"
                      className="text-xs font-medium"
                    >
                      {proj.year}
                    </text>
                    <text
                      x={x + barWidth / 2}
                      y={(containerHeight - 80) - barHeight - 5}
                      textAnchor="middle"
                      className="text-xs font-medium"
                    >
                      {(projectedMargin - baseMargin).toFixed(1)} points
                    </text>
                  </g>
                );
              })}
              
              {/* Ligne de tendance */}
              <polyline
                points={trendLinePoints}
                fill="none"
                stroke={colors.line}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-center mt-2">
              <span className={`${colors.text} font-medium`}>
                {(projectedMargin - baseMargin).toFixed(1)} points
              </span>
              <span className="text-sm text-gray-500 ml-1">vs année précédente</span>
            </div>
          </div>
        );
        
      case 'cashflow':
        return (
          <div className="my-6 flex flex-col items-center" style={{ height: `${containerHeight}px` }}>
            <div className="flex items-center gap-10 mb-6">
              <div className="text-center">
                <svg width="180" height="180" viewBox="0 0 100 100">
                  {/* Camembert des coûts et marge */}
                  <circle cx="50" cy="50" r="45" fill="rgba(239, 68, 68, 0.2)" />
                  <path
                    d={`M 50 50 L 50 5 A 45 45 0 ${pieData.profitPercentage > 50 ? 1 : 0} 1 ${
                      50 + 45 * Math.sin((pieData.profitPercentage / 100) * Math.PI * 2)
                    } ${
                      50 - 45 * Math.cos((pieData.profitPercentage / 100) * Math.PI * 2)
                    } Z`}
                    fill="rgba(16, 185, 129, 0.7)"
                  />
                  <text x="50" y="45" textAnchor="middle" className="text-sm font-medium">Marge</text>
                  <text x="50" y="60" textAnchor="middle" className="text-lg font-bold">{pieData.profitPercentage.toFixed(1)}%</text>
                </svg>
                <div className="text-xs mt-2">Répartition coûts/marge en 2027</div>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="text-xs text-gray-500 mb-1">ROI sur 3 ans</div>
                  <div className={`text-base font-medium ${financialIndicators.roi > 0 ? 'text-success-600' : 'text-error-600'}`}>
                    {financialIndicators.roi.toFixed(1)}%
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="text-xs text-gray-500 mb-1">Délai de récupération</div>
                  <div className="text-base font-medium">
                    {financialIndicators.paybackPeriod > 0 
                      ? `${financialIndicators.paybackPeriod.toFixed(1)} ans` 
                      : 'Non applicable'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 w-full text-center mt-2">
              <div className="text-xs text-gray-500 mb-1">
                Bénéfice cumulé sur 3 ans
              </div>
              <div className="text-lg font-semibold">
                {formatCurrency(projections.reduce((sum, proj, index) => index > 0 ? sum + proj.profit : sum, 0))}
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm mb-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-700 flex items-center">
          <TrendingUp size={16} className="mr-1.5" />
          Impact sur 3 ans
          <Tooltip text="Projections financières sur 3 ans basées sur le scénario sélectionné. Ces graphiques montrent l'évolution potentielle des principaux indicateurs financiers dans le temps.">
            <HelpCircle size={14} className="ml-1.5 text-gray-400" />
          </Tooltip>
        </h3>
        
        <div className="flex text-xs rounded-md overflow-hidden border border-gray-200">
          <button
            className={`px-3 py-1.5 ${activeTab === 'revenue' ? `${colors.bg} ${colors.text} font-medium` : 'bg-white hover:bg-gray-50'}`}
            onClick={() => setActiveTab('revenue')}
          >
            <BarChart3 size={14} className="inline-block mr-1" />
            CA
          </button>
          <button
            className={`px-3 py-1.5 ${activeTab === 'margin' ? `${colors.bg} ${colors.text} font-medium` : 'bg-white hover:bg-gray-50'}`}
            onClick={() => setActiveTab('margin')}
          >
            <LineChart size={14} className="inline-block mr-1" />
            Marge
          </button>
          <button
            className={`px-3 py-1.5 ${activeTab === 'cashflow' ? `${colors.bg} ${colors.text} font-medium` : 'bg-white hover:bg-gray-50'}`}
            onClick={() => setActiveTab('cashflow')}
          >
            <PieChart size={14} className="inline-block mr-1" />
            Rentabilité
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        {renderChart()}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-between">
        <span>Base de comparaison: CA 2024 de {formatCurrency(baseRevenue)}</span>
        <span className="text-gray-400">Scénario {scenarioType}</span>
      </div>
    </motion.div>
  );
} 