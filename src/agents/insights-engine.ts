import { EventEmitter } from 'events';
import { LLMService } from './llm-service';

/**
 * Type d'insight généré par le moteur
 */
export enum InsightType {
  FINANCIAL = 'financial',
  SECTORAL = 'sectoral',
  OPERATIONAL = 'operational',
  REGULATORY = 'regulatory',
  STRATEGIC = 'strategic',
  RISK = 'risk'
}

/**
 * Niveau de confiance d'un insight
 */
export enum ConfidenceLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

/**
 * Structure d'un insight généré
 */
export interface Insight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  confidence: ConfidenceLevel;
  relevance: number; // 1-10
  source: {
    agent: string;
    data: string;
  };
  timestamp: Date;
  metadata?: Record<string, any>;
}

/**
 * Configuration du moteur d'insights
 */
export interface InsightsEngineConfig {
  minConfidence?: ConfidenceLevel;
  minRelevance?: number;
  maxInsightsPerType?: number;
  contextWindow?: number;
}

/**
 * Moteur d'insights croisés
 * Analyse les données de multiples sources pour générer des insights actionnables
 */
export class InsightsEngine extends EventEmitter {
  private static instance: InsightsEngine;
  private insights: Insight[] = [];
  private llmService: LLMService;
  private config: InsightsEngineConfig;
  
  private constructor(config: InsightsEngineConfig = {}) {
    super();
    this.config = {
      minConfidence: config.minConfidence || ConfidenceLevel.MEDIUM,
      minRelevance: config.minRelevance || 5,
      maxInsightsPerType: config.maxInsightsPerType || 10,
      contextWindow: config.contextWindow || 30 // jours
    };
    
    this.llmService = LLMService.getInstance();
  }
  
  /**
   * Obtenir l'instance singleton du moteur d'insights
   */
  public static getInstance(config?: InsightsEngineConfig): InsightsEngine {
    if (!InsightsEngine.instance) {
      InsightsEngine.instance = new InsightsEngine(config);
    }
    return InsightsEngine.instance;
  }
  
  /**
   * Ajouter un insight au moteur
   */
  public addInsight(insight: Omit<Insight, 'id' | 'timestamp'>): Insight {
    const newInsight: Insight = {
      ...insight,
      id: this.generateInsightId(),
      timestamp: new Date()
    };
    
    // Filtrer les insights selon la configuration
    if (
      this.getConfidenceScore(newInsight.confidence) >= this.getConfidenceScore(this.config.minConfidence!) &&
      newInsight.relevance >= this.config.minRelevance!
    ) {
      this.insights.push(newInsight);
      this.emit('new-insight', newInsight);
      
      // Limiter le nombre d'insights par type
      const typeInsights = this.insights.filter(i => i.type === newInsight.type);
      if (typeInsights.length > this.config.maxInsightsPerType!) {
        // Trier par pertinence et confiance puis supprimer les moins pertinents
        typeInsights.sort((a, b) => {
          const aScore = a.relevance * this.getConfidenceScore(a.confidence);
          const bScore = b.relevance * this.getConfidenceScore(b.confidence);
          return bScore - aScore;
        });
        
        const toRemove = typeInsights.slice(this.config.maxInsightsPerType!);
        this.insights = this.insights.filter(i => !toRemove.includes(i));
      }
    }
    
    return newInsight;
  }
  
  /**
   * Obtenir tous les insights disponibles
   */
  public getAllInsights(): Insight[] {
    return [...this.insights];
  }
  
  /**
   * Obtenir les insights filtrés par type
   */
  public getInsightsByType(type: InsightType): Insight[] {
    return this.insights.filter(i => i.type === type);
  }
  
