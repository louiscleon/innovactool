/**
 * ReviewAgent
 * 
 * This agent analyzes financial data, detects anomalies and suggests
 * corrective missions with estimated impact.
 */

import fs from 'fs';
import path from 'path';

// Types for data analysis
interface FECEntry {
  id: string;
  compteNum: string;
  compteLib: string;
  dateEcr: string;
  journalCode: string;
  journalLib: string;
  ecritureNum: string;
  ecritureLib: string;
  montant: number;
  debit: boolean;
  [key: string]: any;
}

interface AnomalyDetection {
  compte: string;
  compteLib: string;
  ecartPct: number;
  ecartValeur: number;
  severite: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
}

interface MissionRecommendation {
  titre: string;
  description: string;
  type: 'RH' | 'GESTION' | 'JURIDIQUE' | 'FISCAL' | 'OPTIMISATION';
  impactEstime: string;
  priorite: number;
  difficulte: number;
  duree: string;
}

/**
 * Main function to process financial data with the ReviewAgent
 */
export async function processFinancialReview(
  siren: string,
  secteur?: string
): Promise<{
  anomalies: AnomalyDetection[];
  recommendations: MissionRecommendation[];
  kpis: any;
  comparisons: any;
}> {
  try {
    // Load FEC data
    const fecData = await loadFECData();
    
    // Load company data
    const companyData = await loadCompanyData(siren);
    
    // Load sector averages
    const sectorAverages = await loadSectorAverages(secteur);
    
    // Calculate KPIs
    const kpis = calculateKPIs(fecData, companyData);
    
    // Compare with sector averages
    const comparisons = compareWithSector(kpis, sectorAverages);
    
    // Detect anomalies
    const anomalies = detectAnomalies(fecData, comparisons);
    
    // Generate recommendations
    const recommendations = await generateRecommendations(anomalies, companyData, secteur);
    
    return {
      anomalies,
      recommendations,
      kpis,
      comparisons
    };
  } catch (error) {
    console.error('Error in ReviewAgent:', error);
    
    // Return fallback data in case of error
    return {
      anomalies: getDefaultAnomalies(),
      recommendations: getDefaultRecommendations(),
      kpis: getDefaultKPIs(),
      comparisons: getDefaultComparisons()
    };
  }
}

/**
 * Load FEC data from mock file
 */
async function loadFECData(): Promise<FECEntry[]> {
  try {
    const dataPath = path.join(process.cwd(), 'data-simulations', 'fec_sample.json');
    const fileData = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error('Error loading FEC data:', error);
    throw error;
  }
}

/**
 * Load company data from mock file or API
 */
async function loadCompanyData(siren: string): Promise<any> {
  try {
    // Try to fetch from API first
    const response = await fetch(`/api/companydata?siren=${siren}`);
    
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Failed to fetch company data from API');
    }
  } catch (error) {
    console.error('Error loading company data:', error);
    
    // Fallback to mock data
    try {
      const dataPath = path.join(process.cwd(), 'data-simulations', 'entreprises.json');
      const fileData = fs.readFileSync(dataPath, 'utf8');
      const companies = JSON.parse(fileData);
      
      // Find company by SIREN or return a default one
      const company = companies.find((c: any) => c.siren === siren) || companies[0];
      return company;
    } catch (fallbackError) {
      console.error('Error loading fallback company data:', fallbackError);
      throw fallbackError;
    }
  }
}

/**
 * Load sector averages from mock data
 */
async function loadSectorAverages(secteur?: string): Promise<any> {
  try {
    const dataPath = path.join(process.cwd(), 'data-simulations', 'entreprises.json');
    const fileData = fs.readFileSync(dataPath, 'utf8');
    const companies = JSON.parse(fileData);
    
    // Filter by sector if provided
    let filteredCompanies = companies;
    if (secteur) {
      const sectorLower = secteur.toLowerCase();
      filteredCompanies = companies.filter((c: any) => 
        c.secteur && c.secteur.toLowerCase().includes(sectorLower)
      );
      
      // If no companies found for this sector, use all data
      if (filteredCompanies.length === 0) {
        filteredCompanies = companies;
      }
    }
    
    // Calculate averages for key metrics
    const averages: any = {
      ca: 0,
      resultat: 0,
      effectif: 0,
      charges: 0,
      marge: 0,
      dso: 0,
      dpo: 0,
      tresorerie: 0
    };
    
    // Sum all values
    filteredCompanies.forEach((company: any) => {
      for (const key in averages) {
        if (company[key] !== undefined) {
          averages[key] += company[key];
        }
      }
    });
    
    // Calculate averages
    for (const key in averages) {
      averages[key] /= filteredCompanies.length;
    }
    
    return averages;
  } catch (error) {
    console.error('Error loading sector averages:', error);
    throw error;
  }
}

