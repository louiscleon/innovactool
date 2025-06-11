"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { MessageSquare, AlertCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { ModuleContainer } from '@/components/ModuleAnimations';
import { DecorativeIllustration } from '@/components/DecorativeIllustration';
import { AnimatedElement } from '@/components/AppearanceAnimations';
import { AssistantConseil } from './AssistantConseil';
import { fetchCompanyData } from '@/services/api';
import { Badge } from '@/components/Badge';

// Composant d'interface client
function CPAContent() {
  const searchParams = useSearchParams();
  const siren = searchParams.get('siren');
  const [companyData, setCompanyData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (siren) {
      setLoading(true);
      fetchCompanyData(siren)
        .then(data => {
          setCompanyData(data);
          setError('');
        })
        .catch(err => {
          console.error('Erreur lors de la récupération des données:', err);
          setError(`Impossible de trouver les informations pour le SIREN ${siren}`);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [siren]);
  
  return (
    <>
      {/* Affichage des données SIREN si présentes */}
      {siren && (
        <div className="mb-6">
          {loading ? (
            <div className="flex items-center text-sm text-gray-500">
              <div className="animate-spin w-4 h-4 border-t-2 border-primary-500 rounded-full mr-2"></div>
              Recherche des informations pour le SIREN {siren}...
            </div>
          ) : error ? (
            <div className="flex items-center text-sm text-red-500">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </div>
          ) : companyData && (
            <div className="bg-primary-50 border border-primary-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Badge color="primary" size="sm" className="mr-2">
                    {companyData.source === 'API' ? 'API SIRENE' : 'Base de données'}
                  </Badge>
                  <h3 className="text-lg font-semibold text-gray-800">{companyData.raisonSociale}</h3>
                </div>
                <Badge color="success" size="sm">SIREN : {companyData.siren}</Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                <div>
                  <div className="text-xs text-gray-500">Forme juridique</div>
                  <div className="text-sm font-medium">{companyData.formeJuridique}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Activité</div>
                  <div className="text-sm font-medium">{companyData.libelleApe}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Date de création</div>
                  <div className="text-sm font-medium">{companyData.dateCreation}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Capital social</div>
                  <div className="text-sm font-medium">{companyData.capital}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      <AnimatedElement variant="slideUp">
        <AssistantConseil initialQuery={siren ? `Pouvez-vous me donner des informations sur l'entreprise avec le SIREN ${siren} ?` : ''} />
      </AnimatedElement>
    </>
  );
}

// Composant page
export default function CPACopilotPage() {
  return (
    <ModuleContainer 
      title="Assistant Conseil" 
      description="Votre assistant IA dédié, conçu pour les professionnels de l'expertise comptable. Posez vos questions et obtenez des réponses précises et contextuelles."
      icon={<MessageSquare className="h-6 w-6 text-primary-500" />}
      decorationCount={3}
    >
      {/* Illustrations décoratives colorées avec animations */}
      <AnimatedElement variant="fadeIn" delay={0.5} className="absolute top-20 right-10 -z-10">
        <DecorativeIllustration 
          name="18" 
          size="sm" 
          fullColor
          effect="float"
        />
      </AnimatedElement>
      
      <AnimatedElement variant="fadeIn" delay={0.7} className="absolute bottom-20 left-20 -z-10">
        <DecorativeIllustration 
          name="13" 
          size="sm" 
          fullColor
          effect="pulse"
        />
      </AnimatedElement>
      
      <AnimatedElement variant="fadeIn" delay={0.9} className="absolute top-60 right-40 -z-10">
        <DecorativeIllustration 
          name="06" 
          size="xs" 
          fullColor
          effect="float"
        />
      </AnimatedElement>
      
      <Suspense fallback={<div className="text-center p-4">Chargement de l'assistant...</div>}>
        <CPAContent />
      </Suspense>
    </ModuleContainer>
  );
}