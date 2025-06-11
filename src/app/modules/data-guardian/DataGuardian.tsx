"use client";

import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { motion, AnimatePresence } from 'framer-motion';
import { FecUploader } from './FecUploader';
import { FecTable } from './FecTable';
import { FecTableAnon } from './FecTableAnon';
import { DataForge } from './DataForge';
import { RgpdPreviewModal } from './RgpdPreviewModal';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Download, FileText, Shield, Info, AlertCircle, Eye, Lock, List, CheckCircle2, Database, Check, Upload } from 'lucide-react';
import { AnimatedCard, cardTransition, errorTransition } from '@/components/ModuleAnimations';
import { 
  detectSensitiveColumns, 
  anonymizeData, 
  computeRgpdScore,
  exportToCsv,
  generateReport,
  explainRgpdScore
} from './utils';

export function DataGuardian() {
  const [fecRaw, setFecRaw] = useState<any[] | null>(null);
  const [fecAnonymized, setFecAnonymized] = useState<any[] | null>(null);
  const [sensitiveColumns, setSensitiveColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRgpdPreview, setShowRgpdPreview] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [scoreExplanation, setScoreExplanation] = useState<string>('');
  const [exportInProgress, setExportInProgress] = useState(false);
  const [currentTechnique, setCurrentTechnique] = useState<string>('');
  const [warehouseSending, setWarehouseSending] = useState(false);
  const [warehouseComplete, setWarehouseComplete] = useState(false);
  const [warehouseMessage, setWarehouseMessage] = useState('');
  const [contributionCount, setContributionCount] = useState(0);
  const [showContributionBadge, setShowContributionBadge] = useState(false);
  
  // Définir les étapes du processus
  const steps = [
    { label: "Chargement du fichier", description: "Téléversement du FEC" },
    { label: "Analyse des données", description: "Détection des informations sensibles" },
    { label: "Anonymisation", description: "Traitement des données personnelles" },
    { label: "Validation RGPD", description: "Vérification de la conformité" }
  ];
  
  const handleUpload = (file: File) => {
    try {
      setLoading(true);
      setError(null);
      setCurrentStep(1);
      setProcessingStage("Téléversement du fichier en cours...");
      
      setTimeout(() => {
        setProcessingStage("Analyse du format FEC...");
        
        Papa.parse(file, {
          header: true,
          complete: (results) => {
            if (results.data && Array.isArray(results.data) && results.data.length > 0 && results.data[0] && Object.keys(results.data[0]).length > 0) {
              setFecRaw(results.data);
              setFileName(file.name);
              
              // Detect sensitive columns
              setProcessingStage("Détection des données sensibles...");
              setTimeout(() => {
                const detected = detectSensitiveColumns(results.data);
                setSensitiveColumns(detected);
                
                setCurrentStep(2);
                setLoading(false);
                setIsComplete(false);
                setWarehouseComplete(false);
              }, 800);
            } else {
              setError("Le fichier semble vide ou mal formaté. Veuillez vérifier votre FEC et réessayer.");
              setLoading(false);
              setCurrentStep(0);
            }
          },
          error: (error) => {
            setError(`Erreur lors de l'analyse du fichier: ${error.message}`);
            setLoading(false);
            setCurrentStep(0);
          }
        });
      }, 1000);
    } catch (err) {
      setError("Erreur lors du traitement du fichier. Vérifiez le format et réessayez.");
      setLoading(false);
      setCurrentStep(0);
    }
  };
  
  const handleProcessData = async () => {
    try {
      if (!fecRaw || fecRaw.length === 0 || !fecRaw[0]) {
        setError("Aucune donnée à traiter. Veuillez charger un fichier FEC valide.");
        return;
      }
      
      setLoading(true);
      setCurrentStep(3);
      setProcessingStage("Anonymisation des données en cours...");
      
      // Affichage des techniques d'anonymisation
      setCurrentTechnique("K-anonymat");
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setProcessingStage("Application des algorithmes de masquage...");
      setCurrentTechnique("L-diversité");
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProcessingStage("Application des techniques de généralisation...");
      setCurrentTechnique("Differential Privacy");
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Apply anonymization
      const anonymized = anonymizeData(fecRaw, sensitiveColumns);
      setFecAnonymized(anonymized);
      
      setProcessingStage("Calcul du score de conformité RGPD...");
      setCurrentTechnique("");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Calculate RGPD score
      const rgpdScore = computeRgpdScore(fecRaw, sensitiveColumns, anonymized);
      setScore(rgpdScore);
      
      setCurrentStep(4);
      setIsComplete(true);
      setLoading(false);
    } catch (err) {
      setError("Une erreur est survenue lors de l'anonymisation.");
      setLoading(false);
      setCurrentStep(2);
    }
  };
  
  const handleExport = () => {
    if (fecAnonymized) {
      exportToCsv(fecAnonymized, `${fileName.replace('.csv', '')}_anonymized.csv`);
    }
  };
  
  const handleExportReport = () => {
    if (fecAnonymized && fecRaw) {
      setExportInProgress(true);
      setTimeout(() => {
        generateReport(fecRaw, sensitiveColumns, score);
        setExportInProgress(false);
      }, 1500);
    }
  };
  
  const handleSendToWarehouse = async () => {
    if (!fecAnonymized || warehouseSending) return;
    
    setWarehouseSending(true);
    setWarehouseMessage("Initialisation de la connexion au data warehouse...");
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    setWarehouseMessage("Préparation des données anonymisées...");
    
    await new Promise(resolve => setTimeout(resolve, 1200));
    setWarehouseMessage("Envoi des données vers le data warehouse central...");
    
    await new Promise(resolve => setTimeout(resolve, 1800));
    setWarehouseMessage("Vérification de l'intégrité des données...");
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    setWarehouseMessage("Validation des métadonnées RGPD...");
    
    await new Promise(resolve => setTimeout(resolve, 800));
    setWarehouseComplete(true);
    setWarehouseMessage("Transfert terminé avec succès !");
    
    // Incrémenter le compteur de contributions et afficher le badge
    setContributionCount(prev => prev + 1);
    setShowContributionBadge(true);
    
    // Cacher le badge après 5 secondes
    setTimeout(() => {
      setWarehouseSending(false);
    }, 3000);
  };
  
  const getScoreColor = () => {
    if (score > 90) return 'success';
    if (score > 70) return 'info';
    if (score > 50) return 'warning';
    return 'error';
  };

  // Mise à jour pour calculer et afficher l'explication du score
  useEffect(() => {
    if (score > 0 && sensitiveColumns.length > 0) {
      setScoreExplanation(explainRgpdScore(score, sensitiveColumns));
    }
  }, [score, sensitiveColumns]);

  return (
    <>
      {/* Header avec badge de contribution */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="relative flex items-center">
            <Database className="h-5 w-5 text-primary-600 mr-1.5" />
            <span className="font-medium text-sm">Data Warehouse</span>
            
            <AnimatePresence>
              {showContributionBadge && (
                <motion.div 
                  initial={{ scale: 0, x: -10 }}
                  animate={{ scale: 1, x: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 10 
                  }}
                  className="absolute -right-5 -top-2"
                >
                  <div className="flex items-center justify-center bg-success-500 text-white text-xs font-bold rounded-full h-5 w-5">
                    +1
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <div className="flex items-center">
          <Badge color="primary" variant="soft" size="sm">
            <Database className="h-3 w-3 mr-1" />
            <span>Contributions: {contributionCount}</span>
          </Badge>
        </div>
      </div>
      
      {/* Indicateur de progression global */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <h2 className="text-sm font-medium text-gray-700">Progression du traitement</h2>
          <span className="text-xs text-gray-500">{currentStep > 0 ? `${currentStep}/${steps.length}` : '0/4'}</span>
        </div>
        <div className="bg-gray-100 h-2 rounded-full w-full overflow-hidden">
          <motion.div 
            className="bg-primary-500 h-full rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentStep / steps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between mt-2">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`flex-1 text-center ${index < currentStep ? 'text-primary-600' : 'text-gray-400'}`}
            >
              <div className="relative">
                <div 
                  className={`w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center 
                  ${index < currentStep ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'}`}
                >
                  {index < currentStep ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-medium">{index + 1}</span>
                  )}
                </div>
                <div className="text-xs font-medium">{step.label}</div>
                <div className="text-[10px] text-gray-500">{step.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <AnimatePresence>
        {error && (
          <motion.div 
            className="mb-4 p-2.5 bg-error-50 border border-error-200 text-error-700 rounded-xl flex items-start"
            variants={errorTransition}
            initial="hidden"
            animate="visible"
            exit="exit"
            key="error-message"
          >
            <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatedCard className="mb-5">
        <FecUploader onUpload={handleUpload} />
      </AnimatedCard>

      {/* Affichage des informations RGPD et des contrôles d'export en haut */}
      {isComplete && (
        <div className="space-y-5 mb-6">
          <div className="flex flex-wrap gap-4">
            {/* Score RGPD */}
            <AnimatedCard className="flex-1 min-w-[320px]">
              <Card size="sm" className="h-full">
                <div className="p-4">
                  <h3 className="text-sm font-medium mb-3">Score de conformité RGPD</h3>
                  <div className="flex items-center mb-3">
                    <div className={`h-14 w-14 flex items-center justify-center rounded-full text-lg font-bold text-white bg-${getScoreColor()}-500 mr-3`}>
                      {score}%
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full bg-${getScoreColor()}-500`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-500">Minimum requis: 85%</span>
                        <span className="text-xs text-gray-500">100%</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Explication du score */}
                  <div className={`p-3 rounded-lg bg-${getScoreColor()}-50 text-${getScoreColor()}-800 text-sm mb-2`}>
                    {scoreExplanation}
                  </div>
                </div>
              </Card>
            </AnimatedCard>
            
            {/* Export controls */}
            <AnimatedCard className="flex-1 min-w-[320px]">
              <Card size="sm" className="h-full">
                <div className="p-4">
                  <h3 className="text-sm font-medium mb-4">Exports disponibles</h3>
                  <div className="flex flex-col space-y-3">
                    <Button 
                      onClick={handleExport}
                      disabled={!isComplete || !fecAnonymized}
                      size="sm"
                      variant="outline"
                      icon={<Download size={16} />}
                    >
                      Exporter FEC anonymisé
                    </Button>
                    
                    <Button 
                      onClick={handleExportReport}
                      disabled={!isComplete || !fecAnonymized}
                      size="sm"
                      variant="outline"
                      icon={<FileText size={16} />}
                      className="relative"
                    >
                      {exportInProgress ? (
                        <>
                          <span className="opacity-0">Exporter rapport RGPD</span>
                          <span className="absolute inset-0 flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                          </span>
                        </>
                      ) : (
                        'Exporter rapport RGPD'
                      )}
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setShowRgpdPreview(true)}
                      icon={<Eye size={16} />}
                    >
                      Aperçu du rapport
                    </Button>
                  </div>
                </div>
              </Card>
            </AnimatedCard>
          </div>
        </div>
      )}

      {/* Affichage des tableaux côte à côte quand données disponibles */}
      {fecRaw && fecRaw.length > 0 && fecRaw[0] && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Tableau des données originales */}
            <AnimatedCard>
              <Card 
                title="Aperçu des données originales" 
                icon={<FileText className="w-4 h-4 text-primary-500" />}
                size="sm"
                className="h-full"
              >
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <Badge color="secondary" variant="soft" size="xs">
                      Données sensibles détectées: {sensitiveColumns.length}
                    </Badge>
                  </div>
                  
                  {!isComplete && (
                    <Button 
                      size="xs" 
                      variant="outline"
                      onClick={handleProcessData}
                      disabled={loading}
                    >
                      <Shield className="w-3.5 h-3.5 mr-1.5" />
                      Anonymiser les données
                    </Button>
                  )}
                </div>
                
                <FecTable 
                  data={fecRaw.slice(0, 50)} 
                  sensitiveColumns={sensitiveColumns} 
                />
              </Card>
            </AnimatedCard>
            
            {/* Tableau des données anonymisées ou forge de données en cours */}
            <AnimatedCard>
              {loading ? (
                <DataForge 
                  currentStep={2} 
                  processingStage={processingStage} 
                  currentTechnique={currentTechnique}
                />
              ) : isComplete ? (
                <Card 
                  title="Données anonymisées" 
                  icon={<Lock className="w-4 h-4 text-primary-500" />}
                  size="sm"
                  className="h-full"
                >
                  <div className="flex justify-between items-center mb-3">
                    <Badge color="success" variant="soft" size="xs">
                      Protection RGPD active
                    </Badge>
                  </div>
                  
                  <FecTableAnon 
                    data={fecAnonymized ? fecAnonymized.slice(0, 50) : []} 
                    sensitiveColumns={sensitiveColumns}
                  />
                </Card>
              ) : (
                <Card 
                  title="Anonymisation en attente" 
                  icon={<Shield className="w-4 h-4 text-gray-400" />}
                  size="sm"
                  className="h-full flex items-center justify-center"
                >
                  <div className="text-center p-8">
                    <div className="text-gray-500 mb-3">
                      Cliquez sur "Anonymiser les données" pour lancer le traitement
                    </div>
                    <Button 
                      size="sm" 
                      onClick={handleProcessData}
                      disabled={loading}
                    >
                      <Shield className="w-4 h-4 mr-1.5" />
                      Anonymiser les données
                    </Button>
                  </div>
                </Card>
              )}
            </AnimatedCard>
          </div>
          
          {/* Bouton d'envoi vers le data warehouse */}
          {isComplete && !warehouseComplete && (
            <AnimatedCard>
              <Card size="sm" className="border-2 border-primary-100">
                <div className="p-5 flex flex-col items-center">
                  <h3 className="text-base font-medium text-center mb-3">
                    Contribuez à l'amélioration des données collectives
                  </h3>
                  <p className="text-sm text-gray-600 text-center mb-4">
                    En partageant vos données anonymisées avec notre data warehouse central, vous aidez à enrichir les modèles d'IA et les analyses sectorielles.
                  </p>
                  
                  <Button
                    onClick={handleSendToWarehouse}
                    disabled={warehouseSending}
                    size="lg"
                    variant="primary"
                    className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 w-full max-w-md"
                  >
                    <Database className="h-5 w-5 mr-1.5" />
                    Envoyer vers le Data Warehouse
                  </Button>
                </div>
              </Card>
            </AnimatedCard>
          )}
          
          {/* Affichage du traitement de l'envoi */}
          {warehouseSending && (
            <AnimatedCard>
              <Card size="sm">
                <div className="p-4">
                  <h3 className="text-sm font-medium mb-3 flex items-center">
                    <Database className="h-4 w-4 text-primary-500 mr-1.5" />
                    Envoi vers le Data Warehouse
                  </h3>
                  
                  <div className="mb-3">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      {!warehouseComplete ? (
                        <motion.div
                          className="h-full bg-primary-500 rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ 
                            width: warehouseComplete ? "100%" : ["20%", "45%", "65%", "85%", "95%"],
                          }}
                          transition={{
                            duration: 4,
                            ease: "easeInOut",
                            times: [0, 0.2, 0.4, 0.6, 0.8]
                          }}
                        />
                      ) : (
                        <div className="h-full bg-success-500 rounded-full w-full" />
                      )}
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    {warehouseComplete ? (
                      <motion.div 
                        className="flex items-start text-success-600 bg-success-50 p-3 rounded-lg"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Transfert réussi !</p>
                          <p className="text-xs mt-1">Merci pour votre contribution ! Vos données enrichissent désormais notre data warehouse collectif et aideront à améliorer les analyses du secteur.</p>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="flex items-center text-primary-600">
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-primary-500 border-t-transparent rounded-full"></div>
                        <span>{warehouseMessage}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </AnimatedCard>
          )}
        </div>
      )}
      
      {showRgpdPreview && (
        <RgpdPreviewModal 
          isOpen={showRgpdPreview}
          onClose={() => setShowRgpdPreview(false)} 
          filename={fileName}
          score={score}
          sensitiveColumnsCount={sensitiveColumns.length}
          originalRowCount={fecRaw?.length || 0}
          anonymizedRowCount={fecAnonymized?.length || 0}
        />
      )}
    </>
  );
} 