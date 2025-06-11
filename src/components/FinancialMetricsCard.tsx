"use client";

import React from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import { NetworkElement } from './NetworkElements';
import { TrendingUp, Info } from 'lucide-react';
import { Tooltip } from './Tooltip';

// Types d'éléments graphiques
type ChartType = 'bar' | 'line' | 'area' | 'pie' | 'donut';

// Props pour FinancialMetricsCard
interface FinancialMetricsCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  metrics: {
    label: string;
    value: string | number;
    trend?: number;
    status?: 'positive' | 'negative' | 'neutral';
    comparison?: {
      value: string | number;
      label: string;
    };
  }[];
  chartData?: {
    type: ChartType;
    data: any[];
    colors?: string[];
    labels?: string[];
    height?: number;
  };
  info?: string;
  className?: string;
}

export const FinancialMetricsCard: React.FC<FinancialMetricsCardProps> = ({
  title,
  subtitle,
  icon,
  metrics,
  chartData,
  info,
  className
}) => {
  // Fonction pour déterminer la couleur d'une tendance
  const getTrendColor = (trend?: number, status?: 'positive' | 'negative' | 'neutral') => {
    if (status === 'positive') return 'text-success-500';
    if (status === 'negative') return 'text-error-500';
    if (trend && trend > 0) return 'text-success-500';
    if (trend && trend < 0) return 'text-error-500';
    return 'text-gray-500';
  };

  // Fonction pour formater une tendance en pourcentage
  const formatTrend = (trend?: number) => {
    if (!trend) return null;
    const sign = trend > 0 ? '+' : '';
    return `${sign}${trend.toFixed(1)}%`;
  };

  // Rendu du graphique
  const renderChart = () => {
    if (!chartData) return null;

    if (chartData.type === 'bar') {
      return (
        <div className="h-32 w-full flex items-end justify-around gap-1">
          {chartData.data.map((value, index) => {
            const maxValue = Math.max(...chartData.data);
            const height = value === 0 ? 0 : Math.max((value / maxValue) * 100, 5);
            
            return (
              <div key={index} className="flex flex-col items-center">
                <div className="relative flex-1 w-full flex items-end">
                  <div
                    className={`w-6 rounded-t-sm ${chartData.colors?.[index] || 'bg-primary-500'} hover:opacity-75 transition-all`}
                    style={{ height: `${height}%` }}
                  />
                </div>
                {chartData.labels && (
                  <span className="text-xs text-gray-500 mt-2">{chartData.labels[index]}</span>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    if (chartData.type === 'line' || chartData.type === 'area') {
      // Simplistic area/line chart - in real app use a proper chart library
      return (
        <div className="h-32 w-full relative">
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 100 100" 
            preserveAspectRatio="none"
            className="overflow-visible"
          >
            {/* Base line */}
            <line x1="0" y1="95" x2="100" y2="95" stroke="#f1f5f9" strokeWidth="1" />
            
            {/* Vertical grid lines */}
            {chartData.data.map((_, index) => {
              const x = (index / (chartData.data.length - 1)) * 100;
              return (
                <line 
                  key={`grid-${index}`} 
                  x1={x} 
                  y1="0" 
                  x2={x} 
                  y2="95" 
                  stroke="#f1f5f9" 
                  strokeWidth="1" 
                />
              );
            })}
            
            {/* Area under curve */}
            {chartData.type === 'area' && (
              <path
                d={`
                  M 0 ${100 - (chartData.data[0] / Math.max(...chartData.data)) * 90}
                  ${chartData.data.map((value, index) => {
                    const x = (index / (chartData.data.length - 1)) * 100;
                    const y = 100 - (value / Math.max(...chartData.data)) * 90;
                    return `L ${x} ${y}`;
                  }).join(' ')}
                  L 100 95
                  L 0 95
                  Z
                `}
                fill={chartData.colors?.[0] || 'rgba(99, 102, 241, 0.1)'}
              />
            )}
            
            {/* Line */}
            <path
              d={`
                M 0 ${100 - (chartData.data[0] / Math.max(...chartData.data)) * 90}
                ${chartData.data.map((value, index) => {
                  const x = (index / (chartData.data.length - 1)) * 100;
                  const y = 100 - (value / Math.max(...chartData.data)) * 90;
                  return `L ${x} ${y}`;
                }).join(' ')}
              `}
              fill="none"
              stroke={chartData.colors?.[0] || 'rgb(99, 102, 241)'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Data points */}
            {chartData.data.map((value, index) => {
              const x = (index / (chartData.data.length - 1)) * 100;
              const y = 100 - (value / Math.max(...chartData.data)) * 90;
              return (
                <circle
                  key={`point-${index}`}
                  cx={x}
                  cy={y}
                  r="2"
                  fill="white"
                  stroke={chartData.colors?.[0] || 'rgb(99, 102, 241)'}
                  strokeWidth="2"
                />
              );
            })}
          </svg>
          
          {chartData.labels && (
            <div className="flex justify-between mt-2">
              {chartData.labels.map((label, index) => (
                <span key={`label-${index}`} className="text-xs text-gray-500">{label}</span>
              ))}
            </div>
          )}
        </div>
      );
    }

    return <div className="h-32 flex items-center justify-center text-gray-400">Graphique non disponible</div>;
  };

  return (
    <Card size="sm" className={`relative overflow-hidden ${className}`}>
      <NetworkElement 
        type="circle" 
        size="xs" 
        position="top-right" 
        color="primary" 
        opacity={0.04} 
      />
      
      <div className="flex items-center justify-between p-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          {icon && <div className="text-primary-500">{icon}</div>}
          <div>
            <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
        </div>
        
        {info && (
          <Tooltip text={info}>
            <Info className="h-3.5 w-3.5 text-gray-400" />
          </Tooltip>
        )}
      </div>
      
      <div className="p-4">
        {/* Métriques principales */}
        <div className={`grid ${metrics.length > 3 ? 'grid-cols-2' : 'grid-cols-1'} gap-3 mb-4`}>
          {metrics.map((metric, index) => (
            <div key={index} className="flex flex-col">
              <div className="text-xs text-gray-500 mb-1">{metric.label}</div>
              <div className="flex items-end gap-1.5">
                <span className="text-lg font-semibold text-gray-800">{metric.value}</span>
                {metric.trend !== undefined && (
                  <div className={`flex items-center text-xs ${getTrendColor(metric.trend, metric.status)}`}>
                    <TrendingUp className={`h-3 w-3 mr-0.5 ${metric.trend < 0 ? 'rotate-180' : ''}`} />
                    <span>{formatTrend(metric.trend)}</span>
                  </div>
                )}
              </div>
              {metric.comparison && (
                <div className="text-xs text-gray-500 mt-1">
                  {metric.comparison.label}: {metric.comparison.value}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Graphique */}
        {chartData && renderChart()}
      </div>
    </Card>
  );
}; 