/**
 * Calculate KPIs from FEC data
 */
function calculateKPIs(fecData: FECEntry[], companyData: any): any {
  // Group entries by account
  const accountGroups: Record<string, FECEntry[]> = {};
  
  fecData.forEach(entry => {
    if (!accountGroups[entry.compteNum]) {
      accountGroups[entry.compteNum] = [];
    }
    accountGroups[entry.compteNum].push(entry);
  });
  
  // Calculate account balances
  const balances: Record<string, number> = {};
  
  for (const [compte, entries] of Object.entries(accountGroups)) {
    balances[compte] = entries.reduce((sum, entry) => {
      return sum + (entry.debit ? entry.montant : -entry.montant);
    }, 0);
  }
  
  // Calculate key financial ratios
  const kpis = {
    // Use company data for high-level KPIs
    ca: companyData.ca || 0,
    resultat: companyData.resultat || 0,
    effectif: companyData.effectif || 0,
    
    // Calculate from FEC data where possible
    charges: calculateCharges(balances),
    marge: (companyData.resultat / companyData.ca) * 100 || 0,
    dso: companyData.dso || 45, // Default value if not available
    dpo: companyData.dpo || 30, // Default value if not available
    tresorerie: calculateTresorerie(balances),
    
    // Add account-specific metrics
    comptes: balances
  };
  
  return kpis;
}

/**
 * Calculate total charges from account balances
 */
function calculateCharges(balances: Record<string, number>): number {
  // Sum all accounts starting with 6 (charges in French accounting)
  let totalCharges = 0;
  
  for (const [compte, balance] of Object.entries(balances)) {
    if (compte.startsWith('6')) {
      totalCharges += Math.abs(balance);
    }
  }
  
  return totalCharges;
}

/**
 * Calculate trésorerie from account balances
 */
function calculateTresorerie(balances: Record<string, number>): number {
  // Sum all accounts starting with 5 (trésorerie in French accounting)
  let totalTresorerie = 0;
  
  for (const [compte, balance] of Object.entries(balances)) {
    if (compte.startsWith('5')) {
      totalTresorerie += balance;
    }
  }
  
  return totalTresorerie;
}

/**
 * Compare company KPIs with sector averages
 */
function compareWithSector(kpis: any, sectorAverages: any): any {
  const comparisons: any = {};
  
  // Calculate percentage differences
  for (const key in kpis) {
    if (typeof kpis[key] === 'number' && typeof sectorAverages[key] === 'number') {
      const sectorValue = sectorAverages[key];
      
      if (sectorValue !== 0) {
        comparisons[key] = {
          valeur: kpis[key],
          moyenne: sectorValue,
          ecart: kpis[key] - sectorValue,
          ecartPct: ((kpis[key] - sectorValue) / sectorValue) * 100
        };
      }
    }
  }
  
  return comparisons;
}

/**
 * Detect anomalies in financial data
 */
function detectAnomalies(fecData: FECEntry[], comparisons: any): AnomalyDetection[] {
  const anomalies: AnomalyDetection[] = [];
  
  // Check for significant deviations from sector averages
  for (const [key, comparison] of Object.entries(comparisons)) {
    const comp = comparison as any;
    
    // Check if deviation is significant (more than 15%)
    if (Math.abs(comp.ecartPct) > 15) {
      let severity: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
      
      if (Math.abs(comp.ecartPct) > 50) {
        severity = 'HIGH';
      } else if (Math.abs(comp.ecartPct) > 30) {
        severity = 'MEDIUM';
      }
      
      // Get account label if available
      let compteLib = key;
      if (key === 'ca') compteLib = 'Chiffre d\'affaires';
      if (key === 'resultat') compteLib = 'Résultat net';
      if (key === 'effectif') compteLib = 'Effectif';
      if (key === 'charges') compteLib = 'Charges d\'exploitation';
      if (key === 'marge') compteLib = 'Marge bénéficiaire';
      if (key === 'dso') compteLib = 'Délai moyen de paiement clients';
      if (key === 'dpo') compteLib = 'Délai moyen de paiement fournisseurs';
      if (key === 'tresorerie') compteLib = 'Trésorerie';
      
      anomalies.push({
        compte: key,
        compteLib,
        ecartPct: comp.ecartPct,
        ecartValeur: comp.ecart,
        severite: severity,
        description: generateAnomalyDescription(key, comp.ecartPct)
      });
    }
  }
  
  // Check for unusual patterns in FEC data
  // (In a real implementation, we would have more sophisticated anomaly detection)
  
  return anomalies;
}

