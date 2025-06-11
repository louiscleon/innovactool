export interface LLMRequest {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

export interface LLMResponse {
  content: string;
  model: string;
  finish_reason: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Service to interact with various LLM APIs
 */
export class LLMService {
  private static instance: LLMService;
  private baseUrl: string = '';
  private apiKey: string = '';
  private apiVersion: string = '2025-04-01-preview';
  private deployment: string = 'gpt-4o';

  private constructor() {
    // In a real app, you would get these from environment variables
    // But for client-side we'll use mock data only
    console.warn('⚠️ Running in browser mode: LLM functionality will use mock data.');
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): LLMService {
    if (!LLMService.instance) {
      LLMService.instance = new LLMService();
    }
    return LLMService.instance;
  }

  /**
   * Generate a completion using Azure OpenAI
   */
  async generateCompletion(request: LLMRequest): Promise<LLMResponse> {
    const { messages, temperature = 0.7 } = request;

    // In browser environment, always return mock response
    return this.getMockResponse(messages);
  }

  /**
   * Get news updates using Perplexity API
   */
  async getNewsUpdates(query: string): Promise<string> {
    // In browser environment, always return mock news data
    return this.getMockNewsData(query);
  }

  /**
   * Generate a mock response for development without API keys
   */
  private getMockResponse(messages: Array<{ role: string; content: string }>): LLMResponse {
    const lastMessage = messages[messages.length - 1].content;
    
    console.log('⚠️ Using mock LLM response for development');
    
    // Check for specific prompts to return appropriate mock data
    if (lastMessage.includes('scénarios de prévision')) {
      return {
        content: `\`\`\`json
{
  "neutral_scenario": {
    "revenue_evolution": [
      {"month": 1, "value": 140000},
      {"month": 6, "value": 145000},
      {"month": 12, "value": 155000},
      {"month": 18, "value": 163000},
      {"month": 24, "value": 172000}
    ],
    "cash_evolution": [
      {"month": 1, "value": 320000},
      {"month": 6, "value": 335000},
      {"month": 12, "value": 360000},
      {"month": 18, "value": 385000},
      {"month": 24, "value": 415000}
    ],
    "wc_requirements": [
      {"month": 1, "value": 210000},
      {"month": 6, "value": 215000},
      {"month": 12, "value": 225000},
      {"month": 18, "value": 235000},
      {"month": 24, "value": 250000}
    ],
    "risks": ["Détérioration du DSO", "Hausse modérée des coûts fixes"],
    "opportunities": ["Stabilisation de la part de marché", "Maintien des marges actuelles"]
  },
  "optimized_scenario": {
    "revenue_evolution": [
      {"month": 1, "value": 140000},
      {"month": 6, "value": 150000},
      {"month": 12, "value": 170000},
      {"month": 18, "value": 190000},
      {"month": 24, "value": 210000}
    ],
    "cash_evolution": [
      {"month": 1, "value": 320000},
      {"month": 6, "value": 345000},
      {"month": 12, "value": 390000},
      {"month": 18, "value": 440000},
      {"month": 24, "value": 500000}
    ],
    "wc_requirements": [
      {"month": 1, "value": 210000},
      {"month": 6, "value": 220000},
      {"month": 12, "value": 235000},
      {"month": 18, "value": 245000},
      {"month": 24, "value": 260000}
    ],
    "risks": ["Tension sur les équipes techniques", "Difficultés de recrutement"],
    "opportunities": ["Développement offre Data Management", "Croissance clients tech 25%", "Amélioration DSO"]
  },
  "critical_scenario": {
    "revenue_evolution": [
      {"month": 1, "value": 140000},
      {"month": 6, "value": 135000},
      {"month": 12, "value": 130000},
      {"month": 18, "value": 125000},
      {"month": 24, "value": 120000}
    ],
    "cash_evolution": [
      {"month": 1, "value": 320000},
      {"month": 6, "value": 290000},
      {"month": 12, "value": 260000},
      {"month": 18, "value": 230000},
      {"month": 24, "value": 210000}
    ],
    "wc_requirements": [
      {"month": 1, "value": 210000},
      {"month": 6, "value": 215000},
      {"month": 12, "value": 220000},
      {"month": 18, "value": 225000},
      {"month": 24, "value": 230000}
    ],
    "risks": ["Perte client principal (-25% CA)", "Dégradation DSO +15j", "Tension trésorerie S2 2024"],
    "opportunities": ["Réduction coûts fixes", "Recentrage sur activités rentables"]
  }
}
\`\`\``,
        model: 'mock-gpt-4',
        finish_reason: 'mock'
      };
    } else if (lastMessage.includes('missions d\'accompagnement')) {
      return {
        content: `\`\`\`json
[
  {
    "name": "Optimisation du cycle client",
    "description": "Réduire le DSO et améliorer le suivi des paiements",
    "impact": "Amélioration trésorerie +15% à 12 mois"
  },
  {
    "name": "Tableau de bord stratégique",
    "description": "Mise en place d'indicateurs de pilotage mensuels",
    "impact": "Détection anticipée risques et opportunités"
  },
  {
    "name": "Plan de développement commercial",
    "description": "Stratégie de diversification clientèle et offres",
    "impact": "Réduction dépendance client principal de 42% à 30%"
  },
  {
    "name": "Accompagnement levée de fonds",
    "description": "Préparation dossier financement et business plan",
    "impact": "Sécurisation trésorerie pour phase de croissance"
  }
]
\`\`\``,
        model: 'mock-gpt-4',
        finish_reason: 'mock'
      };
    }
    
    return {
      content: `[Mock LLM Response] Responding to: "${lastMessage.substring(0, 50)}..."`,
      model: 'mock-gpt-4',
      finish_reason: 'mock'
    };
  }

  /**
   * Generate mock news data for development
   */
  private getMockNewsData(query: string): string {
    return `[Mock News Data for "${query}"] 
    
Recent developments indicate significant progress in the industry. Experts have noted that market trends are shifting towards more sustainable practices. Several new innovations have been announced in the past quarter, with major companies investing in research and development.

In terms of regulatory updates, new guidelines were published last month that will impact operational practices. Industry analysts predict continued growth in the sector, with particular emphasis on digital transformation and AI integration.`;
  }
} 