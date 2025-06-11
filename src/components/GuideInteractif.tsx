import React, { useState, useEffect } from 'react';
import { Book, X, ChevronRight, ChevronLeft, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { usePathname } from 'next/navigation';

// Guide content by page path
const guideContent: Record<string, {
  title: string;
  steps: Array<{
    title: string;
    description: string;
    image?: string;
    highlight?: string;
  }>
}> = {
  '/': {
    title: 'Guide de la page d\'accueil',
    steps: [
      {
        title: 'Bienvenue sur Innovac\'tool',
        description: 'Découvrez notre plateforme agentique pour experts-comptables. Utilisez le menu latéral pour naviguer entre les différents modules.',
        highlight: '.sidebar'
      },
      {
        title: 'Parcours de démonstration',
        description: 'Suivez le parcours guidé pour explorer toutes les fonctionnalités dans un ordre logique.',
        highlight: '.module-navigation'
      },
      {
        title: 'Sélection de client',
        description: 'Choisissez un client dans le sélecteur en haut à droite pour personnaliser l\'expérience.',
        highlight: '.client-selector'
      }
    ]
  },
  '/modules/pilotview': {
    title: 'Guide du Tableau de Bord',
    steps: [
      {
        title: 'Gestion des clients',
        description: 'Parcourez et sélectionnez vos clients pour visualiser leurs informations détaillées et KPIs.',
        highlight: '.client-list'
      },
      {
        title: 'Vue d\'ensemble',
        description: 'Consultez les KPIs essentiels et leurs comparaisons sectorielles sur une interface unifiée.',
        highlight: '.dashboard-overview'
      },
      {
        title: 'Comparaisons sectorielles',
        description: 'Visualisez comment les performances du client se situent par rapport aux moyennes du secteur.',
        highlight: '.sector-comparison'
      },
      {
        title: 'Analyse temporelle',
        description: 'Suivez l\'évolution des indicateurs clés dans le temps grâce aux graphiques interactifs.',
        highlight: '.timeline-charts'
      }
    ]
  },
  '/modules/cpa-copilot': {
    title: 'Guide de l\'Assistant Conseil',
    steps: [
      {
        title: 'Conversation sécurisée',
        description: 'Posez vos questions à l\'IA. L\'agent Safe Advisor garantit des réponses conformes aux règles déontologiques.',
        highlight: '.chat-container'
      },
      {
        title: 'Choix des agents',
        description: 'Sélectionnez l\'agent spécialisé selon votre besoin : conseil général ou statistiques sectorielles.',
        highlight: '.agent-selector'
      },
      {
        title: 'Exemples de questions',
        description: 'Utilisez les exemples suggérés pour découvrir les capacités de l\'assistant.',
        highlight: '.question-suggestions'
      }
    ]
  },
  '/modules/forecaster': {
    title: 'Guide du Prévisionniste',
    steps: [
      {
        title: 'Formuler une hypothèse',
        description: 'Saisissez une hypothèse business pour voir son impact potentiel sur les finances de l\'entreprise.',
        highlight: '.hypothesis-input'
      },
      {
        title: 'Scénarios comparatifs',
        description: 'Analysez les projections optimistes, neutres et pessimistes générées par l\'IA.',
        highlight: '.scenarios-container'
      },
      {
        title: 'Facteurs d\'influence',
        description: 'Consultez les facteurs externes et internes qui influencent les projections.',
        highlight: '.factors-section'
      }
    ]
  },
  '/modules/reviewmaster-ai': {
    title: 'Guide de l\'Agent de Révision',
    steps: [
      {
        title: 'Détection d\'anomalies',
        description: 'Visualisez les écarts et anomalies détectés automatiquement dans les comptes du client.',
        highlight: '.anomaly-section'
      },
      {
        title: 'Suggestions de corrections',
        description: 'Consultez et appliquez les corrections suggérées par l\'IA pour régulariser les écritures.',
        highlight: '.correction-proposals'
      },
      {
        title: 'Missions recommandées',
        description: 'Découvrez les missions de conseil suggérées en fonction des anomalies détectées.',
        highlight: '.mission-recommendations'
      }
    ]
  },
  '/modules/data-guardian': {
    title: 'Guide du Protecteur de Données',
    steps: [
      {
        title: 'Données sécurisées',
        description: 'Cette interface permet de partager des données de façon anonymisée et conforme au RGPD.',
        highlight: '.data-protection'
      },
      {
        title: 'Configuration de l\'anonymisation',
        description: 'Personnalisez les règles d\'anonymisation selon vos besoins spécifiques.',
        highlight: '.anonymization-settings'
      },
      {
        title: 'Validation et partage',
        description: 'Vérifiez l\'aperçu des données anonymisées avant de les partager en toute sécurité.',
        highlight: '.sharing-section'
      }
    ]
  }
};

interface GuideInteractifProps {
  isVisible: boolean;
  onClose: () => void;
}

export function GuideButton() {
  const [showGuide, setShowGuide] = useState(false);
  
  return (
    <>
      <button 
        className="fixed bottom-4 right-4 bg-primary-500 text-white rounded-full p-3 shadow-lg hover:bg-primary-600 transition-colors z-30"
        onClick={() => setShowGuide(true)}
        title="Guide interactif"
      >
        <HelpCircle size={20} />
      </button>
      
      <AnimatePresence>
        {showGuide && (
          <GuideInteractif isVisible={showGuide} onClose={() => setShowGuide(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

export function GuideInteractif({ isVisible, onClose }: GuideInteractifProps) {
  const pathname = usePathname();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  // Get guide content for current path or default to home guide
  const guide = guideContent[pathname] || guideContent['/'];
  const currentStep = guide.steps[currentStepIndex];
  
  useEffect(() => {
    // Reset step index when path changes
    setCurrentStepIndex(0);
  }, [pathname]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      }
    };

    if (isVisible) {
      window.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible, currentStepIndex, guide.steps.length]);

  const handleNext = () => {
    if (currentStepIndex < guide.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white rounded-lg overflow-hidden shadow-xl w-full max-w-md mx-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* Header */}
        <div className="bg-primary-500 text-white px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Book size={18} className="mr-2" />
            <h3 className="font-semibold">{guide.title}</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <div className="mb-4">
            <h4 className="font-medium text-lg mb-2">{currentStep.title}</h4>
            <p className="text-gray-600">{currentStep.description}</p>
          </div>
          
          {currentStep.image && (
            <div className="mb-4 border border-gray-200 rounded overflow-hidden">
              <img src={currentStep.image} alt={currentStep.title} className="w-full" />
            </div>
          )}
          
          {/* Progress dots */}
          <div className="flex justify-center space-x-1 my-4">
            {guide.steps.map((_, index) => (
              <div 
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStepIndex ? 'bg-primary-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Footer with navigation */}
        <div className="border-t border-gray-200 px-4 py-3 flex justify-between">
          <Button 
            variant="text" 
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
            className={currentStepIndex === 0 ? "opacity-50 cursor-not-allowed" : ""}
          >
            <ChevronLeft size={16} className="mr-1" />
            Précédent
          </Button>
          
          <Button 
            variant="primary" 
            onClick={handleNext}
          >
            {currentStepIndex < guide.steps.length - 1 ? "Suivant" : "Terminer"}
            {currentStepIndex < guide.steps.length - 1 && (
              <ChevronRight size={16} className="ml-1" />
            )}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
} 