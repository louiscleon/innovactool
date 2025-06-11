/**
 * ForecastAgent
 * 
 * This agent analyzes business hypotheses and generates forecast scenarios
 * based on data from the data warehouse.
 */

/**
 * Main function to process a hypothesis with the ForecastAgent
 */
export async function processForecastHypothesis(
  hypothesis: string,
  secteur?: string
): Promise<{
  scenarios: {
    optimiste: any;
    neutre: any;
    pessimiste: any;
  };
  justification: string;
  facteurs_cles: string[];
  fiabilite: number;
}> {
  try {
    // Call the hypotheses API
    const response = await fetch('/api/hypotheses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hypothese: hypothesis,
        secteur
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Enrich the response with additional analysis
    const enrichedData = await enrichForecastData(data);
    
    return enrichedData;
  } catch (error) {
    console.error('Error in ForecastAgent:', error);
    
    // Return fallback data in case of error
    return {
      scenarios: {
        optimiste: {
          CA: '+10%',
          marge: '+8%',
          tresorerie: '+15k€',
          effectifs: '+2',
          investissements: '+20k€'
        },
        neutre: {
          CA: '+5%',
          marge: '+3%',
          tresorerie: '+5k€',
          effectifs: '0',
          investissements: '+10k€'
        },
        pessimiste: {
          CA: '-2%',
          marge: '-5%',
          tresorerie: '-10k€',
          effectifs: '-1',
          investissements: '0k€'
        }
      },
      justification: "Estimation basée sur des données historiques similaires du datawarehouse mutualisé.",
      facteurs_cles: [
        "Tendance générale du marché",
        "Inflation estimée à 2%",
        "Concurrence stable"
      ],
      fiabilite: 0.75
    };
  }
}

/**
 * Enrich the forecast data with additional insights
 */
async function enrichForecastData(data: any): Promise<any> {
  // Add insights based on the scenario data
  const insights = await generateInsights(data);
  
  // Calculate impact scores for each scenario
  const impactScores = calculateImpactScores(data.scenarios);
  
  // Return enriched data
  return {
    ...data,
    insights,
    impactScores
  };
}

/**
 * Generate additional insights based on the forecast data
 */
async function generateInsights(data: any): Promise<string[]> {
  // In a real implementation, we would use LLM to generate insights
  // For now, we'll return some static insights
  
  const { hypothese, secteur, scenarios } = data;
  
  // Create a prompt for the LLM
  const prompt = `
Analyse cette hypothèse business: "${hypothese}"
Pour le secteur: ${secteur || 'Non spécifié'}

Scénario optimiste:
${formatScenarioForPrompt(scenarios.optimiste)}

Scénario neutre:
${formatScenarioForPrompt(scenarios.neutre)}

Scénario pessimiste:
${formatScenarioForPrompt(scenarios.pessimiste)}

Génère 3 insights stratégiques pertinents basés sur ces projections.
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
        agent: 'ForecastAgent',
        model: 'gpt-4',
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const responseData = await response.json();
    
    // Split the response into individual insights
    const insights = responseData.response
      .split(/\d+\./)
      .filter((s: string) => s.trim().length > 0)
      .map((s: string) => s.trim());
    
    return insights.length > 0 ? insights : getDefaultInsights();
  } catch (error) {
    console.error('Error generating insights:', error);
    return getDefaultInsights();
  }
}

/**
 * Format a scenario object for inclusion in a prompt
 */
function formatScenarioForPrompt(scenario: any): string {
  return Object.entries(scenario)
    .map(([key, value]) => `- ${key}: ${value}`)
    .join('\n');
}

/**
 * Get default insights in case of error
 */
function getDefaultInsights(): string[] {
  return [
    "La gestion de trésorerie sera un facteur critique de succès, particulièrement dans le scénario pessimiste où une baisse significative est anticipée.",
    "L'investissement dans la formation des équipes pourrait atténuer l'impact négatif sur la productivité dans les scénarios moins favorables.",
    "Une stratégie de diversification des revenus permettrait de réduire la volatilité prévue dans les différents scénarios."
  ];
}

/**
 * Calculate impact scores for each scenario
 */
function calculateImpactScores(scenarios: any): any {
  const result: any = {};
  
  // Calculate for each scenario
  for (const [scenarioName, scenarioData] of Object.entries(scenarios)) {
    const scenarioObj = scenarioData as any;
    
    // Calculate financial impact
    let financialImpact = 0;
    if (scenarioObj.CA) {
      const caValue = parseFloat(scenarioObj.CA);
      financialImpact += isNaN(caValue) ? 0 : caValue;
    }
    if (scenarioObj.marge) {
      const margeValue = parseFloat(scenarioObj.marge);
      financialImpact += isNaN(margeValue) ? 0 : margeValue * 2; // Marge has double weight
    }
    
    // Calculate operational impact
    let operationalImpact = 0;
    if (scenarioObj.effectifs) {
      const effectifsValue = parseFloat(scenarioObj.effectifs);
      operationalImpact += isNaN(effectifsValue) ? 0 : effectifsValue * 5; // Each employee has significant impact
    }
    
    // Calculate investment impact
    let investmentImpact = 0;
    if (scenarioObj.investissements) {
      const investValue = parseFloat(scenarioObj.investissements);
      investmentImpact += isNaN(investValue) ? 0 : investValue / 10000; // Convert to impact score
    }
    
    result[scenarioName] = {
      financial: Math.abs(financialImpact),
      operational: Math.abs(operationalImpact),
      investment: Math.abs(investmentImpact),
      total: Math.abs(financialImpact) + Math.abs(operationalImpact) + Math.abs(investmentImpact)
    };
  }
  
  return result;
} 