/**
 * Generate a description for an anomaly
 */
function generateAnomalyDescription(metric: string, deviation: number): string {
  const direction = deviation > 0 ? 'supérieur' : 'inférieur';
  const absDeviation = Math.abs(deviation).toFixed(1);
  
  switch (metric) {
    case 'ca':
      return `Chiffre d'affaires ${absDeviation}% ${direction} à la moyenne sectorielle`;
    case 'resultat':
      return `Résultat net ${absDeviation}% ${direction} à la moyenne sectorielle`;
    case 'effectif':
      return `Effectif ${absDeviation}% ${direction} à la moyenne sectorielle`;
    case 'charges':
      return `Charges d'exploitation ${absDeviation}% ${direction} à la moyenne sectorielle`;
    case 'marge':
      return `Marge bénéficiaire ${absDeviation}% ${direction} à la moyenne sectorielle`;
    case 'dso':
      return `Délai de paiement clients ${absDeviation}% ${direction} à la moyenne sectorielle`;
    case 'dpo':
      return `Délai de paiement fournisseurs ${absDeviation}% ${direction} à la moyenne sectorielle`;
    case 'tresorerie':
      return `Niveau de trésorerie ${absDeviation}% ${direction} à la moyenne sectorielle`;
    default:
      return `Écart de ${absDeviation}% ${direction} à la moyenne sectorielle pour ${metric}`;
  }
}

/**
 * Generate mission recommendations based on detected anomalies
 */
