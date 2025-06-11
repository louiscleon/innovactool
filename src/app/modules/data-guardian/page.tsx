"use client";

import React from 'react';
import { DataGuardian } from './DataGuardian';
import { Shield } from 'lucide-react';
import { ModuleContainer } from '@/components/ModuleAnimations';
import { DecorativeIllustration } from '@/components/DecorativeIllustration';
import { AnimatedElement } from '@/components/AppearanceAnimations';

export default function DataGuardianPage() {
  return (
    <>
      <ModuleContainer 
        title="Protecteur de données" 
        description="Anonymisez vos fichiers FEC pour une conformité RGPD renforcée et un partage sécurisé. Identifiez et traitez les données sensibles automatiquement."
        icon={<Shield className="h-6 w-6 text-primary-500" />}
        decorationCount={3}
      >
        {/* Illustrations décoratives colorées avec animations */}
        <AnimatedElement variant="fadeIn" delay={0.5} className="absolute top-20 right-10 -z-10">
          <DecorativeIllustration 
            name="16" 
            size="sm" 
            fullColor
            effect="float"
          />
        </AnimatedElement>
        
        <AnimatedElement variant="fadeIn" delay={0.7} className="absolute bottom-20 left-20 -z-10">
          <DecorativeIllustration 
            name="22" 
            size="sm" 
            fullColor
            effect="pulse"
          />
        </AnimatedElement>
        
        <AnimatedElement variant="fadeIn" delay={0.9} className="absolute top-60 right-20 -z-10">
          <DecorativeIllustration 
            name="24" 
            size="xs" 
            fullColor
            effect="float"
          />
        </AnimatedElement>
        
        <AnimatedElement variant="slideUp">
          <DataGuardian />
        </AnimatedElement>
      </ModuleContainer>
    </>
  );
} 