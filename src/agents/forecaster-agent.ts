import { Agent, AgentConfig, Message } from './base-agent';
import { LLMService } from './llm-service';

/**
 * Agent spécialisé dans la prévision financière et stratégique
 */
export class ForecasterAgent extends Agent {
  private llmService: LLMService;

  constructor(config: AgentConfig) {
    super({
      ...config,
      name: config.name || 'Prévisionniste Stratégique',
      description: config.description || 'Spécialiste en prévision financière et stratégique pour cabinet comptable',
      systemPrompt: config.systemPrompt || `Tu es un expert en prévision financière et stratégique pour cabinet d'expertise comptable.
Ta mission est d'analyser les données financières et sectorielles pour produire des prévisions crédibles.
Tu génères 3 scénarios (neutre, optimisé, critique) et tu proposes des missions d'accompagnement adaptées.
Tu as accès aux données du cabinet et du secteur pour contextualiser tes analyses.
Tu sais identifier les risques financiers et les opportunités de croissance dès les premiers signaux.`
    });
    
    this.llmService = LLMService.getInstance();
  }

  /**
   * Processus principal de l'agent prévisionniste
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
        temperature: 0.7
      });
      
      // Envoyer la réponse
      await this.sendMessage(response.content);
      
      return response.content;
    } catch (error) {
      console.error('Erreur lors de la génération de la prévision:', error);
      return 'Désolé, une erreur est survenue lors de la génération des prévisions. Veuillez réessayer.';
    }
  }

  /**
   * Générer les trois scénarios de prévision
   */
  async generateScenarios(financialData: any, sectoralData: any): Promise<any> {
    const scenarioPrompt = `
    Sur base des données financières suivantes:
    ${JSON.stringify(financialData, null, 2)}
    
    Et des données sectorielles suivantes:
    ${JSON.stringify(sectoralData, null, 2)}
    
    Génère trois scénarios de prévision pour les 24 prochains mois:
    1. Scénario neutre (tendances actuelles prolongées)
    2. Scénario optimisé (avec optimisation de la gestion)
    3. Scénario critique (avec matérialisation des risques identifiés)
    
    Pour chaque scénario, fournis:
    - Évolution du CA
    - Évolution de la trésorerie
    - Évolution du BFR
    - Principaux risques
    - Opportunités clés
    
    Présente les résultats sous forme structurée dans un format JSON.`;
    
    try {
      const response = await this.llmService.generateCompletion({
        messages: [
          { role: 'system' as const, content: this.systemPrompt },
          { role: 'user' as const, content: scenarioPrompt }
        ],
        temperature: 0.5
      });
      
      // Tenter de parser le JSON dans la réponse
      const jsonMatch = response.content.match(/```json\n([\s\S]*?)```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          return JSON.parse(jsonMatch[1]);
        } catch (e) {
          console.error('Erreur lors du parsing JSON des scénarios:', e);
          return { error: 'Format de réponse invalide' };
        }
      }
      
      return { error: 'Format de réponse invalide' };
    } catch (error) {
      console.error('Erreur lors de la génération des scénarios:', error);
      return { error: 'Erreur lors de la génération des scénarios' };
    }
  }
  
  /**
   * Proposer des missions d'accompagnement adaptées aux prévisions
   */
  async suggestMissions(scenarios: any): Promise<string[]> {
    const missionPrompt = `
    Sur base des scénarios de prévision suivants:
    ${JSON.stringify(scenarios, null, 2)}
    
    Propose 3 à 5 missions d'accompagnement que le cabinet d'expertise comptable pourrait offrir
    pour aider le client à optimiser sa trajectoire financière et éviter les risques.
    
    Pour chaque mission:
    - Donne un nom court et explicite
    - Décris l'objectif principal en une phrase
    - Précise l'impact attendu sur les indicateurs financiers
    
    Présente les résultats sous forme de liste structurée dans un format JSON.`;
    
    try {
      const response = await this.llmService.generateCompletion({
        messages: [
          { role: 'system' as const, content: this.systemPrompt },
          { role: 'user' as const, content: missionPrompt }
        ],
        temperature: 0.7
      });
      
      // Tenter de parser le JSON dans la réponse
      const jsonMatch = response.content.match(/```json\n([\s\S]*?)```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          const missions = JSON.parse(jsonMatch[1]);
          return missions.map((m: any) => m.name || m.titre || m.mission);
        } catch (e) {
          console.error('Erreur lors du parsing JSON des missions:', e);
          return ['Erreur: Format de réponse invalide'];
        }
      }
      
      // Si on ne peut pas extraire le JSON, retourner le texte brut
      return [response.content];
    } catch (error) {
      console.error('Erreur lors de la génération des missions:', error);
      return ['Erreur lors de la génération des missions'];
    }
  }
} 