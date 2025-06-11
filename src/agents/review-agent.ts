import { Agent, AgentConfig, Message } from './base-agent';
import { LLMService } from './llm-service';

/**
 * Agent spécialisé dans la révision comptable et la détection d'anomalies
 */
export class ReviewAgent extends Agent {
  private llmService: LLMService;

  constructor(config: AgentConfig) {
    super({
      ...config,
      name: config.name || 'Agent de Révision',
      description: config.description || 'Spécialiste en révision comptable et détection d\'anomalies',
      systemPrompt: config.systemPrompt || `Tu es un expert en révision comptable pour cabinet d'expertise comptable.
Ta mission est d'analyser les écritures comptables pour détecter les anomalies, incohérences et risques.
Tu dois comparer les montants aux données sectorielles pour identifier les écarts significatifs.
Tu proposes des écritures d'ordre (OD) pour corriger les problèmes identifiés.
Tu évalues la criticité des anomalies et justifies tes propositions avec des références comptables et fiscales.`
    });
    
    this.llmService = LLMService.getInstance();
  }

  /**
   * Processus principal de l'agent de révision
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
        temperature: 0.3
      });
      
      // Envoyer la réponse
      await this.sendMessage(response.content);
      
      return response.content;
    } catch (error) {
      console.error('Erreur lors de la révision comptable:', error);
      return 'Désolé, une erreur est survenue lors de l\'analyse de révision. Veuillez réessayer.';
    }
  }

  /**
   * Analyser les écritures comptables et détecter les anomalies
   */
  async analyzeEntries(accountingData: any, sectoralData: any): Promise<any> {
    const analysisPrompt = `
    Sur base des données comptables suivantes:
    ${JSON.stringify(accountingData, null, 2)}
    
    Et des données sectorielles suivantes:
    ${JSON.stringify(sectoralData, null, 2)}
    
    Identifie toutes les anomalies dans les écritures comptables:
    1. Erreurs d'équilibre débit/crédit
    2. Utilisation de comptes incorrects
    3. Montants anormaux par rapport au secteur
    4. Écritures potentiellement en doublon
    5. Problèmes de TVA (taux, déductibilité)
    
    Pour chaque anomalie, indique:
    - Type d'anomalie
    - Comptes concernés
    - Montants impliqués
    - Criticité (haute, moyenne, basse)
    - Écart par rapport aux références sectorielles si applicable
    - Proposition d'OD corrective
    - Justification comptable et réglementaire
    
    Présente les résultats sous forme structurée dans un format JSON.`;
    
    try {
      const response = await this.llmService.generateCompletion({
        messages: [
          { role: 'system' as const, content: this.systemPrompt },
          { role: 'user' as const, content: analysisPrompt }
        ],
        temperature: 0.3
      });
      
      // Tenter de parser le JSON dans la réponse
      const jsonMatch = response.content.match(/```json\n([\s\S]*?)```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          return JSON.parse(jsonMatch[1]);
        } catch (e) {
          console.error('Erreur lors du parsing JSON des anomalies:', e);
          return { error: 'Format de réponse invalide' };
        }
      }
      
      return { error: 'Format de réponse invalide' };
    } catch (error) {
      console.error('Erreur lors de la détection des anomalies:', error);
      return { error: 'Erreur lors de la détection des anomalies' };
    }
  }
  
  /**
   * Générer des propositions d'OD correctives
   */
  async generateODProposals(anomalies: any): Promise<any> {
    const odPrompt = `
    Sur base des anomalies détectées suivantes:
    ${JSON.stringify(anomalies, null, 2)}
    
    Génère des propositions d'écritures d'ordre (OD) correctives pour chaque anomalie.
    
    Pour chaque OD, précise:
    - Description de l'OD
    - Date proposée
    - Mouvements comptables (comptes, libellés, montants débit/crédit)
    - Justification comptable et réglementaire complète
    - Impact sur le bilan et le résultat
    
    Présente les résultats sous forme structurée dans un format JSON.`;
    
    try {
      const response = await this.llmService.generateCompletion({
        messages: [
          { role: 'system' as const, content: this.systemPrompt },
          { role: 'user' as const, content: odPrompt }
        ],
        temperature: 0.4
      });
      
      // Tenter de parser le JSON dans la réponse
      const jsonMatch = response.content.match(/```json\n([\s\S]*?)```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          return JSON.parse(jsonMatch[1]);
        } catch (e) {
          console.error('Erreur lors du parsing JSON des OD:', e);
          return { error: 'Format de réponse invalide' };
        }
      }
      
      return { error: 'Format de réponse invalide' };
    } catch (error) {
      console.error('Erreur lors de la génération des OD:', error);
      return { error: 'Erreur lors de la génération des OD' };
    }
  }
  
  /**
   * Analyser les écarts sectoriels sur les postes comptables
   */
  async analyzeSectoralGaps(accountingData: any, sectoralData: any): Promise<any> {
    const gapAnalysisPrompt = `
    Sur base des données comptables suivantes:
    ${JSON.stringify(accountingData, null, 2)}
    
    Et des données sectorielles suivantes:
    ${JSON.stringify(sectoralData, null, 2)}
    
    Analyse les écarts entre les postes comptables de l'entreprise et les moyennes sectorielles.
    
    Pour chaque poste significatif, indique:
    - Intitulé du poste
    - Montant actuel
    - Moyenne sectorielle
    - Écart en valeur et en pourcentage
    - Évaluation de l'écart (normal, attention, critique)
    - Causes possibles de l'écart
    - Recommandations pour l'optimisation
    
    Présente les résultats sous forme structurée dans un format JSON.`;
    
    try {
      const response = await this.llmService.generateCompletion({
        messages: [
          { role: 'system' as const, content: this.systemPrompt },
          { role: 'user' as const, content: gapAnalysisPrompt }
        ],
        temperature: 0.4
      });
      
      // Tenter de parser le JSON dans la réponse
      const jsonMatch = response.content.match(/```json\n([\s\S]*?)```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          return JSON.parse(jsonMatch[1]);
        } catch (e) {
          console.error('Erreur lors du parsing JSON des écarts sectoriels:', e);
          return { error: 'Format de réponse invalide' };
        }
      }
      
      return { error: 'Format de réponse invalide' };
    } catch (error) {
      console.error('Erreur lors de l\'analyse des écarts sectoriels:', error);
      return { error: 'Erreur lors de l\'analyse des écarts sectoriels' };
    }
  }
} 