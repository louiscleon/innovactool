"use client";

import React, { useEffect, useState } from 'react';
import { 
  PieChart, 
  BarChart, 
  TrendingUp, 
  Filter, 
  Download, 
  Calendar, 
  RefreshCw, 
  Activity, 
  AlertCircle,
  Users,
  ChevronRight,
  Search,
  ArrowLeft,
  Building2,
  FileSpreadsheet,
  Percent
} from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { NetworkElement } from '@/components/NetworkElements';
import { NetworkWatermark } from '@/components/NetworkWatermark';
import { SectoralComparison } from './SectoralComparison';
import { getUnifiedClientData, getSectoralData, RiskFactor, GrowthOpportunity } from '@/services/clientDataService';
import { useClient } from '@/components/ClientContext';
import { ClientSelector } from '@/components/ClientSelector';
import { ClientDetailView } from '@/components/ClientDetailView';
import { FinancialOverview } from '@/components/FinancialOverview';
import { BusinessInsights } from '@/components/BusinessInsights';
import { MarketTrendsSection } from '@/components/MarketTrendsSection';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components';
import { fetchCompanyData, fetchEnterpriseFullData, analyzedEnterpriseData, EnterpriseData } from '@/services/api';
import { Tooltip } from '@/components/Tooltip';

