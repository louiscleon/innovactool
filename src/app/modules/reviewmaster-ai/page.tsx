"use client";

import React, { useState } from 'react';
import { Search, AlertTriangle, CheckCircle, ArrowRight, Upload, FileText, PieChart, Filter, AlertCircle, Download, Edit, BarChart, ChevronDown, ChevronUp, AlertOctagon, BarChart2 } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { mockSectoralData } from '@/mock-data/sectoral-data';
import { NetworkWatermark } from '@/components/NetworkWatermark';
import { SectoralGapAnalysis } from '@/components/SectoralGapAnalysis';
import { CorrectionODProposal, ODProposal } from '@/components/CorrectionODProposal';
import { mockSectoralGaps, mockODProposals } from '@/mock-data/mock-client-360';

interface Anomaly {
  id: string;
  type: 'warning' | 'error' | 'info';
  description: string;
  account: string;
  amount: number;
  date: string;
  status: 'pending' | 'resolved' | 'ignored';
  suggestion?: string;
  criticality: 'high' | 'medium' | 'low';
  sectorComparison?: {
    median: number;
    percentile: number;
    status: 'above' | 'below' | 'normal';
  };
  proposedOD?: ProposedOD;
}

interface ProposedOD {
  id: string;
  description: string;
  date: string;
  entries: {
    account: string;
    label: string;
    debit?: number;
    credit?: number;
  }[];
  justification: string;
  status?: 'pending' | 'approved' | 'rejected';
  legalReference?: string;
  impact?: {
    balance_sheet: string;
    income_statement: string;
    tax: string;
  };
}

