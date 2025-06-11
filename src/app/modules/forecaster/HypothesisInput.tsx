'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Info, AlertTriangle, TrendingUp, LineChart, FileText, Search, BarChart4, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tooltip } from '@/components/Tooltip';

interface HypothesisInputProps {
  onSubmit: (hypothesis: string) => void;
  isLoading: boolean;
  companyName?: string;
  sector?: string;
}

export default function HypothesisInput({ onSubmit, isLoading, companyName, sector }: HypothesisInputProps) {
  const [hypothesis, setHypothesis] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [showHelpPanel, setShowHelpPanel] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  // Extraire les paramètres d'URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const promptParam = params.get('prompt');
      
      // Si un prompt est fourni, le définir comme hypothèse
      if (promptParam) {
        setHypothesis(promptParam);
        setIsTyping(true);
        // Optionnellement, soumettre automatiquement le prompt
        // onSubmit(promptParam);
      }
    }
  }, []);

  // Assurer que la fenêtre reste visible dans la viewport
  useEffect(() => {
    if (showExamples && suggestionsRef.current) {
      const rect = suggestionsRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Faire défiler si nécessaire pour voir le contenu
      if (rect.bottom > viewportHeight) {
        window.scrollBy({
          top: rect.bottom - viewportHeight + 40,
          behavior: 'smooth'
        });
      }
    }
  }, [showExamples]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hypothesis.trim() && !isLoading) {
      onSubmit(hypothesis);
      // Ne pas réinitialiser l'hypothèse après soumission pour éviter les problèmes
      // setHypothesis('');
      setShowExamples(false);
      setShowHelpPanel(false);
    }
  };

  // Exemples standards
  const standardExamples = [
    {
      text: "Nous envisageons de recruter 3 développeurs supplémentaires",
      description: "Analyser l'impact financier et opérationnel de l'augmentation des effectifs techniques",
      category: "RH"
    },
    {
      text: "Nous envisageons d'investir 200k€ dans une nouvelle ligne de production",
      description: "Évaluer la rentabilité et le retour sur investissement d'une nouvelle capacité productive",
      category: "Investissement"
    },
    {
      text: "Nous prévoyons d'augmenter nos tarifs de 10%",
      description: "Analyser l'impact sur le chiffre d'affaires et la clientèle d'une modification tarifaire",
      category: "Commercial"
    },
    {
      text: "Nous prévoyons de créer une offre de services avec abonnement mensuel",
      description: "Évaluer le potentiel de transformation du modèle économique vers des revenus récurrents",
      category: "Stratégie"
    },
    {
      text: "Nous envisageons d'ouvrir une filiale à l'étranger pour développer notre marché européen",
      description: "Analyser les enjeux d'une expansion internationale et son impact financier",
      category: "Développement"
    }
  ];

  // Exemples d'opportunités provenant du tableau de bord
  const dashboardOpportunities = [
    {
      id: "cloud",
      text: "Nous souhaitons simuler une transition vers les services cloud",
      label: "Transition vers services cloud",
      description: "Analyser l'impact financier et opérationnel d'une migration vers un modèle SaaS"
    },
    {
      id: "ia", 
      text: "Nous souhaitons simuler l'intégration d'IA et d'automatisation",
      label: "IA et automatisation",
      description: "Évaluer le retour sur investissement de l'intégration de solutions d'IA dans vos processus"
    },
    {
      id: "international",
      text: "Nous souhaitons simuler une expansion internationale",
      label: "Expansion internationale",
      description: "Projeter l'impact financier et les ressources nécessaires pour une expansion à l'international"
    }
  ];

  const insertExample = (example: string) => {
    setHypothesis(example);
    setIsTyping(true);
    setShowExamples(false);
  };

  // Conseils pour formuler des hypothèses efficaces
  const hypothesisTips = [
    {
      title: "Soyez précis sur les montants",
      description: "Indiquez clairement les sommes en jeu (ex: '200k€ d'investissement' plutôt que 'un investissement important')",
      icon: <BarChart4 size={16} className="text-primary-600" />
    },
    {
      title: "Spécifiez les délais",
      description: "Mentionnez la période concernée (ex: 'dans les 6 prochains mois' ou 'sur 2 ans')",
      icon: <FileText size={16} className="text-primary-600" />
    },
    {
      title: "Contextualisez votre hypothèse",
      description: "Précisez le contexte business (ex: 'pour répondre à une demande croissante' ou 'pour diversifier nos revenus')",
      icon: <Search size={16} className="text-primary-600" />
    },
    {
      title: "Quantifiez les objectifs",
      description: "Indiquez les résultats attendus quand c'est possible (ex: 'pour augmenter notre CA de 15%')",
      icon: <TrendingUp size={16} className="text-primary-600" />
    }
  ];

  return (
    <div className="w-full">
      <div className="relative" ref={inputContainerRef}>
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center">
            <h3 className="text-sm font-medium text-gray-700">Simulez votre hypothèse business</h3>
            <Tooltip text="Décrivez un projet, une décision ou un changement que vous envisagez pour votre entreprise. Notre IA analysera son impact financier potentiel.">
              <HelpCircle size={14} className="ml-1.5 text-gray-400" />
            </Tooltip>
          </div>
          <button
            type="button"
            className={`text-xs flex items-center px-2 py-1 rounded ${showHelpPanel ? 'bg-primary-50 text-primary-600' : 'text-gray-500 hover:text-primary-600'}`}
            onClick={() => setShowHelpPanel(!showHelpPanel)}
          >
            <Info size={14} className="mr-1" />
            {showHelpPanel ? "Masquer les conseils" : "Conseils de formulation"}
          </button>
        </div>

        {showHelpPanel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 p-3 bg-primary-50 rounded-lg border border-primary-100"
          >
            <h4 className="text-xs font-medium text-primary-700 mb-2">Comment formuler une hypothèse efficace ?</h4>
            <div className="grid grid-cols-2 gap-3">
              {hypothesisTips.map((tip, index) => (
                <div key={index} className="flex items-start p-2 bg-white rounded border border-gray-100">
                  <div className="p-1.5 bg-primary-100 rounded mr-2 flex-shrink-0">
                    {tip.icon}
                  </div>
                  <div>
                    <h5 className="text-xs font-medium text-gray-700">{tip.title}</h5>
                    <p className="text-xs text-gray-500 mt-0.5">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-xs text-primary-600 mt-2 flex items-center">
              <AlertTriangle size={12} className="mr-1" />
              Plus votre hypothèse est précise, plus les projections financières seront pertinentes
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center bg-white rounded-xl border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-all">
            <textarea
              value={hypothesis}
              onChange={(e) => {
                setHypothesis(e.target.value);
                setIsTyping(e.target.value.length > 0);
              }}
              placeholder="Décrivez votre hypothèse ou scénario à analyser..."
              className="flex-1 px-4 py-3 bg-transparent border-none focus:outline-none resize-none min-h-[60px]"
              rows={Math.min(4, Math.max(1, hypothesis.split('\n').length))}
            />
            <div className="flex items-center pr-3 space-x-2">
              <button
                type="button"
                onClick={() => {
                  setShowExamples(!showExamples);
                  if (showExamples) setShowHelpPanel(false);
                }}
                className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-colors"
                title="Voir des exemples"
              >
                <Sparkles size={18} />
              </button>
              <button
                type="submit"
                disabled={!hypothesis.trim() || isLoading}
                className={`p-2 rounded-full transition-colors ${
                  hypothesis.trim() && !isLoading
                    ? 'bg-primary-500 text-white hover:bg-primary-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                onClick={handleSubmit}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </form>

        {/* Exemples d'hypothèses - version intégrée directement dans le bloc */}
        {showExamples && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 bg-white rounded-lg border border-gray-200 p-3"
          >
            {/* Titre et bouton fermer */}
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-700">Suggestions d'hypothèses</h3>
              <button 
                onClick={() => setShowExamples(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Section opportunités du tableau de bord */}
            <div className="mb-4">
              <div className="flex items-center mb-2 text-sm text-primary-600 font-medium">
                <TrendingUp size={14} className="mr-1" />
                <span>Opportunités identifiées dans le tableau de bord</span>
              </div>
              <div className="space-y-2 border-l-2 border-primary-200 pl-3 max-h-[150px] overflow-y-auto">
                {dashboardOpportunities.map((opportunity) => (
                  <button
                    key={opportunity.id}
                    onClick={() => insertExample(opportunity.text)}
                    className="w-full text-left p-2 text-sm hover:bg-primary-50 rounded transition-colors flex items-center"
                  >
                    <div className="mr-2 bg-primary-100 p-1 rounded">
                      <LineChart size={12} className="text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-primary-700">{opportunity.label}</div>
                      <div className="text-xs text-gray-600">{opportunity.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Section exemples standards */}
            <div>
              <div className="flex items-center mb-2 text-sm text-gray-600">
                <Info size={14} className="mr-1" />
                <span>Autres exemples d'hypothèses</span>
              </div>
              <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-1">
                {standardExamples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => insertExample(example.text)}
                    className="w-full text-left p-2 text-sm hover:bg-gray-100 rounded transition-colors flex items-start"
                  >
                    <div className="mr-2 h-5 w-5 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-500 flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-gray-700 block truncate">{example.text}</span>
                      <div className="text-xs text-gray-500 mt-0.5 flex items-center flex-wrap">
                        <span className="bg-gray-100 text-gray-600 rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wide mr-2 mb-1">{example.category}</span>
                        <span className="inline-block">{example.description}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mt-3 text-xs text-gray-500 flex items-center justify-center border-t border-gray-100 pt-2">
              <AlertTriangle size={12} className="mr-1" />
              <span>Cliquez sur une suggestion pour l'utiliser comme point de départ</span>
            </div>
          </motion.div>
        )}
      </div>

      {!showHelpPanel && (
        <div className="mt-3 flex items-center text-xs text-gray-500">
          <AlertTriangle size={12} className="mr-1" />
          <span>
            Pour des résultats plus précis, soyez spécifique dans votre hypothèse (montants, délais, contexte).
          </span>
        </div>
      )}
    </div>
  );
} 