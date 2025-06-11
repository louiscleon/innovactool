'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Check, AlertTriangle, Info, Download, MapPin, Briefcase, HelpCircle } from 'lucide-react';
import { Tooltip } from '@/components/Tooltip';
import TrendVisualizer from './TrendVisualizer';

export interface ScenarioData {
  CA: string;
  CA_absolu?: string;
  marge: string;
  tresorerie: string;
  effectifs: string;
  investissements: string;
  masse_salariale: string;
  productivité: string;
  revenus_recurrents: string;
  taux_attrition_clients: string;
  part_export: string;
  [key: string]: string | undefined;
}

export interface Scenario {
  optimiste: ScenarioData;
  neutre: ScenarioData;
  pessimiste: ScenarioData;
}

export interface ScenarioResultsProps {
  hypothesis: string;
  scenarios: Scenario;
  justification: string;
  facteurs_cles: string[];
  fiabilite: number;
}

export default function ScenarioResults({
  hypothesis,
  scenarios,
  justification,
  facteurs_cles,
  fiabilite
}: ScenarioResultsProps) {
  const [activeScenario, setActiveScenario] = useState<'neutre' | 'optimiste' | 'pessimiste'>('neutre');
  const [showTrendVisualizer, setShowTrendVisualizer] = useState<boolean>(true);

  const getScenarioColor = (scenario: string) => {
    switch (scenario) {
      case 'optimiste': return 'text-success-500';
      case 'pessimiste': return 'text-error-500';
      default: return 'text-primary-500';
    }
  };

  const getScenarioBgColor = (scenario: string) => {
    switch (scenario) {
      case 'optimiste': return 'bg-success-50 border-success-200';
      case 'pessimiste': return 'bg-error-50 border-error-200';
      default: return 'bg-primary-50 border-primary-200';
    }
  };

  const getScenarioIcon = (scenario: string) => {
    switch (scenario) {
      case 'optimiste': return <TrendingUp className="w-5 h-5 text-success-500" />;
      case 'pessimiste': return <TrendingDown className="w-5 h-5 text-error-500" />;
      default: return <Minus className="w-5 h-5 text-primary-500" />;
    }
  };

  const getImpactClass = (value: string | undefined) => {
    if (!value) return 'text-gray-600';
    if (value.startsWith('+')) return 'text-success-600';
    if (value.startsWith('-')) return 'text-error-600';
    return 'text-gray-600';
  };

  // Fonction pour générer les infobulles explicatives pour chaque indicateur
  const getTooltipText = (key: string) => {
    const tooltips: Record<string, string> = {
      CA: "Chiffre d'affaires prévisionnel après mise en œuvre de l'hypothèse, exprimé en variation par rapport à la situation actuelle (920k€ en 2024).",
      marge: "Marge nette prévisionnelle (résultat net / chiffre d'affaires). La marge actuelle est de 10%.",
      tresorerie: "Impact sur la trésorerie disponible. Une valeur négative indique un besoin de financement.",
      effectifs: "Nombre d'employés prévu après mise en œuvre de l'hypothèse (actuellement 24 employés).",
      investissements: "Montant total des investissements nécessaires pour mettre en œuvre l'hypothèse.",
      masse_salariale: "Montant total des rémunérations et charges sociales associées aux effectifs de l'entreprise.",
      productivité: "Gain de productivité estimé grâce à l'investissement.",
      revenus_recurrents: "Part du chiffre d'affaires qui sera générée de façon récurrente et prévisible.",
      taux_attrition_clients: "Pourcentage de clients susceptibles de ne pas renouveler leur contrat suite à l'augmentation tarifaire.",
      part_export: "Pourcentage du chiffre d'affaires réalisé à l'international."
    };
    
    return tooltips[key] || "Indicateur financier ou opérationnel lié à l'hypothèse analysée.";
  };

  // Fonction pour obtenir des explications détaillées pour les facteurs clés
  const getFacteurExplication = (facteur: string): string => {
    // Extraction de la clé du facteur (avant les deux points)
    const facteurKey = facteur.split(':')[0].trim().toLowerCase();
    
    const explications: Record<string, string> = {
      // Facteurs de rentabilité et investissement
      "tri (taux de rentabilité interne) estimé": "Le TRI mesure la rentabilité d'un investissement en pourcentage. Un TRI de 19,8% est considéré comme très bon dans le secteur informatique où la moyenne est de 15%. Ce taux élevé indique un fort potentiel de création de valeur.",
      "point mort estimé": "Le point mort correspond au délai nécessaire pour que l'investissement génère suffisamment de cash-flow pour couvrir son coût initial. 22 mois est un délai raisonnable pour un investissement de cette ampleur dans le secteur informatique.",
      "van (valeur actuelle nette) sur 3 ans": "La VAN de +95k€ indique que cet investissement créera 95 000€ de valeur sur 3 ans, après déduction du coût initial. Une VAN positive est un indicateur favorable pour la décision d'investissement.",
      "indice de confiance sectoriel": "Cet indice mesure la stabilité et la prévisibilité du secteur. Un score de 85/100 indique un environnement économique favorable avec des risques limités.",
      "roi moyen observé": "Le Retour sur Investissement moyen observé dans des entreprises comparables est de 17,5% après 3 ans. Ce chiffre sert de référence pour évaluer la performance potentielle de votre projet.",
      
      // Facteurs liés au marché
      "croissance du secteur bancaire": "Le secteur bancaire, qui représente une part importante de vos clients, connaît une croissance de 7,2%. Cette croissance soutenue justifie l'investissement dans des ressources supplémentaires.",
      "croissance du marché cloud": "Le marché des services cloud connaît une croissance annuelle de 25%, soit plus de 5 fois la croissance économique globale. Cette forte dynamique représente une opportunité significative.",
      "potentiel du marché européen": "Le marché européen des services informatiques croît de 12% par an, offrant des perspectives intéressantes pour une expansion internationale, particulièrement en Europe du Nord et de l'Est.",
      "élasticité-prix moyenne du secteur": "Ce coefficient de -0,58 indique qu'une augmentation de 10% des prix entraîne en moyenne une baisse de volume de 5,8%. Votre élasticité semble plus favorable que la moyenne sectorielle.",
      
      // Facteurs liés aux clients et à la fidélisation
      "taux de fidélisation client infotech": "Votre taux de fidélisation client de 92% est supérieur à la moyenne sectorielle (85%). Cela suggère une forte satisfaction client et une base solide pour vos projets de développement.",
      "taux de rétention client moyen du secteur": "Le taux de rétention moyen de 85% dans le secteur indique une bonne stabilité des relations clients. Vos performances actuelles sont supérieures à cette référence.",
      "durée moyenne des contrats d'abonnement": "La durée moyenne de 28 mois des contrats d'abonnement dans le secteur est un indicateur favorable pour la stabilité des revenus dans un modèle SaaS.",
      
      // Facteurs opérationnels
      "délai moyen avant productivité optimale d'un développeur": "Un nouveau développeur atteint sa pleine productivité en moyenne après 4 mois. Cette période de montée en compétence est intégrée dans les projections financières.",
      "tension sur le marché de l'emploi it": "La forte tension sur le marché de l'emploi IT implique des défis de recrutement et une pression sur les salaires, facteurs pris en compte dans les projections.",
      "positionnement tarifaire actuel": "Votre positionnement dans le quartile supérieur des tarifs du marché reflète une stratégie de différenciation par la qualité plutôt que par le prix.",
      "barrières réglementaires": "Les barrières réglementaires faibles, notamment grâce à votre conformité RGPD déjà en place, facilitent votre expansion internationale en Europe.",
      
      // Facteurs économiques et financiers
      "contexte inflationniste": "L'inflation de 4,2% sur les charges en 2024 est prise en compte dans les projections financières et justifie en partie l'augmentation tarifaire envisagée.",
      "contexte économique parisien": "La forte demande en services IT à Paris crée un environnement favorable pour le recrutement de talents spécialisés et le développement commercial.",
      "coût d'acquisition client amorti sur": "L'amortissement du coût d'acquisition client sur 9 mois est favorable par rapport à la durée moyenne des contrats (28 mois), permettant une rentabilité client positive.",
      "multiple de valorisation moyen": "Un multiple de valorisation de 1,8 à 2,5 fois l'EBITDA constitue une référence sectorielle importante pour évaluer l'impact de votre stratégie sur la valeur de l'entreprise."
    };

    // Recherche par correspondance partielle dans les clés
    for (const [key, explication] of Object.entries(explications)) {
      if (facteurKey.includes(key) || key.includes(facteurKey)) {
        return explication;
      }
    }

    return "Facteur clé impactant les projections financières et opérationnelles de cette hypothèse.";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      {/* Hypothèse */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
          Hypothèse analysée
          <Tooltip text="Cette hypothèse est analysée en fonction des données financières actuelles de votre entreprise et des tendances sectorielles.">
            <HelpCircle size={14} className="ml-1.5 text-gray-400" />
          </Tooltip>
        </h3>
        <p className="text-gray-800 font-medium">{hypothesis}</p>
        
        {/* Contexte sectoriel et géographique */}
        <div className="flex items-center mt-2 text-xs text-gray-500">
          <Briefcase size={14} className="mr-1" />
          <span className="mr-3">Secteur : Programmation informatique</span>
          <MapPin size={14} className="mr-1" />
          <span>Localisation : Paris</span>
        </div>
      </div>

      {/* Sélecteur de scénario */}
      <div className="grid grid-cols-3 border-b border-gray-200">
        {(['neutre', 'optimiste', 'pessimiste'] as const).map((scenario) => (
          <button
            key={scenario}
            onClick={() => setActiveScenario(scenario)}
            className={`py-3 px-4 flex items-center justify-center gap-2 transition-colors ${
              activeScenario === scenario
                ? `${getScenarioBgColor(scenario)} border-b-2 ${getScenarioColor(scenario)} font-medium`
                : 'hover:bg-gray-50'
            }`}
          >
            {getScenarioIcon(scenario)}
            <span className="capitalize">{scenario}</span>
          </button>
        ))}
      </div>

      {/* Détails du scénario */}
      <div className="p-4">
        <div className={`p-4 rounded-lg mb-4 ${getScenarioBgColor(activeScenario)}`}>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(scenarios[activeScenario]).map(([key, value]) => {
              // Afficher uniquement les clés qui ne sont pas des versions alternatives
              if (key === 'CA_absolu') return null;
              
              return (
                <div key={key} className="flex flex-col">
                  <span className="text-xs text-gray-500 mb-1 flex items-center">
                    {key}
                    <Tooltip text={getTooltipText(key)}>
                      <Info className="w-3 h-3 ml-1 text-gray-400" />
                    </Tooltip>
                  </span>
                  <span className={`text-lg font-semibold ${getImpactClass(value)}`}>
                    {key === 'marge' ? (
                      <span className="block text-sm mt-1">{value} points</span>
                    ) : value}
                  </span>
                </div>
              );
            })}
          </div>
          
          {/* Note sur la spécificité du scénario */}
          <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-600">
            <p>Ce scénario est calculé spécifiquement pour InfoTech Solutions, une entreprise de programmation informatique basée à Paris avec 24 employés et un CA de 920k€.</p>
          </div>
        </div>

        {/* Visualisation des tendances sur 3 ans */}
        {showTrendVisualizer && (
          <div className="mb-6">
            <TrendVisualizer 
              hypothesis={hypothesis}
              scenarioData={scenarios[activeScenario]}
              scenarioType={activeScenario}
              companyName="InfoTech Solutions"
              baseRevenue={920000}
              baseMargin={10.0}
            />
          </div>
        )}

        {/* Justification */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Info className="w-4 h-4 mr-1 text-primary-500" />
            Justification
            <Tooltip text="Cette analyse est basée sur des données sectorielles récentes et sur la comparaison avec des entreprises similaires ayant mis en œuvre des stratégies comparables.">
              <HelpCircle size={14} className="ml-1.5 text-gray-400" />
            </Tooltip>
          </h4>
          <div className="text-sm text-gray-600">
            <p className="mb-2">{justification}</p>
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <h5 className="text-xs font-medium text-gray-700 mb-2 flex items-center">
                <Check className="w-3.5 h-3.5 mr-1.5 text-success-500" />
                Points clés à retenir
              </h5>
              <ul className="list-disc pl-4 space-y-1 text-xs text-gray-600">
                <li>Cette analyse se base sur {fiabilite > 85 ? 'un large échantillon' : fiabilite > 75 ? 'un échantillon significatif' : 'un échantillon'} d'entreprises similaires du secteur.</li>
                <li>Le scénario neutre représente l'évolution la plus probable selon les données sectorielles actuelles.</li>
                <li>Les entreprises ayant mis en œuvre des stratégies similaires ont connu une amélioration moyenne de {
                  activeScenario === 'optimiste' ? 'leurs performances supérieure aux prévisions' :
                  activeScenario === 'pessimiste' ? 'leurs performances inférieure aux prévisions initialement estimées' :
                  'leurs performances conforme aux prévisions'
                }.</li>
                <li>Les projections tiennent compte des spécificités de votre entreprise et du contexte économique actuel.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Facteurs clés */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            Facteurs clés
            <Tooltip text="Les facteurs qui influencent significativement les résultats de cette hypothèse et qui ont été pris en compte dans l'analyse.">
              <HelpCircle size={14} className="ml-1.5 text-gray-400" />
            </Tooltip>
          </h4>
          <ul className="space-y-1">
            {facteurs_cles.map((facteur, index) => (
              <li key={index} className="text-sm flex items-start">
                <Check className="w-4 h-4 mr-2 text-primary-500 flex-shrink-0 mt-0.5" />
                <div className="text-gray-600 flex items-center">
                  {facteur}
                  <Tooltip text={getFacteurExplication(facteur)} width="lg">
                    <Info className="w-3.5 h-3.5 ml-1.5 text-gray-400" />
                  </Tooltip>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Indice de fiabilité */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <AlertTriangle className={`w-4 h-4 mr-1 ${fiabilite > 80 ? 'text-success-500' : fiabilite > 60 ? 'text-warning-500' : 'text-error-500'}`} />
            Indice de fiabilité
            <Tooltip text="Cet indice reflète le niveau de confiance dans les projections, basé sur la qualité et la quantité des données comparables disponibles.">
              <HelpCircle size={14} className="ml-1.5 text-gray-400" />
            </Tooltip>
          </h4>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
            <div
              className={`h-2 rounded-full ${fiabilite > 80 ? 'bg-success-500' : fiabilite > 60 ? 'bg-warning-500' : 'bg-error-500'}`}
              style={{ width: `${fiabilite}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Basé sur {fiabilite < 70 ? 'peu' : fiabilite < 85 ? 'plusieurs' : 'de nombreuses'} données comparables du secteur informatique à Paris</span>
            <span>{fiabilite.toFixed(2)}%</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between">
        <span className="text-xs text-gray-500">Généré le {new Date().toLocaleDateString()}</span>
        <button 
          className="flex items-center text-sm text-primary-600 hover:text-primary-800 transition-colors"
          onClick={() => setShowTrendVisualizer(!showTrendVisualizer)}
        >
          {showTrendVisualizer ? (
            <>
              <Minus className="w-4 h-4 mr-1" />
              Masquer les projections
            </>
          ) : (
            <>
              <TrendingUp className="w-4 h-4 mr-1" />
              Afficher les projections
            </>
          )}
        </button>
        <button className="flex items-center text-sm text-primary-600 hover:text-primary-800 transition-colors">
          <Download className="w-4 h-4 mr-1" />
          Exporter en PDF
        </button>
      </div>
    </motion.div>
  );
} 