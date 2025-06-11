import { Agent, AgentConfig, Message } from './base-agent';
import { LLMService } from './llm-service';

/**
 * Agent spécialisé dans le conseil stratégique et la génération de missions
 */
export class CounselAgent extends Agent {
  private llmService: LLMService;

  constructor(config: AgentConfig) {
    super({
      ...config,
      name: config.name || 'Conseiller Stratégique IA',
      description: config.description || 'Spécialiste en conseil et génération de missions pour cabinet comptable',
      systemPrompt: config.systemPrompt || `Tu es un conseiller stratégique IA pour cabinet d'expertise comptable.
Ta mission est d'analyser les données client pour générer des propositions de missions à forte valeur ajoutée.
Tu dois détecter les signaux faibles qui justifient une intervention du cabinet.
Tu génères des propositions de missions précises, contextualisées et adaptées aux besoins spécifiques.
Tu justifies chaque recommandation avec des arguments métier (comptables, fiscaux, juridiques, financiers).
Tu utilises un langage professionnel d'expert-comptable pour formuler tes propositions.`
    });
    
    this.llmService = LLMService.getInstance();
  }

  /**
   * Processus principal de l'agent de conseil
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
        temperature: 0.5
      });
      
      // Envoyer la réponse
      await this.sendMessage(response.content);
      
      return response.content;
    } catch (error) {
      console.error('Erreur lors de la génération de conseil:', error);
      return 'Désolé, une erreur est survenue lors de la génération des conseils. Veuillez réessayer.';
    }
  }

  /**
   * Générer des propositions de missions basées sur les signaux détectés
   */
  async generateMissionProposals(clientData: any, detectedSignals: any): Promise<any> {
    const proposalPrompt = `
    Sur base des données client suivantes:
    ${JSON.stringify(clientData, null, 2)}
    
    Et des signaux détectés suivants:
    ${JSON.stringify(detectedSignals, null, 2)}
    
    Génère 3 à 5 propositions de missions à haute valeur ajoutée pour ce client.
    
    Pour chaque mission, précise:
    - Titre explicite de la mission
    - Description détaillée (problématique, approche, livrables)
    - Signal(s) déclencheur(s) justifiant la mission
    - Bénéfices quantifiables pour le client
    - Niveau de confiance/pertinence (pourcentage)
    - Honoraires estimés (fourchette)
    - Planning indicatif (durée, étapes clés)
    - Expertise(s) requise(s)
    
    Utilise un langage professionnel adapté au secteur de l'expertise comptable.
    Présente les résultats sous forme structurée dans un format JSON.`;
    
    try {
      const response = await this.llmService.generateCompletion({
        messages: [
          { role: 'system' as const, content: this.systemPrompt },
          { role: 'user' as const, content: proposalPrompt }
        ],
        temperature: 0.6
      });
      
      // Tenter de parser le JSON dans la réponse
      const jsonMatch = response.content.match(/```json\n([\s\S]*?)```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          return JSON.parse(jsonMatch[1]);
        } catch (e) {
          console.error('Erreur lors du parsing JSON des propositions de missions:', e);
          return { error: 'Format de réponse invalide' };
        }
      }
      
      return { error: 'Format de réponse invalide' };
    } catch (error) {
      console.error('Erreur lors de la génération des propositions de missions:', error);
      return { error: 'Erreur lors de la génération des propositions de missions' };
    }
  }
  
  /**
   * Générer une justification détaillée pour une mission proposée
   */
  async generateMissionJustification(mission: any, clientContext: any): Promise<string> {
    const justificationPrompt = `
    Sur base de la mission proposée suivante:
    ${JSON.stringify(mission, null, 2)}
    
    Et du contexte client:
    ${JSON.stringify(clientContext, null, 2)}
    
    Génère une justification détaillée et argumentée pour cette mission.
    
    Cette justification doit:
    - Expliquer pourquoi cette mission est pertinente maintenant
    - Citer les signaux faibles ou forts qui la justifient
    - Référencer des éléments chiffrés précis
    - Mentionner les risques de ne pas agir
    - Inclure des références réglementaires ou sectorielles si pertinent
    - Quantifier les bénéfices potentiels
    - Justifier le niveau d'honoraires
    
    La justification doit être rédigée dans un style professionnel, précis et convaincant.`;
    
    try {
      const response = await this.llmService.generateCompletion({
        messages: [
          { role: 'system' as const, content: this.systemPrompt },
          { role: 'user' as const, content: justificationPrompt }
        ],
        temperature: 0.4
      });
      
      return response.content;
    } catch (error) {
      console.error('Erreur lors de la génération de la justification:', error);
      return 'Erreur lors de la génération de la justification.';
    }
  }
  
  /**
   * Générer le contenu d'une lettre de mission
   */
  async generateMissionLetter(mission: any, clientInfo: any, cabinetInfo: any): Promise<string> {
    const letterPrompt = `
    Génère une lettre de mission professionnelle pour la mission suivante:
    ${JSON.stringify(mission, null, 2)}
    
    Informations client:
    ${JSON.stringify(clientInfo, null, 2)}
    
    Informations cabinet:
    ${JSON.stringify(cabinetInfo, null, 2)}
    
    La lettre de mission doit inclure:
    1. En-tête professionnel
    2. Référence et date
    3. Contexte et objectifs de la mission
    4. Périmètre et limites de l'intervention
    5. Méthodologie et approche
    6. Livrables attendus
    7. Planning prévisionnel
    8. Équipe d'intervention et rôles
    9. Honoraires et modalités de facturation
    10. Conditions spécifiques
    11. Clause de confidentialité
    12. Signature
    
    Utilise un format professionnel et un style adapté au secteur de l'expertise comptable.`;
    
    try {
      const response = await this.llmService.generateCompletion({
        messages: [
          { role: 'system' as const, content: this.systemPrompt },
          { role: 'user' as const, content: letterPrompt }
        ],
        temperature: 0.3
      });
      
      return response.content;
    } catch (error) {
      console.error('Erreur lors de la génération de la lettre de mission:', error);
      return 'Erreur lors de la génération de la lettre de mission.';
    }
  }
} 