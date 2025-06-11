import { Agent, AgentConfig, Message } from './base-agent';
import { LLMService } from './llm-service';

/**
 * Agent spécialisé dans l'analyse sectorielle et la comparaison de données
 */
export class SectoralAgent extends Agent {
  private llmService: LLMService;

  constructor(config: AgentConfig) {
    super({
      ...config,
      name: config.name || 'Analyste Sectoriel',
      description: config.description || 'Spécialiste en analyse sectorielle et benchmarking',
      systemPrompt: config.systemPrompt || `Tu es un expert en analyse sectorielle pour cabinet d'expertise comptable.
Ta mission est d'analyser les données d'un client par rapport à son secteur d'activité.
Tu compares les ratios financiers, la structure de coûts et les indicateurs de performance.
Tu identifies les forces, faiblesses et opportunités du client face à ses pairs.
Tu repères les tendances sectorielles et les risques potentiels pour formuler des recommandations stratégiques.`
    });
    
    this.llmService = LLMService.getInstance();
  }

  /**
   * Processus principal de l'agent d'analyse sectorielle
   */
  async process(input: string): Promise<string> {
    // Construire les messages pour le LLM
    const messages = [
      { role: 'system' as const, content: this.systemPrompt },
      ...this.memory.map(msg => ({ 
        role: msg.role, 
        content: msg.content 
      })),
      { role: 'user' as const, content: input }
    ];
    
    try {
      // Appeler le LLM pour générer une réponse
      const response = await this.llmService.generateCompletion({
        messages,
        temperature: 0.4
      });
      
      // Envoyer la réponse
      await this.sendMessage(response.content);
      
      return response.content;
    } catch (error) {
      console.error('Erreur lors de l\'analyse sectorielle:', error);
      return 'Désolé, une erreur est survenue lors de l\'analyse sectorielle. Veuillez réessayer.';
    }
  }

  /**
   * Analyser la position d'une entreprise par rapport à son secteur
   */
  async analyzeSectoralPosition(clientData: any, sectoralData: any): Promise<any> {
    const positionPrompt = `
    Sur base des données client suivantes:
    ${JSON.stringify(clientData, null, 2)}
    
    Et des données sectorielles suivantes:
    ${JSON.stringify(sectoralData, null, 2)}
    
    Analyse la position de l'entreprise par rapport à son secteur selon ces axes:
    1. Ratios financiers clés (rentabilité, liquidité, solvabilité)
    2. Structure des coûts et marges
    3. Productivité et indicateurs opérationnels
    4. Dynamique de croissance
    
    Pour chaque axe, détermine:
    - Position actuelle (percentile dans le secteur)
    - Forces distinctives
    - Zones de fragilité
    - Opportunités d'amélioration
    - Recommandations adaptées au secteur
    
    Présente les résultats sous forme structurée dans un format JSON.`;
    
    try {
      const response = await this.llmService.generateCompletion({
        messages: [
          { role: 'system' as const, content: this.systemPrompt },
          { role: 'user' as const, content: positionPrompt }
        ],
        temperature: 0.4
      });
      
      // Tenter de parser le JSON dans la réponse
      const jsonMatch = response.content.match(/```json\n([\s\S]*?)```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          return JSON.parse(jsonMatch[1]);
        } catch (e) {
          console.error('Erreur lors du parsing JSON de la position sectorielle:', e);
          return { error: 'Format de réponse invalide' };
        }
      }
      
      return { error: 'Format de réponse invalide' };
    } catch (error) {
      console.error('Erreur lors de l\'analyse de la position sectorielle:', error);
      return { error: 'Erreur lors de l\'analyse de la position sectorielle' };
    }
  }
  
  /**
   * Identifier les tendances sectorielles et leur impact potentiel
   */
  async analyzeSectoralTrends(sectoralData: any, clientCategory: string): Promise<any> {
    const trendsPrompt = `
    Sur base des données sectorielles suivantes:
    ${JSON.stringify(sectoralData, null, 2)}
    
    Pour une entreprise de catégorie: ${clientCategory}
    
    Identifie les principales tendances sectorielles actuelles:
    1. Évolution des indicateurs clés sur les 3 dernières années
    2. Modifications structurelles du secteur
    3. Nouveaux modèles économiques émergeants
    4. Impacts réglementaires récents ou annoncés
    
    Pour chaque tendance, détermine:
    - Description et importance stratégique
    - Niveau d'impact potentiel (faible, moyen, fort)
    - Horizon temporel (court, moyen, long terme)
    - Opportunités à saisir
    - Risques à anticiper
    - Stratégies d'adaptation recommandées
    
    Présente les résultats sous forme structurée dans un format JSON.`;
    
    try {
      const response = await this.llmService.generateCompletion({
        messages: [
          { role: 'system' as const, content: this.systemPrompt },
          { role: 'user' as const, content: trendsPrompt }
        ],
        temperature: 0.5
      });
      
      // Tenter de parser le JSON dans la réponse
      const jsonMatch = response.content.match(/```json\n([\s\S]*?)```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          return JSON.parse(jsonMatch[1]);
        } catch (e) {
          console.error('Erreur lors du parsing JSON des tendances sectorielles:', e);
          return { error: 'Format de réponse invalide' };
        }
      }
      
      return { error: 'Format de réponse invalide' };
    } catch (error) {
      console.error('Erreur lors de l\'analyse des tendances sectorielles:', error);
      return { error: 'Erreur lors de l\'analyse des tendances sectorielles' };
    }
  }
  
  /**
   * Générer des insights sectoriels à partir de l'actualité
   */
  async generateSectoralInsights(sectorName: string): Promise<any> {
    try {
      // Obtenir les actualités du secteur
      const newsData = await this.llmService.getNewsUpdates(`actualités récentes secteur ${sectorName} finance économie`);
      
      const insightsPrompt = `
      Sur base des actualités sectorielles suivantes:
      ${newsData}
      
      Pour le secteur: ${sectorName}
      
      Extrais les insights stratégiques pertinents pour les entreprises du secteur:
      1. Développements majeurs récents
      2. Impacts économiques et financiers probables
      3. Opportunités commerciales ou stratégiques
      4. Risques émergents à surveiller
      
      Pour chaque insight, précise:
      - Description synthétique
      - Source(s) identifiée(s)
      - Niveau de confiance (faible, moyen, élevé)
      - Pertinence stratégique (1-5)
      - Applications pratiques pour une entreprise du secteur
      
      Présente les résultats sous forme structurée dans un format JSON.`;
      
      const response = await this.llmService.generateCompletion({
        messages: [
          { role: 'system' as const, content: this.systemPrompt },
          { role: 'user' as const, content: insightsPrompt }
        ],
        temperature: 0.6
      });
      
      // Tenter de parser le JSON dans la réponse
      const jsonMatch = response.content.match(/```json\n([\s\S]*?)```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          return JSON.parse(jsonMatch[1]);
        } catch (e) {
          console.error('Erreur lors du parsing JSON des insights sectoriels:', e);
          return { error: 'Format de réponse invalide' };
        }
      }
      
      return { error: 'Format de réponse invalide' };
    } catch (error) {
      console.error('Erreur lors de la génération des insights sectoriels:', error);
      return { error: 'Erreur lors de la génération des insights sectoriels' };
    }
  }
} 