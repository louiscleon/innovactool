"use client";

import React from 'react';
import { LayoutTemplate } from 'lucide-react';
import { ModuleContainer } from '@/components/ModuleAnimations';
import { DecorativeIllustration } from '@/components/DecorativeIllustration';
import { AnimatedElement } from '@/components/AppearanceAnimations';
import { StackTechnique } from './StackTechnique';

export default function StackTechniquePage() {
  return (
    <ModuleContainer 
      title="Stack Technique" 
      description="Découvrez l'architecture technique complète du démonstrateur Innovac'tool et sa cohérence avec le mémoire DEC."
      icon={<LayoutTemplate className="h-6 w-6 text-primary-500" />}
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
      
      <AnimatedElement variant="slideUp">
        <StackTechnique />
      </AnimatedElement>
    </ModuleContainer>
  );
} 