// Interface pour les données client
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
  const [startDate, setStartDate] = useState("01");
  const [startMonth, setStartMonth] = useState("Janvier");
  const [endDate, setEndDate] = useState("31");
  const [endMonth, setEndMonth] = useState("Décembre");
  const [endYear, setEndYear] = useState("2024");
  const [showNoDataMessage, setShowNoDataMessage] = useState(false);
  const [periodRatio, setPeriodRatio] = useState(1); // Ratio pour le prorata des données financières
  const [filterCategories, setFilterCategories] = useState<string[]>([]);
  const [visibleBlocks, setVisibleBlocks] = useState<string[]>([
    'client-info', 'main-kpis', 'business-insights', 'risks',
    'opportunities', 'financial-overview', 'sectoral-comparison',
    'company-news', 'sector-news'
  ]);
  const [showPdfExport, setShowPdfExport] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalContent, setModalContent] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  
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

  // Vérifier si un bloc est visible
  const isBlockVisible = (blockName: string) => {
    return visibleBlocks.includes(blockName);
  };

  // Calcul du prorata des données financières en fonction de la période
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

  // Fonction pour filtrer les blocs en fonction des catégories sélectionnées
  const applyFilters = () => {
    const blockCategoryMapping: {[key: string]: string[]} = {
      'finance': ['financial-overview', 'sectoral-comparison'],
      'insights': ['business-insights', 'risks', 'opportunities'],
      'marché': ['company-news', 'sector-news'],
      'général': ['client-info', 'main-kpis']
    };
    
    if (filterCategories.length === 0) {
      // Si aucun filtre n'est sélectionné, afficher tous les blocs
      setVisibleBlocks([
        'client-info', 'main-kpis', 'business-insights', 'risks',
        'opportunities', 'financial-overview', 'sectoral-comparison',
        'company-news', 'sector-news'
      ]);
      return;
    }
    
    // Collecte des blocs visibles en fonction des catégories sélectionnées
    const blocks = filterCategories.flatMap(category => blockCategoryMapping[category] || []);
    setVisibleBlocks([...new Set(blocks)]); // Déduplique les blocs
  };

  // Fonction pour afficher une fenêtre modale avec des recommandations
  const handleRecommendationClick = (type: string) => {
    let title = '';
    let content = '';
    
    switch (type) {
      case 'insights':
        title = 'Analyse complète des insights business';
        content = `<h3 class="font-medium text-gray-800 mb-3">Analyse détaillée pour ${clientData?.company?.name}</h3>`;
        break;
      case 'risks':
        title = 'Plan de mitigation des risques';
        content = `<h3 class="font-medium text-gray-800 mb-3">Analyse des risques identifiés</h3>`;
        break;
      case 'opportunities':
        title = 'Analyse de faisabilité des opportunités';
        content = `<h3 class="font-medium text-gray-800 mb-3">Évaluation des opportunités de croissance</h3>`;
        break;
      default:
        title = 'Informations';
        content = 'Contenu non disponible pour le moment.';
    }
    
    setModalTitle(title);
    setModalContent(content);
    setModalType(type);
    setShowModal(true);
  };

  // Fonction pour rafraîchir les données avec feedback visuel
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Réinitialiser les blocs chargés
    setLoadedBlocks([]);
    
    // Sélection des blocs à recharger
    const visibleBlocksToRefresh = visibleBlocks.filter(block => {
      // Ne pas recharger certains blocs si on est dans une période spécifique
      if (periodRatio < 1 && ['client-info', 'company-news', 'sector-news'].includes(block)) {
        // Ces blocs ne sont pas affectés par la période, on les garde chargés
        return false;
      }
      return true;
    });
    
    // Si aucun bloc n'est à recharger, on simule un chargement rapide
    if (visibleBlocksToRefresh.length === 0) {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
      return;
    }
    
    // Temps de chargement spécifiques pour chaque bloc (en ms)
    const blockLoadTimes: {[key: string]: number} = {
      'client-info': 800,
      'main-kpis': 1200, 
      'business-insights': 6000,
      'risks': 2500,
      'opportunities': 3000,
      'financial-overview': 2000,
      'sectoral-comparison': 2800,
      'company-news': 5500,
      'sector-news': 6500
    };
    
    // Recharger progressivement les blocs visibles
    let currentTime = 500; // Décalage initial
    visibleBlocksToRefresh.forEach((block) => {
      const loadTime = blockLoadTimes[block] || 1500;
      
      setTimeout(() => {
        setLoadedBlocks(prev => [...prev, block]);
        
        // Si c'est le dernier bloc, on indique que le rafraîchissement est terminé
        if (block === visibleBlocksToRefresh[visibleBlocksToRefresh.length - 1]) {
          setIsRefreshing(false);
        }
      }, currentTime);
      
      currentTime += loadTime / 2; // On divise le temps par 2 pour accélérer le rafraîchissement
    });
  };

  // Fonction pour exporter les données avec feedback visuel
  const handleExport = () => {
    setShowPdfExport(!showPdfExport);
    if (exportSuccess) {
      setExportSuccess(false);
    }
  };

  // Fonction pour générer le PDF
  const generatePdf = () => {
    // Simulation de génération de PDF
    setExportSuccess(true);
    
    // Simuler la création d'un lien de téléchargement
    setTimeout(() => {
      const pdfFilename = `Rapport_${activeClient.name}_${endMonth}_${endYear}.pdf`;
      
      // Créer un lien temporaire pour simuler un téléchargement
      const downloadLink = document.createElement('a');
      downloadLink.href = 'data:application/pdf;base64,JVBERi0xLjMNCiXi48/T...'; // Base64 tronqué pour simplifier
      downloadLink.download = pdfFilename;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      // Fermeture de la fenêtre d'export
      setExportSuccess(false);
      setShowPdfExport(false);
    }, 2000);
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

      {/* Sélecteur de client et contrôles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-1">
          <ClientSelector />
        </div>
        <div className="md:col-span-2 flex flex-wrap justify-end items-center gap-3">
          <div className="relative group">
            <Button 
              variant="outline" 
              size="xs" 
              icon={<Calendar size={14} />}
              onClick={() => document.getElementById('datepicker-modal')?.classList.toggle('hidden')}
            >
              {startMonth} - {endMonth} {endYear}
            </Button>
            
            <div id="datepicker-modal" className="hidden absolute right-0 top-full mt-2 z-50 bg-white shadow-lg rounded-lg p-4 w-80">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date début</label>
                  <div className="flex gap-2">
                    <select 
                      className="text-sm border border-gray-300 rounded p-1"
                      value={startMonth}
                      onChange={(e) => setStartMonth(e.target.value)}
                    >
                      <option>Janvier</option>
                      <option>Février</option>
                      <option>Mars</option>
                      <option>Avril</option>
                      <option>Mai</option>
                      <option>Juin</option>
                      <option>Juillet</option>
                      <option>Août</option>
                      <option>Septembre</option>
                      <option>Octobre</option>
                      <option>Novembre</option>
                      <option>Décembre</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date fin</label>
                  <div className="flex gap-2">
                    <select 
                      className="text-sm border border-gray-300 rounded p-1"
                      value={endMonth}
                      onChange={(e) => setEndMonth(e.target.value)}
                    >
                      <option>Janvier</option>
                      <option>Février</option>
                      <option>Mars</option>
                      <option>Avril</option>
                      <option>Mai</option>
                      <option>Juin</option>
                      <option>Juillet</option>
                      <option>Août</option>
                      <option>Septembre</option>
                      <option>Octobre</option>
                      <option>Novembre</option>
                      <option>Décembre</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
                <select 
                  className="text-sm border border-gray-300 rounded p-1 w-full"
                  value={endYear}
                  onChange={(e) => {
                    setEndYear(e.target.value);
                    setShowNoDataMessage(e.target.value === "2023");
                  }}
                >
                  <option>2024</option>
                  <option>2023</option>
                  <option>2022</option>
                  <option>2021</option>
                </select>
                {showNoDataMessage && (
                  <div className="flex items-center mt-2 p-1.5 rounded-md bg-amber-50 border border-amber-200">
                    <AlertCircle className="h-4 w-4 text-amber-500 mr-1.5 flex-shrink-0" />
                    <p className="text-xs text-amber-700">
                      Les comptes complets de 2023 ne sont pas encore tous disponibles. Certaines données pourraient être manquantes.
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="xs"
                  onClick={() => document.getElementById('datepicker-modal')?.classList.add('hidden')}
                >
                  Annuler
                </Button>
                <Button 
                  variant="primary" 
                  size="xs"
                  onClick={() => {
                    const ratio = calculatePeriodRatio(startMonth, endMonth, endYear);
                    setPeriodRatio(ratio);
                    document.getElementById('datepicker-modal')?.classList.add('hidden');
                  }}
                >
                  Appliquer
                </Button>
              </div>
            </div>
          </div>
          
          <div className="relative group">
            <Button 
              variant="outline" 
              size="xs" 
              icon={<Filter size={14} />}
              onClick={() => document.getElementById('filter-modal')?.classList.toggle('hidden')}
            >
              Filtres
            </Button>
            
            <div id="filter-modal" className="hidden absolute right-0 top-full mt-2 z-50 bg-white shadow-lg rounded-lg p-4 w-64">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Filtrer par catégorie</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                <div className="p-2 bg-gray-50 rounded-md mb-1">
                  <span className="text-xs font-medium text-gray-600 block mb-1.5">Informations générales</span>
                  <label className="flex items-center gap-2 text-sm">
                    <input 
                      type="checkbox" 
                      className="rounded text-primary-500"
                      checked={filterCategories.includes('général')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilterCategories(prev => [...prev, 'général']);
                        } else {
                          setFilterCategories(prev => prev.filter(c => c !== 'général'));
                        }
                      }}
                    />
                    Aperçu du client
                  </label>
                </div>
                
                <div className="p-2 bg-gray-50 rounded-md mb-1">
                  <span className="text-xs font-medium text-gray-600 block mb-1.5">Données financières</span>
                  <label className="flex items-center gap-2 text-sm">
                    <input 
                      type="checkbox" 
                      className="rounded text-primary-500"
                      checked={filterCategories.includes('finance')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilterCategories(prev => [...prev, 'finance']);
                        } else {
                          setFilterCategories(prev => prev.filter(c => c !== 'finance'));
                        }
                      }}
                    />
                    Analyse financière
                  </label>
                </div>
                
                <div className="p-2 bg-gray-50 rounded-md mb-1">
                  <span className="text-xs font-medium text-gray-600 block mb-1.5">Analyse business</span>
                  <label className="flex items-center gap-2 text-sm">
                    <input 
                      type="checkbox" 
                      className="rounded text-primary-500"
                      checked={filterCategories.includes('insights')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilterCategories(prev => [...prev, 'insights']);
                        } else {
                          setFilterCategories(prev => prev.filter(c => c !== 'insights'));
                        }
                      }}
                    />
                    Insights et recommandations
                  </label>
                </div>
                
                <div className="p-2 bg-gray-50 rounded-md mb-1">
                  <span className="text-xs font-medium text-gray-600 block mb-1.5">Actualités</span>
                  <label className="flex items-center gap-2 text-sm">
                    <input 
                      type="checkbox" 
                      className="rounded text-primary-500"
                      checked={filterCategories.includes('marché')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilterCategories(prev => [...prev, 'marché']);
                        } else {
                          setFilterCategories(prev => prev.filter(c => c !== 'marché'));
                        }
                      }}
                    />
                    Actualités sectorielles
                  </label>
                </div>
              </div>
              
              <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center">
                <button
                  className="text-xs text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    setFilterCategories([]);
                    applyFilters();
                  }}
                >
                  Tout réinitialiser
                </button>
                <Button 
                  variant="primary" 
                  size="xs"
                  onClick={() => {
                    applyFilters();
                    document.getElementById('filter-modal')?.classList.add('hidden');
                  }}
                >
                  Appliquer les filtres
                </Button>
              </div>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="xs"
            icon={isRefreshing ? null : <RefreshCw size={14} />}
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <div className="flex items-center">
                <div className="animate-spin w-3.5 h-3.5 border-t-2 border-primary-500 border-r-2 rounded-full mr-1.5"></div>
                Actualisation...
              </div>
            ) : (
              "Actualiser"
            )}
          </Button>
          
          <Button 
            variant="outline" 
            size="xs" 
            icon={<Download size={14} />}
            onClick={handleExport}
            className={exportSuccess ? "bg-success-50 text-success-700 border-success-200" : ""}
          >
            {exportSuccess ? "Exporté ✓" : "Exporter"}
          </Button>
          
          {showPdfExport && (
            <div className="absolute right-0 top-full mt-2 z-50 bg-white shadow-lg rounded-lg p-4 w-96">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700">Exportation du rapport</h4>
                <button 
                  className="text-gray-400 hover:text-gray-500" 
                  onClick={() => setShowPdfExport(false)}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <p className="text-xs text-gray-500 mb-4 pb-2 border-b border-gray-100">
                Configurez les paramètres de votre rapport avant l'exportation.
              </p>
              
              <div className="space-y-4 mb-4">
                <div>
                  <h5 className="text-xs font-medium text-gray-700 mb-2">Contenu à inclure</h5>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded text-primary-500" defaultChecked />
                      <span className="text-sm text-gray-700">Vue d'ensemble</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded text-primary-500" defaultChecked />
                      <span className="text-sm text-gray-700">Données financières</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded text-primary-500" defaultChecked />
                      <span className="text-sm text-gray-700">Insights business</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded text-primary-500" defaultChecked />
                      <span className="text-sm text-gray-700">Positionnement</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded text-primary-500" defaultChecked />
                      <span className="text-sm text-gray-700">Risques & opportunités</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded text-primary-500" defaultChecked />
                      <span className="text-sm text-gray-700">Actualités</span>
                    </label>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Format du rapport</label>
                    <select className="text-sm border border-gray-300 rounded p-1.5 w-full bg-white">
                      <option>PDF</option>
                      <option>Excel</option>
                      <option>PowerPoint</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Période à inclure</label>
                    <select className="text-sm border border-gray-300 rounded p-1.5 w-full bg-white">
                      <option>Période sélectionnée</option>
                      <option>Année complète</option>
                      <option>Derniers 12 mois</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Informations additionnelles</label>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded text-primary-500" defaultChecked />
                      <span className="text-sm text-gray-700">Page de garde</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded text-primary-500" defaultChecked />
                      <span className="text-sm text-gray-700">Sommaire</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded text-primary-500" defaultChecked />
                      <span className="text-sm text-gray-700">Notes explicatives</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded text-primary-500" />
                      <span className="text-sm text-gray-700">Logo client</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 pb-2">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center mr-3">
                    <FileSpreadsheet className="h-5 w-5 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Rapport_{activeClient.name.replace(/\s+/g, '_')}_{endMonth.substring(0,3)}_{endYear}.pdf</p>
                    <p className="text-xs text-gray-500">Le rapport sera généré au format sélectionné</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-2">
                <Button 
                  variant="primary" 
                  size="sm" 
                  icon={<Download size={16} />}
                  onClick={generatePdf}
                  disabled={exportSuccess}
                  className="w-auto"
                >
                  {exportSuccess ? "Rapport généré ✓" : "Générer et télécharger"}
                </Button>
              </div>
            </div>
          )}
        </div>
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
          
          {/* Vue d'ensemble Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Info client */}
              <div className="lg:col-span-12" style={{ display: isBlockVisible('client-info') ? 'flex' : 'none' }}>
                <div className="w-full">
                  {!isBlockLoaded('client-info') ? (
                    <Card className="min-h-[180px]" size="sm">
                      <div className="p-4 flex flex-col items-center justify-center h-full">
                        <div className="animate-pulse bg-primary-100 p-2 rounded-lg">
                          <Building2 className="h-5 w-5 text-primary-500" />
                        </div>
                        <div className="mt-3 text-xs text-center text-gray-500">
                          Chargement des informations client...
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <Card 
                      title="Informations client"
                      icon={<Building2 className="h-4 w-4 text-primary-500" />}
                      size="sm"
                    >
                      <div className="p-4">
                        <div className="flex flex-col md:flex-row md:justify-between">
                          <div>
                            <h2 className="text-xl font-bold text-gray-800">{clientData?.company?.name || 'Nom de l\'entreprise'}</h2>
                            <p className="text-sm text-gray-600">{clientData?.company?.sector_name || 'Secteur d\'activité'}</p>
                          </div>
                          <div className="mt-2 md:mt-0">
                            <Badge color="secondary" size="sm">Siren : {clientData?.company?.siren || 'N/A'}</Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <div className="text-xs text-gray-500 mb-1">Chiffre d'affaires</div>
                            <div className="text-lg font-semibold text-gray-800">
                              {clientData?.financial_history ? 
                                (clientData.financial_history["2023"].revenue / 1000000).toFixed(1) + " M€" : 
                                "N/A"}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Année 2023</div>
                          </div>
                          
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <div className="text-xs text-gray-500 mb-1">Effectif</div>
                            <div className="text-lg font-semibold text-gray-800">
                              {clientData?.company?.employees || 'N/A'}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">ETP</div>
                          </div>
                          
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <div className="text-xs text-gray-500 mb-1">Création</div>
                            <div className="text-lg font-semibold text-gray-800">
                              {clientData?.company?.creation_date ? 
                                new Date(clientData.company.creation_date).getFullYear() : 
                                'N/A'}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {clientData?.company?.age ? clientData.company.age + ' ans' : 'N/A'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-500 mt-1 text-right">
                          Source: INSEE, Registre du Commerce
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
              
              {/* KPIs Principaux */}
              <div className="lg:col-span-12" style={{ display: isBlockVisible('main-kpis') ? 'flex' : 'none' }}>
                <div className="w-full">
                  {!isBlockLoaded('main-kpis') ? (
                    <Card className="min-h-[180px]" size="sm">
                      <div className="p-4 flex flex-col items-center justify-center h-full">
                        <div className="animate-pulse bg-primary-100 p-2 rounded-lg">
                          <BarChart className="h-5 w-5 text-primary-500" />
                        </div>
                        <div className="mt-3 text-xs text-center text-gray-500">
                          Chargement des KPIs...
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <Card 
                      title="Indicateurs clés de performance"
                      icon={<BarChart className="h-4 w-4 text-primary-500" />}
                      size="sm"
                    >
                      <div className="p-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <div className="text-xs text-gray-500 mb-1">CA 2023</div>
                            <div className="text-lg font-semibold text-gray-800">
                              {clientData?.financial_history ? 
                                (clientData.financial_history["2023"].revenue / 1000000).toFixed(1) + " M€" : 
                                "N/A"}
                            </div>
                            <div className="text-xs mt-1">
                              <span className={clientData?.financial_history && 
                                    clientData.financial_history["2023"].revenue > clientData.financial_history["2022"].revenue ? 
                                    "text-success-600" : "text-error-600"}>
                                {clientData?.financial_history ? 
                                  ((clientData.financial_history["2023"].revenue - clientData.financial_history["2022"].revenue) / 
                                    clientData.financial_history["2022"].revenue * 100).toFixed(1) + "% vs 2022" : 
                                  "N/A"}
                              </span>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <div className="text-xs text-gray-500 mb-1">Résultat net</div>
                            <div className="text-lg font-semibold text-gray-800">
                              {clientData?.financial_history ? 
                                (clientData.financial_history["2023"].net_income / 1000).toFixed(0) + " k€" : 
                                "N/A"}
                            </div>
                            <div className="text-xs mt-1">
                              <span className={clientData?.financial_history && 
                                    clientData.financial_history["2023"].net_income > clientData.financial_history["2022"].net_income ? 
                                    "text-success-600" : "text-error-600"}>
                                {clientData?.financial_history ? 
                                  ((clientData.financial_history["2023"].net_income - clientData.financial_history["2022"].net_income) / 
                                    clientData.financial_history["2022"].net_income * 100).toFixed(1) + "% vs 2022" : 
                                  "N/A"}
                              </span>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <div className="text-xs text-gray-500 mb-1">Marge nette</div>
                            <div className="text-lg font-semibold text-gray-800">
                              {clientData?.key_ratios ? 
                                (clientData.key_ratios["2023"].net_margin * 100).toFixed(1) + "%" : 
                                "N/A"}
                            </div>
                            <div className="text-xs mt-1">
                              <span className={clientData?.key_ratios && 
                                    clientData.key_ratios["2023"].net_margin > clientData.key_ratios["2022"].net_margin ? 
                                    "text-success-600" : "text-error-600"}>
                                {clientData?.key_ratios ? 
                                  ((clientData.key_ratios["2023"].net_margin - clientData.key_ratios["2022"].net_margin) * 100).toFixed(1) + 
                                  " pts vs 2022" : 
                                  "N/A"}
                              </span>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <div className="text-xs text-gray-500 mb-1">Délai client (DSO)</div>
                            <div className="text-lg font-semibold text-gray-800">
                              {clientData?.key_ratios ? 
                                Math.round(clientData.key_ratios["2023"].days_sales_outstanding) + " jours" : 
                                "N/A"}
                            </div>
                            <div className="text-xs mt-1">
                              <span className={clientData?.key_ratios && 
                                    clientData.key_ratios["2023"].days_sales_outstanding < clientData.key_ratios["2022"].days_sales_outstanding ? 
                                    "text-success-600" : "text-error-600"}>
                                {clientData?.key_ratios ? 
                                  Math.round(clientData.key_ratios["2023"].days_sales_outstanding - 
                                  clientData.key_ratios["2022"].days_sales_outstanding) + " j vs 2022" : 
                                  "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
              
              {/* Business Insights */}
              <div className="lg:col-span-12" style={{ display: isBlockVisible('business-insights') ? 'flex' : 'none' }}>
                <div className="w-full">
                  {!isBlockLoaded('business-insights') ? (
                    <Card className="min-h-[180px]" size="sm">
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
                    <Card className="relative overflow-hidden">
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
                      
                      <div className="p-3">
                        <div className="text-sm text-gray-700">
                          {clientData?.company?.name} est une entreprise de {clientData?.company?.sector_name} qui affiche une 
                          croissance stable depuis sa création en {new Date(clientData?.company?.creation_date).getFullYear()}. 
                          Avec {clientData?.company?.employees} employés et un chiffre d'affaires de {' '}
                          {(clientData?.financial_history['2023'].revenue / 1000000).toFixed(1)} M€, 
                          l'entreprise se positionne dans la moyenne haute de son secteur.
                        </div>
                        
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-success-50 p-4 rounded-lg border border-success-100">
                            <div className="flex items-center mb-2">
                              <div className="w-5 h-5 rounded-full bg-success-100 flex items-center justify-center mr-2">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M20 6L9 17L4 12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                              <h3 className="text-sm font-medium text-gray-800">Points forts</h3>
                            </div>
                            <ul className="text-xs text-gray-700 space-y-2">
                              <li className="flex items-center">
                                <span className="w-1.5 h-1.5 bg-success-500 rounded-full mr-2 flex-shrink-0"></span>
                                <span>Forte croissance du CA: <span className="font-medium">+16% en 2023</span></span>
                              </li>
                              <li className="flex items-center">
                                <span className="w-1.5 h-1.5 bg-success-500 rounded-full mr-2 flex-shrink-0"></span>
                                <span>Marge nette supérieure à la moyenne sectorielle</span>
                              </li>
                              <li className="flex items-center">
                                <span className="w-1.5 h-1.5 bg-success-500 rounded-full mr-2 flex-shrink-0"></span>
                                <span>Position concurrentielle solide dans son segment</span>
                              </li>
                            </ul>
                          </div>
                          <div className="bg-warning-50 p-4 rounded-lg border border-warning-100">
                            <div className="flex items-center mb-2">
                              <div className="w-5 h-5 rounded-full bg-warning-100 flex items-center justify-center mr-2">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12 9v4M12 17h.01M12 3c-1.86 0-3.72.5-5.36 1.37a10.72 10.72 0 0 0-3.91 3.72A10.56 10.56 0 0 0 1.8 17.98A10.62 10.62 0 0 0 12 22c1.86 0 3.72-.5 5.36-1.37a10.72 10.72 0 0 0 3.91-3.72 10.56 10.56 0 0 0 .93-9.88A10.62 10.62 0 0 0 12 3z" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                              <h3 className="text-sm font-medium text-gray-800">Points d'attention</h3>
                            </div>
                            <ul className="text-xs text-gray-700 space-y-2">
                              <li className="flex items-center">
                                <span className="w-1.5 h-1.5 bg-warning-500 rounded-full mr-2 flex-shrink-0"></span>
                                <span>DSO en augmentation <span className="font-medium">(+5j vs 2022)</span></span>
                              </li>
                              <li className="flex items-center">
                                <span className="w-1.5 h-1.5 bg-warning-500 rounded-full mr-2 flex-shrink-0"></span>
                                <span>Pression sur les marges au S2 2023</span>
                              </li>
                              <li className="flex items-center">
                                <span className="w-1.5 h-1.5 bg-warning-500 rounded-full mr-2 flex-shrink-0"></span>
                                <span>Forte dépendance au secteur retail <span className="font-medium">(35% du CA)</span></span>
                              </li>
                            </ul>
                          </div>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-4 w-full bg-white border-primary-200 text-primary-700 hover:bg-primary-50 hover:border-primary-300"
                          onClick={() => handleRecommendationClick('insights')}
                        >
                          <Search size={14} className="mr-1.5" />
                          Voir l'analyse complète
                        </Button>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
              
              {/* Risques à surveiller */}
              <div className="md:col-span-6 lg:col-span-6" style={{ display: isBlockVisible('risks') ? 'flex' : 'none' }}>
                <div className="w-full">
                  {!isBlockLoaded('risks') ? (
                    <Card className="min-h-[1200px]" size="sm">
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
                      <div className="h-full">
                        <Card className="relative h-auto">
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
                          
                          <div className="p-3">
                            <div className="grid grid-cols-1 gap-4">
                              {clientData.risk_factors.slice(0, 5).map((risk: RiskFactor, index: number) => (
                                <div key={index} className="p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow bg-white">
                                  <div className="flex items-start">
                                    <div className={`mt-1 w-4 h-4 rounded-full flex-shrink-0 ${
                                      risk.impact === 'high' ? 'bg-error-500' : 
                                      risk.impact === 'medium' ? 'bg-warning-500' : 'bg-info-500'
                                    }`} />
                                    <div className="ml-3 w-full">
                                      <div className="text-sm font-semibold text-gray-800 mb-2">{risk.name}</div>
                                      
                                      <div className="flex flex-wrap mb-2 gap-x-5 gap-y-1.5">
                                        <div className="flex items-center bg-gray-50 px-2 py-1 rounded-md">
                                          <span className="text-xs text-gray-500 mr-1.5">Impact:</span> 
                                          <span className={`text-xs font-medium ${
                                            risk.impact === 'high' ? 'text-error-600' : 
                                            risk.impact === 'medium' ? 'text-warning-600' : 'text-info-600'
                                          }`}>
                                            {risk.impact === 'high' ? 'Élevé' : risk.impact === 'medium' ? 'Moyen' : 'Faible'}
                                          </span>
                                        </div>
                                        
                                        {risk.probability && (
                                          <div className="flex items-center bg-gray-50 px-2 py-1 rounded-md">
                                            <span className="text-xs text-gray-500 mr-1.5">Probabilité:</span> 
                                            <span className="text-xs font-medium">{risk.probability === 'high' ? 'Élevée' : risk.probability === 'medium' ? 'Moyenne' : 'Faible'}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-4 w-full bg-white border-error-200 text-error-700 hover:bg-error-50 hover:border-error-300"
                              onClick={() => handleRecommendationClick('risks')}
                            >
                              <AlertCircle size={14} className="mr-1.5" />
                              Plan de mitigation
                            </Button>
                          </div>
                        </Card>
                      </div>
                    )
                  )}
                </div>
              </div>
              
              {/* Opportunités de croissance */}
              <div className="md:col-span-6 lg:col-span-6" style={{ display: isBlockVisible('opportunities') ? 'flex' : 'none' }}>
                <div className="w-full">
                {!isBlockLoaded('opportunities') ? (
                  <Card className="min-h-[1200px]" size="sm">
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
                    <div className="h-full">
                      <Card className="relative h-auto">
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
                        
                        <div className="p-3">
                          <div className="grid grid-cols-1 gap-4">
                            {clientData.growth_opportunities.slice(0, 5).map((opportunity: GrowthOpportunity, index: number) => (
                              <div key={index} className="p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow bg-white">
                                <div className="flex items-center mb-3">
                                  <div className="w-8 h-8 rounded-full bg-success-100 flex items-center justify-center flex-shrink-0">
                                    <TrendingUp size={16} className="text-success-600" />
                                  </div>
                                  <div className="ml-3 flex-grow">
                                    <div className="text-sm font-semibold text-gray-800">{opportunity.name}</div>
                                  </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3 mt-3">
                                  <div className="col-span-3 md:col-span-1 bg-success-50 rounded-lg p-2.5 border border-success-100">
                                    <div className="text-xs text-gray-500 mb-1">CA potentiel</div>
                                    <div className="text-sm font-medium text-success-700">{opportunity.potential_revenue}</div>
                                  </div>
                                  <div className="col-span-3 md:col-span-1 bg-gray-50 rounded-lg p-2.5 border border-gray-100">
                                    <div className="text-xs text-gray-500 mb-1">Investissement</div>
                                    <div className="text-sm font-medium text-gray-700">{opportunity.investment_required.toLocaleString()} €</div>
                                  </div>
                                  <div className="col-span-3 md:col-span-1 bg-gray-50 rounded-lg p-2.5 border border-gray-100">
                                    <div className="text-xs text-gray-500 mb-1">Délai</div>
                                    <div className="text-sm font-medium text-gray-700">{opportunity.time_to_market}</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-4 w-full bg-white border-success-200 text-success-700 hover:bg-success-50 hover:border-success-300 opportunity-button"
                            data-opportunity="cloud"
                            data-prompt="Nous souhaitons simuler une transition vers les services cloud"
                          >
                            <TrendingUp size={14} className="mr-1.5" />
                            Simuler cette opportunité
                          </Button>
                        </div>
                      </Card>
                    </div>
                  )
                )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Autres onglets seront ajoutés séparément */}
        </Tabs>
      </div>

      {/* Modal pour les recommandations sera ajouté dans la prochaine partie */}
    </div>
  );
} 