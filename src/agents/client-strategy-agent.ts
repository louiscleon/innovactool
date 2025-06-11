import { Agent, AgentConfig, Message } from './base-agent';
import { LLMService } from './llm-service';

/**
 * Agent spécialisé dans l'élaboration de la stratégie client à 360°
 */
export class ClientStrategyAgent extends Agent {
  private llmService: LLMService;

  constructor(config: AgentConfig) {
    super({
      ...config,
      name: config.name || 'Stratège Client',
      description: config.description || 'Spécialiste en stratégie et vision client à 360°',
      systemPrompt: config.systemPrompt || `Tu es un expert en stratégie d'entreprise pour cabinet d'expertise comptable.
Ta mission est d'analyser l'entreprise cliente dans sa globalité pour en dresser un portrait stratégique complet.
Tu intègres des données financières, juridiques, commerciales et organisationnelles.
Tu identifies les forces, faiblesses, opportunités, menaces et facteurs clés de succès.
Tu formules des recommandations stratégiques adaptées au contexte spécifique du client.
Tu utilises un langage professionnel tout en rendant accessible des concepts complexes.`
    });
    
    this.llmService = LLMService.getInstance();
  }

  /**
   * Processus principal de l'agent de stratégie client
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
      console.error('Erreur lors de l\'analyse stratégique:', error);
      return 'Désolé, une erreur est survenue lors de l\'analyse stratégique. Veuillez réessayer.';
    }
  }

  /**
   * Générer un profil client complet à 360°
   */
  async generateClientProfile(clientData: any, marketData: any, legalData: any): Promise<any> {
    const profilePrompt = `
    Sur base des données client suivantes:
    ${JSON.stringify(clientData, null, 2)}
    
    Des données de marché:
    ${JSON.stringify(marketData, null, 2)}
    
    Et des données juridiques:
    ${JSON.stringify(legalData, null, 2)}
    
    Génère un profil stratégique complet du client à 360°:
    
    1. Identité et gouvernance
       - Informations légales et structurelles
       - Historique et étapes clés
       - Structure de gouvernance et dirigeants
       - Valeurs et culture d'entreprise
       
    2. Analyse financière
       - Performance financière récente
       - Indicateurs clés et ratios
       - Structure financière et financement
       - Évolution des principaux postes
       
    3. Marché et positionnement
       - Secteur d'activité et tendances
       - Position concurrentielle
       - Avantages compétitifs
       - Parts de marché estimées
       
    4. Analyse SWOT approfondie
       - Forces distinctives
       - Faiblesses structurelles
       - Opportunités de développement
       - Menaces et risques identifiés
       
    5. Facteurs clés de succès
       - Actuels et futurs
       - Criticité et maîtrise
       
    Présente les résultats sous forme structurée dans un format JSON.`;
    
    try {
      const response = await this.llmService.generateCompletion({
        messages: [
          { role: 'system' as const, content: this.systemPrompt },
          { role: 'user' as const, content: profilePrompt }
        ],
        temperature: 0.4
      });
      
      // Tenter de parser le JSON dans la réponse
      const jsonMatch = response.content.match(/```json\n([\s\S]*?)```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          return JSON.parse(jsonMatch[1]);
        } catch (e) {
          console.error('Erreur lors du parsing JSON du profil client:', e);
          return { error: 'Format de réponse invalide' };
        }
      }
      
      return { error: 'Format de réponse invalide' };
    } catch (error) {
      console.error('Erreur lors de la génération du profil client:', error);
      return { error: 'Erreur lors de la génération du profil client' };
    }
  }
  
  /**
   * Extraire et analyser l'actualité pertinente pour un client
   */
  async analyzeClientNews(clientName: string, sector: string): Promise<any> {
    try {
      // Obtenir les actualités pertinentes
      const newsData = await this.llmService.getNewsUpdates(`actualités récentes entreprise ${clientName} secteur ${sector}`);
      
      const newsAnalysisPrompt = `
      Sur base des actualités suivantes concernant l'entreprise ${clientName} ou son secteur:
      ${newsData}
      
      Analyse ces informations et extrais:
      
      1. Développements récents significatifs
         - Faits marquants concernant directement l'entreprise
         - Événements sectoriels importants
         - Changements réglementaires pertinents
         
      2. Impact stratégique potentiel
         - Opportunités à court terme
         - Menaces immédiates
         - Tendances à surveiller
         
      3. Recommandations pour l'expert-comptable
         - Points d'attention spécifiques
         - Sujets à aborder lors du prochain entretien
         - Informations complémentaires à rechercher
      
      Pour chaque élément, évalue sa fiabilité, sa pertinence et son impact potentiel.
      Présente les résultats sous forme structurée dans un format JSON.`;
      
      const response = await this.llmService.generateCompletion({
        messages: [
          { role: 'system' as const, content: this.systemPrompt },
          { role: 'user' as const, content: newsAnalysisPrompt }
        ],
        temperature: 0.5
      });
      
      // Tenter de parser le JSON dans la réponse
      const jsonMatch = response.content.match(/```json\n([\s\S]*?)```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          return JSON.parse(jsonMatch[1]);
        } catch (e) {
          console.error('Erreur lors du parsing JSON de l\'analyse d\'actualité:', e);
          return { error: 'Format de réponse invalide' };
        }
      }
      
      return { error: 'Format de réponse invalide' };
    } catch (error) {
      console.error('Erreur lors de l\'analyse des actualités:', error);
      return { error: 'Erreur lors de l\'analyse des actualités' };
    }
  }
  
  /**
   * Générer des recommandations stratégiques spécifiques
   */
  async generateStrategicRecommendations(clientProfile: any, sectoralData: any): Promise<any> {
    const recommendationsPrompt = `
    Sur base du profil client:
    ${JSON.stringify(clientProfile, null, 2)}
    
    Et des données sectorielles:
    ${JSON.stringify(sectoralData, null, 2)}
    
    Génère des recommandations stratégiques précises et actionnables pour ce client:
    
    1. Axes stratégiques prioritaires
       - Orientation générale recommandée
       - Priorités à court et moyen terme
       - Indicateurs de succès à suivre
       
    2. Opportunités de développement
       - Nouveaux marchés/segments
       - Innovations possibles
       - Partenariats stratégiques
       
    3. Optimisations structurelles
       - Organisation
       - Processus
       - Modèle économique
       
    4. Gestion des risques identifiés
       - Mesures d'atténuation
       - Plans de contingence
       
    5. Feuille de route d'implémentation
       - Étapes clés
       - Ressources nécessaires
       - Séquencement recommandé
    
    Pour chaque recommandation, indique:
    - Description détaillée
    - Bénéfices attendus
    - Difficulté de mise en œuvre (1-5)
    - Impact potentiel (1-5)
    - Délai de réalisation estimé
    
    Présente les résultats sous forme structurée dans un format JSON.`;
    
    try {
      const response = await this.llmService.generateCompletion({
        messages: [
          { role: 'system' as const, content: this.systemPrompt },
          { role: 'user' as const, content: recommendationsPrompt }
        ],
        temperature: 0.5
      });
      
      // Tenter de parser le JSON dans la réponse
      const jsonMatch = response.content.match(/```json\n([\s\S]*?)```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          return JSON.parse(jsonMatch[1]);
        } catch (e) {
          console.error('Erreur lors du parsing JSON des recommandations stratégiques:', e);
          return { error: 'Format de réponse invalide' };
        }
      }
      
      return { error: 'Format de réponse invalide' };
    } catch (error) {
      console.error('Erreur lors de la génération des recommandations stratégiques:', error);
      return { error: 'Erreur lors de la génération des recommandations stratégiques' };
    }
  }
} 