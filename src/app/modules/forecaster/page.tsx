'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, ArrowRight, Filter, BarChart4, Activity, PieChart, Calendar, Zap, PlusCircle, Download, Clipboard, Brain, LineChart, Check } from 'lucide-react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { ModuleContainer } from '@/components/ModuleAnimations';
import { DecorativeIllustration } from '@/components/DecorativeIllustration';
import { AnimatedElement } from '@/components/AppearanceAnimations';
import { NetworkElement } from '@/components/NetworkElements';
import HypothesisInput from './HypothesisInput';
import ScenarioResults, { Scenario } from './ScenarioResults';
import SignificantEvents from './SignificantEvents';
import { getUnifiedClientData, getSectoralData, UnifiedClientData, SectoralData } from '@/services/clientDataService';

// Composant pour afficher la progression du traitement
interface ProcessingProgressProps {
  steps: Array<{ title: string; description: string; progress: number }>;
  currentStep: number;
  isProcessing: boolean;
}

const ProcessingProgress: React.FC<ProcessingProgressProps> = ({ steps, currentStep, isProcessing }) => {
  if (!isProcessing) return null;
  
  const currentProgress = steps[currentStep]?.progress || 0;
  
  return (
    <div className="mt-6 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 flex items-center mb-1">
          <Activity className="w-4 h-4 mr-1.5 text-primary-500" />
          Traitement en cours
        </h3>
        <p className="text-xs text-gray-500">Notre IA analyse votre hypothèse et génère des projections financières personnalisées</p>
      </div>
      
      <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4">
        <div 
          className="bg-primary-600 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${currentProgress}%` }}
        />
      </div>
      
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={`flex items-start ${index === currentStep ? 'text-primary-600' : index < currentStep ? 'text-gray-400' : 'text-gray-300'}`}
          >
            <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center flex-shrink-0 ${
              index === currentStep 
                ? 'bg-primary-100 border-2 border-primary-500' 
                : index < currentStep 
                  ? 'bg-primary-50 text-primary-500' 
                  : 'bg-gray-100'
            }`}>
              {index < currentStep ? (
                <Check className="w-3 h-3" />
              ) : (
                <span className="text-xs font-medium">{index + 1}</span>
              )}
            </div>
            <div>
              <div className={`text-sm font-medium ${
                index === currentStep ? 'text-primary-600' : index < currentStep ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {step.title}
              </div>
              <div className={`text-xs ${
                index === currentStep ? 'text-primary-500' : 'text-gray-400'
              }`}>
                {step.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Types pour les entrées du journal de l'agent
interface JournalEntry {
  timestamp: Date;
  entry: string;
  type?: 'info' | 'warning' | 'success' | 'error';
}

// Type pour les missions suggérées
interface Mission {
  id: string;
  title: string;
  description: string;
  impact: string;
  confidence: number;
}

// Type pour les événements significatifs
interface SignificantEvent {
  date: string;
  event: string;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
  source: string;
  probability: number;
  financial_impact: string;
  url?: string;
}

// Type pour les données des scénarios
interface ForecastScenarioData {
  CA: string;
  marge: string;
  tresorerie: string;
  effectifs: string;
  investissements?: string;
  [key: string]: string | undefined;
}

// Type pour la structure des scénarios
interface ForecastScenario {
  optimiste: ForecastScenarioData;
  neutre: ForecastScenarioData;
  pessimiste: ForecastScenarioData;
}

// Type pour une hypothèse analysée
interface Hypothesis {
  id: string;
  text: string;
  scenarios: Scenario;
  justification: string;
  facteurs_cles: string[];
  fiabilite: number;
}

// Type pour la réponse de l'API d'hypothèses
interface HypothesesResponse {
  hypotheses: Array<{
    id: string;
    sector: string;
    hypothesis: string;
    scenarios: ForecastScenario;
    justification: string;
    facteurs_cles: string[];
    fiabilite: number;
  }>;
}

// Type pour les opportunités du tableau de bord
interface DashboardOpportunity {
  id: string;
  text: string;
  label: string;
}

export default function ForecasterPage() {
  const [clientData, setClientData] = useState<UnifiedClientData | null>(null);
  const [sectoralData, setSectoralData] = useState<SectoralData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('finances');
  
  // Étapes de traitement pour la visualisation du processus
  const [processingStep, setProcessingStep] = useState<number>(0);
  const [processingSteps] = useState<Array<{ title: string; description: string; progress: number }>>([
    { title: "Collecte des données", description: "Collecte des données sectorielles et financières", progress: 20 },
    { title: "Analyse comparative", description: "Analyse des ratios financiers des entreprises comparables", progress: 40 },
    { title: "Simulation des scénarios", description: "Génération des projections financières", progress: 60 },
    { title: "Calcul des indices", description: "Évaluation des indices de confiance et des facteurs clés", progress: 80 },
    { title: "Finalisation", description: "Génération du rapport finalisé", progress: 100 }
  ]);
  
  const [significantEvents] = useState<SignificantEvent[]>([
    { 
      date: "T2 2024",
      event: "Lancement nouvelle offre SaaS",
      impact: 'positive',
      description: "Lancement d'une nouvelle offre de services cloud par abonnement qui devrait générer des revenus récurrents et stabiliser le chiffre d'affaires de l'entreprise.",
      source: "Business Plan InfoTech Solutions",
      probability: 95,
      financial_impact: "+15% de CA sur 12 mois" 
    },
    { 
      date: "T3 2024",
      event: "Départ CTO fondateur",
      impact: 'negative',
      description: "Le départ prévu du CTO fondateur pourrait créer une instabilité temporaire dans la direction technique et ralentir certains projets en cours.",
      source: "Communication interne",
      probability: 80,
      financial_impact: "-3% de productivité sur 2 trimestres"
    },
    { 
      date: "T4 2024",
      event: "Restructuration dette",
      impact: 'neutral',
      description: "Renégociation des conditions de la dette actuelle pour obtenir des taux plus avantageux et allonger l'échéancier de remboursement.",
      source: "Plan de financement",
      probability: 70,
      financial_impact: "-15k€ en charges financières annuelles"
    },
    { 
      date: "T1 2025",
      event: "Expansion internationale",
      impact: 'positive',
      description: "Ouverture prévue d'un bureau en Allemagne pour développer la présence sur le marché européen et diversifier le portefeuille clients.",
      source: "Roadmap stratégique 2025",
      probability: 65,
      financial_impact: "+12% de CA potentiel",
      url: "https://www.lesechos.fr/tech-medias/hightech/comment-les-pme-tech-francaises-accelerent-leur-internationalisation-1347584"
    },
    { 
      date: "T2 2025",
      event: "Nouvelle réglementation IA",
      impact: 'neutral',
      description: "Entrée en vigueur de la nouvelle réglementation européenne sur l'IA qui pourrait nécessiter des adaptations techniques et administratives.",
      source: "Commission Européenne",
      probability: 90,
      financial_impact: "+35k€ en conformité estimés",
      url: "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai"
    }
  ]);
  const [agentJournal, setAgentJournal] = useState<JournalEntry[]>([
    { timestamp: new Date(2023, 4, 20, 9, 30, 0), entry: 'Prévisionniste Stratégique initialisé.', type: 'info' },
    { timestamp: new Date(2023, 4, 20, 9, 30, 5), entry: 'Connexion au datawarehouse - 1250 FEC disponibles', type: 'info' },
    { timestamp: new Date(2023, 4, 20, 9, 30, 10), entry: 'Modèles prédictifs chargés avec succès', type: 'success' }
  ]);
  
  const [currentHypothesis, setCurrentHypothesis] = useState<string>('');
  const [hypothesesHistory, setHypothesesHistory] = useState<Hypothesis[]>([]);
  const [activeHypothesis, setActiveHypothesis] = useState<Hypothesis | null>(null);
  const [hypothesesData, setHypothesesData] = useState<HypothesesResponse | null>(null);
  
  // État pour suivre si l'hypothèse actuelle provient du tableau de bord
  const [fromDashboard, setFromDashboard] = useState<DashboardOpportunity | null>(null);
  
  // Mapping des opportunités du tableau de bord
  const dashboardOpportunities: Record<string, DashboardOpportunity> = {
    'cloud': { id: 'cloud', text: 'Transition vers services cloud', label: 'Transition vers services cloud' },
    'ia': { id: 'ia', text: 'IA et automatisation', label: 'IA et automatisation' },
    'international': { id: 'international', text: 'Expansion internationale', label: 'Expansion internationale' }
  };
  
  // Mapping des exemples standards vers des hypothèses spécifiques
  const standardPromptMap: Record<string, string> = {
    "Si nous recrutons 3 développeurs supplémentaires, quel impact sur notre rentabilité ?": "hyp001",
    "Nous envisageons d'investir 200k€ dans une nouvelle ligne de production, est-ce rentable ?": "hyp002",
    "Quel serait l'impact d'une augmentation de 10% de nos tarifs sur notre chiffre d'affaires ?": "hyp003",
    "Nous prévoyons de créer une offre de services avec abonnement mensuel pour stabiliser nos revenus": "hyp007",
    "Nous envisageons d'ouvrir une filiale à l'étranger pour développer notre marché européen": "hyp008"
  };
  
  // Mapping des opportunités du tableau de bord vers des hypothèses spécifiques
  const dashboardPromptMap: Record<string, string> = {
    "cloud": "hyp007",
    "ia": "hyp006",
    "international": "hyp003"
  };
  
  // Extraire les paramètres d'URL au chargement
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const opportunityParam = params.get('opportunity');
      const promptParam = params.get('prompt');
      
      if (opportunityParam && opportunityParam in dashboardOpportunities) {
        setFromDashboard(dashboardOpportunities[opportunityParam]);
        
        // Ajouter une entrée spécifique au journal pour indiquer la source
        addToJournal(
          `Analyse d'opportunité depuis le tableau de bord: ${dashboardOpportunities[opportunityParam].label}`, 
          "info"
        );
      }
    }
  }, []);
  
  // Charger les données d'hypothèses au démarrage
  useEffect(() => {
    const loadData = async () => {
      try {
        // Charger les données client et sectorielles
        const clientDataResult = await getUnifiedClientData();
        setClientData(clientDataResult);
        
        const sectorDataResult = getSectoralData();
        setSectoralData(sectorDataResult);
        
        // Charger les données d'hypothèses
        const response = await fetch('/api/hypotheses.json');
        const data = await response.json();
        setHypothesesData(data);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setDataLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const addToJournal = (entry: string, type: 'info' | 'warning' | 'success' | 'error' = 'info') => {
    setAgentJournal(prev => [...prev, { 
      timestamp: new Date(), 
      entry,
      type
    }]);
  };
  
  // Traitement de l'hypothèse soumise
  const handleHypothesisSubmit = async (hypothesis: string) => {
    setLoading(true);
    setProcessingStep(0); // Réinitialiser l'étape
    
    // Ajouter au journal
    addToJournal("Analyse en cours de l'hypothèse: " + hypothesis, "info");
    
    // Vérifier si nous avons une correspondance pour cette opportunité
    let matchingOpportunity: DashboardOpportunity | null = null;
    for (const key in dashboardOpportunities) {
      if (hypothesis === dashboardOpportunities[key].text) {
        matchingOpportunity = dashboardOpportunities[key];
        break;
      }
    }
    
    // Si c'est une opportunité du tableau de bord
    if (matchingOpportunity) {
      setFromDashboard({
        id: matchingOpportunity.id,
        text: matchingOpportunity.text,
        label: matchingOpportunity.label
      });
      
      addToJournal(
        `Analyse d'opportunité identifiée: ${matchingOpportunity.label}`,
        "info"
      );
    } else {
      setFromDashboard(null);
    }
    
    // Simulation d'une analyse en cours par les agents IA avec étapes visibles
    // Étape 1
    addToJournal("Agent IA: Collecte des données sectorielles en cours...", "info");
    await new Promise(resolve => setTimeout(resolve, 800));
    setProcessingStep(1);
    
    // Étape 2
    addToJournal("Agent IA: Analyse des ratios financiers des entreprises comparables...", "info");
    await new Promise(resolve => setTimeout(resolve, 1000));
    setProcessingStep(2);
    
    // Étape 3
    addToJournal("Agent IA: Simulation des scénarios financiers...", "info");
    await new Promise(resolve => setTimeout(resolve, 1200));
    setProcessingStep(3);
    
    // Étape 4
    addToJournal("Agent IA: Calcul des indices de confiance...", "info");
    await new Promise(resolve => setTimeout(resolve, 900));
    setProcessingStep(4);
    
    try {
      // Déterminer quelle hypothèse utiliser en fonction du prompt
      let hypothesisId: string | null = null;
      
      // Vérifier d'abord les exemples standards
      for (const [key, value] of Object.entries(standardPromptMap)) {
        if (hypothesis === key) {
          hypothesisId = value;
          break;
        }
      }
      
      // Si c'est une opportunité du tableau de bord
      if (!hypothesisId && matchingOpportunity) {
        // Mapping spécifique pour les opportunités du tableau de bord
        const dashboardPromptMap: Record<string, string> = {
          "cloud": "hyp007",
          "ia": "hyp006",
          "international": "hyp008"
        };
        
        hypothesisId = dashboardPromptMap[matchingOpportunity.id];
      }
      
      // Charger les données d'hypothèses depuis le fichier JSON
      let hypothesesData;
      try {
        const response = await fetch('/api/hypotheses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            hypothese: hypothesis,
            secteur: clientData?.company.sector_name 
          }),
        });
        
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données d'hypothèses");
        }
        
        hypothesesData = await response.json();
        addToJournal("Données d'hypothèses récupérées avec succès", "success");
      } catch (error) {
        console.error("Erreur lors de la récupération des données d'hypothèses:", error);
        addToJournal("Erreur lors de la récupération des données d'hypothèses", "error");
        throw error;
      }
      
      if (!hypothesesData?.hypotheses || !Array.isArray(hypothesesData.hypotheses) || hypothesesData.hypotheses.length === 0) {
        throw new Error("Données d'hypothèses non disponibles ou format incorrect");
      }
      
      // Si on n'a pas trouvé de correspondance exacte, utiliser une hypothèse par défaut
      if (!hypothesisId) {
        // Récupérer une hypothèse aléatoire depuis les données simulées
        const randomIndex = Math.floor(Math.random() * hypothesesData.hypotheses.length);
        hypothesisId = hypothesesData.hypotheses[randomIndex].id;
      }
      
      // Trouver l'hypothèse correspondante
      const hypothesisResult = hypothesesData.hypotheses.find((h: any) => h.id === hypothesisId);
      
      if (!hypothesisResult) {
        throw new Error("Hypothèse non trouvée dans les données");
      }
      
      // Créer un nouvel objet hypothèse
      const newHypothesis: Hypothesis = {
        id: `hyp-${Date.now()}`,
        text: hypothesis,
        scenarios: hypothesisResult.scenarios as any,
        justification: hypothesisResult.justification,
        facteurs_cles: hypothesisResult.facteurs_cles,
        fiabilite: hypothesisResult.fiabilite
      };
      
      setHypothesesHistory(prev => [newHypothesis, ...prev]);
      setActiveHypothesis(newHypothesis);
      addToJournal("Analyse terminée avec succès", "success");
     
    } catch (error) {
      console.error('Erreur lors de l\'analyse de l\'hypothèse:', error);
      addToJournal("Une erreur est survenue pendant l'analyse", "error");
      
      // Utiliser des données de secours préparées selon le prompt
      let fallbackData;
      
      // Déterminer quelle donnée de secours utiliser selon le prompt
      if (hypothesis === "Si nous recrutons 3 développeurs supplémentaires, quel impact sur notre rentabilité ?") {
        fallbackData = {
          scenarios: {
            optimiste: {
              "CA": "+18%",
              "marge": "+14%",
              "tresorerie": "+110k€",
              "effectifs": "+3",
              "investissements": "+15k€",
              "masse_salariale": "+130k€"
            },
            neutre: {
              "CA": "+10%",
              "marge": "+7%",
              "tresorerie": "+60k€",
              "effectifs": "+3",
              "investissements": "+15k€",
              "masse_salariale": "+130k€"
            },
            pessimiste: {
              "CA": "+4%",
              "marge": "-2%",
              "tresorerie": "-15k€",
              "effectifs": "+3",
              "investissements": "+15k€",
              "masse_salariale": "+130k€"
            }
          },
          justification: "Analyse basée sur 165 entreprises similaires ayant augmenté leurs effectifs techniques. Les entreprises du secteur informatique montrent une croissance moyenne de 14% du CA suite à un renforcement des équipes de développement.",
          facteurs_cles: [
            "Croissance du secteur: +7.5%",
            "Délai moyen avant productivité optimale: 3-4 mois",
            "Tension sur le marché de l'emploi IT: forte"
          ],
          fiabilite: 84
        };
      } else if (hypothesis === "Nous envisageons d'investir 200k€ dans une nouvelle ligne de production, est-ce rentable ?") {
        fallbackData = {
          scenarios: {
            optimiste: {
              "CA": "+14%",
              "marge": "+11%",
              "tresorerie": "-50k€ la première année, puis +110k€/an",
              "effectifs": "0",
              "investissements": "+200k€",
              "productivité": "+32%"
            },
            neutre: {
              "CA": "+7%",
              "marge": "+5%",
              "tresorerie": "-50k€ la première année, puis +65k€/an",
              "effectifs": "0",
              "investissements": "+200k€",
              "productivité": "+22%"
            },
            pessimiste: {
              "CA": "+2%",
              "marge": "+1%",
              "tresorerie": "-50k€ la première année, puis +25k€/an",
              "effectifs": "0",
              "investissements": "+200k€",
              "productivité": "+12%"
            }
          },
          justification: "Analyse basée sur 88 entreprises du secteur ayant réalisé des investissements similaires entre 2020 et 2023. Le retour sur investissement moyen observé est de 4,5 ans avec une amélioration moyenne de la productivité de 22%.",
          facteurs_cles: [
            "Carnet de commandes actuel: 7 mois",
            "Taux d'utilisation des machines actuelles: 83%",
            "Évolution du marché: +3.8% prévus"
          ],
          fiabilite: 80
        };
      } else if (hypothesis === "Quel serait l'impact d'une augmentation de 10% de nos tarifs sur notre chiffre d'affaires ?") {
        fallbackData = {
          scenarios: {
            optimiste: {
              "CA": "+7%",
              "marge": "+15%",
              "tresorerie": "+80k€",
              "effectifs": "0",
              "clients": "-2%",
              "ticket_moyen": "+10%"
            },
            neutre: {
              "CA": "+4%",
              "marge": "+12%",
              "tresorerie": "+50k€",
              "effectifs": "0",
              "clients": "-5%",
              "ticket_moyen": "+10%"
            },
            pessimiste: {
              "CA": "-3%",
              "marge": "+6%",
              "tresorerie": "+20k€",
              "effectifs": "0",
              "clients": "-12%",
              "ticket_moyen": "+10%"
            }
          },
          justification: "Analyse basée sur 120 entreprises du secteur ayant augmenté leurs tarifs de plus de 8% sur une année. L'élasticité-prix moyenne de la demande dans ce secteur est de -0,6.",
          facteurs_cles: [
            "Positionnement prix actuel: milieu de gamme",
            "Augmentation moyenne des prix concurrents: +4.5%",
            "Fidélité moyenne des clients: forte"
          ],
          fiabilite: 78
        };
      } else if (hypothesis === "Nous prévoyons de créer une offre de services avec abonnement mensuel pour stabiliser nos revenus") {
        fallbackData = {
          scenarios: {
            optimiste: {
              "CA": "+13% la première année, puis +22% récurrent",
              "marge": "+18%",
              "tresorerie": "+45k€/an",
              "effectifs": "+2",
              "investissements": "+70k€",
              "revenus_recurrents": "55% du CA total"
            },
            neutre: {
              "CA": "+7% la première année, puis +13% récurrent",
              "marge": "+10%",
              "tresorerie": "+15k€/an",
              "effectifs": "+2",
              "investissements": "+70k€",
              "revenus_recurrents": "40% du CA total"
            },
            pessimiste: {
              "CA": "+2% la première année, puis +7% récurrent",
              "marge": "+4%",
              "tresorerie": "-8k€ la première année, puis +8k€/an",
              "effectifs": "+2",
              "investissements": "+70k€",
              "revenus_recurrents": "25% du CA total"
            }
          },
          justification: "Projection basée sur l'analyse de 58 ESN ayant opéré une transition vers un modèle de revenus récurrents. La valeur d'entreprise moyenne a augmenté de 2.3x après cette transformation du modèle économique.",
          facteurs_cles: [
            "Taux de rétention client moyen du secteur: 82%",
            "Durée moyenne des contrats d'abonnement: 24 mois",
            "Coût d'acquisition client amorti sur: 10 mois"
          ],
          fiabilite: 76
        };
      } else if (hypothesis === "Nous envisageons d'ouvrir une filiale à l'étranger pour développer notre marché européen") {
        fallbackData = {
          scenarios: {
            optimiste: {
              "CA": "+25%",
              "marge": "+18%",
              "tresorerie": "-120k€ la première année, puis +180k€/an",
              "effectifs": "+5",
              "investissements": "+250k€",
              "nouveaux_clients": "+30%"
            },
            neutre: {
              "CA": "+15%",
              "marge": "+10%",
              "tresorerie": "-120k€ la première année, puis +100k€/an",
              "effectifs": "+5",
              "investissements": "+250k€",
              "nouveaux_clients": "+20%"
            },
            pessimiste: {
              "CA": "+7%",
              "marge": "+3%",
              "tresorerie": "-120k€ la première année, puis +30k€/an",
              "effectifs": "+5",
              "investissements": "+250k€",
              "nouveaux_clients": "+10%"
            }
          },
          justification: "Analyse basée sur 38 entreprises du secteur ayant développé une présence internationale depuis 2019. Le seuil de rentabilité est généralement atteint après 18-24 mois d'opération.",
          facteurs_cles: [
            "Potentiel de marché dans la zone cible: élevé",
            "Barrières réglementaires: modérées",
            "Compétition locale: moyenne (5 acteurs principaux)"
          ],
          fiabilite: 72
        };
      } else if (matchingOpportunity?.id === "cloud") {
        fallbackData = {
          scenarios: {
            optimiste: {
              "CA": "+28%",
              "marge": "+20%",
              "tresorerie": "-90k€ la première année, puis +140k€/an",
              "effectifs": "+2",
              "investissements": "+120k€",
              "revenus_recurrents": "65% du CA total"
            },
            neutre: {
              "CA": "+20%",
              "marge": "+15%",
              "tresorerie": "-90k€ la première année, puis +90k€/an",
              "effectifs": "+2",
              "investissements": "+120k€",
              "revenus_recurrents": "50% du CA total"
            },
            pessimiste: {
              "CA": "+12%",
              "marge": "+8%",
              "tresorerie": "-90k€ la première année, puis +40k€/an",
              "effectifs": "+2",
              "investissements": "+120k€",
              "revenus_recurrents": "35% du CA total"
            }
          },
          justification: "Analyse basée sur 75 entreprises technologiques ayant effectué une transition vers les services cloud. La croissance moyenne observée est de 22% sur les 24 premiers mois avec une amélioration des marges de 12 points.",
          facteurs_cles: [
            "Croissance du marché cloud: +25%/an",
            "Marge brute moyenne des services cloud: 62%",
            "Taux d'adoption du cloud dans votre secteur: 42%"
          ],
          fiabilite: 85
        };
      } else if (matchingOpportunity?.id === "ia") {
        fallbackData = {
          scenarios: {
            optimiste: {
              "CA": "+18%",
              "marge": "+12%",
              "tresorerie": "-65k€ la première année, puis +95k€/an",
              "effectifs": "+1",
              "investissements": "+80k€",
              "productivité": "+25%"
            },
            neutre: {
              "CA": "+12%",
              "marge": "+8%",
              "tresorerie": "-65k€ la première année, puis +60k€/an",
              "effectifs": "+1",
              "investissements": "+80k€",
              "productivité": "+18%"
            },
            pessimiste: {
              "CA": "+5%",
              "marge": "+3%",
              "tresorerie": "-65k€ la première année, puis +20k€/an",
              "effectifs": "+1",
              "investissements": "+80k€",
              "productivité": "+10%"
            }
          },
          justification: "Analyse basée sur 42 entreprises similaires ayant intégré des solutions d'IA dans leurs processus depuis 2021. Le ROI moyen constaté est de 2.1x sur 24 mois.",
          facteurs_cles: [
            "Maturité technologique de l'entreprise: moyenne+",
            "Coûts actuels d'inefficacité processus: ~8% du CA",
            "Applications IA les plus pertinentes: automatisation des tâches administratives, analyse prédictive, assistance client"
          ],
          fiabilite: 79
        };
      } else if (matchingOpportunity?.id === "international") {
        fallbackData = {
          scenarios: {
            optimiste: {
              "CA": "+32%",
              "marge": "+20%",
              "tresorerie": "-150k€ la première année, puis +220k€/an",
              "effectifs": "+6",
              "investissements": "+180k€",
              "nouveaux_clients": "+40%"
            },
            neutre: {
              "CA": "+22%",
              "marge": "+12%",
              "tresorerie": "-150k€ la première année, puis +130k€/an",
              "effectifs": "+6",
              "investissements": "+180k€",
              "nouveaux_clients": "+25%"
            },
            pessimiste: {
              "CA": "+10%",
              "marge": "+5%",
              "tresorerie": "-150k€ la première année, puis +50k€/an",
              "effectifs": "+6",
              "investissements": "+180k€",
              "nouveaux_clients": "+15%"
            }
          },
          justification: "Analyse basée sur 28 entreprises du secteur ayant développé une présence internationale depuis 2020. Les marchés européens montrent une demande croissante (+15%/an) pour ce type de services.",
          facteurs_cles: [
            "Potentiel de marché dans la zone cible: très élevé",
            "Barrières réglementaires: faibles dans l'UE",
            "Compétition locale: limitée (3 acteurs principaux)"
          ],
          fiabilite: 76
        };
      } else {
        // Données génériques par défaut
        fallbackData = {
          scenarios: {
            optimiste: {
              "CA": "+15%",
              "marge": "+12%",
              "tresorerie": "+90k€",
              "effectifs": "+2",
              "investissements": "+50k€"
            },
            neutre: {
              "CA": "+8%",
              "marge": "+5%",
              "tresorerie": "+40k€",
              "effectifs": "+1",
              "investissements": "+50k€"
            },
            pessimiste: {
              "CA": "+3%",
              "marge": "-2%",
              "tresorerie": "-20k€",
              "effectifs": "+1",
              "investissements": "+50k€"
            }
          },
          justification: "Analyse basée sur 65 entreprises similaires ayant mis en œuvre des stratégies comparables. Le secteur montre une tendance positive avec une croissance moyenne de 8% sur les 12 derniers mois.",
          facteurs_cles: [
            "Croissance du marché: +7.5%",
            "Taux de conversion moyen: 2.8%",
            "Coût d'acquisition client: 450€"
          ],
          fiabilite: 78
        };
      }
      
      const mockHypothesis: Hypothesis = {
        id: `hyp-${Date.now()}`,
        text: hypothesis,
        scenarios: fallbackData.scenarios as any,
        justification: fallbackData.justification,
        facteurs_cles: fallbackData.facteurs_cles,
        fiabilite: fallbackData.fiabilite
      };
      
      setHypothesesHistory(prev => [mockHypothesis, ...prev]);
      setActiveHypothesis(mockHypothesis);
      addToJournal("Analyse terminée avec des données de secours", "warning");
    } finally {
      setLoading(false);
      // Réinitialiser l'étape de traitement après un délai pour que l'utilisateur puisse voir la finalisation
      setTimeout(() => {
        setProcessingStep(0);
      }, 800);
    }
  };
  
  if (dataLoading || !clientData || !sectoralData) {
    return <div className="p-8 flex justify-center items-center">Chargement des données...</div>;
  }

  return (
    <ModuleContainer
      title="Prévisionniste"
      description="Simulez différents scénarios d'évolution de votre activité pour anticiper leurs impacts financiers et opérationnels."
      icon={<TrendingUp className="h-6 w-6" />}
    >
      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Form and history */}
        <div className="lg:col-span-2">
          {/* Hypothesis input section */}
          <AnimatedElement delay={0.1}>
            <Card className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-5 w-5 text-primary-500" />
                <h2 className="text-lg font-semibold text-gray-800">Simulez une hypothèse</h2>
              </div>
              
              <HypothesisInput 
                onSubmit={handleHypothesisSubmit} 
                isLoading={loading}
                companyName={clientData.company.name}
                sector={clientData.company.sector_name}
              />
              
              <div className="mt-4 bg-gray-50 rounded-md p-3 text-xs text-gray-500">
                Basé sur l'analyse de {sectoralData.sector.companies} entreprises similaires.
              </div>
            </Card>
          </AnimatedElement>
          
          {/* Barre de progression pendant le traitement */}
          {loading && (
            <AnimatedElement delay={0.1}>
              <ProcessingProgress 
                steps={processingSteps}
                currentStep={processingStep}
                isProcessing={loading}
              />
            </AnimatedElement>
          )}
          
          {/* Results section */}
          {activeHypothesis && (
            <AnimatedElement delay={0.2}>
              <Card className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <BarChart4 className="h-5 w-5 text-primary-500" />
                    <h2 className="text-lg font-semibold text-gray-800">Résultats de l'analyse</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    {fromDashboard && (
                      <Badge color="success" variant="soft" className="flex items-center gap-1">
                        <TrendingUp size={12} />
                        <span>Opportunité tableau de bord</span>
                      </Badge>
                    )}
                    <Badge color="primary" variant="soft">Fiabilité: {activeHypothesis.fiabilite}%</Badge>
                  </div>
                </div>
                
                {/* Scenarios results */}
                <ScenarioResults 
                  scenarios={activeHypothesis.scenarios}
                  hypothesis={activeHypothesis.text}
                  justification={activeHypothesis.justification}
                  facteurs_cles={activeHypothesis.facteurs_cles}
                  fiabilite={activeHypothesis.fiabilite}
                />
                
                {/* Actions */}
                <div className="mt-5 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="xs"
                    icon={<Download size={14} />}
                  >
                    Exporter
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    icon={<Clipboard size={14} />}
                  >
                    Rapport détaillé
                  </Button>
                </div>
              </Card>
            </AnimatedElement>
          )}
          
          {/* History of hypotheses */}
          {hypothesesHistory.length > 1 && (
            <AnimatedElement delay={0.3}>
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="h-5 w-5 text-primary-500" />
                  <h2 className="text-lg font-semibold text-gray-800">Historique des simulations</h2>
                </div>
                
                <div className="space-y-3">
                  {hypothesesHistory.slice(1).map((hyp) => (
                    <div 
                      key={hyp.id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer"
                      onClick={() => setActiveHypothesis(hyp)}
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-800 mb-1 truncate">{hyp.text}</div>
                        <div className="text-xs text-gray-500">Fiabilité: {hyp.fiabilite}%</div>
                      </div>
                      <Button variant="outline" size="xs">
                        <ArrowRight size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </AnimatedElement>
          )}
        </div>
        
        {/* Right column: Context and Agent */}
        <div className="lg:col-span-1 space-y-6">
          {/* Company context */}
          <AnimatedElement delay={0.2}>
            <Card className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="h-5 w-5 text-primary-500" />
                <h2 className="text-lg font-semibold text-gray-800">Contexte entreprise</h2>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Entreprise:</div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary-100 text-primary-600 font-medium">
                    {clientData.company.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-800">{clientData.company.name}</div>
                    <div className="text-xs text-gray-500">{clientData.company.sector_name}</div>
                  </div>
                </div>
              </div>
              
              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-3">
                <button
                  className={`px-3 py-2 text-sm font-medium ${activeTab === 'finances' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('finances')}
                >
                  Finances
                </button>
                <button
                  className={`px-3 py-2 text-sm font-medium ${activeTab === 'events' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('events')}
                >
                  Événements
                </button>
              </div>
              
              {/* Tab content */}
              {activeTab === 'finances' ? (
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">Chiffre d'affaires 2024</div>
                    <div className="text-md font-semibold text-gray-800">
                      920 000 €
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">Croissance CA</div>
                    <div className="flex items-center">
                      <div className="text-md font-semibold text-gray-800 mr-2 text-error-600">
                        -45,2%
                      </div>
                      <Badge color="error" variant="soft" size="xs">vs 2023</Badge>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">Marge nette 2024</div>
                    <div className="text-md font-semibold text-gray-800">
                      10,0%
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-3 mt-3">
                    <div className="text-xs font-medium text-gray-500 mb-2">Secteur: {clientData.company.sector_name}</div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">Croissance sectorielle:</span>
                      <span className="font-medium text-gray-800">+38,7%</span>
                    </div>
                    <div className="flex justify-between items-center text-xs mt-1">
                      <span className="text-gray-500">Marge moyenne:</span>
                      <span className="font-medium text-gray-800">7,5%</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-xs font-medium text-gray-700 mb-2">Événements significatifs</div>
                  {significantEvents.map((event, index) => (
                    <div 
                      key={index}
                      className="p-2 rounded-md border border-gray-100 flex items-start gap-2"
                    >
                      <div className="mt-0.5">
                        {event.impact === 'positive' ? (
                          <div className="h-3 w-3 rounded-full bg-success-500"></div>
                        ) : event.impact === 'negative' ? (
                          <div className="h-3 w-3 rounded-full bg-error-500"></div>
                        ) : (
                          <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-800">{event.event}</div>
                        <div className="text-xs text-gray-500">{event.date}</div>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-center pt-2">
                    <Button
                      variant="outline"
                      size="xs"
                      icon={<PlusCircle size={14} />}
                    >
                      Ajouter un événement
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </AnimatedElement>
          
          {/* Agent section */}
          <AnimatedElement delay={0.3}>
            <Card
              title="Agent Prévisionniste"
              icon={<Brain className="w-4 h-4 text-primary-500" />}
              className="mb-6"
            >
              <div className="bg-gray-50 rounded-md p-3 mb-3 flex items-center gap-3">
                <div className="bg-primary-500 rounded-full w-8 h-8 flex items-center justify-center">
                  <Brain className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Agent actif</div>
                  <div className="text-sm font-medium">Prévisionniste Stratégique v1.2</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="text-sm text-gray-700">
                  Cet agent analyse les données historiques, les tendances sectorielles et les projections 
                  macroéconomiques pour générer des scénarios de prévision personnalisés.
                </div>
                
                <div className="flex gap-2">
                  <Badge color="success" variant="soft" size="xs">65 modèles chargés</Badge>
                  <Badge color="info" variant="soft" size="xs">1250 entreprises similaires</Badge>
                </div>
              </div>
            </Card>
          </AnimatedElement>
          
          {/* Significant Events with article links on hover */}
          <AnimatedElement delay={0.4}>
            <SignificantEvents events={significantEvents} />
          </AnimatedElement>
          
          <AnimatedElement delay={0.5}>
            <Card
              title="Journal de l'agent"
              icon={<Activity className="w-4 h-4 text-primary-500" />}
              size="sm"
            >
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {agentJournal.slice().reverse().map((entry, index) => (
                  <div key={index} className="text-xs border-l-2 border-gray-200 pl-3 py-1">
                    <div className="flex items-center">
                      <span className={`font-mono ${
                        entry.type === 'info' ? 'text-gray-500' :
                        entry.type === 'success' ? 'text-success-500' :
                        entry.type === 'warning' ? 'text-warning-500' :
                        'text-error-500'
                      }`}>
                        {entry.timestamp.toLocaleTimeString()} 
                      </span>
                    </div>
                    <div className="mt-1 text-gray-700">{entry.entry}</div>
                  </div>
                ))}
              </div>
            </Card>
          </AnimatedElement>
        </div>
      </div>
    </ModuleContainer>
  );
} 