async function generateRecommendations(
  anomalies: AnomalyDetection[],
  companyData: any,
  secteur?: string
): Promise<MissionRecommendation[]> {
  // Filter significant anomalies
  const significantAnomalies = anomalies.filter(a => a.severite !== 'LOW');
  
  if (significantAnomalies.length === 0) {
    return [];
  }
  
  // Prepare context for LLM
  const anomaliesContext = significantAnomalies.map(a => 
    `${a.compteLib}: écart de ${a.ecartPct.toFixed(1)}% (${a.ecartValeur.toFixed(0)}), sévérité ${a.severite}`
  ).join('\n');
  
  // Create a prompt for the LLM
  const prompt = `
Entreprise: ${companyData.raisonSociale || 'Non spécifiée'}
Secteur: ${secteur || companyData.secteur || 'Non spécifié'}
CA: ${companyData.ca?.toLocaleString('fr-FR')}€
Effectif: ${companyData.effectif || 'Non spécifié'}

Anomalies détectées:
${anomaliesContext}

En tant qu'expert-comptable, propose 3 missions à forte valeur ajoutée pour cette entreprise, en te basant sur les anomalies détectées.
Pour chaque mission, précise:
1. Un titre concis
2. Une description de la mission
3. Le type de mission (RH, GESTION, JURIDIQUE, FISCAL ou OPTIMISATION)
4. L'impact financier estimé en euros
5. La difficulté de mise en œuvre (1-10)
6. La durée estimée

Format de réponse pour chaque mission:
Titre: [titre]
Description: [description]
Type: [type]
Impact: [impact en euros]
Difficulté: [1-10]
Durée: [durée]
`;

  try {
    // Call the LLM API
    const response = await fetch('/api/llm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        agent: 'ReviewAgent',
        model: 'gpt-4',
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const responseData = await response.json();
    
    // Parse the response to extract missions
    const missions = parseMissionsFromResponse(responseData.response);
    
    return missions.length > 0 ? missions : getDefaultRecommendations();
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return getDefaultRecommendations();
  }
}

/**
 * Parse missions from LLM response
 */
function parseMissionsFromResponse(response: string): MissionRecommendation[] {
  try {
    const missions: MissionRecommendation[] = [];
    
    // Split by double newlines to separate missions
    const missionBlocks = response.split('\n\n');
    
    for (const block of missionBlocks) {
      const lines = block.split('\n');
      
      // Check if this block looks like a mission
      if (lines.some(line => line.startsWith('Titre:') || line.startsWith('Title:'))) {
        let titre = '';
        let description = '';
        let type: any = 'OPTIMISATION';
        let impactEstime = '';
        let difficulte = 5;
        let duree = '';
        
        for (const line of lines) {
          if (line.startsWith('Titre:') || line.startsWith('Title:')) {
            titre = line.substring(line.indexOf(':') + 1).trim();
          } else if (line.startsWith('Description:')) {
            description = line.substring(line.indexOf(':') + 1).trim();
          } else if (line.startsWith('Type:')) {
            const typeValue = line.substring(line.indexOf(':') + 1).trim().toUpperCase();
            if (['RH', 'GESTION', 'JURIDIQUE', 'FISCAL', 'OPTIMISATION'].includes(typeValue)) {
              type = typeValue;
            }
          } else if (line.startsWith('Impact:')) {
            impactEstime = line.substring(line.indexOf(':') + 1).trim();
          } else if (line.startsWith('Difficulté:') || line.startsWith('Difficulte:')) {
            const diffValue = parseInt(line.substring(line.indexOf(':') + 1).trim());
            if (!isNaN(diffValue)) {
              difficulte = diffValue;
            }
          } else if (line.startsWith('Durée:') || line.startsWith('Duree:')) {
            duree = line.substring(line.indexOf(':') + 1).trim();
          }
        }
        
        // Only add if we have at least a title and description
        if (titre && description) {
          missions.push({
            titre,
            description,
            type,
            impactEstime,
            priorite: 10 - difficulte, // Higher difficulty = lower priority
            difficulte,
            duree
          });
        }
      }
    }
    
    return missions;
  } catch (error) {
    console.error('Error parsing missions:', error);
    return [];
  }
}

/**
 * Default anomalies in case of error
 */
function getDefaultAnomalies(): AnomalyDetection[] {
  return [
    {
      compte: 'charges',
      compteLib: 'Charges d\'exploitation',
      ecartPct: 18.5,
      ecartValeur: 25000,
      severite: 'MEDIUM',
      description: 'Charges d\'exploitation 18.5% supérieures à la moyenne sectorielle'
    },
    {
      compte: 'dso',
      compteLib: 'Délai moyen de paiement clients',
      ecartPct: 35.2,
      ecartValeur: 15,
      severite: 'HIGH',
      description: 'Délai de paiement clients 35.2% supérieur à la moyenne sectorielle'
    },
    {
      compte: 'marge',
      compteLib: 'Marge bénéficiaire',
      ecartPct: -12.8,
      ecartValeur: -3.5,
      severite: 'LOW',
      description: 'Marge bénéficiaire 12.8% inférieure à la moyenne sectorielle'
    }
  ];
}

/**
 * Default recommendations in case of error
 */
function getDefaultRecommendations(): MissionRecommendation[] {
  return [
    {
      titre: 'Optimisation du BFR',
      description: 'Mission d\'optimisation des délais de paiement clients et fournisseurs pour améliorer la trésorerie',
      type: 'GESTION',
      impactEstime: '15 000€',
      priorite: 8,
      difficulte: 2,
      duree: '2 mois'
    },
    {
      titre: 'Révision de la structure des charges',
      description: 'Analyse détaillée des postes de charges et identification des économies potentielles',
      type: 'OPTIMISATION',
      impactEstime: '25 000€',
      priorite: 7,
      difficulte: 3,
      duree: '3 mois'
    },
    {
      titre: 'Mise en place d\'indicateurs de pilotage',
      description: 'Création d\'un tableau de bord avec KPIs pertinents pour suivre la performance',
      type: 'GESTION',
      impactEstime: '10 000€',
      priorite: 6,
      difficulte: 4,
      duree: '1 mois'
    }
  ];
}

/**
 * Default KPIs in case of error
 */
function getDefaultKPIs(): any {
  return {
    ca: 850000,
    resultat: 42500,
    effectif: 12,
    charges: 780000,
    marge: 5,
    dso: 60,
    dpo: 30,
    tresorerie: 95000
  };
}

/**
 * Default comparisons in case of error
 */
function getDefaultComparisons(): any {
  return {
    ca: {
      valeur: 850000,
      moyenne: 920000,
      ecart: -70000,
      ecartPct: -7.6
    },
    resultat: {
      valeur: 42500,
      moyenne: 55000,
      ecart: -12500,
      ecartPct: -22.7
    },
    effectif: {
      valeur: 12,
      moyenne: 13,
      ecart: -1,
      ecartPct: -7.7
    },
    charges: {
      valeur: 780000,
      moyenne: 658000,
      ecart: 122000,
      ecartPct: 18.5
    },
    marge: {
      valeur: 5,
      moyenne: 5.73,
      ecart: -0.73,
      ecartPct: -12.8
    },
    dso: {
      valeur: 60,
      moyenne: 44.4,
      ecart: 15.6,
      ecartPct: 35.2
    },
    dpo: {
      valeur: 30,
      moyenne: 32.5,
      ecart: -2.5,
      ecartPct: -7.7
    },
    tresorerie: {
      valeur: 95000,
      moyenne: 105000,
      ecart: -10000,
      ecartPct: -9.5
    }
  };
} 