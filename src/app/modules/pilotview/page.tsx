"use client";

import React, { useEffect, useState } from 'react';
import { 
  PieChart, 
  BarChart, 
  TrendingUp, 
  Activity, 
  AlertCircle,
  Users,
  ChevronRight,
  Search,
  ArrowLeft,
  Building2,
  FileSpreadsheet
} from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { NetworkElement } from '@/components/NetworkElements';
import { NetworkWatermark } from '@/components/NetworkWatermark';
import { SectoralComparison } from './SectoralComparison';
import { getUnifiedClientData, getSectoralData, RiskFactor, GrowthOpportunity } from '@/services/clientDataService';
import { useClient } from '@/components/ClientContext';
import { ClientDetailView } from '@/components/ClientDetailView';
import { FinancialOverview } from '@/components/FinancialOverview';
import { BusinessInsights } from '@/components/BusinessInsights';
import { MarketTrendsSection } from '@/components/MarketTrendsSection';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components';
import { fetchCompanyData, fetchEnterpriseFullData, analyzedEnterpriseData, EnterpriseData } from '@/services/api';
import { Tooltip } from '@/components/Tooltip';

// Interface pour les données client de ClientScope
interface Client {
  id: string;
  name: string;
  sector: string;
  revenue: number;
  employees: number;
  score: number;
  potentialValue: 'high' | 'medium' | 'low';
  siren?: string;
}

