import React from 'react';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { NetworkElement } from '@/components/NetworkElements';
import { Building2, Users, TrendingUp, BarChart2, Briefcase, Info, Globe, FileText } from 'lucide-react';

interface Director {
  id: string;
  name: string;
  role: string;
  since: string;
  otherMandates?: string[];
}

interface LegalInfo {
  name: string;
  siren: string;
  legalForm: string;
  creationDate: string;
  address: string;
  capital: number;
  directors: Director[];
}

interface FinancialInfo {
  revenue: number;
  revenue_trend: string;
  operating_profit: number;
  operating_margin: number;
  net_profit: number;
  net_margin: number;
  cash: number;
  equity: number;
  debt: number;
  wc_requirement: number;
}

interface SectorPosition {
  sector: string;
  naf_code: string;
  ranking: number;
  total_companies: number;
  growth_percentile: number;
  profitability_percentile: number;
  financial_health_score: number;
}

interface NewsItem {
  id: string;
  date: string;
  title: string;
  source: string;
  type: 'company' | 'sector' | 'regulatory';
  impact: 'positive' | 'negative' | 'neutral';
}

interface MissionRecommendation {
  id: string;
  title: string;
  description: string;
  benefit: string;
  relevance: number;
  type: 'strategic' | 'financial' | 'operational' | 'regulatory';
}

interface ClientProfileProps {
  legalInfo: LegalInfo;
  financialInfo: FinancialInfo;
  sectorPosition: SectorPosition;
  news: NewsItem[];
  recommendedMissions: MissionRecommendation[];
}

const formatEuros = (amount: number) => {
  return amount.toLocaleString('fr-FR') + ' €';
};

const formatPercent = (value: number) => {
  return (value * 100).toFixed(1) + '%';
};

