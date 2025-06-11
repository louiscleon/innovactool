import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Cache mechanism to limit API calls
const apiCache = new Map();
const CACHE_TTL = 3600000; // 1 hour in milliseconds

// InfoTech Solutions data
const companyData = {
  ca: 920000, // CA 2024 de 920k€
  employees: 24,
  location: 'Paris',
  sector: 'Programmation informatique'
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { hypothese, secteur } = body;

    if (!hypothese) {
      return NextResponse.json({ error: 'Hypothèse is required' }, { status: 400 });
    }

    // Create a cache key based on the request parameters
    const cacheKey = `hypothesis_${hypothese.substring(0, 50)}_${secteur || ''}`;
    const cachedData = apiCache.get(cacheKey);
    
    if (cachedData && cachedData.timestamp > Date.now() - CACHE_TTL) {
      console.log(`Using cached hypothesis data`);
      return NextResponse.json(cachedData.data);
    }

    // Get data from mock data file
    const scenarioData = await generateScenarios(hypothese, secteur);

    // Store in cache
    apiCache.set(cacheKey, {
      data: scenarioData,
      timestamp: Date.now()
    });

    return NextResponse.json(scenarioData);
  } catch (error) {
    console.error('Error processing hypothesis:', error);
    return NextResponse.json({ error: 'Failed to process hypothesis' }, { status: 500 });
  }
}

async function generateScenarios(hypothese: string, secteur?: string) {
  try {
    // Read from mock data file
    const dataPath = path.join(process.cwd(), 'data-simulations', 'hypotheses.json');
    const fileData = fs.readFileSync(dataPath, 'utf8');
    const jsonData = JSON.parse(fileData);
    
    // Access the hypotheses array from the object structure
    const mockData = jsonData.hypotheses;
    
    if (!mockData || !Array.isArray(mockData)) {
      throw new Error('Invalid hypotheses data format');
    }
    
    // Find a matching hypothesis or use a default one
    let matchingHypothesis = mockData.find((h: any) => 
      h.hypothesis.toLowerCase().includes(hypothese.toLowerCase()) ||
      hypothese.toLowerCase().includes(h.hypothesis.toLowerCase())
    );
    
    // If no match found, use the first one as default
    if (!matchingHypothesis) {
      matchingHypothesis = mockData[0];
    }
    
    // Add some randomness to make it look dynamic
    const randomFactor = Math.random() * 0.2 + 0.9; // Random factor between 0.9 and 1.1
    
    // Modify the scenarios slightly
    const modifiedScenarios = {
      optimiste: enrichScenario(modifyScenarioValues(matchingHypothesis.scenarios.optimiste, randomFactor * 1.1)),
      neutre: enrichScenario(modifyScenarioValues(matchingHypothesis.scenarios.neutre, randomFactor)),
      pessimiste: enrichScenario(modifyScenarioValues(matchingHypothesis.scenarios.pessimiste, randomFactor * 0.9))
    };
    
    // Modify the factors
    const facteurs = [...matchingHypothesis.facteurs_cles];
    
    // Ajouter des facteurs spécifiques à la localisation et au secteur
    if (!facteurs.some(f => f.toLowerCase().includes('paris'))) {
      facteurs.push("Contexte économique parisien: forte demande en services IT");
    }
    
    if (secteur) {
      facteurs.push(`Spécificités du secteur ${secteur}`);
    }
    
    // Améliorer la justification
    let enhancedJustification = matchingHypothesis.justification;
    if (!enhancedJustification.includes("Paris")) {
      enhancedJustification += ` Cette analyse prend en compte les spécificités du marché parisien où InfoTech Solutions est implantée.`;
    }
    if (!enhancedJustification.includes("informatique")) {
      enhancedJustification += ` Pour une entreprise de programmation informatique comme InfoTech Solutions, cette stratégie s'avère particulièrement adaptée dans le contexte actuel du secteur.`;
    }
    
    // Add timestamp to make it look fresh
    return {
      hypotheses: [{
        id: matchingHypothesis.id,
        sector: secteur || matchingHypothesis.sector,
        hypothesis: hypothese,
        scenarios: modifiedScenarios,
        justification: enhancedJustification,
        facteurs_cles: facteurs,
        fiabilite: Math.round(matchingHypothesis.fiabilite * randomFactor * 100) / 100
      }],
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating scenarios:', error);
    throw new Error('Failed to generate scenarios');
  }
}

// Enrichit un scénario avec des valeurs absolues
function enrichScenario(scenario: any) {
  const result = { ...scenario };
  
  // Ajouter une valeur absolue pour le CA si c'est un pourcentage
  if (result.CA && typeof result.CA === 'string' && result.CA.includes('%')) {
    try {
      const percentValue = parseFloat(result.CA);
      if (!isNaN(percentValue)) {
        const absoluteValue = Math.round((percentValue / 100) * companyData.ca);
        result.CA_absolu = `+${absoluteValue.toLocaleString()}€`;
      }
    } catch (e) {
      console.error('Error calculating absolute value:', e);
    }
  }
  
  return result;
}

function modifyScenarioValues(scenario: any, factor: number) {
  const result: any = {};
  
  // Apply the random factor to numeric values
  for (const key in scenario) {
    const value = scenario[key];
    
    if (typeof value === 'string') {
      // Handle percentage strings
      if (value.includes('%')) {
        const numValue = parseFloat(value);
        result[key] = `${Math.round(numValue * factor * 10) / 10}%`;
      }
      // Handle monetary values
      else if (value.includes('€')) {
        const numValue = parseFloat(value.replace(/[^0-9.-]+/g, ''));
        const unit = value.includes('k€') ? 'k€' : '€';
        result[key] = `${Math.round(numValue * factor)}${unit}`;
      }
      // Handle plain numbers
      else if (!isNaN(parseFloat(value))) {
        const numValue = parseFloat(value);
        result[key] = `${Math.round(numValue * factor * 10) / 10}`;
      }
      // Keep non-numeric strings as is
      else {
        result[key] = value;
      }
    } else {
      // Handle numeric values
      result[key] = Math.round(value * factor * 10) / 10;
    }
  }
  
  return result;
} 