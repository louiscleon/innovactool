/**
 * Service centralisé de données client
 * Sert de source unique de vérité pour toutes les données client dans l'application
 */

import { clientData, sectorData } from '@/mock-data/unified-client-data';
import { fetchCompanyData } from './api';

// Types pour les données client
export interface ClientInfo {
  name: string;
  siren: string;
  sector_code: string;
  sector_name: string;
  creation_date: string;
  employees: number;
  legal_form: string;
  address: string;
  capital: number;
  directors: Array<{
    name: string;
    role: string;
    since: string;
  }>;
}

export interface FinancialData {
  revenue: number;
  expenses: number;
  net_income: number;
  cash: number;
  accounts_receivable: number;
  accounts_payable: number;
  working_capital: number;
  debt: number;
  equity: number;
  quarterly?: Array<{
    quarter: string;
    revenue: number;
    expenses: number;
    net_income: number;
  }>;
}

export interface KeyRatio {
  gross_margin: number;
  net_margin: number;
  debt_to_equity: number;
  current_ratio: number;
  days_sales_outstanding: number;
}

export interface FinancialHistory {
  [year: string]: FinancialData;
}

export interface KeyRatios {
  [year: string]: KeyRatio;
}

export interface KPI {
  label: string;
  value: string;
  trend: string;
  status: string;
}

export interface RiskFactor {
  name: string;
  impact: string;
  probability?: string;
  indicators: string[];
  trend?: string;
}

export interface GrowthOpportunity {
  name: string;
  potential_revenue: string;
  investment_required: number;
  time_to_market: string;
}

export interface UnifiedClientData {
  company: ClientInfo;
  financial_history: FinancialHistory;
  key_ratios: KeyRatios;
  current_kpis: KPI[];
  client_segments: Array<{ segment: string; percentage: number }>;
  predictions: Array<{ metric: string; value: string; confidence: number }>;
  risk_factors: RiskFactor[];
  growth_opportunities: GrowthOpportunity[];
}

export interface SectoralData {
  sector: {
    code: string;
    name: string;
    companies: number;
    total_revenue: number;
    average_employees: number;
  };
  financial_averages: {
    [year: string]: {
      revenue_avg: number;
      revenue_median: number;
      net_margin_avg: number;
      net_margin_median: number;
      growth_rate: number;
      cash_ratio_avg: number;
      days_sales_outstanding_avg: number;
    };
  };
  company_size_comparisons: {
    [size: string]: {
      employees_range: string;
      revenue_avg: number;
      net_margin_avg: number;
      days_sales_outstanding_avg: number;
    };
  };
  market_trends?: Array<{
    name: string;
    trend: string;
    impact_on_revenue: string;
    impact_on_margins: string;
  }>;
}

// Gestionnaire de cache pour les données client
class ClientDataCache {
  private cache: Map<string, UnifiedClientData> = new Map();
  private defaultClientSiren: string = "123456789"; // InfoTech Solution
  
  constructor() {
    // Pré-remplir le cache avec les données de démo
    this.cache.set(this.defaultClientSiren, clientData as any);
  }
  
  get(siren: string): UnifiedClientData | undefined {
    return this.cache.get(siren);
  }
  
  set(siren: string, data: UnifiedClientData): void {
    this.cache.set(siren, data);
  }
  
  has(siren: string): boolean {
    return this.cache.has(siren);
  }
  
  getDefaultClientSiren(): string {
    return this.defaultClientSiren;
  }
}

// Singleton pour le cache
const clientDataCache = new ClientDataCache();

/**
 * Récupère les données client unifiées
 * @param siren - Le numéro SIREN de l'entreprise
 * @param forceRefresh - Force le rafraîchissement des données même si elles sont en cache
 */
export async function getUnifiedClientData(
  siren: string = clientDataCache.getDefaultClientSiren(),
  forceRefresh: boolean = false
): Promise<UnifiedClientData> {
  // Si les données sont en cache et qu'on ne force pas le rafraîchissement, on les renvoie
  if (clientDataCache.has(siren) && !forceRefresh) {
    return clientDataCache.get(siren)!;
  }
  
  try {
    // Essayons de récupérer les données réelles
    const realData = await fetchCompanyData(siren);
    
    // Transformation des données réelles en format unifié
    // Note: ceci est une implémentation partielle, à compléter avec les données financières réelles
    const unifiedData: UnifiedClientData = {
      company: {
        name: realData.raisonSociale,
        siren: realData.siren,
        sector_code: realData.codeApe,
        sector_name: realData.libelleApe,
        creation_date: realData.dateCreation,
        employees: 0, // À compléter avec des données réelles
        legal_form: realData.formeJuridique,
        address: realData.adresse,
        capital: parseInt(realData.capital.replace(/\D/g, ''), 10) || 0,
        directors: realData.dirigeants.map(d => ({
          name: `${d.prenom} ${d.nom}`,
          role: d.fonction,
          since: '' // À compléter avec des données réelles
        }))
      },
      // On utilise les données simulées pour le reste
      // À remplacer par des données réelles quand disponibles
      financial_history: clientData.financial_history,
      key_ratios: clientData.key_ratios,
      current_kpis: clientData.current_kpis,
      client_segments: clientData.client_segments,
      predictions: clientData.predictions,
      risk_factors: clientData.risk_factors,
      growth_opportunities: clientData.growth_opportunities
    };
    
    // Mettre en cache
    clientDataCache.set(siren, unifiedData);
    return unifiedData;
    
  } catch (error) {
    console.error('Erreur lors de la récupération des données client réelles:', error);
    
    // En cas d'erreur, si on a les données en cache, on les renvoie
    if (clientDataCache.has(siren)) {
      return clientDataCache.get(siren)!;
    }
    
    // Sinon, on renvoie les données par défaut
    return clientData as any;
  }
}

/**
 * Récupère les données sectorielles
 */
export function getSectoralData(): SectoralData {
  return sectorData as any;
}

/**
 * Récupère la période à afficher pour les données (janvier-décembre 2024)
 */
export function getCurrentPeriod(): { start: string; end: string } {
  return {
    start: "01/01/2024",
    end: "31/12/2024"
  };
}

/**
 * Fonction pour simuler un client à partir de données réelles partielles
 * Utilise les données de démo pour compléter
 */
export function simulateClientFromPartialData(
  partialData: Partial<UnifiedClientData>
): UnifiedClientData {
  return {
    ...clientData as any,
    ...partialData,
    company: {
      ...clientData.company,
      ...partialData.company
    }
  };
}

// Export par défaut pour faciliter l'importation
export default {
  getUnifiedClientData,
  getSectoralData,
  getCurrentPeriod,
  simulateClientFromPartialData
}; 