export default function ReviewMasterAiPage() {
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null);
  const [sectorComparison, setSectorComparison] = useState(false);
  const [showSectoralGaps, setShowSectoralGaps] = useState(false);
  const [showODProposals, setShowODProposals] = useState(false);

  // Fonction pour simuler l'analyse d'un fichier FEC
  const startAnalysis = () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setProgress(0);
    setAnomalies([]);
    setSelectedAnomaly(null);

    // Simuler la progression de l'analyse
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsAnalyzing(false);
        setIsAnalysisComplete(true);
        generateMockAnomalies();
      }
    }, 200);
  };

  // Générer des anomalies fictives pour la démonstration
  const generateMockAnomalies = () => {
    const mockAnomalies: Anomaly[] = [
      {
        id: '1',
        type: 'error',
        description: 'Écriture non équilibrée',
        account: '401000',
        amount: 1250.75,
        date: '15/03/2023',
        status: 'pending',
        suggestion: 'Vérifier l\'écriture n°3792 et équilibrer avec le compte 512000',
        criticality: 'high',
        sectorComparison: {
          median: 0, // Cette anomalie n'a pas de référence sectorielle (c'est une erreur technique)
          percentile: 100,
          status: 'above'
        },
        proposedOD: {
          id: 'OD123',
          description: 'Correction écriture non équilibrée',
          date: '20/06/2023',
          entries: [
            {
              account: '401000',
              label: 'Fournisseurs',
              credit: 1250.75
            },
            {
              account: '512000',
              label: 'Banque',
              debit: 1250.75
            }
          ],
          justification: 'OD de correction pour équilibrer l\'écriture n°3792 du 15/03/2023. Montant manquant au crédit.',
          status: 'pending',
          legalReference: 'PCG Art. 420-1: Principe de la partie double',
          impact: {
            balance_sheet: 'Correction de la balance des comptes',
            income_statement: 'Pas d\'impact sur le résultat',
            tax: 'Aucun impact fiscal'
          }
        }
      },
      {
        id: '2',
        type: 'warning',
        description: 'Montant inhabituel pour ce fournisseur',
        account: '606100',
        amount: 9875.25,
        date: '22/04/2023',
        status: 'pending',
        suggestion: 'Vérifier la cohérence avec les factures précédentes du fournisseur',
        criticality: 'medium',
        sectorComparison: {
          median: 4200.50,
          percentile: 92,
          status: 'above'
        },
        proposedOD: {
          id: 'OD129',
          description: 'Provision pour risque de surfacturation',
          date: '20/06/2023',
          entries: [
            {
              account: '681500',
              label: 'Dotations aux provisions d\'exploitation',
              debit: 5000.00
            },
            {
              account: '151000',
              label: 'Provisions pour risques',
              credit: 5000.00
            }
          ],
          justification: 'Provision prudentielle pour risque de surfacturation du fournisseur XYZ. Le montant facturé est 135% au-dessus de la moyenne des 12 derniers mois et 92% au-dessus de la médiane sectorielle.',
          status: 'pending',
          legalReference: 'PCG Art. 323-2: Constitution de provisions',
          impact: {
            balance_sheet: 'Augmentation des provisions au passif de 5000€',
            income_statement: 'Diminution du résultat d\'exploitation de 5000€',
            tax: 'Déduction fiscale sous réserve de justification du risque'
          }
        }
      },
      {
        id: '3',
        type: 'info',
        description: 'TVA déductible potentiellement incomplète',
        account: '445620',
        amount: 356.80,
        date: '05/05/2023',
        status: 'pending',
        suggestion: 'Recalculer la TVA en fonction du montant HT facturé',
        criticality: 'low',
        sectorComparison: {
          median: 350.00,
          percentile: 55,
          status: 'normal'
        },
        proposedOD: {
          id: 'OD124',
          description: 'Correction TVA déductible',
          date: '20/06/2023',
          entries: [
            {
              account: '445620',
              label: 'TVA déductible sur biens et services',
              debit: 123.20
            },
            {
              account: '401000',
              label: 'Fournisseurs',
              credit: 123.20
            }
          ],
          justification: 'Complément de TVA déductible calculé sur la base du montant HT facturé de 1740€ (TVA à 20% = 348€, actuellement comptabilisé 356.80€)',
          status: 'pending',
          legalReference: 'CGI Art. 271-I: Droit à déduction de la TVA',
          impact: {
            balance_sheet: 'Augmentation des créances fiscales de 123.20€',
            income_statement: 'Pas d\'impact sur le résultat',
            tax: 'Augmentation de la TVA déductible de 123.20€'
          }
        }
      },
      {
        id: '4',
        type: 'warning',
        description: 'Écriture en doublon potentielle',
        account: '607000',
        amount: 2340.00,
        date: '12/05/2023',
        status: 'pending',
        suggestion: 'Vérifier la référence de facture qui semble identique à une écriture du 10/05',
        criticality: 'medium',
        sectorComparison: {
          median: 2100.00,
          percentile: 65,
          status: 'above'
        },
        proposedOD: {
          id: 'OD125',
          description: 'Suppression doublon',
          date: '20/06/2023',
          entries: [
            {
              account: '401000',
              label: 'Fournisseurs',
              debit: 2340.00
            },
            {
              account: '607000',
              label: 'Achats de marchandises',
              credit: 1950.00
            },
            {
              account: '445620',
              label: 'TVA déductible sur biens et services',
              credit: 390.00
            }
          ],
          justification: 'Annulation de l\'écriture en doublon du 12/05/2023, référence facture F23-05421 déjà comptabilisée le 10/05/2023',
          status: 'pending',
          legalReference: 'PCG Art. 410-1: Principe de régularité et sincérité',
          impact: {
            balance_sheet: 'Diminution des dettes fournisseurs de 2340€',
            income_statement: 'Diminution des charges d\'exploitation de 1950€',
            tax: 'Réduction de la TVA déductible de 390€'
          }
        }
      },
      {
        id: '5',
        type: 'error',
        description: 'Compte non existant dans le plan comptable',
        account: '399999',
        amount: 450.30,
        date: '01/06/2023',
        status: 'pending',
        suggestion: 'Utiliser un compte existant, potentiellement 390000',
        criticality: 'high',
        sectorComparison: {
          median: 0, // Pas de comparaison sectorielle pour cette erreur technique
          percentile: 0,
          status: 'normal'
        },
        proposedOD: {
          id: 'OD126',
          description: 'Reclassement comptable',
          date: '20/06/2023',
          entries: [
            {
              account: '390000',
              label: 'Provisions pour dépréciation des stocks',
              debit: 450.30
            },
            {
              account: '399999',
              label: 'Compte inexistant à régulariser',
              credit: 450.30
            }
          ],
          justification: 'Reclassement d\'une écriture utilisant un compte non défini dans le PCG. Le compte 399999 n\'existe pas et doit être remplacé par le compte 390000 (Provisions pour dépréciation des stocks) selon la nature de l\'opération.',
          status: 'pending',
          legalReference: 'PCG Art. 410-1 et suivants: Plan de comptes',
          impact: {
            balance_sheet: 'Reclassement sans impact sur le total',
            income_statement: 'Pas d\'impact sur le résultat',
            tax: 'Aucun impact fiscal'
          }
        }
      }
    ];

    // Ajout de 3 anomalies supplémentaires avec comparaisons sectorielles
    const additionalAnomalies: Anomaly[] = [
      {
        id: '6',
        type: 'warning',
        description: 'Charges de personnel élevées par rapport au secteur',
        account: '641000',
        amount: 1240000,
        date: '31/05/2023',
        status: 'pending',
        suggestion: 'Analyser la structure des rémunérations et l\'effectif par rapport aux standards sectoriels',
        criticality: 'high',
        sectorComparison: {
          median: 980000,
          percentile: 85,
          status: 'above'
        }
      },
      {
        id: '7',
        type: 'info',
        description: 'Achats non stockés supérieurs à la moyenne sectorielle',
        account: '606000',
        amount: 85000,
        date: '15/04/2023',
        status: 'pending',
        suggestion: 'Évaluer la pertinence d\'une politique d\'achat centralisée',
        criticality: 'medium',
        sectorComparison: {
          median: 45000,
          percentile: 89,
          status: 'above'
        }
      },
      {
        id: '8',
        type: 'info',
        description: 'Honoraires élevés par rapport aux pratiques du secteur',
        account: '622600',
        amount: 210000,
        date: '30/04/2023',
        status: 'pending',
        suggestion: 'Évaluer l\'internalisation de certaines compétences clés',
        criticality: 'medium',
        sectorComparison: {
          median: 120000,
          percentile: 75,
          status: 'above'
        }
      }
    ];

    setAnomalies([...mockAnomalies, ...additionalAnomalies]);
  };

  // Filtrer les anomalies en fonction de l'onglet actif
  const filteredAnomalies = anomalies.filter(anomaly => {
    if (activeTab === 'all') return true;
    if (activeTab === 'errors') return anomaly.type === 'error';
    if (activeTab === 'warnings') return anomaly.type === 'warning';
    if (activeTab === 'resolved') return anomaly.status === 'resolved';
    return true;
  });

  // Mettre à jour le statut d'une anomalie
  const updateAnomalyStatus = (id: string, status: 'pending' | 'resolved' | 'ignored') => {
    setAnomalies(prevAnomalies => 
      prevAnomalies.map(anomaly => 
        anomaly.id === id ? { ...anomaly, status } : anomaly
      )
    );
    
    if (selectedAnomaly && selectedAnomaly.id === id) {
      setSelectedAnomaly({ ...selectedAnomaly, status });
    }
  };

  // Fonctions pour gérer les propositions d'OD
  const handleApproveOD = (id: string) => {
    setAnomalies(prevAnomalies => 
      prevAnomalies.map(anomaly => {
        if (anomaly.proposedOD && anomaly.proposedOD.id === id) {
          return { 
            ...anomaly, 
            status: 'resolved',
            proposedOD: {
              ...anomaly.proposedOD,
              status: 'approved'
            }
          };
        }
        return anomaly;
      })
    );
  };

  const handleRejectOD = (id: string) => {
    setAnomalies(prevAnomalies => 
      prevAnomalies.map(anomaly => {
        if (anomaly.proposedOD && anomaly.proposedOD.id === id) {
          return { 
            ...anomaly, 
            proposedOD: {
              ...anomaly.proposedOD,
              status: 'rejected'
            }
          };
        }
        return anomaly;
      })
    );
  };

  return (
    <div className="animate-fade-in relative">
      {/* Add NetworkWatermark */}
      <NetworkWatermark opacity={0.03} />
      
      <div className="relative mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-primary-100 p-1.5 rounded-lg">
            <Search className="h-6 w-6 text-primary-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Agent de révision</h1>
        </div>
        <p className="text-sm text-gray-600 max-w-3xl">
          Détection intelligente d'anomalies dans vos écritures comptables et proposition de corrections automatisées.
        </p>
      </div>
      
      {/* File Upload Section */}
      {!selectedFile && !isAnalysisComplete && (
        <Card size="sm" className="mb-6">
          <div className="flex flex-col items-center justify-center p-4">
            <div className="p-2.5 bg-primary-50 rounded-full mb-3">
              <Upload className="h-6 w-6 text-primary-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Téléchargez votre fichier FEC</h2>
            <p className="text-sm text-gray-600 mb-4 text-center max-w-lg">
              Analysez vos écritures comptables pour identifier automatiquement les anomalies et incohérences.
            </p>
            <div className="flex gap-3">
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => setSelectedFile('exemple_fec_2023.txt')}
              >
                Sélectionner un fichier
              </Button>
              <Button 
                variant="outline" 
                size="sm"
              >
                Utiliser un exemple
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      {/* Selected File */}
      {selectedFile && !isAnalysisComplete && (
        <Card size="sm" className="mb-6">
          <div className="flex items-center p-3">
            <div className="p-1.5 bg-blue-50 rounded-md mr-3">
              <FileText className="h-5 w-5 text-primary-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-800 text-sm">{selectedFile}</h3>
              <p className="text-xs text-gray-500">Prêt pour l'analyse</p>
            </div>
            <Button 
              variant="primary" 
              size="sm"
              onClick={startAnalysis}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? 'Analyse en cours...' : 'Démarrer l\'analyse'}
            </Button>
          </div>
          
          {isAnalyzing && (
            <div className="px-3 pb-3">
              <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                <div 
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Analyse en cours...</span>
                <span className="text-xs font-medium text-gray-700">{progress}%</span>
              </div>
            </div>
          )}
        </Card>
      )}
      
      {/* Analysis Results */}
      {isAnalysisComplete && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Summary / Left Panel */}
          <div className="lg:col-span-1">
            <Card size="sm" className="mb-4">
              <div className="p-3 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800 text-sm">Résumé de l'analyse</h3>
                  <Badge color="success" variant="soft" size="xs">Terminé</Badge>
                </div>
              </div>
              
              <div className="p-3">
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-600">Fichier analysé</span>
                    <span className="text-xs font-medium">{selectedFile}</span>
                  </div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-600">Écritures vérifiées</span>
                    <span className="text-xs font-medium">528</span>
                  </div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-600">Anomalies détectées</span>
                    <span className="text-xs font-medium text-error-600">{anomalies.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Temps d'analyse</span>
                    <span className="text-xs font-medium">28 secondes</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="bg-error-50 border border-error-100 rounded-lg p-2 text-center">
                    <p className="text-xs text-error-600 mb-1">Erreurs</p>
                    <p className="text-lg font-semibold text-error-700">
                      {anomalies.filter(a => a.type === 'error').length}
                    </p>
                  </div>
                  <div className="bg-warning-50 border border-warning-100 rounded-lg p-2 text-center">
                    <p className="text-xs text-warning-600 mb-1">Alertes</p>
                    <p className="text-lg font-semibold text-warning-700">
                      {anomalies.filter(a => a.type === 'warning').length}
                    </p>
                  </div>
                  <div className="bg-info-50 border border-info-100 rounded-lg p-2 text-center">
                    <p className="text-xs text-info-600 mb-1">Infos</p>
                    <p className="text-lg font-semibold text-info-700">
                      {anomalies.filter(a => a.type === 'info').length}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="xs"
                    className="flex-1"
                    icon={<Download size={14} />}
                  >
                    Exporter
                  </Button>
                  <Button 
                    variant={sectorComparison ? "primary" : "outline"}
                    size="xs"
                    className="flex-1"
                    icon={<BarChart size={14} />}
                    onClick={() => setSectorComparison(!sectorComparison)}
                  >
                    Comparaison
                  </Button>
                  <Button 
                    variant={showSectoralGaps ? "primary" : "outline"}
                    size="xs"
                    className="flex-1"
                    icon={<BarChart2 size={14} />}
                    onClick={() => setShowSectoralGaps(!showSectoralGaps)}
                  >
                    Écarts
                  </Button>
                  <Button 
                    variant={showODProposals ? "primary" : "outline"}
                    size="xs"
                    className="flex-1"
                    icon={<FileText size={14} />}
                    onClick={() => setShowODProposals(!showODProposals)}
                  >
                    ODs
                  </Button>
                </div>
              </div>
            </Card>
            
            <Card size="sm">
              <div className="p-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800 text-sm">Analyse rapide</h3>
              </div>
              
              <div className="p-3">
                <div className="text-xs text-gray-600 space-y-2">
                  <p>L'analyse a identifié plusieurs problèmes nécessitant votre attention :</p>
                  <ul className="list-disc ml-4 space-y-1">
                    <li>2 écritures non équilibrées</li>
                    <li>1 utilisation de compte non-existant</li>
                    <li>2 anomalies de montants inhabituels</li>
                  </ul>
                  <p className="pt-1.5">
                    L'IA suggère que ces problèmes soient résolus avant la clôture comptable pour assurer l'exactitude des états financiers.
                  </p>
                </div>
                
                {sectorComparison && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center mb-2">
                      <BarChart className="h-3.5 w-3.5 text-primary-500 mr-1.5" />
                      <h4 className="text-xs font-medium text-gray-700">Analyse sectorielle</h4>
                    </div>
                    <div className="text-xs text-gray-600">
                      <p className="mb-1.5">
                        Comparaison des montants avec les données sectorielles du 
                        <span className="font-medium"> {mockSectoralData.sector.name}</span> 
                        (code NAF {mockSectoralData.sector.code})
                      </p>
                      <div className="bg-warning-50 p-1.5 rounded border border-warning-100 text-warning-700 mb-1.5">
                        <AlertOctagon className="h-3 w-3 inline-block mr-1" />
                        <span>3 postes présentent des écarts significatifs par rapport au secteur</span>
                      </div>
                      <p>
                        Les écarts les plus importants concernent les postes 
                        <span className="font-medium"> charges de personnel</span> (+52%) et 
                        <span className="font-medium"> achats de marchandises</span> (+135%)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
          
          {/* Anomaly List & Details / Main Panel */}
          <div className="lg:col-span-2">
            <Card size="sm" className="mb-4">
              <div className="flex border-b border-gray-100">
                <button 
                  className={`px-4 py-3 text-sm font-medium ${activeTab === 'all' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-600 hover:text-gray-800'}`}
                  onClick={() => setActiveTab('all')}
                >
                  Toutes ({anomalies.length})
                </button>
                <button 
                  className={`px-4 py-3 text-sm font-medium ${activeTab === 'errors' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-600 hover:text-gray-800'}`}
                  onClick={() => setActiveTab('errors')}
                >
                  Erreurs ({anomalies.filter(a => a.type === 'error').length})
                </button>
                <button 
                  className={`px-4 py-3 text-sm font-medium ${activeTab === 'warnings' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-600 hover:text-gray-800'}`}
                  onClick={() => setActiveTab('warnings')}
                >
                  Alertes ({anomalies.filter(a => a.type === 'warning').length})
                </button>
                <button 
                  className={`px-4 py-3 text-sm font-medium ${activeTab === 'resolved' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-600 hover:text-gray-800'}`}
                  onClick={() => setActiveTab('resolved')}
                >
                  Résolues ({anomalies.filter(a => a.status === 'resolved').length})
                </button>
              </div>
              
              <div className="divide-y divide-gray-100">
                {filteredAnomalies.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-gray-500">Aucune anomalie dans cette catégorie</p>
                  </div>
                ) : (
                  filteredAnomalies.map(anomaly => (
                    <div 
                      key={anomaly.id}
                      className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 
                        ${selectedAnomaly?.id === anomaly.id ? 'bg-gray-50' : ''}`}
                      onClick={() => setSelectedAnomaly(anomaly)}
                    >
                      <div className="flex items-center">
                        {anomaly.type === 'error' && (
                          <div className="relative">
                            <AlertCircle className="h-5 w-5 text-error-500 mr-3" />
                            {anomaly.criticality === 'high' && (
                              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-error-500 rounded-full border border-white"></div>
                            )}
                          </div>
                        )}
                        {anomaly.type === 'warning' && (
                          <div className="relative">
                            <AlertTriangle className="h-5 w-5 text-warning-500 mr-3" />
                            {anomaly.criticality === 'high' && (
                              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-warning-500 rounded-full border border-white"></div>
                            )}
                          </div>
                        )}
                        {anomaly.type === 'info' && <FileText className="h-5 w-5 text-info-500 mr-3" />}
                        
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h4 className="text-sm font-medium text-gray-800">{anomaly.description}</h4>
                            {anomaly.criticality === 'high' && (
                              <Badge color="error" variant="soft" size="xs" className="ml-2">Critique</Badge>
                            )}
                          </div>
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-gray-500 mr-3">Compte: {anomaly.account}</span>
                            <span className="text-xs text-gray-500 mr-3">Date: {anomaly.date}</span>
                            <span className="text-xs font-medium text-gray-700">{anomaly.amount.toLocaleString('fr-FR')} €</span>
                            {anomaly.sectorComparison && (
                              <span className={`text-xs ml-2 ${
                                anomaly.sectorComparison.status === 'above' ? 'text-error-600' : 
                                anomaly.sectorComparison.status === 'below' ? 'text-success-600' : 
                                'text-gray-600'
                              }`}>
                                ({anomaly.sectorComparison.status === 'above' ? '+' : ''}
                                {Math.round((anomaly.amount / anomaly.sectorComparison.median - 1) * 100)}% vs secteur)
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          {anomaly.status === 'resolved' ? (
                            <Badge color="success" variant="soft" size="xs">Résolu</Badge>
                          ) : anomaly.status === 'ignored' ? (
                            <Badge color="gray" variant="soft" size="xs">Ignoré</Badge>
                          ) : (
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
            
            {/* Selected Anomaly Details */}
            {selectedAnomaly && (
              <Card size="sm">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-gray-800">Détails de l'anomalie</h3>
                    <div className="flex items-center">
                      {selectedAnomaly.criticality === 'high' && (
                        <Badge color="error" variant="soft" className="mr-2">Critique</Badge>
                      )}
                      {selectedAnomaly.criticality === 'medium' && (
                        <Badge color="warning" variant="soft" className="mr-2">Modérée</Badge>
                      )}
                      {selectedAnomaly.criticality === 'low' && (
                        <Badge color="success" variant="soft" className="mr-2">Faible</Badge>
                      )}
                      {selectedAnomaly.type === 'error' && <Badge color="error" variant="soft">Erreur</Badge>}
                      {selectedAnomaly.type === 'warning' && <Badge color="warning" variant="soft">Alerte</Badge>}
                      {selectedAnomaly.type === 'info' && <Badge color="info" variant="soft">Info</Badge>}
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                    <p className="text-gray-800">{selectedAnomaly.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Informations</h4>
                      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600">Compte</span>
                          <span className="text-xs font-medium">{selectedAnomaly.account}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600">Montant</span>
                          <span className="text-xs font-medium">{selectedAnomaly.amount.toLocaleString('fr-FR')} €</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600">Date</span>
                          <span className="text-xs font-medium">{selectedAnomaly.date}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Suggestion</h4>
                      <div className="bg-primary-50 border border-primary-100 rounded-lg p-3">
                        <p className="text-sm text-gray-700">
                          {selectedAnomaly.suggestion || "Aucune suggestion disponible."}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Comparaison sectorielle */}
                  {selectedAnomaly.sectorComparison && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-700">Comparaison sectorielle</h4>
                        <Badge 
                          color={
                            selectedAnomaly.sectorComparison.status === 'above' ? 'error' : 
                            selectedAnomaly.sectorComparison.status === 'below' ? 'success' : 
                            'info'
                          } 
                          variant="soft"
                          size="sm"
                        >
                          {selectedAnomaly.sectorComparison.percentile}% percentile
                        </Badge>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="mb-3">
                          <div className="flex justify-between mb-1">
                            <span className="text-xs text-gray-500">Valeur</span>
                            <span className="text-xs text-gray-500">Médiane du secteur</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-semibold">{selectedAnomaly.amount.toLocaleString('fr-FR')} €</span>
                            <span className="text-sm font-semibold">{selectedAnomaly.sectorComparison.median.toLocaleString('fr-FR')} €</span>
                          </div>
                        </div>
                        
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
                          <div 
                            className={`h-full rounded-full ${
                              selectedAnomaly.sectorComparison.status === 'above' ? 'bg-error-500' : 
                              selectedAnomaly.sectorComparison.status === 'below' ? 'bg-success-500' : 
                              'bg-info-500'
                            }`}
                            style={{ 
                              width: `${
                                selectedAnomaly.sectorComparison.status === 'above' ? 
                                Math.min(100, selectedAnomaly.sectorComparison.percentile) : 
                                Math.min(100, 100 - selectedAnomaly.sectorComparison.percentile)
                              }%` 
                            }}
                          ></div>
                        </div>
                        
                        <p className="text-xs text-gray-600">
                          {selectedAnomaly.sectorComparison.status === 'above' ? 
                            `Ce montant est ${Math.round((selectedAnomaly.amount / selectedAnomaly.sectorComparison.median - 1) * 100)}% au-dessus de la médiane du secteur pour des comptes similaires.` : 
                            selectedAnomaly.sectorComparison.status === 'below' ? 
                            `Ce montant est ${Math.round((1 - selectedAnomaly.amount / selectedAnomaly.sectorComparison.median) * 100)}% en-dessous de la médiane du secteur pour des comptes similaires.` : 
                            'Ce montant est dans la norme sectorielle pour des comptes similaires.'
                          }
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Proposition d'OD */}
                  {selectedAnomaly.proposedOD && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-700">Opération diverse proposée</h4>
                        <Badge color="primary" variant="soft" size="sm">{selectedAnomaly.proposedOD.id}</Badge>
                      </div>
                      
                      <div className="bg-primary-50 border border-primary-100 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="text-sm font-medium text-gray-800">{selectedAnomaly.proposedOD.description}</div>
                            <div className="text-xs text-gray-500 mt-1">Date proposée: {selectedAnomaly.proposedOD.date}</div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="xs"
                            icon={<Edit size={14} />}
                          >
                            Modifier
                          </Button>
                        </div>
                        
                        <div className="bg-white rounded border border-gray-200 mb-3">
                          <div className="grid grid-cols-12 gap-2 p-2 border-b border-gray-100 bg-gray-50 text-xs font-medium text-gray-600">
                            <div className="col-span-2">Compte</div>
                            <div className="col-span-4">Libellé</div>
                            <div className="col-span-3 text-right">Débit</div>
                            <div className="col-span-3 text-right">Crédit</div>
                          </div>
                          
                          {selectedAnomaly.proposedOD.entries.map((entry, index) => (
                            <div key={index} className="grid grid-cols-12 gap-2 p-2 text-sm">
                              <div className="col-span-2 text-gray-600">{entry.account}</div>
                              <div className="col-span-4 text-gray-800">{entry.label}</div>
                              <div className="col-span-3 text-right text-gray-800">
                                {entry.debit ? entry.debit.toLocaleString('fr-FR') : ''}
                              </div>
                              <div className="col-span-3 text-right text-gray-800">
                                {entry.credit ? entry.credit.toLocaleString('fr-FR') : ''}
                              </div>
                            </div>
                          ))}
                          
                          <div className="grid grid-cols-12 gap-2 p-2 border-t border-gray-100 bg-gray-50 text-sm font-semibold">
                            <div className="col-span-2"></div>
                            <div className="col-span-4 text-right">Total:</div>
                            <div className="col-span-3 text-right">
                              {selectedAnomaly.proposedOD.entries
                                .reduce((sum, entry) => sum + (entry.debit || 0), 0)
                                .toLocaleString('fr-FR')}
                            </div>
                            <div className="col-span-3 text-right">
                              {selectedAnomaly.proposedOD.entries
                                .reduce((sum, entry) => sum + (entry.credit || 0), 0)
                                .toLocaleString('fr-FR')}
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-xs font-medium text-gray-700 mb-1">Justification</div>
                          <p className="text-xs text-gray-600 bg-white p-2 rounded border border-gray-200">
                            {selectedAnomaly.proposedOD.justification}
                          </p>
                        </div>
                        
                        <div className="flex justify-end mt-3">
                          <Button 
                            variant="primary" 
                            size="sm"
                          >
                            Appliquer l'OD
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => updateAnomalyStatus(selectedAnomaly.id, 'ignored')}
                      disabled={selectedAnomaly.status !== 'pending'}
                    >
                      Ignorer
                    </Button>
                    
                    <Button 
                      variant="primary" 
                      size="sm"
                      icon={<CheckCircle size={16} />}
                      onClick={() => updateAnomalyStatus(selectedAnomaly.id, 'resolved')}
                      disabled={selectedAnomaly.status !== 'pending'}
                    >
                      Marquer comme résolu
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 