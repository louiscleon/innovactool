"use client";

import React from 'react';
import { Card } from './Card';
import { Tooltip } from './Tooltip';
import { NetworkElement } from './NetworkElements';
import { Info, Download, Filter, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from './Button';

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface ComparisonData {
  label: string;
  value: number;
  benchmark: number;
  unit?: string;
  status?: 'positive' | 'negative' | 'neutral';
}

interface DataVisualizationCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  type: 'pie' | 'radar' | 'comparison' | 'table';
  data: DataPoint[] | ComparisonData[] | any[];
  className?: string;
  showControls?: boolean;
  info?: string;
}

export const DataVisualizationCard: React.FC<DataVisualizationCardProps> = ({
  title,
  description,
  icon,
  type,
  data,
  className,
  showControls = false,
  info
}) => {
  // Pie chart rendering
  const renderPieChart = (chartData: DataPoint[]) => {
    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    let startAngle = 0;
    
    return (
      <div className="flex flex-col items-center py-4">
        <div className="relative w-44 h-44">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {chartData.map((segment, i) => {
              // Calculate angles
              const angle = (segment.value / total) * 360;
              const endAngle = startAngle + angle;
              const largeArc = angle > 180 ? 1 : 0;
              
              // Calculate coordinates
              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;
              const x1 = 50 + 40 * Math.cos(startRad);
              const y1 = 50 + 40 * Math.sin(startRad);
              const x2 = 50 + 40 * Math.cos(endRad);
              const y2 = 50 + 40 * Math.sin(endRad);
              
              // Default colors if not specified
              const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#14b8a6', '#0ea5e9'];
              const segmentColor = segment.color || colors[i % colors.length];
              
              // Create the path
              const path = (
                <path 
                  key={i}
                  d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={segmentColor}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              );
              
              // Update start angle for next segment
              startAngle = endAngle;
              
              return path;
            })}
            <circle cx="50" cy="50" r="30" fill="white" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
            {total.toLocaleString()}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-4 w-full max-w-xs">
          {chartData.map((segment, i) => {
            const colors = ['bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500', 'bg-teal-500', 'bg-sky-500'];
            const bgColor = segment.color ? segment.color : colors[i % colors.length];
            
            return (
              <div key={i} className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: bgColor }}></div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-gray-700">{segment.label}</div>
                  <div className="text-xs text-gray-500">
                    {segment.value.toLocaleString()} ({((segment.value / total) * 100).toFixed(1)}%)
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  // Radar/Spider chart rendering (simplified version)
  const renderRadarChart = (chartData: DataPoint[]) => {
    const maxValue = Math.max(...chartData.map(item => item.value));
    const centerX = 100;
    const centerY = 100;
    const radius = 70;
    
    // Calculate points on polygon
    const angleStep = (2 * Math.PI) / chartData.length;
    const points = chartData.map((item, i) => {
      const angle = i * angleStep - Math.PI / 2; // Start from top
      const distance = (item.value / maxValue) * radius;
      return {
        x: centerX + distance * Math.cos(angle),
        y: centerY + distance * Math.sin(angle),
        label: item.label,
        value: item.value
      };
    });
    
    // Create polygon points string
    const polygonPoints = points.map(point => `${point.x},${point.y}`).join(' ');
    
    return (
      <div className="flex flex-col items-center py-4">
        <div className="relative w-52 h-52">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Background circles */}
            {[0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => (
              <circle 
                key={i}
                cx={centerX}
                cy={centerY}
                r={radius * scale}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="1"
              />
            ))}
            
            {/* Axis lines */}
            {chartData.map((_, i) => {
              const angle = i * angleStep - Math.PI / 2;
              const x = centerX + radius * Math.cos(angle);
              const y = centerY + radius * Math.sin(angle);
              
              return (
                <line 
                  key={i}
                  x1={centerX}
                  y1={centerY}
                  x2={x}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
              );
            })}
            
            {/* Data polygon */}
            <polygon 
              points={polygonPoints}
              fill="rgba(99, 102, 241, 0.2)"
              stroke="#6366f1"
              strokeWidth="2"
            />
            
            {/* Data points */}
            {points.map((point, i) => (
              <circle 
                key={i}
                cx={point.x}
                cy={point.y}
                r="4"
                fill="white"
                stroke="#6366f1"
                strokeWidth="2"
              />
            ))}
          </svg>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-4 w-full max-w-xs">
          {chartData.map((item, i) => (
            <div key={i} className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
              <div className="flex-1">
                <div className="text-xs font-medium text-gray-700">{item.label}</div>
                <div className="text-xs text-gray-500">
                  {item.value.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Comparison chart rendering
  const renderComparisonChart = (chartData: ComparisonData[]) => {
    const maxValue = Math.max(...chartData.flatMap(item => [item.value, item.benchmark])) * 1.2;
    
    return (
      <div className="w-full py-4">
        {chartData.map((item, i) => {
          const valuePercent = (item.value / maxValue) * 100;
          const benchmarkPercent = (item.benchmark / maxValue) * 100;
          const isHigherThanBenchmark = item.value > item.benchmark;
          
          // Déterminer la couleur de statut en fonction des conditions
          let statusColor = 'bg-gray-500'; // Valeur par défaut
          
          if (item.status === 'positive' || (isHigherThanBenchmark && item.status !== 'negative')) {
            statusColor = 'bg-success-500';
          } else if (item.status === 'negative' || (!isHigherThanBenchmark && item.status === undefined || item.status === 'neutral')) {
            statusColor = 'bg-error-500';
          }
          
          return (
            <div key={i} className="mb-5">
              <div className="flex items-center justify-between mb-1.5">
                <div className="text-sm font-medium text-gray-700">{item.label}</div>
                <div className="flex items-center">
                  <div className="text-sm font-medium text-gray-700 mr-1">
                    {item.value.toLocaleString()}{item.unit || ''}
                  </div>
                  {isHigherThanBenchmark ? (
                    <TrendingUp className="h-3.5 w-3.5 text-success-500" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5 text-error-500" />
                  )}
                </div>
              </div>
              
              <div className="relative h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                {/* Benchmark line */}
                <div 
                  className="absolute h-full w-0.5 bg-gray-400 z-10" 
                  style={{ left: `${benchmarkPercent}%` }}
                />
                
                {/* Value bar */}
                <div
                  className={`h-full ${statusColor}`}
                  style={{ width: `${valuePercent}%` }}
                />
              </div>
              
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <div>0{item.unit || ''}</div>
                <div className="text-center">
                  Secteur: {item.benchmark.toLocaleString()}{item.unit || ''}
                </div>
                <div>{Math.ceil(maxValue).toLocaleString()}{item.unit || ''}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  // Table rendering
  const renderTable = (tableData: any[]) => {
    if (!tableData.length) return null;
    
    const columns = Object.keys(tableData[0]);
    
    return (
      <div className="w-full overflow-x-auto py-2">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {columns.map((column, i) => (
                <th 
                  key={i}
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableData.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-gray-50">
                {columns.map((column, colIdx) => (
                  <td key={colIdx} className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                    {row[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  // Render main content based on type
  const renderContent = () => {
    switch (type) {
      case 'pie':
        return renderPieChart(data as DataPoint[]);
      case 'radar':
        return renderRadarChart(data as DataPoint[]);
      case 'comparison':
        return renderComparisonChart(data as ComparisonData[]);
      case 'table':
        return renderTable(data);
      default:
        return <div className="p-4 text-center text-gray-500">Type de visualisation non pris en charge</div>;
    }
  };
  
  return (
    <Card className={`relative overflow-hidden ${className}`} size="sm">
      <NetworkElement 
        type="node" 
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
            {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {info && (
            <Tooltip text={info}>
              <Info className="h-3.5 w-3.5 text-gray-400" />
            </Tooltip>
          )}
          
          {showControls && (
            <>
              <Button variant="outline" size="xs">
                <Filter size={14} className="mr-1" />
                Filtrer
              </Button>
              <Button variant="outline" size="xs">
                <Download size={14} className="mr-1" />
                Exporter
              </Button>
            </>
          )}
        </div>
      </div>
      
      {renderContent()}
    </Card>
  );
}; 