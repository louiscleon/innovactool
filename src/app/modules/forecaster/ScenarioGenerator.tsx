'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface DataPoint {
  month: number;
  value: number;
}

interface Scenario {
  name: string;
  description: string;
  revenue_projection: DataPoint[];
  cash_projection: DataPoint[];
  working_capital_projection: DataPoint[];
  risks: string[];
  opportunities: string[];
}

interface Scenarios {
  neutral: Scenario;
  optimized: Scenario;
  critical: Scenario;
  [key: string]: Scenario;
}

interface ScenarioGeneratorProps {
  scenarios: Scenarios;
}

export default function ScenarioGenerator({ scenarios }: ScenarioGeneratorProps) {
  const [selectedScenario, setSelectedScenario] = useState<string>('neutral');
  const [selectedMetric, setSelectedMetric] = useState<string>('revenue');
  
  const getMetricTitle = (metric: string): string => {
    switch (metric) {
      case 'revenue': return 'Chiffre d\'affaires';
      case 'cash': return 'Trésorerie';
      case 'working_capital': return 'BFR';
      default: return 'Métrique';
    }
  };
  
  const getMetricData = (scenario: Scenario, metric: string): DataPoint[] => {
    switch (metric) {
      case 'revenue': return scenario.revenue_projection;
      case 'cash': return scenario.cash_projection;
      case 'working_capital': return scenario.working_capital_projection;
      default: return [];
    }
  };
  
  // Mock chart rendering - in production, use a real chart library
  const renderChart = (data: DataPoint[]) => {
    // Get min and max values for scaling
    const values = data.map(d => d.value);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const range = maxValue - minValue;
    
    return (
      <div className="bg-white p-4 rounded-lg w-full h-64 relative overflow-hidden">
        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 text-xs text-gray-500">
          <span>M1</span>
          <span>M6</span>
          <span>M12</span>
          <span>M18</span>
          <span>M24</span>
        </div>
        
        {/* Y-axis values */}
        <div className="absolute top-0 left-0 bottom-8 flex flex-col justify-between items-start text-xs text-gray-500">
          <span>{Math.round(maxValue / 1000)}k</span>
          <span>{Math.round((maxValue + minValue) / 2000)}k</span>
          <span>{Math.round(minValue / 1000)}k</span>
        </div>
        
        {/* Chart area */}
        <div className="absolute top-6 left-10 right-4 bottom-8 flex items-end">
          {data.slice(0, 24).map((point, i) => {
            const height = ((point.value - minValue) / range) * 100;
            const color = selectedScenario === 'neutral' ? 'bg-primary-500' : 
                           selectedScenario === 'optimized' ? 'bg-success-500' : 'bg-error-500';
            
            return (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.5, delay: i * 0.02 }}
                className={`${color} w-1 mx-0.5 rounded-t-sm`}
                style={{ height: `${height}%` }}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4">Scénarios de prévision</h3>
      
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setSelectedScenario('neutral')}
          className={`px-4 py-2 rounded-lg flex-1 font-medium text-sm transition-colors ${
            selectedScenario === 'neutral' 
              ? 'bg-primary-500 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Neutre
        </button>
        <button
          onClick={() => setSelectedScenario('optimized')}
          className={`px-4 py-2 rounded-lg flex-1 font-medium text-sm transition-colors ${
            selectedScenario === 'optimized' 
              ? 'bg-success-500 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Optimisé
        </button>
        <button
          onClick={() => setSelectedScenario('critical')}
          className={`px-4 py-2 rounded-lg flex-1 font-medium text-sm transition-colors ${
            selectedScenario === 'critical' 
              ? 'bg-error-500 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Critique
        </button>
      </div>
      
      <div className="mb-4">
        <h4 className="text-md font-semibold mb-2">{scenarios[selectedScenario].name}</h4>
        <p className="text-sm text-gray-600 mb-4">{scenarios[selectedScenario].description}</p>
      </div>
      
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setSelectedMetric('revenue')}
          className={`px-4 py-2 rounded-lg flex-1 font-medium text-sm transition-colors ${
            selectedMetric === 'revenue' 
              ? 'bg-gray-700 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          CA
        </button>
        <button
          onClick={() => setSelectedMetric('cash')}
          className={`px-4 py-2 rounded-lg flex-1 font-medium text-sm transition-colors ${
            selectedMetric === 'cash' 
              ? 'bg-gray-700 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Trésorerie
        </button>
        <button
          onClick={() => setSelectedMetric('working_capital')}
          className={`px-4 py-2 rounded-lg flex-1 font-medium text-sm transition-colors ${
            selectedMetric === 'working_capital' 
              ? 'bg-gray-700 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          BFR
        </button>
      </div>
      
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Évolution sur 24 mois ({getMetricTitle(selectedMetric)})</h4>
        {renderChart(getMetricData(scenarios[selectedScenario], selectedMetric))}
      </div>
      
      <div className="grid grid-cols-2 gap-6 mt-6">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Risques identifiés</h4>
          <ul className="space-y-1">
            {scenarios[selectedScenario].risks.map((risk, idx) => (
              <li key={idx} className="text-sm flex items-start">
                <span className="mt-1 mr-2 w-2 h-2 rounded-full bg-error-500"></span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Opportunités</h4>
          <ul className="space-y-1">
            {scenarios[selectedScenario].opportunities.map((opp, idx) => (
              <li key={idx} className="text-sm flex items-start">
                <span className="mt-1 mr-2 w-2 h-2 rounded-full bg-success-500"></span>
                <span>{opp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 