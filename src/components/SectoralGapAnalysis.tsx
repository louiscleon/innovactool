import React from 'react';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { NetworkElement } from '@/components/NetworkElements';
import { BarChart2, TrendingUp, TrendingDown, Minus, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface GapItem {
  id: string;
  account: string;
  description: string;
  amount: number;
  sectorAverage: number;
  gap: number;
  gapPercent: number;
  status: 'above' | 'below' | 'normal';
  criticality: 'high' | 'medium' | 'low';
  causes?: string[];
  recommendations?: string[];
}

interface SectoralGapAnalysisProps {
  gaps: GapItem[];
  sector: string;
  companyName: string;
}

const formatEuros = (amount: number) => {
  return amount.toLocaleString('fr-FR') + ' €';
};

const formatPercent = (value: number) => {
  return value > 0 
    ? `+${value.toFixed(1)}%`
    : value < 0
      ? `${value.toFixed(1)}%`
      : '0%';
};

export const SectoralGapAnalysis: React.FC<SectoralGapAnalysisProps> = ({
  gaps,
  sector,
  companyName
}) => {
  const criticalGaps = gaps.filter(gap => gap.criticality === 'high');
  const significantGaps = gaps.filter(gap => gap.criticality === 'medium');
  const normalGaps = gaps.filter(gap => gap.criticality === 'low');
  
  return (
    <div className="space-y-4">
      <Card size="sm" className="relative overflow-hidden">
        <NetworkElement 
          type="node" 
          size="sm" 
          position="top-right" 
          color="primary" 
          opacity={0.04} 
        />
        
        <div className="flex items-center gap-2 p-3 border-b border-gray-100">
          <BarChart2 className="h-4 w-4 text-primary-500" />
          <h2 className="text-sm font-semibold text-gray-800">Analyse des écarts sectoriels</h2>
        </div>
        
        <div className="p-3">
          <div className="mb-3">
            <p className="text-xs text-gray-600">
              Comparaison des postes comptables de <span className="font-medium">{companyName}</span> avec les moyennes du secteur <span className="font-medium">{sector}</span>.
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-error-50 border border-error-100 rounded-lg p-2 text-center">
              <p className="text-xs text-error-600 mb-1">Critiques</p>
              <p className="text-lg font-semibold text-error-700">
                {criticalGaps.length}
              </p>
            </div>
            <div className="bg-warning-50 border border-warning-100 rounded-lg p-2 text-center">
              <p className="text-xs text-warning-600 mb-1">Significatifs</p>
              <p className="text-lg font-semibold text-warning-700">
                {significantGaps.length}
              </p>
            </div>
            <div className="bg-success-50 border border-success-100 rounded-lg p-2 text-center">
              <p className="text-xs text-success-600 mb-1">Normaux</p>
              <p className="text-lg font-semibold text-success-700">
                {normalGaps.length}
              </p>
            </div>
          </div>
        </div>
      </Card>
      
      {criticalGaps.length > 0 && (
        <Card size="sm" className="relative overflow-hidden">
          <NetworkElement 
            type="connection" 
            size="xs" 
            position="bottom-left" 
            color="primary" 
            opacity={0.04} 
          />
          
          <div className="flex items-center gap-2 p-3 border-b border-gray-100">
            <AlertTriangle className="h-4 w-4 text-error-500" />
            <h2 className="text-sm font-semibold text-gray-800">Écarts critiques</h2>
          </div>
          
          <div className="divide-y divide-gray-100">
            {criticalGaps.map(gap => (
              <GapItemView key={gap.id} gap={gap} />
            ))}
          </div>
        </Card>
      )}
      
      {significantGaps.length > 0 && (
        <Card size="sm" className="relative overflow-hidden">
          <NetworkElement 
            type="wave" 
            size="xs" 
            position="bottom-right" 
            color="secondary" 
            opacity={0.04} 
          />
          
          <div className="flex items-center gap-2 p-3 border-b border-gray-100">
            <TrendingUp className="h-4 w-4 text-warning-500" />
            <h2 className="text-sm font-semibold text-gray-800">Écarts significatifs</h2>
          </div>
          
          <div className="divide-y divide-gray-100">
            {significantGaps.map(gap => (
              <GapItemView key={gap.id} gap={gap} />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

const GapItemView: React.FC<{ gap: GapItem }> = ({ gap }) => {
  return (
    <div className="p-3">
      <div className="flex justify-between items-start mb-1.5">
        <div>
          <h4 className="text-xs font-medium text-gray-800">{gap.account} - {gap.description}</h4>
          <div className="flex items-center text-xs text-gray-500 mt-0.5 space-x-2">
            <span className="font-medium">Montant: {formatEuros(gap.amount)}</span>
            <span className="text-gray-300">•</span>
            <span>Moyenne secteur: {formatEuros(gap.sectorAverage)}</span>
          </div>
        </div>
        <Badge 
          color={
            gap.criticality === 'high' ? 'error' :
            gap.criticality === 'medium' ? 'warning' :
            'success'
          } 
          variant="soft" 
          size="xs"
        >
          {gap.status === 'above' ? '+' : gap.status === 'below' ? '-' : '='} {Math.abs(gap.gapPercent).toFixed(0)}%
        </Badge>
      </div>
      
      <div className="flex items-center mt-2 mb-3">
        <div className="flex-1 bg-gray-100 h-1.5 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${
              gap.status === 'above' ? 'bg-error-500' :
              gap.status === 'below' ? 'bg-warning-500' :
              'bg-success-500'
            }`}
            style={{ 
              width: `${Math.min(Math.abs(gap.gapPercent) / 2, 100)}%`,
              marginLeft: gap.status !== 'below' ? '50%' : 'auto',
              marginRight: gap.status === 'below' ? '50%' : 'auto'
            }}
          ></div>
        </div>
        
        <div className="w-24 pl-2 flex justify-between">
          <div className="flex items-center">
            <TrendingDown className="h-3 w-3 text-warning-500 mr-0.5" />
            <span className="text-xs">-50%</span>
          </div>
          <div className="flex items-center">
            <TrendingUp className="h-3 w-3 text-error-500 mr-0.5" />
            <span className="text-xs">+50%</span>
          </div>
        </div>
      </div>
      
      {(gap.causes && gap.causes.length > 0) && (
        <div className="mb-2">
          <p className="text-xs font-medium text-gray-700 mb-1">Causes potentielles:</p>
          <ul className="text-xs text-gray-600 pl-4 list-disc">
            {gap.causes.map((cause, index) => (
              <li key={index}>{cause}</li>
            ))}
          </ul>
        </div>
      )}
      
      {(gap.recommendations && gap.recommendations.length > 0) && (
        <div>
          <p className="text-xs font-medium text-gray-700 mb-1">Recommandations:</p>
          <ul className="text-xs text-gray-600 pl-4 list-disc">
            {gap.recommendations.map((recommendation, index) => (
              <li key={index}>{recommendation}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};