export const ClientProfileView: React.FC<ClientProfileProps> = ({
  legalInfo,
  financialInfo,
  sectorPosition,
  news,
  recommendedMissions
}) => {
  return (
    <div className="space-y-4">
      {/* Identité légale */}
      <Card size="sm" className="relative overflow-hidden">
        <NetworkElement 
          type="node" 
          size="sm" 
          position="top-right" 
          color="primary" 
          opacity={0.04} 
        />
        
        <div className="flex items-center gap-2 p-3 border-b border-gray-100">
          <Building2 className="h-4 w-4 text-primary-500" />
          <h2 className="text-sm font-semibold text-gray-800">Identité légale</h2>
        </div>
        
        <div className="p-3">
          <div className="flex justify-between mb-2">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-800">{legalInfo.name}</h3>
              <p className="text-xs text-gray-500">{legalInfo.legalForm}</p>
            </div>
            <Badge color="primary" variant="soft" size="xs">
              {sectorPosition.sector}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <p className="text-xs text-gray-500">SIREN</p>
              <p className="text-xs font-medium">{legalInfo.siren}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Date de création</p>
              <p className="text-xs font-medium">{legalInfo.creationDate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Capital social</p>
              <p className="text-xs font-medium">{formatEuros(legalInfo.capital)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Code NAF</p>
              <p className="text-xs font-medium">{sectorPosition.naf_code}</p>
            </div>
          </div>
          
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Adresse</p>
            <p className="text-xs">{legalInfo.address}</p>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 mb-1">Direction</p>
            <div className="space-y-1">
              {legalInfo.directors.map(director => (
                <div key={director.id} className="text-xs">
                  <span className="font-medium">{director.name}</span> - {director.role}
                  {director.otherMandates && director.otherMandates.length > 0 && (
                    <span className="text-xs text-primary-500 ml-1 cursor-pointer" title={director.otherMandates.join(', ')}>
                      ({director.otherMandates.length} autres mandats)
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
      
      {/* Performance financière */}
      <Card size="sm" className="relative overflow-hidden">
        <NetworkElement 
          type="connection" 
          size="sm" 
          position="bottom-left" 
          color="secondary" 
          opacity={0.04} 
        />
        
        <div className="flex items-center gap-2 p-3 border-b border-gray-100">
          <TrendingUp className="h-4 w-4 text-primary-500" />
          <h2 className="text-sm font-semibold text-gray-800">Performance financière</h2>
        </div>
        
        <div className="p-3">
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-3">
            <div>
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-xs text-gray-500">Chiffre d'affaires</p>
                <Badge 
                  color={financialInfo.revenue_trend === 'up' ? 'success' : 'error'} 
                  variant="soft" 
                  size="xs"
                >
                  {financialInfo.revenue_trend === 'up' ? '+' : '-'}
                </Badge>
              </div>
              <p className="text-sm font-medium">{formatEuros(financialInfo.revenue)}</p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Résultat d'exploitation</p>
              <p className="text-sm font-medium">{formatEuros(financialInfo.operating_profit)}</p>
              <p className="text-xs text-gray-500">
                Marge: {formatPercent(financialInfo.operating_margin)}
              </p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Résultat net</p>
              <p className="text-sm font-medium">{formatEuros(financialInfo.net_profit)}</p>
              <p className="text-xs text-gray-500">
                Marge: {formatPercent(financialInfo.net_margin)}
              </p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Trésorerie</p>
              <p className="text-sm font-medium">{formatEuros(financialInfo.cash)}</p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Capitaux propres</p>
              <p className="text-sm font-medium">{formatEuros(financialInfo.equity)}</p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Endettement</p>
              <p className="text-sm font-medium">{formatEuros(financialInfo.debt)}</p>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Positionnement sectoriel */}
      <Card size="sm" className="relative overflow-hidden">
        <NetworkElement 
          type="node" 
          size="xs" 
          position="bottom-right" 
          color="primary" 
          opacity={0.04} 
        />
        
        <div className="flex items-center gap-2 p-3 border-b border-gray-100">
          <BarChart2 className="h-4 w-4 text-primary-500" />
          <h2 className="text-sm font-semibold text-gray-800">Positionnement sectoriel</h2>
        </div>
        
        <div className="p-3">
          <div className="flex items-center mb-3">
            <p className="text-xs">Classement:</p>
            <p className="text-sm font-medium ml-1">{sectorPosition.ranking}</p>
            <p className="text-xs text-gray-500 ml-1">sur {sectorPosition.total_companies} entreprises du secteur</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Croissance</p>
              <div className="flex items-center">
                <div className="flex-1 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-success-500 h-full rounded-full" 
                    style={{ width: `${sectorPosition.growth_percentile}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-xs font-medium">{sectorPosition.growth_percentile}%</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Percentile du secteur</p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 mb-1">Rentabilité</p>
              <div className="flex items-center">
                <div className="flex-1 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary-500 h-full rounded-full" 
                    style={{ width: `${sectorPosition.profitability_percentile}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-xs font-medium">{sectorPosition.profitability_percentile}%</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Percentile du secteur</p>
            </div>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 mb-1">Santé financière globale</p>
            <div className="flex items-center">
              <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    sectorPosition.financial_health_score >= 75 ? 'bg-success-500' :
                    sectorPosition.financial_health_score >= 50 ? 'bg-warning-500' :
                    'bg-error-500'
                  }`}
                  style={{ width: `${sectorPosition.financial_health_score}%` }}
                ></div>
              </div>
              <span className="ml-2 text-xs font-medium">{sectorPosition.financial_health_score}/100</span>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Actualité de l'entreprise */}
      <Card size="sm" className="relative overflow-hidden">
        <NetworkElement 
          type="connection" 
          size="xs" 
          position="top-left" 
          color="primary" 
          opacity={0.04} 
        />
        
        <div className="flex items-center gap-2 p-3 border-b border-gray-100">
          <Globe className="h-4 w-4 text-primary-500" />
          <h2 className="text-sm font-semibold text-gray-800">Actualité récente</h2>
        </div>
        
        <div className="p-3 divide-y divide-gray-100">
          {news.length > 0 ? (
            news.map(item => (
              <div key={item.id} className="py-2 first:pt-0 last:pb-0">
                <div className="flex justify-between items-start mb-0.5">
                  <h4 className="text-xs font-medium">{item.title}</h4>
                  <Badge 
                    color={
                      item.impact === 'positive' ? 'success' :
                      item.impact === 'negative' ? 'error' :
                      'info'
                    } 
                    variant="soft" 
                    size="xs"
                  >
                    {item.impact}
                  </Badge>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{item.source}</span>
                  <span>{item.date}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-500">Aucune actualité récente</p>
          )}
        </div>
      </Card>
      
      {/* Missions recommandées */}
      <Card size="sm" className="relative overflow-hidden">
        <NetworkElement 
          type="node" 
          size="sm" 
          position="bottom-right" 
          color="primary" 
          opacity={0.04} 
        />
        
        <div className="flex items-center gap-2 p-3 border-b border-gray-100">
          <Briefcase className="h-4 w-4 text-primary-500" />
          <h2 className="text-sm font-semibold text-gray-800">Missions stratégiques recommandées</h2>
        </div>
        
        <div className="p-3 space-y-3">
          {recommendedMissions.map(mission => (
            <div key={mission.id} className="p-2 bg-gray-50 rounded-md border border-gray-100">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-xs font-medium text-gray-800">{mission.title}</h4>
                <Badge 
                  color={
                    mission.type === 'strategic' ? 'primary' :
                    mission.type === 'financial' ? 'success' :
                    mission.type === 'operational' ? 'warning' :
                    'info'
                  } 
                  variant="soft" 
                  size="xs"
                >
                  {mission.type}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 mb-1.5">{mission.description}</p>
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  <span className="font-medium text-success-600">Bénéfice:</span> {mission.benefit}
                </p>
                <div className="flex items-center text-xs">
                  <span className="text-gray-500 mr-1">Pertinence:</span>
                  <div className="flex space-x-0.5">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div 
                        key={i} 
                        className={`w-1.5 h-1.5 rounded-full ${
                          i <= mission.relevance ? 'bg-primary-500' : 'bg-gray-200'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};