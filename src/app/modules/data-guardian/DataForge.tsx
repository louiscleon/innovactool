"use client";

import React from 'react';
import { motion } from '@/components/AnimatedImports';
import { Shield, Activity, Ban, Lock, FileText } from 'lucide-react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

export interface DataForgeProps {
  currentStep?: number;
  onRun?: () => void;
  isRunning?: boolean;
  isComplete?: boolean;
  processingStage?: string;
  currentTechnique?: string;
}

const PIPELINE_STEPS = [
  { 
    name: 'Analyse du FEC', 
    description: 'Détection des colonnes et structures',
    icon: <FileText className="w-3.5 h-3.5" />
  },
  { 
    name: 'Détection données sensibles', 
    description: 'Identification des PII et données critiques',
    icon: <Activity className="w-3.5 h-3.5" /> 
  },
  { 
    name: 'Anonymisation des noms', 
    description: 'Masquage et hash des identifiants',
    icon: <Ban className="w-3.5 h-3.5" />
  },
  { 
    name: 'Sécurité des comptes', 
    description: 'Traitement des informations bancaires',
    icon: <Lock className="w-3.5 h-3.5" />
  },
  { 
    name: 'Neutralisation libellés', 
    description: 'Suppression des détails sensibles',
    icon: <Shield className="w-3.5 h-3.5" />
  },
  { 
    name: 'Score RGPD', 
    description: 'Évaluation de conformité',
    icon: <Activity className="w-3.5 h-3.5" />
  },
  { 
    name: 'Export sécurisé', 
    description: 'Préparation des fichiers anonymisés',
    icon: <FileText className="w-3.5 h-3.5" />
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      when: "beforeChildren", 
      staggerChildren: 0.08 
    } 
  }
};

const stepVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.25 } 
  }
};

const iconVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 15 
    } 
  }
};

const activeVariants = {
  active: {
    scale: [1, 1.02, 1],
    transition: {
      repeat: Infinity,
      duration: 1.5
    }
  }
};

export function DataForge({ 
  currentStep = 0,
  onRun = () => {}, 
  isRunning = false, 
  isComplete = false,
  processingStage = '',
  currentTechnique = ''
}: DataForgeProps) {
  return (
    <Card
      title="Forge de données"
      icon={<Shield className="h-4 w-4 text-primary-500" />}
      size="sm"
      className="h-full flex flex-col"
    >
      <motion.div 
        className="flex-1"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {processingStage && (
          <div className="mb-3 text-xs text-primary-600 bg-primary-50 p-2 rounded-lg">
            <div className="flex items-center">
              <div className="animate-spin mr-2 h-3 w-3 border-2 border-primary-600 border-t-transparent rounded-full"></div>
              {processingStage}
            </div>
          </div>
        )}

        {currentTechnique && (
          <div className="mb-3 text-xs text-success-600 bg-success-50 p-2 rounded-lg border border-success-100">
            <div className="flex items-center">
              <div className="mr-2 h-2 w-2 bg-success-500 rounded-full"></div>
              <span className="font-medium">Technique en cours :</span>
              <span className="ml-1">{currentTechnique}</span>
            </div>
          </div>
        )}
        
        <div className="space-y-2 mb-3">
          {PIPELINE_STEPS.map((step, index) => {
            const isActive = currentStep === index;
            const isComplete = currentStep > index;
            
            return (
              <motion.div
                key={index}
                variants={stepVariants}
                className={`p-2 rounded-lg text-xs flex items-start ${
                  isActive 
                    ? 'bg-primary-100 text-primary-700' 
                    : isComplete 
                      ? 'bg-success-50 text-success-700' 
                      : 'bg-gray-50 text-gray-500'
                }`}
                animate={isActive ? "active" : ""}
              >
                <motion.div 
                  className={`p-1 rounded-full mr-2 ${
                    isActive 
                      ? 'bg-primary-200' 
                      : isComplete 
                        ? 'bg-success-100' 
                        : 'bg-gray-100'
                  }`}
                  variants={iconVariants}
                >
                  {step.icon}
                </motion.div>
                <div>
                  <div className="font-medium">{step.name}</div>
                  <div className="text-2xs">{step.description}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
      
      {!isRunning && !isComplete && (
        <div className="flex justify-center pt-2">
          <Button
            size="sm"
            onClick={onRun}
            disabled={isRunning}
            className="w-full"
          >
            <Shield className="h-3.5 w-3.5 mr-1.5" />
            Lancer l'anonymisation
          </Button>
        </div>
      )}
    </Card>
  );
}