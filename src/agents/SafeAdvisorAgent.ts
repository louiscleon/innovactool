/**
 * SafeAdvisorAgent
 * 
 * This agent provides general business advice while ensuring safety
 * by avoiding specific legal, fiscal, or regulatory advice that could
 * create liability issues.
 */
import { callLLM } from '@/services/api';

// List of sensitive topics that require special handling
const SENSITIVE_TOPICS = [
  'fiscal', 'impôt', 'taxe', 'juridique', 'légal', 'droit', 'loi',
  'fraude', 'optimisation fiscale', 'évitement fiscal', 'évasion',
  'blanchiment', 'contourner', 'illégal', 'illicite', 'sanction'
];

/**
 * Checks if a query contains sensitive topics that should be handled carefully
 */
function containsSensitiveTopics(query: string): boolean {
  const queryLower = query.toLowerCase();
  return SENSITIVE_TOPICS.some(topic => queryLower.includes(topic));
}

/**
 * Reformulates a sensitive query to make it safer to answer
 */
function reformulateSensitiveQuery(query: string): string {
  // For demonstration purposes, we'll just add a disclaimer
  return `[Reformulation pour réponse générale et non-spécifique] ${query}`;
}

/**
 * Main function to process a query with the SafeAdvisorAgent
 */
export async function processSafeAdvisorQuery(query: string): Promise<{
  response: string;
  safety: 'safe' | 'reformulated' | 'blocked';
  originalQuery: string;
}> {
  try {
    // Check if query contains sensitive topics
    const isSensitive = containsSensitiveTopics(query);
    
    if (isSensitive) {
      // Check if the query is too sensitive to answer at all
      const isBlockable = query.toLowerCase().includes('fraude') || 
                          query.toLowerCase().includes('illégal') ||
                          query.toLowerCase().includes('blanchiment');
      
      if (isBlockable) {
        // Block the query completely
        return {
          response: "Je ne peux pas fournir de conseils sur des sujets qui pourraient impliquer des activités illégales ou contraires à l'éthique. Je vous recommande de consulter un expert-comptable ou un avocat pour obtenir des conseils professionnels adaptés à votre situation spécifique.",
          safety: 'blocked',
          originalQuery: query
        };
      } else {
        // Reformulate and process with caution
        const reformulatedQuery = reformulateSensitiveQuery(query);
        
        // Call the LLM API with the reformulated query
        const response = await callLLM(reformulatedQuery, 'SafeAdvisorAgent');
        
        return {
          response: `⚠️ Avertissement: Je fournis ici des informations générales qui ne constituent pas un conseil fiscal ou juridique personnalisé.\n\n${response.response}`,
          safety: 'reformulated',
          originalQuery: query
        };
      }
    } else {
      // Process safe query normally
      const response = await callLLM(query, 'SafeAdvisorAgent');
      
      return {
        response: response.response,
        safety: 'safe',
        originalQuery: query
      };
    }
  } catch (error) {
    console.error('Error in SafeAdvisorAgent:', error);
    return {
      response: "Désolé, je n'ai pas pu traiter votre demande. Veuillez réessayer ultérieurement.",
      safety: 'blocked',
      originalQuery: query
    };
  }
} 