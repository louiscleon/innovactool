/**
 * Service API pour centraliser les appels aux différentes API
 */

// Types pour les réponses API
export interface CompanyData {
  source: string;
  siren: string;
  raisonSociale: string;
  formeJuridique: string;
  codeApe: string;
  libelleApe: string;
  dirigeants: Array<{
    nom: string;
    prenom: string;
    fonction: string;
  }>;
  adresse: string;
  capital: string;
  dateCreation: string;
}

export interface NewsItem {
  title: string;
  summary: string;
  source: string;
  date: string;
  url: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  tags: string[];
}

export interface NewsData {
  source: string;
  articles: NewsItem[];
}

export interface HypothesisScenario {
  CA: string;
  marge: string;
  tresorerie: string;
  effectifs: string;
  investissements: string;
  [key: string]: string;
}

export interface HypothesisData {
  hypothese: string;
  secteur: string;
  scenarios: {
    optimiste: HypothesisScenario;
    neutre: HypothesisScenario;
    pessimiste: HypothesisScenario;
  };
  justification: string;
  facteurs_cles: string[];
  fiabilite: number;
  insights?: string[];
  impactScores?: Record<string, any>;
}

export interface LLMResponse {
  response: string;
  agent: string;
  model: string;
  status: string;
}

/**
 * Interface pour les données combinées des différentes sources
 */
export interface SearchData {
  financial: string;
  management: string;
  news: string; 
  sector: string;
  regulatory: string;
}

export interface EnterpriseData {
  company: CompanyData;
  news?: NewsData;
  llmAnalysis?: string;
  searchData?: string | SearchData;
}

/**
 * Récupère les données d'une entreprise par son SIREN
 */
export async function fetchCompanyData(siren: string): Promise<CompanyData> {
  try {
    const response = await fetch(`/api/companydata?siren=${siren}`);
    
    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des données entreprise:', error);
    throw error;
  }
}

/**
 * Récupère les actualités pertinentes pour une entreprise ou un secteur
 */