  /**
   * Générer des insights croisés à partir de données multisources
   */
  public async generateCrossInsights(
    financialData: any,
    sectoralData: any,
    clientData: any,
    regulatoryData: any
  ): Promise<Insight[]> {
    const insightsPrompt = `
    Analyse ces différentes sources de données pour identifier des insights croisés actionnables:
    
    Données financières:
    ${JSON.stringify(financialData, null, 2)}
    
    Données sectorielles:
    ${JSON.stringify(sectoralData, null, 2)}
    
    Données client:
    ${JSON.stringify(clientData, null, 2)}
    
    Données réglementaires:
    ${JSON.stringify(regulatoryData, null, 2)}
    
    Génère 5 à 10 insights actionnables en croisant ces différentes sources.
    Chaque insight doit révéler une information non évidente qui émerge de la mise en relation de plusieurs sources.
    
    Pour chaque insight, précise:
    - Type (financial, sectoral, operational, regulatory, strategic, risk)
    - Titre court et explicite
    - Description détaillée de l'insight
    - Niveau de confiance (low, medium, high)
    - Pertinence stratégique (1-10)
    - Source principale (quelle combinaison de données a permis de générer cet insight)
    
    Présente les résultats sous forme structurée dans un format JSON.`;
    
    try {
      const response = await this.llmService.generateCompletion({
        messages: [
          { 
            role: 'system', 
            content: `Tu es un moteur d'analyse multidimensionnelle expert en détection d'insights croisés.
Tu excelles à identifier des patterns et connections non évidentes entre différentes sources de données.
Tes insights doivent être actionnables, précis et pertinents pour un cabinet d'expertise comptable.`
          },
          { role: 'user', content: insightsPrompt }
        ],
        temperature: 0.5
      });
      
      // Tenter de parser le JSON dans la réponse
      const jsonMatch = response.content.match(/```json\n([\s\S]*?)```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          const generatedInsights = JSON.parse(jsonMatch[1]);
          
          // Transformer et ajouter les insights
          const newInsights: Insight[] = [];
          
          for (const rawInsight of generatedInsights) {
            const insightType = this.mapStringToInsightType(rawInsight.type);
            const confidenceLevel = this.mapStringToConfidenceLevel(rawInsight.confidence);
            
            const insight = this.addInsight({
              type: insightType,
              title: rawInsight.title,
              description: rawInsight.description,
              confidence: confidenceLevel,
              relevance: rawInsight.relevance,
              source: {
                agent: 'InsightsEngine',
                data: rawInsight.source
              },
              metadata: {
                generated: true,
                timestamp: new Date()
              }
            });
            
            newInsights.push(insight);
          }
          
          return newInsights;
        } catch (e) {
          console.error('Erreur lors du parsing JSON des insights:', e);
          return [];
        }
      }
      
      return [];
    } catch (error) {
      console.error('Erreur lors de la génération des insights croisés:', error);
      return [];
    }
  }
  
  /**
   * Générer un résumé des insights les plus pertinents
   */
  public async generateInsightsSummary(): Promise<string> {
    if (this.insights.length === 0) {
      return "Aucun insight disponible actuellement.";
    }
    
    // Trier les insights par pertinence et confiance
    const sortedInsights = [...this.insights].sort((a, b) => {
      const aScore = a.relevance * this.getConfidenceScore(a.confidence);
      const bScore = b.relevance * this.getConfidenceScore(b.confidence);
      return bScore - aScore;
    });
    
    // Prendre les 10 plus pertinents
    const topInsights = sortedInsights.slice(0, 10);
    
    const summaryPrompt = `
    Voici les insights les plus pertinents identifiés par le système:
    
    ${JSON.stringify(topInsights, null, 2)}
    
    Génère un résumé synthétique (3-4 paragraphes) qui:
    1. Identifie les thèmes principaux qui émergent de ces insights
    2. Met en évidence les opportunités stratégiques clés
    3. Souligne les risques majeurs à surveiller
    4. Propose 2-3 axes d'action prioritaires
    
    Le résumé doit être concis, actionnable et écrit dans un style professionnel adapté à un expert-comptable.`;
    
    try {
      const response = await this.llmService.generateCompletion({
        messages: [
          { 
            role: 'system', 
            content: `Tu es un expert en synthèse stratégique pour cabinet d'expertise comptable.
Ta mission est de transformer des insights complexes en recommandations claires et actionnables.
Ton style est concis, précis et professionnel.`
          },
          { role: 'user', content: summaryPrompt }
        ],
        temperature: 0.4
      });
      
      return response.content;
    } catch (error) {
      console.error('Erreur lors de la génération du résumé des insights:', error);
      return "Erreur lors de la génération du résumé des insights.";
    }
  }
  
  /**
   * Générer un ID unique pour un insight
   */
  private generateInsightId(): string {
    return `ins_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }
  
  /**
   * Convertir le niveau de confiance en score numérique
   */
  private getConfidenceScore(level: ConfidenceLevel): number {
    switch (level) {
      case ConfidenceLevel.LOW: return 1;
      case ConfidenceLevel.MEDIUM: return 2;
      case ConfidenceLevel.HIGH: return 3;
      default: return 0;
    }
  }
  
  /**
   * Mapper une chaîne en type d'insight
   */
  private mapStringToInsightType(typeStr: string): InsightType {
    const lowerStr = typeStr.toLowerCase();
    
    if (lowerStr.includes('financ')) return InsightType.FINANCIAL;
    if (lowerStr.includes('sector')) return InsightType.SECTORAL;
    if (lowerStr.includes('operat')) return InsightType.OPERATIONAL;
    if (lowerStr.includes('regul')) return InsightType.REGULATORY;
    if (lowerStr.includes('strat')) return InsightType.STRATEGIC;
    if (lowerStr.includes('risk')) return InsightType.RISK;
    
    return InsightType.STRATEGIC; // default
  }
  
  /**
   * Mapper une chaîne en niveau de confiance
   */
  private mapStringToConfidenceLevel(confStr: string): ConfidenceLevel {
    const lowerStr = confStr.toLowerCase();
    
    if (lowerStr.includes('high')) return ConfidenceLevel.HIGH;
    if (lowerStr.includes('medium') || lowerStr.includes('med')) return ConfidenceLevel.MEDIUM;
    if (lowerStr.includes('low')) return ConfidenceLevel.LOW;
    
    return ConfidenceLevel.MEDIUM; // default
  }
} 