export default function PilotViewPage() {
  const { activeClient, clientList } = useClient();
  const [clientData, setClientData] = useState<any>(null);
  const [sectorData, setSectorData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showClientList, setShowClientList] = useState(false);
  const [enterpriseData, setEnterpriseData] = useState<EnterpriseData | null>(null);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const [loadedBlocks, setLoadedBlocks] = useState<string[]>([]);
  const [periodRatio, setPeriodRatio] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalContent, setModalContent] = useState<string>('');
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Récupérer les données client centralisées
        const data = await getUnifiedClientData(activeClient.siren);
        setClientData(data);
        
        // Récupérer les données sectorielles
        const sectData = getSectoralData();
        setSectorData(sectData);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      } finally {
        // Simuler le chargement progressif
        setLoading(false);
        loadBlocksProgressively();
      }
    }

    fetchData();
  }, [activeClient.siren]);
  
  // Gérer les opportunités après le rendu complet du composant
  useEffect(() => {
    function setupOpportunityListeners() {
      // Attendre que le DOM soit complètement mis à jour
      setTimeout(() => {
        const buttons = document.querySelectorAll('.opportunity-button');
        buttons.forEach(button => {
          button.addEventListener('click', (e) => {
            e.preventDefault();
            const opportunity = button.getAttribute('data-opportunity');
            const prompt = button.getAttribute('data-prompt');
            if (opportunity && prompt) {
              const url = `/modules/forecaster?opportunity=${opportunity}&prompt=${encodeURIComponent(prompt)}`;
              window.location.href = url;
            }
          });
        });
      }, 100); // Petit délai pour s'assurer que le DOM est complètement chargé
    }
    
    setupOpportunityListeners();
    
    return () => {
      // Le nettoyage se produit automatiquement lorsque la modal se ferme
    };
  }, [loadedBlocks]); // Exécuter à chaque fois que les blocs sont chargés

  // Fonction pour charger progressivement les blocs
  const loadBlocksProgressively = () => {
    const blocks = [
      'client-info',
      'main-kpis', 
      'business-insights',
      'risks',
      'opportunities',
      'financial-overview',
      'sectoral-comparison',
      'company-news',
      'sector-news'
    ];
    
    // Temps de chargement spécifiques pour chaque bloc (en ms)
    const blockLoadTimes: {[key: string]: number} = {
      'client-info': 800,
      'main-kpis': 1200, 
      'business-insights': 6000, // Alimenté par Perplexity - temps plus long
      'risks': 2500,
      'opportunities': 3000,
      'financial-overview': 2000,
      'sectoral-comparison': 2800,
      'company-news': 5500, // Alimenté par Perplexity - temps plus long
      'sector-news': 6500 // Alimenté par Perplexity - temps plus long
    };
    
    // Réinitialiser les blocs chargés
    setLoadedBlocks([]);
    
    let currentTime = 0;
    blocks.forEach((block) => {
      const loadTime = blockLoadTimes[block] || 1500; // Temps par défaut si non spécifié
      currentTime += loadTime;
      
      setTimeout(() => {
        setLoadedBlocks(prev => [...prev, block]);
      }, currentTime);
    });
  };

  // Vérifier si un bloc est chargé
  const isBlockLoaded = (blockName: string) => {
    return loadedBlocks.includes(blockName);
  };

  // La fonction calculatePeriodRatio est conservée car elle pourrait être utilisée ailleurs
  const calculatePeriodRatio = (start: string, end: string, year: string) => {
    const monthsMapping: {[key: string]: number} = {
      "Janvier": 0, "Février": 1, "Mars": 2, "Avril": 3, "Mai": 4, "Juin": 5,
      "Juillet": 6, "Août": 7, "Septembre": 8, "Octobre": 9, "Novembre": 10, "Décembre": 11
    };
    
    const startIdx = monthsMapping[start];
    const endIdx = monthsMapping[end];
    
    // Nombre de jours par mois (approximatif pour les calculs de prorata)
    const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    // Calcul plus précis en tenant compte du nombre de jours
    if (startIdx <= endIdx) {
      // Période dans la même année
      const totalDays = daysPerMonth.slice(startIdx, endIdx + 1).reduce((sum, days) => sum + days, 0);
      return totalDays / 365;
    } else {
      // Pour les périodes à cheval sur deux années, on considère une année complète
      return 1;
    }
  };

  // Nous affichons désormais tous les blocs
  const isBlockVisible = () => {
    return true;
  };

  // État pour identifier si la modal d'opportunités est actuellement affichée
  const [opportunitiesModalActive, setOpportunitiesModalActive] = useState(false);
  
  // Fonction pour afficher une fenêtre modale avec des recommandations
  const handleRecommendationClick = (type: string) => {
    let title = '';
    let content = '';
    
    switch (type) {
      case 'insights':
        title = 'Analyse complète des insights business';
        content = `
          <div class="bg-gradient-to-r from-blue-50 to-primary-50 rounded-lg p-4 mb-5 border border-primary-100">
            <h3 class="font-medium text-gray-800 mb-3 flex items-center">
              <svg class="h-5 w-5 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Analyse détaillée pour ${clientData?.company?.name}
            </h3>
          </div>
          
          <p class="mb-4">L'analyse des données comptables et financières de 2024 comparées à 2023 met en évidence plusieurs tendances et opportunités :</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h4 class="text-sm font-medium text-primary-700 mb-3 pb-2 border-b border-gray-100">Performance financière</h4>
              <ul class="list-disc pl-5 mb-0 space-y-2 text-sm">
                <li>La <strong>croissance du chiffre d'affaires</strong> est solide avec +12% en 2024 (hors TechnoVision Systems), soit 5 points au-dessus de la moyenne du secteur</li>
                <li>La <strong>marge brute</strong> s'est améliorée progressivement, passant de 21% en 2022 à 25% en 2024</li>
                <li>La <strong>rentabilité</strong> a été maintenue malgré les investissements dans la R&D et les recrutements</li>
          </ul>
            </div>
            
            <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h4 class="text-sm font-medium text-warning-700 mb-3 pb-2 border-b border-gray-100">Points d'attention</h4>
              <ul class="list-disc pl-5 mb-0 space-y-2 text-sm">
                <li>Les <strong>délais de paiement clients</strong> se sont dégradés (+5 jours vs 2023), ce qui impacte négativement le BFR</li>
                <li>Une <strong>pression sur les marges</strong> a été observée au premier semestre 2024 en raison de la hausse des coûts</li>
                <li>Le <strong>taux d'endettement</strong> reste faible (0.7x), ce qui offre une marge de manœuvre pour des investissements</li>
              </ul>
            </div>
          </div>
          
          <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-5">
            <h4 class="text-sm font-medium text-success-700 mb-3 pb-2 border-b border-gray-100">Recommandations prioritaires</h4>
            <ol class="list-decimal pl-5 space-y-3 text-sm">
              <li>
                <p class="font-medium">Optimisation des encaissements clients</p>
                <p class="text-gray-600">Mettre en place un plan d'action pour réduire les délais de paiement avec des incitations au règlement rapide, une révision des processus de relance et potentiellement l'affacturage pour certains clients à risque.</p>
              </li>
              <li>
                <p class="font-medium">Analyse de rentabilité par segment client</p>
                <p class="text-gray-600">Analyser les segments clients les plus rentables pour optimiser l'allocation des ressources commerciales et réduire les efforts sur les segments moins profitables.</p>
              </li>
              <li>
                <p class="font-medium">Diversification de l'offre</p>
                <p class="text-gray-600">Étudier l'opportunité d'investissement dans les services cloud pour diversifier les sources de revenus et réduire la dépendance au secteur retail.</p>
              </li>
          </ol>
          </div>
          
          <p class="text-xs text-gray-500 italic">Analyse basée sur les données financières arrêtées au 31/12/2024 et les tendances sectorielles observées.</p>
        `;
        break;
      case 'risks':
        title = 'Plan de mitigation des risques';
        content = `
          <h3 class="font-medium text-gray-800 mb-3">Analyse des risques identifiés</h3>
          
          <div class="mb-4 p-3 border border-error-200 bg-error-50 rounded-lg">
            <h4 class="font-medium text-error-800 mb-2">Risque : Augmentation des délais de paiement</h4>
            <p class="mb-2">Ce risque impacte directement votre trésorerie et peut créer des tensions à court terme.</p>
            <h5 class="font-medium mt-2 mb-1">Plan d'action recommandé :</h5>
            <ol class="list-decimal pl-5 space-y-1">
              <li>Réviser les conditions générales de vente avec des incitations au paiement rapide</li>
              <li>Mettre en place un suivi plus rigoureux des règlements clients</li>
              <li>Instaurer un processus de relance automatisé avec des étapes précises</li>
              <li>Étudier la possibilité d'affacturage pour les clients à risque</li>
            </ol>
          </div>
          
          <div class="mb-4 p-3 border border-warning-200 bg-warning-50 rounded-lg">
            <h4 class="font-medium text-warning-800 mb-2">Risque : Difficulté de recrutement</h4>
            <p class="mb-2">Le marché tendu des talents IT peut limiter votre capacité de croissance et augmenter les coûts salariaux.</p>
            <h5 class="font-medium mt-2 mb-1">Plan d'action recommandé :</h5>
            <ol class="list-decimal pl-5 space-y-1">
              <li>Travailler votre marque employeur en développant votre visibilité dans l'écosystème</li>
              <li>Mettre en place une politique de cooptation avec primes</li>
              <li>Développer des partenariats avec des écoles et universités</li>
              <li>Réfléchir à une stratégie d'acquisition de compétences via de petites structures</li>
            </ol>
          </div>
        `;
        break;
      case 'opportunities':
        title = 'Analyse de faisabilité des opportunités';
        content = `
          <h3 class="font-medium text-gray-800 mb-3">Évaluation des opportunités de croissance</h3>
          
          <div class="mb-4 p-3 border border-success-200 bg-success-50 rounded-lg">
            <h4 class="font-medium text-success-800 mb-2">Opportunité : Transition vers services cloud</h4>
            
            <div class="grid grid-cols-2 gap-x-4 gap-y-3 mb-3">
              <div class="overflow-hidden">
                <p class="text-xs text-gray-600 mb-1">Potentiel de CA additionnel</p>
                <p class="font-medium text-ellipsis overflow-hidden">+15% (soit environ 138k€)</p>
              </div>
              <div class="overflow-hidden">
                <p class="text-xs text-gray-600 mb-1">ROI estimé</p>
                <p class="font-medium text-ellipsis overflow-hidden">18 mois</p>
              </div>
              <div class="overflow-hidden">
                <p class="text-xs text-gray-600 mb-1">Investissement initial</p>
                <p class="font-medium text-ellipsis overflow-hidden">120k€</p>
              </div>
              <div class="overflow-hidden">
                <p class="text-xs text-gray-600 mb-1">Risque projet</p>
                <p class="font-medium text-ellipsis overflow-hidden">Moyen</p>
              </div>
            </div>
            
            <h5 class="font-medium mt-3 mb-1">Étapes de mise en œuvre :</h5>
            <ol class="list-decimal pl-5 space-y-1 mb-3">
              <li>Étude de marché approfondie des solutions cloud demandées par vos clients actuels</li>
              <li>Identification des partenaires technologiques potentiels</li>
              <li>Développement d'une offre MVP (Minimum Viable Product)</li>
              <li>Test auprès d'un panel de clients existants</li>
              <li>Formation des équipes commerciales et recrutement de profils spécialisés</li>
            </ol>
            
            <p class="text-sm font-medium text-success-700">Cette opportunité semble particulièrement adaptée à votre positionnement actuel et pourrait significativement renforcer votre proposition de valeur.</p>
            
            <div class="mt-3 flex justify-end">
              <button 
                type="button"
                class="text-white bg-success-600 hover:bg-success-700 focus:ring-2 focus:ring-success-300 font-medium rounded-lg text-xs px-3 py-1.5 mr-2 focus:outline-none opportunity-button"
                data-opportunity="cloud"
                data-prompt="Je souhaite simuler une transition vers les services cloud avec un investissement initial de 80k€ et un potentiel de CA de +15%"
              >
                Simuler cette opportunité
              </button>
            </div>
          </div>
          
          <div class="mb-4 p-3 border border-success-200 bg-success-50 rounded-lg">
            <h4 class="font-medium text-success-800 mb-2">Opportunité : IA et automatisation</h4>
            
            <div class="grid grid-cols-2 gap-x-4 gap-y-3 mb-3">
              <div class="overflow-hidden">
                <p class="text-xs text-gray-600 mb-1">Potentiel de CA additionnel</p>
                <p class="font-medium text-ellipsis overflow-hidden">+20% (soit environ 184k€)</p>
              </div>
              <div class="overflow-hidden">
                <p class="text-xs text-gray-600 mb-1">ROI estimé</p>
                <p class="font-medium text-ellipsis overflow-hidden">12 mois</p>
              </div>
              <div class="overflow-hidden">
                <p class="text-xs text-gray-600 mb-1">Investissement initial</p>
                <p class="font-medium text-ellipsis overflow-hidden">80k€</p>
              </div>
              <div class="overflow-hidden">
                <p class="text-xs text-gray-600 mb-1">Risque projet</p>
                <p class="font-medium text-ellipsis overflow-hidden">Faible à Moyen</p>
              </div>
            </div>
            
            <h5 class="font-medium mt-3 mb-1">Points d'attention :</h5>
            <ul class="list-disc pl-5 space-y-1">
              <li>Forte demande du marché avec une concurrence encore limitée sur votre segment</li>
              <li>Possibilité de développer des solutions complémentaires à votre offre actuelle</li>
              <li>Potentiel d'amélioration des marges grâce à l'automatisation interne</li>
            </ul>
            
            <div class="mt-3 flex justify-end">
              <button 
                type="button"
                class="text-white bg-success-600 hover:bg-success-700 focus:ring-2 focus:ring-success-300 font-medium rounded-lg text-xs px-3 py-1.5 mr-2 focus:outline-none opportunity-button"
                data-opportunity="ia"
                data-prompt="Je souhaite simuler l'intégration d'IA et d'automatisation avec un investissement initial de 150k€ et un potentiel de CA de +20%"
              >
                Simuler cette opportunité
              </button>
            </div>
          </div>
          
          <div class="mb-4 p-3 border border-success-200 bg-success-50 rounded-lg">
            <h4 class="font-medium text-success-800 mb-2">Opportunité : Expansion internationale</h4>
            
            <div class="grid grid-cols-2 gap-x-4 gap-y-3 mb-3">
              <div class="overflow-hidden">
                <p class="text-xs text-gray-600 mb-1">Potentiel de CA additionnel</p>
                <p class="font-medium text-ellipsis overflow-hidden">+15% (soit environ 138k€)</p>
              </div>
              <div class="overflow-hidden">
                <p class="text-xs text-gray-600 mb-1">ROI estimé</p>
                <p class="font-medium text-ellipsis overflow-hidden">24 mois</p>
              </div>
              <div class="overflow-hidden">
                <p class="text-xs text-gray-600 mb-1">Investissement initial</p>
                <p class="font-medium text-ellipsis overflow-hidden">180k€</p>
              </div>
              <div class="overflow-hidden">
                <p class="text-xs text-gray-600 mb-1">Risque projet</p>
                <p class="font-medium text-ellipsis overflow-hidden">Élevé</p>
              </div>
            </div>
            
            <h5 class="font-medium mt-3 mb-1">Points d'attention :</h5>
            <ul class="list-disc pl-5 space-y-1">
              <li>Adaptation nécessaire des produits aux marchés locaux</li>
              <li>Recrutement d'équipes locales ou partenariats stratégiques</li>
              <li>Complexité réglementaire et administrative à prévoir</li>
            </ul>
            
            <div class="mt-3 flex justify-end">
              <button 
                type="button"
                class="text-white bg-success-600 hover:bg-success-700 focus:ring-2 focus:ring-success-300 font-medium rounded-lg text-xs px-3 py-1.5 mr-2 focus:outline-none opportunity-button"
                data-opportunity="international"
                data-prompt="Je souhaite simuler une expansion internationale avec un investissement initial de 280k€ et un potentiel de CA de +15%"
              >
                Simuler cette opportunité
              </button>
            </div>
          </div>
        `;
        break;
      default:
        title = 'Informations';
        content = 'Contenu non disponible pour le moment.';
    }
    
    setModalTitle(title);
    setModalContent(content);
    setModalType(type);
    setShowModal(true);
    
    // Marquer la modal d'opportunités comme active si nécessaire
    if (type === 'opportunities') {
      setOpportunitiesModalActive(true);
    } else {
      setOpportunitiesModalActive(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-full">
        <div className="animate-spin w-12 h-12 border-t-2 border-primary-500 rounded-full mb-4"></div>
        <p className="text-gray-600">Chargement des données...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in relative w-full pb-8">
      {/* Ajout du NetworkWatermark en filigrane */}
      <NetworkWatermark opacity={0.03} />
      
      <div className="relative mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="bg-primary-100 p-1.5 rounded-lg">
              <PieChart className="h-6 w-6 text-primary-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
          </div>
        </div>
        <p className="text-sm text-gray-600 max-w-3xl">
          Visualisez et analysez les indicateurs clés pour prendre des décisions stratégiques et piloter efficacement l'activité de vos clients.
        </p>
      </div>

      {/* Navigation par onglets */}
      <div className="mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview" icon={<PieChart size={14} />}>
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="financial" icon={<FileSpreadsheet size={14} />}>
              Finances
            </TabsTrigger>
            <TabsTrigger value="insights" icon={<TrendingUp size={14} />}>
              Insights
            </TabsTrigger>
            <TabsTrigger value="market" icon={<Activity size={14} />}>
              Marché
            </TabsTrigger>
          </TabsList>
          
          {/* Onglet Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Information client et Évolution du CA - 6 colonnes */}
              <div className="lg:col-span-6" style={{ display: isBlockVisible() ? 'block' : 'none' }}>
                <div className="grid grid-cols-1 gap-4">
                  {/* Information client */}
                  <div style={{ display: isBlockVisible() ? 'block' : 'none' }}>
                    {!isBlockLoaded('client-info') ? (
                      <Card className="h-full" size="sm">
                        <div className="p-4 flex flex-col items-center justify-center h-full">
                          <div className="animate-spin w-8 h-8 border-t-2 border-primary-500 rounded-full mb-4"></div>
                          <p className="text-sm text-gray-600">Chargement des informations...</p>
                          <p className="text-xs text-gray-500 mt-2">Consultation des données <span className="font-medium">SIRENE</span></p>
                        </div>
                      </Card>
                    ) : (
                      clientData?.company && <ClientDetailView client={clientData.company} />
                    )}
                  </div>
                  
                  {/* Bloc Chiffre d'Affaires */}
                  <div style={{ display: isBlockVisible() ? 'block' : 'none' }}>
                    {!isBlockLoaded('main-kpis') ? (
                      <Card className="h-full" size="sm">
                        <div className="p-4 flex flex-col items-center justify-center h-full">
                          <div className="animate-pulse bg-primary-100 p-2 rounded-lg">
                            <BarChart className="h-5 w-5 text-primary-500" />
                          </div>
                          <div className="mt-3 text-xs text-center text-gray-500">
                            Chargement des données financières...
                          </div>
                          <p className="text-xs text-gray-400 mt-1">Source: <span className="font-medium">DATA WAREHOUSE</span></p>
                        </div>
                      </Card>
                    ) : (
                      <Card className="relative h-full overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-md bg-primary-100 flex items-center justify-center">
                              <BarChart className="h-4 w-4 text-primary-600" />
                            </div>
                            <h2 className="text-base font-semibold text-gray-800">Évolution du CA</h2>
                          </div>
                          <Badge variant="outline" className="bg-white" size="sm">Source: DATA WAREHOUSE</Badge>
                        </div>
                        
                        <div className="p-3">
                          {clientData?.financial_history && (
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <div className="text-xs text-gray-500">CA 2024</div>
                                  <div className="text-lg font-bold text-gray-800">
                                    {(clientData.financial_history['2024'].revenue / 1000000).toFixed(2)} M€
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-xs text-gray-500">Vs 2023</div>
                                  <div className="text-sm font-medium text-error-600">
                                    -45,2%
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-3 h-24 w-full">
                                <svg width="100%" height="100%" viewBox="0 0 400 96">
                                  {/* Axe horizontal */}
                                  <line x1="30" y1="80" x2="380" y2="80" stroke="#e5e7eb" strokeWidth="1" />
                                  
                                  {/* Axe vertical */}
                                  <line x1="30" y1="10" x2="30" y2="80" stroke="#e5e7eb" strokeWidth="1" />
                                  
                                  {/* Données du CA sur 4 ans */}
                                  {(() => {
                                    const years = ['2021', '2022', '2023', '2024'];
                                    const revenues = years.map(year => clientData.financial_history[year]?.revenue || 0);
                                    const maxRevenue = Math.max(...revenues) * 1.1; // 10% de marge au-dessus du max
                                    
                                    // Calculer les points du graphique
                                    const points = revenues.map((rev, i) => {
                                      const x = 30 + (i * 110); // 4 points espacés sur l'axe X
                                      const y = 80 - (rev / maxRevenue * 70); // Hauteur proportionnelle au CA
                                      return `${x},${y}`;
                                    }).join(' ');
                                    
                                    return (
                                      <>
                                        {/* Courbe du CA */}
                                        <polyline 
                                          points={points} 
                                          fill="none" 
                                          stroke="#6366f1" 
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                        
                                        {/* Points sur la courbe */}
                                        {revenues.map((rev, i) => {
                                          const x = 30 + (i * 110);
                                          const y = 80 - (rev / maxRevenue * 70);
                                          return (
                                            <g key={i}>
                                              <circle cx={x} cy={y} r="4" fill="#6366f1" />
                                              <text x={x} y="94" textAnchor="middle" fontSize="10" fill="#6b7280">{years[i]}</text>
                                              <text x={x} y={y-10} textAnchor="middle" fontSize="9" fill="#4b5563">{(rev/1000000).toFixed(1)}M€</text>
                                            </g>
                                          );
                                        })}
                                        
                                        {/* Zone sous la courbe */}
                                        <path 
                                          d={`M30,80 ${points} L${30 + 3 * 110},80 Z`}
                                          fill="url(#gradient)"
                                          opacity="0.2"
                                        />
                                        
                                        {/* Gradient pour la zone sous la courbe */}
                                        <defs>
                                          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.1" />
                                          </linearGradient>
                                        </defs>
                                      </>
                                    );
                                  })()}
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      </Card>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Bloc Insights business - 6 colonnes */}
              <div className="lg:col-span-6" style={{ display: isBlockVisible() ? 'block' : 'none' }}>
                {!isBlockLoaded('business-insights') ? (
                  <Card className="h-full" size="sm">
                    <div className="p-4 flex flex-col items-center justify-center h-full">
                      <div className="animate-pulse bg-primary-100 p-2 rounded-lg">
                        <Search className="h-5 w-5 text-primary-500" />
                      </div>
                      <div className="mt-3 text-xs text-center text-gray-500">
                        Analyse des insights en cours...
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Source: <span className="font-medium">PERPLEXITY</span></p>
                    </div>
                  </Card>
                ) : (
                  <Card className="relative overflow-hidden h-full">
                    <NetworkElement 
                      type="node" 
                      size="xs" 
                      position="top-right" 
                      color="primary" 
                      opacity={0.04} 
                    />
                    
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-primary-100 flex items-center justify-center">
                          <Search className="h-4 w-4 text-primary-600" />
                        </div>
                        <h2 className="text-base font-semibold text-gray-800">Insights business</h2>
                      </div>
                      <Badge variant="outline" className="bg-white" size="sm">Source: PERPLEXITY</Badge>
                    </div>
                    
                    <div className="p-4 h-[calc(100%-64px)] flex flex-col">
                      <div className="text-sm text-gray-700 space-y-4 flex-grow">
                        <p>
                          {clientData?.company?.name} est une entreprise de {clientData?.company?.sector_name} qui affiche une 
                          croissance stable depuis sa création en {new Date(clientData?.company?.creation_date).getFullYear()}. 
                          Avec {clientData?.company?.employees} employés et un chiffre d'affaires de 
                          {(clientData?.financial_history['2024'].revenue / 1000000).toFixed(1)} M€, 
                          l'entreprise se positionne dans la moyenne haute de son secteur.
                        </p>
                        
                        <p className="text-error-700 font-medium">
                          On note une forte baisse du CA qui semble corrélée à la perte du plus important client (TechnoVision Systems).
                        </p>
                        
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                          <h3 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
                            <TrendingUp className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
                            Points forts identifiés
                          </h3>
                          <ul className="list-disc pl-4 space-y-1 text-xs text-gray-700">
                            <li>Taux de fidélisation client élevé (92%) comparé à la moyenne sectorielle (78%)</li>
                            <li>Marge brute en progression constante sur les trois derniers exercices</li>
                            <li>Structure financière solide avec un ratio d'endettement de seulement 0.7x</li>
                          </ul>
                        </div>
                        
                        <div className="mt-3">
                          <div className="bg-primary-50 p-3 rounded-lg border border-primary-100 mb-3">
                            <div className="flex justify-between items-center mb-2">
                              <div className="text-xs font-medium text-primary-800">Potentiel de croissance</div>
                              <div className="px-2 py-0.5 bg-primary-100 rounded-full text-[10px] font-medium text-primary-800">Élevé</div>
                            </div>
                            <div className="text-[11px] text-primary-800 mb-2">
                              +14-16% projeté en 2025 avec les actions suivantes :
                            </div>
                            <ul className="list-disc pl-4 text-[10px] text-primary-700 space-y-1">
                              <li>Développement des services cloud et IA en cours de déploiement</li>
                              <li>Diversification du portefeuille clients B2B (réduction de dépendance)</li>
                              <li>Expansion internationale prévue au Q3 2025 (Allemagne, Espagne)</li>
                            </ul>
                          </div>
                          
                          <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                            <div className="flex justify-between items-center mb-2">
                              <div className="text-xs font-medium text-amber-800">Points d'attention</div>
                              <div className="px-2 py-0.5 bg-amber-100 rounded-full text-[10px] font-medium text-amber-800">Modérés</div>
                            </div>
                            <div className="text-[11px] text-amber-800 mb-2">
                              2 risques principaux identifiés à surveiller :
                            </div>
                            <ul className="list-disc pl-4 text-[10px] text-amber-700 space-y-1">
                              <li>Dégradation des délais de paiement clients (+5 jours vs 2023)</li>
                              <li>Difficultés de recrutement sur profils techniques spécialisés</li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mt-4">
                          <h3 className="text-xs font-medium text-gray-700 mb-2 flex items-center">
                            <Activity className="h-3.5 w-3.5 mr-1.5 text-gray-600" />
                            Positionnement concurrentiel
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="h-2 flex-grow bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-primary-500 rounded-full" style={{ width: '65%' }}></div>
                            </div>
                            <span className="text-xs font-medium text-gray-700">65%</span>
                          </div>
                          <p className="text-[10px] text-gray-600">
                            Performance supérieure à 65% des entreprises du secteur
                          </p>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-auto w-full bg-white border-primary-200 text-primary-700 hover:bg-primary-50 hover:border-primary-300"
                          onClick={() => handleRecommendationClick('insights')}
                        >
                          <Search size={14} className="mr-1.5" />
                          Voir l'analyse complète
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
              
              {/* Risques et Opportunités - 12 colonnes divisés en 2 blocs de 6 colonnes */}
              <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Risques à surveiller */}
                <div className="lg:col-span-1" style={{ display: isBlockVisible() ? 'block' : 'none' }}>
                  {!isBlockLoaded('risks') ? (
                    <Card className="h-full" size="sm">
                      <div className="p-4 flex flex-col items-center justify-center h-full">
                        <div className="animate-pulse bg-error-100 p-2 rounded-lg">
                          <AlertCircle className="h-5 w-5 text-error-500" />
                        </div>
                        <div className="mt-3 text-xs text-center text-gray-500">
                          Évaluation des risques...
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Source: <span className="font-medium">DATA WAREHOUSE</span></p>
                      </div>
                    </Card>
                  ) : (
                    clientData?.risk_factors && (
                      <Card className="relative h-full overflow-hidden">
                        <NetworkElement 
                          type="circle" 
                          size="xs" 
                          position="bottom-left" 
                          color="secondary" 
                          opacity={0.04} 
                        />
                        
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-md bg-error-100 flex items-center justify-center">
                              <AlertCircle className="h-4 w-4 text-error-600" />
                            </div>
                            <h2 className="text-base font-semibold text-gray-800">Risques à surveiller</h2>
                          </div>
                          <Badge variant="outline" className="bg-white" size="sm">Source: DATA WAREHOUSE</Badge>
                        </div>
                        
                        <div className="p-3 overflow-y-auto max-h-[300px]">
                          <div className="grid grid-cols-1 gap-3">
                              {clientData.risk_factors.map((risk: RiskFactor, index: number) => (
                              <div key={index} className="p-3 rounded-lg border shadow-sm hover:shadow-md transition-shadow bg-white">
                                  <div className="flex items-start">
                                  <div className={`mt-1 w-3 h-3 rounded-full flex-shrink-0 ${
                                      risk.impact === 'high' ? 'bg-error-500' : 
                                      risk.impact === 'medium' ? 'bg-warning-500' : 'bg-info-500'
                                    }`} />
                                  <div className="ml-2 w-full">
                                    <div className="text-xs font-semibold text-gray-800 mb-1">{risk.name}</div>
                                    
                                    <div className="flex flex-wrap mb-2 gap-x-2 gap-y-1">
                                      <div className="flex items-center bg-gray-50 px-2 py-0.5 rounded-md">
                                        <span className="text-[10px] text-gray-500 mr-1">Impact:</span> 
                                        <span className={`text-[10px] font-medium ${
                                            risk.impact === 'high' ? 'text-error-600' : 
                                            risk.impact === 'medium' ? 'text-warning-600' : 'text-info-600'
                                          }`}>
                                            {risk.impact === 'high' ? 'Élevé' : risk.impact === 'medium' ? 'Moyen' : 'Faible'}
                                          </span>
                                        </div>
                                        
                                        {risk.probability && (
                                        <div className="flex items-center bg-gray-50 px-2 py-0.5 rounded-md">
                                          <span className="text-[10px] text-gray-500 mr-1">Probabilité:</span> 
                                          <span className="text-[10px] font-medium">{risk.probability === 'high' ? 'Élevée' : risk.probability === 'medium' ? 'Moyenne' : 'Faible'}</span>
                                          </div>
                                        )}
                                      </div>
                                      
                                      {risk.indicators && risk.indicators.length > 0 && (
                                      <div className="mt-1">
                                        <div className="text-[10px] text-gray-500 mb-1">Indicateurs clés:</div>
                                        <ul className="list-disc pl-3 space-y-0.5">
                                          {risk.indicators.slice(0, 2).map((indicator: string, i: number) => (
                                            <li key={i} className="text-[10px] text-gray-700">{indicator}</li>
                                          ))}
                                          {risk.indicators.length > 2 && (
                                            <li className="text-[10px] text-primary-600 font-medium">+ {risk.indicators.length - 2} autres</li>
                                          )}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-3 w-full bg-white border-error-200 text-error-700 hover:bg-error-50 hover:border-error-300"
                            onClick={() => handleRecommendationClick('risks')}
                          >
                            <AlertCircle size={14} className="mr-1.5" />
                            Plan de mitigation
                          </Button>
                        </div>
                      </Card>
                    )
                  )}
                </div>
                
                {/* Opportunités de croissance */}
                <div className="lg:col-span-1" style={{ display: isBlockVisible() ? 'block' : 'none' }}>
                  {!isBlockLoaded('opportunities') ? (
                    <Card className="h-full" size="sm">
                      <div className="p-4 flex flex-col items-center justify-center h-full">
                        <div className="animate-pulse bg-success-100 p-2 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-success-500" />
                        </div>
                        <div className="mt-3 text-xs text-center text-gray-500">
                          Analyse des opportunités...
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Source: <span className="font-medium">IA AGENT</span></p>
                      </div>
                    </Card>
                  ) : (
                    clientData?.growth_opportunities && (
                      <Card className="relative h-full overflow-hidden">
                        <NetworkElement 
                          type="wave" 
                          size="xs" 
                          position="top-right" 
                          color="primary" 
                          opacity={0.04} 
                        />
                        
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-md bg-success-100 flex items-center justify-center">
                              <TrendingUp className="h-4 w-4 text-success-600" />
                            </div>
                            <h2 className="text-base font-semibold text-gray-800">Opportunités de croissance</h2>
                          </div>
                          <Badge variant="outline" className="bg-white" size="sm">Source: IA AGENT</Badge>
                        </div>
                        
                        <div className="p-3 overflow-y-auto max-h-[300px]">
                          <div className="grid grid-cols-1 gap-3">
                              {clientData.growth_opportunities.map((opportunity: GrowthOpportunity, index: number) => (
                              <div key={index} className="p-3 rounded-lg border shadow-sm hover:shadow-md transition-shadow bg-white">
                                <div className="flex items-center mb-2">
                                  <div className="w-6 h-6 rounded-full bg-success-100 flex items-center justify-center flex-shrink-0">
                                    <TrendingUp size={12} className="text-success-600" />
                                    </div>
                                  <div className="ml-2 flex-grow">
                                    <div className="text-xs font-semibold text-gray-800">{opportunity.name}</div>
                                    </div>
                                  </div>
                                <div className="grid grid-cols-3 gap-2 mt-2">
                                  <div className="bg-success-50 rounded-lg p-1.5 border border-success-100">
                                    <div className="text-[10px] text-gray-500">CA potentiel</div>
                                    <div className="text-xs font-medium text-success-700">{opportunity.potential_revenue}</div>
                                    </div>
                                  <div className="bg-gray-50 rounded-lg p-1.5 border border-gray-100">
                                    <div className="text-[10px] text-gray-500">Investissement</div>
                                    <div className="text-xs font-medium text-gray-700">{opportunity.investment_required.toLocaleString()} €</div>
                                    </div>
                                  <div className="bg-gray-50 rounded-lg p-1.5 border border-gray-100">
                                    <div className="text-[10px] text-gray-500">Délai</div>
                                    <div className="text-xs font-medium text-gray-700">{opportunity.time_to_market}</div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-3 w-full bg-white border-success-200 text-success-700 hover:bg-success-50 hover:border-success-300"
                            onClick={() => handleRecommendationClick('opportunities')}
                          >
                            <Search size={14} className="mr-1.5" />
                            Analyser l'opportunité
                          </Button>
                        </div>
                      </Card>
                    )
                  )}
                </div>
              </div>
              
              {/* Actualités (entreprise et sectorielles) */}
              <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Actualités de l'entreprise */}
                <div style={{ display: isBlockVisible() ? 'block' : 'none' }}>
                  {!isBlockLoaded('company-news') ? (
                    <Card className="h-full" size="sm">
                      <div className="p-4 flex flex-col items-center justify-center h-full">
                        <div className="animate-pulse bg-primary-100 p-2 rounded-lg">
                          <FileSpreadsheet className="h-5 w-5 text-primary-500" />
                        </div>
                        <div className="mt-3 text-xs text-center text-gray-500">
                          Recherche d'actualités entreprise...
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Source: <span className="font-medium">PERPLEXITY</span></p>
                      </div>
                    </Card>
                  ) : (
                    <Card 
                      title="Actualités pertinentes"
                      icon={<FileSpreadsheet className="h-4 w-4 text-primary-500" />}
                      size="sm"
                    >
                      <div className="p-3 space-y-3">
                        <div className="text-sm font-medium text-gray-700 border-b border-gray-100 pb-2">
                          Actualités de l'entreprise
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          <div className="border border-gray-200 rounded-lg p-3 bg-white hover:shadow-sm">
                            <div className="text-sm font-medium text-gray-800 mb-1">Expansion vers un nouveau marché</div>
                            <div className="text-xs text-gray-600 mb-2">
                              {clientData?.company?.name} a annoncé son intention d'étendre ses services au marché européen, 
                              en commençant par l'Allemagne et l'Espagne au Q3 2025.
                            </div>
                            <div className="flex justify-between items-center text-xs text-gray-500">
                              <span>Source: Communiqué officiel</span>
                              <span>18/06/2025</span>
                            </div>
                          </div>
                          
                          <div className="border border-gray-200 rounded-lg p-3 bg-white hover:shadow-sm">
                            <div className="text-sm font-medium text-gray-800 mb-1">Nouveau partenariat stratégique</div>
                            <div className="text-xs text-gray-600 mb-2">
                              Un partenariat stratégique a été signé avec Cloud Solutions Inc. pour renforcer 
                              l'offre de services cloud et étendre la base client.
                            </div>
                            <div className="flex justify-between items-center text-xs text-gray-500">
                              <span>Source: Tech Business Journal</span>
                              <span>05/05/2025</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
                
                {/* Actualités sectorielles */}
                <div style={{ display: isBlockVisible() ? 'block' : 'none' }}>
                  {!isBlockLoaded('sector-news') ? (
                    <Card className="h-full" size="sm">
                      <div className="p-4 flex flex-col items-center justify-center h-full">
                        <div className="animate-pulse bg-primary-100 p-2 rounded-lg">
                          <Activity className="h-5 w-5 text-primary-500" />
                        </div>
                        <div className="mt-3 text-xs text-center text-gray-500">
                          Recherche d'actualités sectorielles...
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Source: <span className="font-medium">PERPLEXITY</span></p>
                      </div>
                    </Card>
                  ) : (
                    <Card 
                      title="Tendances sectorielles"
                      icon={<Activity className="h-4 w-4 text-primary-500" />}
                      size="sm"
                    >
                      <div className="p-3 space-y-3">
                        <div className="text-sm font-medium text-gray-700 border-b border-gray-100 pb-2">
                          Actualités du secteur {clientData?.company?.sector_name}
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          <div className="border border-gray-200 rounded-lg p-3 bg-white hover:shadow-sm">
                            <div className="text-sm font-medium text-gray-800 mb-1">
                              Nouvelles réglementations sur la protection des données
                            </div>
                            <div className="text-xs text-gray-600 mb-2">
                              L'Union Européenne a annoncé un renforcement des règles RGPD qui entrera en vigueur 
                              en juillet 2025, avec des impacts significatifs pour le secteur.
                            </div>
                            <div className="flex justify-between items-center text-xs text-gray-500">
                              <span>Source: EU Tech Policy</span>
                              <span>15/06/2025</span>
                            </div>
                          </div>
                          
                          <div className="border border-gray-200 rounded-lg p-3 bg-white hover:shadow-sm">
                            <div className="text-sm font-medium text-gray-800 mb-1">
                              Pénurie de talents dans le secteur IT
                            </div>
                            <div className="text-xs text-gray-600 mb-2">
                              Le secteur de la programmation informatique connaît une pénurie croissante de talents, 
                              avec des salaires en hausse de 12% en moyenne sur les 12 premiers mois de 2025.
                            </div>
                            <div className="flex justify-between items-center text-xs text-gray-500">
                              <span>Source: Tech Recruitment Report</span>
                              <span>02/05/2025</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
              
              {/* Financial Overview */}
              <div className="lg:col-span-12" style={{ display: isBlockVisible() ? 'block' : 'none' }}>
                {!isBlockLoaded('financial-overview') ? (
                  <Card className="h-64" size="sm">
                    <div className="p-4 flex flex-col items-center justify-center h-full">
                      <div className="animate-pulse bg-primary-100 p-2 rounded-lg">
                        <BarChart className="h-5 w-5 text-primary-500" />
                      </div>
                      <div className="mt-3 text-xs text-center text-gray-500">
                        Analyse financière en cours...
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Source: <span className="font-medium">DATA WAREHOUSE</span></p>
                    </div>
                  </Card>
                ) : (
                  clientData?.financial_history && clientData?.key_ratios && (
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                          <BarChart className="h-5 w-5 text-primary-500" />
                          Répartition du résultat
                          <Badge variant="outline" size="xs">Source: DATA WAREHOUSE</Badge>
                        </h2>
                      </div>
                      
                      {/* Répartition du CA */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg p-4 border border-gray-100">
                          <h3 className="text-sm font-medium text-gray-700 mb-4">Poids relatif des charges (2024)</h3>
                          
                          {/* Diagramme de répartition */}
                          <div className="h-64 relative mb-3">
                            <svg viewBox="0 0 400 200" className="w-full h-full">
                              {/* Barres de répartition (données fictives, à adapter) */}
                              <rect x="50" y="10" width="300" height="30" fill="#f3f4f6" />
                              <rect x="50" y="10" width="90" height="30" fill="#93c5fd" /> {/* 30% Personnel */}
                              <text x="145" y="30" fontSize="12" fill="#1e40af" fontWeight="500">30%</text>
                              <text x="360" y="30" fontSize="12" fill="#4b5563" textAnchor="end">Personnel</text>
                              
                              <rect x="50" y="50" width="300" height="30" fill="#f3f4f6" />
                              <rect x="50" y="50" width="60" height="30" fill="#a78bfa" /> {/* 20% Achats */}
                              <text x="115" y="70" fontSize="12" fill="#5b21b6" fontWeight="500">20%</text>
                              <text x="360" y="70" fontSize="12" fill="#4b5563" textAnchor="end">Achats</text>
                              
                              <rect x="50" y="90" width="300" height="30" fill="#f3f4f6" />
                              <rect x="50" y="90" width="120" height="30" fill="#6ee7b7" /> {/* 40% AACE */}
                              <text x="175" y="110" fontSize="12" fill="#065f46" fontWeight="500">40%</text>
                              <text x="360" y="110" fontSize="12" fill="#4b5563" textAnchor="end">AACE</text>
                              
                              <rect x="50" y="130" width="300" height="30" fill="#f3f4f6" />
                              <rect x="50" y="130" width="18" height="30" fill="#fcd34d" /> {/* 6% Impôts */}
                              <text x="73" y="150" fontSize="12" fill="#92400e" fontWeight="500">6%</text>
                              <text x="360" y="150" fontSize="12" fill="#4b5563" textAnchor="end">Impôts</text>
                              
                              <rect x="50" y="170" width="300" height="30" fill="#f3f4f6" />
                              <rect x="50" y="170" width="12" height="30" fill="#fca5a5" /> {/* 4% Autres */}
                              <rect x="62" y="170" width="39" height="30" fill="#6366f1" /> {/* 13% Résultat net */}
                              <text x="67" y="190" fontSize="12" fill="#ef4444" fontWeight="500">4%</text>
                              <text x="106" y="190" fontSize="12" fill="#3730a3" fontWeight="500">13%</text>
                              <text x="220" y="190" fontSize="12" fill="#4b5563">Financier + Except. + Résultat Net</text>
                            </svg>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 mt-4">
                            <div className="bg-blue-50 p-2 rounded-lg border border-blue-100 text-center">
                              <div className="text-[10px] text-gray-500">Personnel</div>
                              <div className="text-xs font-medium text-blue-700">{(clientData.financial_history['2024'].revenue * 0.3 / 1000).toFixed(0)}k€</div>
                              <div className="text-[10px] text-blue-600">30% du CA</div>
                            </div>
                                                    <div className="bg-green-50 p-2 rounded-lg border border-green-100 text-center">
                          <div className="text-[10px] text-gray-500">AACE</div>
                          <div className="text-xs font-medium text-green-700">{(clientData.financial_history['2024'].revenue * 0.4 / 1000).toFixed(0)}k€</div>
                          <div className="text-[10px] text-green-600">40% du CA</div>
                        </div>
                            <div className="bg-indigo-50 p-2 rounded-lg border border-indigo-100 text-center">
                              <div className="text-[10px] text-gray-500">Résultat Net</div>
                              <div className="text-xs font-medium text-indigo-700">{(clientData.financial_history['2024'].net_income / 1000).toFixed(0)}k€</div>
                              <div className="text-[10px] text-indigo-600">13% du CA</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 border border-gray-100">
                          <h3 className="text-sm font-medium text-gray-700 mb-3">Évolution du résultat net</h3>
                          
                          <div className="h-64 relative">
                            <svg width="100%" height="100%" viewBox="0 0 400 200">
                              {/* Grille */}
                              <line x1="50" y1="170" x2="350" y2="170" stroke="#e5e7eb" strokeWidth="1" />
                              <line x1="50" y1="130" x2="350" y2="130" stroke="#e5e7eb" strokeWidth="1" />
                              <line x1="50" y1="90" x2="350" y2="90" stroke="#e5e7eb" strokeWidth="1" />
                              <line x1="50" y1="50" x2="350" y2="50" stroke="#e5e7eb" strokeWidth="1" />
                              <line x1="50" y1="10" x2="350" y2="10" stroke="#e5e7eb" strokeWidth="1" />
                              
                              {/* Axe vertical */}
                              <line x1="50" y1="10" x2="50" y2="170" stroke="#9ca3af" strokeWidth="1" />
                              
                              {/* Barres du résultat net */}
                              <rect x="80" y="120" width="30" height="50" fill="#6366f1" rx="3" />
                              <rect x="150" y="110" width="30" height="60" fill="#6366f1" rx="3" />
                              <rect x="220" y="100" width="30" height="70" fill="#6366f1" rx="3" />
                              <rect x="290" y="80" width="30" height="90" fill="#8b5cf6" rx="3" />
                              
                              {/* Étiquettes */}
                              <text x="95" y="180" textAnchor="middle" fontSize="11" fill="#6b7280">2021</text>
                              <text x="165" y="180" textAnchor="middle" fontSize="11" fill="#6b7280">2022</text>
                              <text x="235" y="180" textAnchor="middle" fontSize="11" fill="#6b7280">2023</text>
                              <text x="305" y="180" textAnchor="middle" fontSize="11" fill="#6b7280">2024</text>
                              
                              {/* Valeurs */}
                              <text x="95" y="115" textAnchor="middle" fontSize="10" fill="#f9fafb" fontWeight="medium">
                                {((clientData.financial_history['2021']?.net_income || 0) / 1000).toFixed(0)}k€
                              </text>
                              <text x="165" y="105" textAnchor="middle" fontSize="10" fill="#f9fafb" fontWeight="medium">
                                {((clientData.financial_history['2022']?.net_income || 0) / 1000).toFixed(0)}k€
                              </text>
                              <text x="235" y="95" textAnchor="middle" fontSize="10" fill="#f9fafb" fontWeight="medium">
                                {((clientData.financial_history['2023']?.net_income || 0) / 1000).toFixed(0)}k€
                              </text>
                              <text x="305" y="75" textAnchor="middle" fontSize="10" fill="#f9fafb" fontWeight="medium">
                                {(clientData.financial_history['2024'].net_income / 1000).toFixed(0)}k€
                              </text>
                              
                              {/* Légende */}
                              <text x="350" y="30" textAnchor="end" fontSize="9" fill="#9ca3af">Résultat Net (k€)</text>
                            </svg>
                          </div>
                          
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <div className="bg-indigo-50 p-2 rounded-lg border border-indigo-100">
                              <div className="text-xs text-gray-500">Taux de croissance du résultat</div>
                              <div className="text-sm font-medium text-indigo-700">
                                +54.5%
                              </div>
                            </div>
                            <div className="bg-green-50 p-2 rounded-lg border border-green-100">
                              <div className="text-xs text-gray-500">Marge nette 2024</div>
                              <div className="text-sm font-medium text-green-700">
                                {((clientData.financial_history['2024'].net_income / clientData.financial_history['2024'].revenue) * 100).toFixed(1)}%
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
              
              {/* Sectoral Comparison */}
              <div className="lg:col-span-12" style={{ display: isBlockVisible() ? 'block' : 'none' }}>
                {!isBlockLoaded('sectoral-comparison') ? (
                  <Card className="h-64" size="sm">
                    <div className="p-4 flex flex-col items-center justify-center h-full">
                      <div className="animate-pulse bg-primary-100 p-2 rounded-lg">
                        <Activity className="h-5 w-5 text-primary-500" />
                      </div>
                      <div className="mt-3 text-xs text-center text-gray-500">
                        Calcul du positionnement sectoriel...
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Source: <span className="font-medium">SIREN</span> & <span className="font-medium">INPI</span></p>
                    </div>
                  </Card>
                ) : (
                  <SectoralComparison />
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* Autres onglets */}
          <TabsContent value="financial" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <BarChart className="h-5 w-5 mr-2 text-primary-500" />
                  Analyse financière détaillée
                  <Badge variant="outline" size="xs" className="ml-2">Source: DATA WAREHOUSE</Badge>
                </h2>
                {clientData?.financial_history && clientData?.key_ratios && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg p-4 border border-gray-100">
                      <h3 className="text-sm font-medium text-gray-700 mb-4">Poids relatif des charges (2024)</h3>
                      
                      {/* Diagramme de répartition */}
                      <div className="h-64 relative mb-3">
                        <svg viewBox="0 0 400 200" className="w-full h-full">
                          {/* Barres de répartition (données fictives, à adapter) */}
                          <rect x="50" y="10" width="300" height="30" fill="#f3f4f6" />
                          <rect x="50" y="10" width="90" height="30" fill="#93c5fd" /> {/* 30% Personnel */}
                          <text x="145" y="30" fontSize="12" fill="#1e40af" fontWeight="500">30%</text>
                          <text x="360" y="30" fontSize="12" fill="#4b5563" textAnchor="end">Personnel</text>
                          
                          <rect x="50" y="50" width="300" height="30" fill="#f3f4f6" />
                          <rect x="50" y="50" width="60" height="30" fill="#a78bfa" /> {/* 20% Achats */}
                          <text x="115" y="70" fontSize="12" fill="#5b21b6" fontWeight="500">20%</text>
                          <text x="360" y="70" fontSize="12" fill="#4b5563" textAnchor="end">Achats</text>
                          
                          <rect x="50" y="90" width="300" height="30" fill="#f3f4f6" />
                          <rect x="50" y="90" width="120" height="30" fill="#6ee7b7" /> {/* 40% AACE */}
                          <text x="175" y="110" fontSize="12" fill="#065f46" fontWeight="500">40%</text>
                          <text x="360" y="110" fontSize="12" fill="#4b5563" textAnchor="end">AACE</text>
                          
                          <rect x="50" y="130" width="300" height="30" fill="#f3f4f6" />
                          <rect x="50" y="130" width="18" height="30" fill="#fcd34d" /> {/* 6% Impôts */}
                          <text x="73" y="150" fontSize="12" fill="#92400e" fontWeight="500">6%</text>
                          <text x="360" y="150" fontSize="12" fill="#4b5563" textAnchor="end">Impôts</text>
                          
                          <rect x="50" y="170" width="300" height="30" fill="#f3f4f6" />
                          <rect x="50" y="170" width="12" height="30" fill="#fca5a5" /> {/* 4% Autres */}
                          <rect x="62" y="170" width="39" height="30" fill="#6366f1" /> {/* 13% Résultat net */}
                          <text x="67" y="190" fontSize="12" fill="#ef4444" fontWeight="500">4%</text>
                          <text x="106" y="190" fontSize="12" fill="#3730a3" fontWeight="500">13%</text>
                          <text x="220" y="190" fontSize="12" fill="#4b5563">Financier + Except. + Résultat Net</text>
                        </svg>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        <div className="bg-blue-50 p-2 rounded-lg border border-blue-100 text-center">
                          <div className="text-[10px] text-gray-500">Personnel</div>
                          <div className="text-xs font-medium text-blue-700">{(clientData.financial_history['2024'].revenue * 0.3 / 1000).toFixed(0)}k€</div>
                          <div className="text-[10px] text-blue-600">30% du CA</div>
                        </div>
                        <div className="bg-green-50 p-2 rounded-lg border border-green-100 text-center">
                          <div className="text-[10px] text-gray-500">AACE</div>
                          <div className="text-xs font-medium text-green-700">{(clientData.financial_history['2024'].revenue * 0.4 / 1000).toFixed(0)}k€</div>
                          <div className="text-[10px] text-green-600">40% du CA</div>
                        </div>
                        <div className="bg-indigo-50 p-2 rounded-lg border border-indigo-100 text-center">
                          <div className="text-[10px] text-gray-500">Résultat Net</div>
                          <div className="text-xs font-medium text-indigo-700">{(clientData.financial_history['2024'].net_income / 1000).toFixed(0)}k€</div>
                          <div className="text-[10px] text-indigo-600">13% du CA</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-gray-100">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Évolution du résultat net</h3>
                      
                      <div className="h-64 relative">
                        <svg width="100%" height="100%" viewBox="0 0 400 200">
                          {/* Grille */}
                          <line x1="50" y1="170" x2="350" y2="170" stroke="#e5e7eb" strokeWidth="1" />
                          <line x1="50" y1="130" x2="350" y2="130" stroke="#e5e7eb" strokeWidth="1" />
                          <line x1="50" y1="90" x2="350" y2="90" stroke="#e5e7eb" strokeWidth="1" />
                          <line x1="50" y1="50" x2="350" y2="50" stroke="#e5e7eb" strokeWidth="1" />
                          <line x1="50" y1="10" x2="350" y2="10" stroke="#e5e7eb" strokeWidth="1" />
                          
                          {/* Axe vertical */}
                          <line x1="50" y1="10" x2="50" y2="170" stroke="#9ca3af" strokeWidth="1" />
                          
                          {/* Barres du résultat net */}
                          <rect x="80" y="120" width="30" height="50" fill="#6366f1" rx="3" />
                          <rect x="150" y="110" width="30" height="60" fill="#6366f1" rx="3" />
                          <rect x="220" y="100" width="30" height="70" fill="#6366f1" rx="3" />
                          <rect x="290" y="80" width="30" height="90" fill="#8b5cf6" rx="3" />
                          
                          {/* Étiquettes */}
                          <text x="95" y="180" textAnchor="middle" fontSize="11" fill="#6b7280">2021</text>
                          <text x="165" y="180" textAnchor="middle" fontSize="11" fill="#6b7280">2022</text>
                          <text x="235" y="180" textAnchor="middle" fontSize="11" fill="#6b7280">2023</text>
                          <text x="305" y="180" textAnchor="middle" fontSize="11" fill="#6b7280">2024</text>
                          
                          {/* Valeurs */}
                          <text x="95" y="115" textAnchor="middle" fontSize="10" fill="#f9fafb" fontWeight="medium">
                            {((clientData.financial_history['2021']?.net_income || 0) / 1000).toFixed(0)}k€
                          </text>
                          <text x="165" y="105" textAnchor="middle" fontSize="10" fill="#f9fafb" fontWeight="medium">
                            {((clientData.financial_history['2022']?.net_income || 0) / 1000).toFixed(0)}k€
                          </text>
                          <text x="235" y="95" textAnchor="middle" fontSize="10" fill="#f9fafb" fontWeight="medium">
                            {((clientData.financial_history['2023']?.net_income || 0) / 1000).toFixed(0)}k€
                          </text>
                          <text x="305" y="75" textAnchor="middle" fontSize="10" fill="#f9fafb" fontWeight="medium">
                            {(clientData.financial_history['2024'].net_income / 1000).toFixed(0)}k€
                          </text>
                          
                          {/* Légende */}
                          <text x="350" y="30" textAnchor="end" fontSize="9" fill="#9ca3af">Résultat Net (k€)</text>
                        </svg>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div className="bg-indigo-50 p-2 rounded-lg border border-indigo-100">
                          <div className="text-xs text-gray-500">Taux de croissance du résultat</div>
                          <div className="text-sm font-medium text-indigo-700">
                            +54.5%
                          </div>
                        </div>
                        <div className="bg-green-50 p-2 rounded-lg border border-green-100">
                          <div className="text-xs text-gray-500">Marge nette 2024</div>
                          <div className="text-sm font-medium text-green-700">
                            {((clientData.financial_history['2024'].net_income / clientData.financial_history['2024'].revenue) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h2 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-primary-500" />
                    Analyse de performance
                  </h2>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium mb-4">Performance financière par rapport au secteur</h3>
                    <div className="flex flex-col">
                      {/* Nouveau graphique en étoile */}
                      <div className="w-full h-[280px] relative flex items-center justify-center">
                        <svg viewBox="0 0 400 280" className="w-full h-full">
                          {/* Lignes de grille horizontales */}
                          <line x1="100" y1="50" x2="350" y2="50" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2" />
                          <line x1="100" y1="100" x2="350" y2="100" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2" />
                          <line x1="100" y1="150" x2="350" y2="150" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2" />
                          <line x1="100" y1="200" x2="350" y2="200" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2" />
                          
                          {/* Axe vertical pour chaque dimension */}
                          <line x1="125" y1="40" x2="125" y2="210" stroke="#e5e7eb" strokeWidth="1" />
                          <line x1="200" y1="40" x2="200" y2="210" stroke="#e5e7eb" strokeWidth="1" />
                          <line x1="275" y1="40" x2="275" y2="210" stroke="#e5e7eb" strokeWidth="1" />
                          <line x1="350" y1="40" x2="350" y2="210" stroke="#e5e7eb" strokeWidth="1" />
                          
                          {/* Étiquettes des dimensions */}
                          <text x="125" y="230" textAnchor="middle" fontSize="13" fill="#4b5563" fontWeight="500">Rentabilité</text>
                          <text x="200" y="230" textAnchor="middle" fontSize="13" fill="#4b5563" fontWeight="500">BFR</text>
                          <text x="275" y="230" textAnchor="middle" fontSize="13" fill="#4b5563" fontWeight="500">Endettement</text>
                          <text x="350" y="230" textAnchor="middle" fontSize="13" fill="#4b5563" fontWeight="500">Croissance</text>
                          
                          {/* Points de données - Votre entreprise (en bleu) */}
                          <circle cx="125" cy="70" r="6" fill="#6366f1" />
                          <circle cx="200" cy="140" r="6" fill="#6366f1" />
                          <circle cx="275" cy="90" r="6" fill="#6366f1" />
                          <circle cx="350" cy="170" r="6" fill="#6366f1" />
                          
                          {/* Ligne de connexion - Votre entreprise */}
                          <polyline 
                            points="125,70 200,140 275,90 350,170" 
                            fill="none" 
                            stroke="#6366f1" 
                            strokeWidth="2"
                          />
                          
                          {/* Points de données - Moyenne sectorielle (en gris) */}
                          <circle cx="125" cy="110" r="5" fill="none" stroke="#9ca3af" strokeWidth="1.5" />
                          <circle cx="200" cy="120" r="5" fill="none" stroke="#9ca3af" strokeWidth="1.5" />
                          <circle cx="275" cy="100" r="5" fill="none" stroke="#9ca3af" strokeWidth="1.5" />
                          <circle cx="350" cy="150" r="5" fill="none" stroke="#9ca3af" strokeWidth="1.5" />
                          
                          {/* Ligne de connexion - Moyenne sectorielle */}
                          <polyline 
                            points="125,110 200,120 275,100 350,150" 
                            fill="none" 
                            stroke="#9ca3af" 
                            strokeWidth="1.5"
                            strokeDasharray="3,2"
                          />
                          
                          {/* Points forts et faibles */}
                          <circle cx="125" cy="70" r="8" fill="#10b981" opacity="0.2" stroke="#10b981" strokeWidth="1" />
                          <circle cx="200" cy="140" r="8" fill="#f97316" opacity="0.2" stroke="#f97316" strokeWidth="1" />
                        </svg>
                      </div>
                      
                      <div className="mt-2 flex items-center justify-center gap-6 text-xs text-gray-600">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-primary-500 rounded-full mr-1.5"></div>
                          <span>Votre entreprise</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-1.5 border border-gray-400"></div>
                          <span>Moyenne sectorielle</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-500 text-right">
                    Source: Analyse sectorielle INPI / Banque de France
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h2 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-primary-500" />
                    Comparaison sectorielle
                  </h2>
                  <SectoralComparison showAlerts={false} />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="insights" className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Insights et recommandations</h2>
              {clientData?.risk_factors && clientData?.growth_opportunities && (
                <BusinessInsights
                  risks={clientData.risk_factors}
                  opportunities={clientData.growth_opportunities}
                />
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="market" className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Analyse sectorielle</h2>
              <SectoralComparison />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal pour les recommandations */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => {
                setShowModal(false);
                setOpportunitiesModalActive(false);
              }}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium text-gray-900">{modalTitle}</h3>
                    {modalType && (
                      <span className="px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 text-xs font-medium">
                        {modalType === 'insights' && 'Insights Business'}
                        {modalType === 'risks' && 'Analyse des risques'}
                        {modalType === 'opportunities' && 'Opportunités de croissance'}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={() => {
                      setShowModal(false);
                      setOpportunitiesModalActive(false);
                    }}
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mb-4 flex justify-between items-center">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span>Source des données:</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">Perplexity</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">Liasse fiscale</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium">Banque de France</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
                  </div>
                </div>
                
                <div 
                  className="text-sm text-gray-700 max-h-[60vh] overflow-y-auto p-4 bg-gray-50 rounded-lg"
                  dangerouslySetInnerHTML={{ __html: modalContent }}
                ></div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowModal(false);
                    setOpportunitiesModalActive(false);
                  }}
                >
                  Fermer
                </button>
                {modalType === 'insights' && (
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      window.location.href = '/modules/cpa-copilot';
                    }}
                  >
                    Consulter l'Assistant CPA
                  </button>
                )}
                {modalType === 'opportunities' && (
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      window.location.href = '/modules/forecaster?opportunity=custom&prompt=Je%20souhaite%20créer%20un%20scénario%20de%20croissance%20personnalisé';
                    }}
                  >
                    Créer un scénario personnalisé
                  </button>
                )}
                {modalType === 'risks' && (
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      // Action spécifique pour les risques
                      window.location.href = '/modules/data-guardian';
                    }}
                  >
                    Approfondir l'analyse des risques
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 