export async function fetchNews(entreprise?: string, secteur?: string): Promise<NewsData> {
  try {
    const params = new URLSearchParams();
    if (entreprise) params.append('entreprise', entreprise);
    if (secteur) params.append('secteur', secteur);
    
    const response = await fetch(`/api/perplexity?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des actualités:', error);
    throw error;
  }
}

/**
 * Envoie une requête à l'API LLM
 */
export async function callLLM(
  prompt: string,
  agent: string = 'GenericAgent',
  model: string = 'gpt-4',
  temperature: number = 0.7,
  systemPrompt?: string
): Promise<LLMResponse> {
  try {
    const response = await fetch('/api/llm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        agent,
        model,
        temperature,
        systemPrompt
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de l\'appel LLM:', error);
    throw error;
  }
}

/**
 * Envoie une hypothèse business pour analyse
 */
export async function analyzeHypothesis(
  hypothese: string,
  secteur?: string
): Promise<HypothesisData> {
  try {
    const response = await fetch('/api/hypotheses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hypothese,
        secteur
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de l\'analyse d\'hypothèse:', error);
    throw error;
  }
}

/**
 * Récupère toutes les données d'une entreprise à partir de plusieurs sources en parallèle
 */
export async function fetchEnterpriseFullData(siren: string): Promise<EnterpriseData> {
  try {
    // Lancer véritablement les requêtes en parallèle avec Promise.all
    const companyData = await fetchCompanyData(siren);
    
    // Une fois qu'on a les données de base, on lance les autres requêtes en parallèle
    const [newsData] = await Promise.all([
      fetchNews(companyData.raisonSociale, companyData.libelleApe)
    ]);
    
    // Construire l'objet de données d'entreprise
    const enterpriseData: EnterpriseData = {
      company: companyData,
      news: newsData
    };
    
    return enterpriseData;
  } catch (error) {
    console.error('Erreur lors de la récupération des données complètes de l\'entreprise:', error);
    throw error;
  }
}

/**
 * Analyse les données d'entreprise avec un agent LLM
 */
export async function analyzedEnterpriseData(enterpriseData: EnterpriseData): Promise<EnterpriseData> {
  try {
    // Stratégie : faire plusieurs requêtes ciblées à Perplexity pour obtenir des données plus précises
    
    // 1. Recherche de données financières précises
    const financialPrompt = `
    Recherche les données financières exactes pour l'entreprise ${enterpriseData.company.raisonSociale} (SIREN: ${enterpriseData.company.siren}).
    Trouve les chiffres précis les plus récents disponibles: CA, résultat net, effectifs, marge brute, croissance annuelle.
    Trouve également toutes les informations disponibles sur les comptes déposés et bilans financiers officiels.
    Ne fais pas d'estimations, utilise uniquement des données factuelles vérifiables.
    Réponds sous forme d'un rapport financier structuré.
    `;
    
    // 2. Recherche sur les dirigeants réels et la gouvernance
    const managementPrompt = `
    Recherche la liste exacte des dirigeants actuels de l'entreprise ${enterpriseData.company.raisonSociale} (SIREN: ${enterpriseData.company.siren}).
    Pour chaque dirigeant, trouve: nom complet, fonction précise, date de nomination, parcours professionnel.
    Cherche également la structure d'actionnariat si disponible (principaux actionnaires, pourcentages).
    Ne fais pas d'estimations, utilise uniquement des données factuelles vérifiables issues de sources officielles.
    `;
    
    // 3. Recherche d'actualités récentes et précises
    const newsPrompt = `
    Recherche les actualités précises et récentes concernant l'entreprise ${enterpriseData.company.raisonSociale} (SIREN: ${enterpriseData.company.siren}).
    Inclus uniquement des informations factuelles vérifiables: communiqués de presse, articles de journaux économiques, annonces officielles.
    Pour chaque actualité, indique: date exacte, source précise, résumé factuel, lien si disponible.
    Concentre-toi sur les 12 derniers mois.
    `;
    
    // 4. Recherche sectorielle et concurrentielle
    const sectorPrompt = `
    Recherche des données précises sur le secteur d'activité "${enterpriseData.company.libelleApe}" (code ${enterpriseData.company.codeApe}).
    Trouve: taille du marché en France (en euros), principaux concurrents avec leurs parts de marché, tendances récentes chiffrées.
    Identifie la position de ${enterpriseData.company.raisonSociale} dans ce secteur si cette information est disponible.
    Ne fais pas d'estimations, utilise uniquement des données factuelles vérifiables issues de sources fiables.
    `;
    
    // 5. Recherche réglementaire et de conformité
    const regulatoryPrompt = `
    Recherche les obligations réglementaires et de conformité spécifiques au secteur "${enterpriseData.company.libelleApe}" (code ${enterpriseData.company.codeApe}) en France.
    Identifie les réglementations sectorielles, normes obligatoires, certifications requises pour ce type d'activité.
    Mentionne également les évolutions réglementaires récentes ou à venir qui pourraient impacter cette entreprise.
    `;
    
    // Exécution parallèle de toutes les requêtes
    const [
      financialResponse, 
      managementResponse, 
      newsResponse, 
      sectorResponse, 
      regulatoryResponse
    ] = await Promise.all([
      callLLM(financialPrompt, 'PerplexityAgent', 'gpt-4', 0.3),
      callLLM(managementPrompt, 'PerplexityAgent', 'gpt-4', 0.3),
      callLLM(newsPrompt, 'PerplexityAgent', 'gpt-4', 0.3),
      callLLM(sectorPrompt, 'PerplexityAgent', 'gpt-4', 0.3),
      callLLM(regulatoryPrompt, 'PerplexityAgent', 'gpt-4', 0.3)
    ]);
    
    // Compilation des résultats de recherche
    const perplexityData = {
      financial: financialResponse.response,
      management: managementResponse.response,
      news: newsResponse.response,
      sector: sectorResponse.response,
      regulatory: regulatoryResponse.response
    };
    
    // Maintenant, demandons à l'agent d'expertise comptable de synthétiser ces informations précises
    const synthesisPrompt = `
    Tu es un expert-comptable de haut niveau qui prépare une analyse complète pour un client.
    
    ## DONNÉES DE BASE
    Raison sociale: ${enterpriseData.company.raisonSociale}
    SIREN: ${enterpriseData.company.siren}
    Forme juridique: ${enterpriseData.company.formeJuridique}
    Activité: ${enterpriseData.company.libelleApe} (${enterpriseData.company.codeApe})
    Date création: ${enterpriseData.company.dateCreation}
    
    ## DONNÉES FINANCIÈRES PRÉCISES
    ${perplexityData.financial}
    
    ## DIRIGEANTS ET GOUVERNANCE
    ${perplexityData.management}
    
    ## ACTUALITÉS RÉCENTES
    ${perplexityData.news}
    
    ## ANALYSE SECTORIELLE
    ${perplexityData.sector}
    
    ## CONTEXTE RÉGLEMENTAIRE
    ${perplexityData.regulatory}
    
    ## TÂCHE
    Synthétise toutes ces informations en un rapport d'expert-comptable structuré qui comprend:
    
    1. SYNTHÈSE EXÉCUTIVE - Un résumé des points essentiels à retenir
    
    2. ANALYSE FINANCIÈRE DÉTAILLÉE - Basée sur les données réelles trouvées, pas d'estimations
    
    3. GOUVERNANCE ET MANAGEMENT - Structure de direction, évolutions récentes
    
    4. POSITIONNEMENT SECTORIEL - Où se situe l'entreprise face à ses concurrents
    
    5. RISQUES ET CONFORMITÉ - Enjeux réglementaires et défis à surveiller
    
    6. RECOMMANDATIONS - Actions concrètes à envisager basées uniquement sur des éléments factuels
    
    Ton rapport doit être extrêmement factuel, précis et basé uniquement sur les données recueillies. N'invente aucune information.
    Utilise des titres clairs et une présentation structurée. Inclus des chiffres précis quand ils sont disponibles.
    `;
    
    // Génération du rapport final
    const synthesisResponse = await callLLM(synthesisPrompt, 'CPAExpertAgent', 'gpt-4', 0.3);
    
    // Retour des données enrichies
    return {
      ...enterpriseData,
      llmAnalysis: synthesisResponse.response,
      searchData: {
        financial: perplexityData.financial,
        management: perplexityData.management,
        news: perplexityData.news,
        sector: perplexityData.sector,
        regulatory: perplexityData.regulatory
      }
    };
  } catch (error) {
    console.error('Erreur lors de l\'analyse LLM des données d\'entreprise:', error);
    // Retourner les données sans analyse LLM en cas d'erreur
    return enterpriseData;
  }
} 