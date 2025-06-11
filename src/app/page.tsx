"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  Shield, 
  PieChart, 
  MessageSquare, 
  Search, 
  Users,
  TrendingUp,
  ArrowRight,
  ChevronRight,
  BookOpen,
  ExternalLink,
  Presentation
} from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { NetworkDecoration, NetworkElement } from '@/components/NetworkElements';
import { NetworkBackground } from '@/components/NetworkBackground';
import { DecorativeIllustration, IllustrationGrid, RandomIllustrations } from '@/components/DecorativeIllustration';
import { BrandDecoration } from '@/components/BrandDecoration';
import { motion } from '@/components/AnimatedImports';
import { ModuleNavigation } from '@/components/ModuleNavigation';
import { InfoTooltip } from '@/components/Tooltip';
import { PresentationSlider } from '@/components/PresentationSlider';

export default function Home() {
  const [showDocumentation, setShowDocumentation] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [showPresentation, setShowPresentation] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Implement progressive loading for components
  useEffect(() => {
    // Simulate progressive loading with reduced time (300ms instead of 500ms)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  const modules = [
    { 
      title: 'Protecteur de données', 
      description: 'Anonymisez vos FEC pour un partage conforme au RGPD en toute sécurité.', 
      icon: <Shield className="w-5 h-5 text-primary-500" />,
      href: '/modules/data-guardian',
      isReady: true,
      color: 'primary',
      elementType: 'circle',
      illustration: '24',
      tooltip: 'Anonymisation des données client et conformité RGPD'
    },
    { 
      title: 'Tableau de bord', 
      description: 'Gestion des clients et tableaux de bord financiers avec indicateurs prédictifs.', 
      icon: <PieChart className="w-5 h-5 text-primary-500" />,
      href: '/modules/pilotview',
      isReady: true,
      color: 'primary',
      elementType: 'connection',
      illustration: '15',
      tooltip: 'Gestion clients et indicateurs financiers'
    },
    { 
      title: 'Assistant Conseil', 
      description: 'Assistant IA pour répondre aux questions et automatiser les tâches comptables.', 
      icon: <MessageSquare className="w-5 h-5 text-primary-500" />,
      href: '/modules/cpa-copilot',
      isReady: true,
      color: 'primary',
      elementType: 'node',
      illustration: '18',
      tooltip: 'Dialogue avec des agents IA spécialisés'
    },
    { 
      title: 'Agent de révision', 
      description: "Détection d'anomalies et proposition d'écritures correctives.", 
      icon: <Search className="w-5 h-5 text-primary-500" />,
      href: '/modules/reviewmaster-ai',
      isReady: true,
      color: 'primary',
      elementType: 'node',
      illustration: '02',
      tooltip: 'Révision automatisée des comptes avec IA'
    },
    { 
      title: 'Prévisionniste', 
      description: 'Simulez et anticipez les trajectoires financières de vos clients.', 
      icon: <TrendingUp className="w-5 h-5 text-primary-500" />,
      href: '/modules/forecaster',
      isReady: true,
      color: 'secondary',
      elementType: 'wave',
      illustration: '05',
      tooltip: 'Projection IA de scénarios financiers'
    },
  ];

  return (
    <div className="w-full">
      {/* Fond avec éléments subtils */}
      <NetworkBackground color="mixed" density="low" />
      
      {/* Modale de démonstration */}
      {showDemo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={() => setShowDemo(false)}>
          <div className="bg-white w-full max-w-4xl rounded-lg shadow-xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-primary-500 text-white px-6 py-4 flex justify-between items-center">
              <div className="flex items-center">
                <Presentation className="mr-2" />
                <h3 className="font-semibold text-lg">Démonstration Innovac'tool</h3>
              </div>
              <button onClick={() => setShowDemo(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <h4 className="font-medium text-lg mb-4">Parcours de démonstration</h4>
              <p className="mb-4">
                Suivez le parcours guidé pour découvrir toutes les fonctionnalités d'Innovac'tool
                et comprendre comment cette plateforme peut transformer votre pratique de l'expertise comptable.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h5 className="font-medium text-md mb-2">Comment utiliser cette démo :</h5>
                <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-600">
                  <li>Sélectionnez un client dans le sélecteur en haut à gauche</li>
                  <li>Parcourez les modules dans l'ordre proposé</li>
                  <li>Dans chaque module, les données réelles et simulées sont identifiées clairement</li>
                  <li>Utilisez les fonctionnalités interactives pour explorer les capacités de l'outil</li>
                </ol>
              </div>
              
              <h5 className="font-medium text-md mt-6 mb-2">Modules à explorer</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {modules.map((module, index) => (
                  <div key={module.title} className="flex items-start p-3 border border-gray-100 rounded-lg">
                    <div className="bg-primary-50 p-2 rounded-lg mr-3">
                      {module.icon}
                    </div>
                    <div>
                      <h6 className="font-medium text-sm">{module.title}</h6>
                      <p className="text-xs text-gray-600">{module.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end mt-4">
                <Button onClick={() => setShowDemo(false)}>
                  Fermer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Presentation Slider component */}
      <PresentationSlider isOpen={showPresentation} onClose={() => setShowPresentation(false)} />
      
      {/* Documentation modal - keeping this for reference but it won't be used */}
      {showDocumentation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={() => setShowDocumentation(false)}>
          <div className="bg-white w-full max-w-4xl rounded-lg shadow-xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-primary-500 text-white px-6 py-4 flex justify-between items-center">
              <div className="flex items-center">
                <BookOpen className="mr-2" />
                <h3 className="font-semibold text-lg">Présentation Innovac'tool</h3>
              </div>
              <button onClick={() => setShowDocumentation(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <h4 className="font-medium text-lg mb-4">Présentation de la plateforme</h4>
              <p className="mb-4">
                Innovac'tool est une plateforme basée sur l'IA agentique, conçue pour transformer l'expertise comptable. 
                Voici une présentation des principaux modules et de leur fonctionnement.
              </p>
              
              <h5 className="font-medium text-md mt-6 mb-2">Concept de Data Warehouse mutualisé</h5>
              <p className="mb-4">
                La plateforme repose sur l'utilisation d'un Data Warehouse mutualisé, permettant aux cabinets d'expertise comptable
                de bénéficier de la puissance des données agrégées et anonymisées de multiples clients et secteurs.
              </p>
              
              <h5 className="font-medium text-md mt-6 mb-2">Architecture des agents IA</h5>
              <p className="mb-4">
                Le système utilise une architecture multi-agents spécialisés qui collaborent pour répondre aux besoins 
                spécifiques des experts-comptables :
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-2">
                <li><span className="font-medium">SafeAdvisorAgent</span> : Garantit des réponses conformes aux règles déontologiques</li>
                <li><span className="font-medium">WarehouseQueryAgent</span> : Analyse les données du DW pour extraire des statistiques pertinentes</li>
                <li><span className="font-medium">ForecastAgent</span> : Génère des projections financières basées sur différentes hypothèses</li>
                <li><span className="font-medium">ReviewAgent</span> : Détecte les anomalies et propose des corrections</li>
              </ul>
              
              <h5 className="font-medium text-md mt-6 mb-2">Sources de données</h5>
              <p className="mb-4">
                La plateforme s'appuie sur diverses sources de données :
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-2">
                <li>APIs officielles (SIRENE, INPI)</li>
                <li>Perplexity API pour les actualités contextualisées</li>
                <li>Data Warehouse interne pour les comparaisons sectorielles</li>
                <li>Données comptables anonymisées pour l'entraînement des modèles</li>
              </ul>
              
              <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-600">
                  Pour plus d'informations, contactez Louis Cléon : louis@cleon.app
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Contenu principal avec défilement - aligné comme les autres pages */}
      <main className="w-full">
        <div className="max-w-7xl mx-auto py-4">
          {/* Hero section améliorée */}
          <div className="mb-12 relative py-4">
            <div className="flex flex-col md:flex-row items-center gap-10">
              {/* Contenu textuel */}
              <div className="flex-1 relative z-10">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col space-y-4 mb-6"
                >
                  <h1 className="text-4xl md:text-5xl text-gray-900 font-bold tracking-tight leading-tight">
                    Transformez votre cabinet avec <span className="text-primary-500">Innovac'tool</span>
                  </h1>
                  <p className="text-xl text-gray-600">
                    Le pouvoir des données comptables combiné à l'intelligence artificielle pour accompagner l'expert-comptable au quotidien
                  </p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex flex-wrap gap-4 mb-6"
                >
                  <Button 
                    size="md" 
                    className="shadow-sm"
                    onClick={() => setShowDemo(true)}
                  >
                    <Presentation className="w-4 h-4 mr-2" />
                    Démonstration
                  </Button>
                  <Button 
                    size="md" 
                    variant="outline"
                    onClick={() => setShowPresentation(true)}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Présentation
                  </Button>
                </motion.div>
              </div>
              
              {/* Section visuelle avec logo et illustrations */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="flex-1 flex justify-center items-center relative"
              >
                <div className="relative w-full h-60 flex items-center justify-center">
                  {/* Logo central avec zone de sécurité */}
                  <div className="absolute z-10 bg-white/0 w-40 h-40 rounded-full flex items-center justify-center">
                    <BrandDecoration type="logo" size="lg" />
                  </div>
                  
                  {/* Illustrations décoratives avec positions éloignées du logo */}
                  <div className="absolute top-0 right-5">
                    <DecorativeIllustration name="05" size="sm" fullColor effect="float" />
                  </div>
                  <div className="absolute bottom-0 left-5">
                    <DecorativeIllustration name="19" size="sm" fullColor effect="pulse" />
                  </div>
                  <div className="absolute bottom-5 right-5">
                    <DecorativeIllustration name="11" size="sm" fullColor effect="float" />
                  </div>
                  <div className="absolute top-5 left-5">
                    <DecorativeIllustration name="25" size="sm" fullColor effect="pulse" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Modules section avec illustrations colorées */}
          <div className="mb-16 relative">
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold text-gray-800 mb-6 flex items-center"
            >
              <DecorativeIllustration name="17" size="xs" fullColor className="inline-block mr-2" />
              <span>Modules disponibles</span>
              <InfoTooltip
                text="Tous les modules sont interconnectés et s'appuient sur le Data Warehouse mutualisé"
                position="right"
                width="md"
              />
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module, i) => (
                <motion.div
                  key={module.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <Link 
                    href={module.href}
                    className="block group"
                  >
                    <Card 
                      isHoverable={true}
                      className="h-full flex flex-col overflow-hidden relative"
                      size="sm"
                    >
                      {/* Élément de réseau subtil */}
                      <NetworkElement
                        type={module.elementType as any}
                        color={module.color as any} 
                        size="sm"
                        position="bottom-right"
                        opacity={0.04}
                        rotate={i * 20}
                        isAnimated={true}
                      />
                      
                      <div className="flex items-start z-10">
                        <div className={`p-1.5 rounded-lg mr-3 bg-${module.color}-50`}>
                          {module.icon}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="text-base font-semibold text-gray-900">{module.title}</h3>
                            <InfoTooltip 
                              text={module.tooltip}
                              position="top"
                            />
                            
                            {module.isReady ? (
                              <Badge 
                                variant="dot" 
                                color="success" 
                                size="xs"
                                className="ml-1.5"
                              >
                                Disponible
                              </Badge>
                            ) : (
                              <Badge 
                                variant="dot" 
                                color="gray" 
                                size="xs"
                                className="ml-1.5"
                              >
                                Bientôt
                              </Badge>
                            )}
                          </div>
                          
                          <p className="mt-1 text-xs text-gray-500">{module.description}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex justify-between items-center pt-2 border-t border-gray-100">
                        <span className={`inline-flex items-center text-xs font-medium ${module.isReady ? 'text-primary-600' : 'text-gray-500'} group-hover:underline`}>
                          {module.isReady ? 'Accéder' : 'En savoir plus'}
                          <ChevronRight className="ml-1 w-3 h-3" />
                        </span>
                        
                        {/* Illustration colorée en petit */}
                        <div className="w-8 h-8 opacity-80 group-hover:opacity-100 transition-opacity">
                          <DecorativeIllustration name={module.illustration} size="xs" fullColor />
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Section de caractéristiques avec illustrations */}
          <div className="mb-16 relative overflow-hidden rounded-xl bg-surface-50 p-6">
            <NetworkElement type="connection" size="lg" position="top-right" opacity={0.04} isAnimated />
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* Grid d'illustrations à gauche */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="md:w-1/3 flex items-center justify-center"
              >
                <IllustrationGrid 
                  illustrations={['07', '21', '13', '17']} 
                  size="md"
                  fullColor
                  gap={4}
                  className="max-w-xs"
                />
              </motion.div>
              
              {/* Contenu à droite */}
              <div className="md:w-2/3">
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-2xl font-bold text-gray-800 mb-6 flex items-center"
                >
                  <DecorativeIllustration name="23" size="xs" fullColor className="inline-block mr-2" />
                  <span>L'expertise comptable augmentée</span>
                  <InfoTooltip
                    text="Notre approche augmente les capacités de l'expert-comptable en automatisant les tâches répétitives et en fournissant des analyses avancées"
                    position="bottom"
                    width="md"
                  />
                </motion.h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      title: "Centralisation et exploitation des données comptables",
                      desc: "Un data warehouse mutualisé pour transformer les FEC en ressource stratégique et construire une base solide pour l'IA.",
                      num: 1,
                      illus: "08",
                      tooltip: "Transformez vos données comptables en source de valeur stratégique"
                    },
                    {
                      title: "Agentisation des tâches à faible valeur ajoutée",
                      desc: "Des agents intelligents orchestrés par AG2 qui analysent, suggèrent, anticipent et délèguent des missions selon les besoins réels du client.",
                      num: 2,
                      illus: "14",
                      tooltip: "Des agents IA spécialisés travaillent ensemble pour automatiser les tâches répétitives"
                    },
                    {
                      title: "Personnalisation augmentée du conseil",
                      desc: "Grâce à la donnée sectorielle et à l'IA, chaque entreprise reçoit un accompagnement contextuel, prédictif, pertinent.",
                      num: 3,
                      illus: "22",
                      tooltip: "Conseil sur mesure basé sur l'analyse des données sectorielles et spécifiques à chaque client"
                    },
                    {
                      title: "Expérience fluide et transparente",
                      desc: "Une interface claire, intuitive et visuelle qui met la puissance de l'IA à portée des experts-comptables, sans rupture de leur quotidien.",
                      num: 4,
                      illus: "16",
                      tooltip: "Une interface utilisateur conçue pour s'intégrer parfaitement dans le quotidien de l'expert-comptable"
                    }
                  ].map((feature, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 + 0.2 }}
                      className="flex"
                    >
                      <div className="mr-3 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-primary-600 font-semibold text-sm">{feature.num}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-semibold text-gray-900 mb-1 text-sm">{feature.title}</h3>
                          <div className="w-5 h-5 ml-2">
                            <DecorativeIllustration name={feature.illus} size="xs" fullColor />
                          </div>
                        </div>
                        <p className="text-gray-600 text-xs">{feature.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer section */}
          <footer className="mt-auto pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <BrandDecoration type="icon" size="xs" className="mr-2" />
                <span>Innovac'tool | Démonstration soutenance DEC</span>
              </div>
              <div className="flex items-center">
                <div className="flex items-center mr-4">
                  <span className="mr-1">Louis Cléon</span>
                  <span className="text-secondary-500">|</span>
                  <span className="ml-1">20 mai 2025</span>
                </div>
                <NetworkElement type="node" size="xs" opacity={0.3} className="mr-2 static" />
                <span>Cabinet augmenté</span>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
