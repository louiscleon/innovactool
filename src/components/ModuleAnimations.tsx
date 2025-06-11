"use client";

import { motion } from '@/components/AnimatedImports';
import React from 'react';
import { NetworkElement } from './NetworkElements';
import { NetworkWatermark } from './NetworkWatermark';

// Animation variants réutilisables
export const pageTransition = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      when: "beforeChildren", 
      staggerChildren: 0.15,
      duration: 0.4 
    } 
  }
};

export const headerTransition = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5
    } 
  }
};

export const cardTransition = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring", 
      damping: 25, 
      stiffness: 120 
    } 
  }
};

export const errorTransition = {
  hidden: { opacity: 0, height: 0, marginBottom: 0 },
  visible: { 
    opacity: 1, 
    height: 'auto', 
    marginBottom: '1rem',
    transition: { duration: 0.3 }
  },
  exit: {
    opacity: 0,
    height: 0,
    marginBottom: 0,
    transition: { duration: 0.2 }
  }
};

export const contentTransition = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.5, 
      delay: 0.2 
    } 
  }
};

export const sidebarTransition = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.5, 
      delay: 0.2 
    } 
  }
};

interface ModuleContainerProps {
  children: React.ReactNode;
  title: string;
  description: string;
  icon: React.ReactNode;
  decorationCount?: number;
}

// Composant conteneur avec header et animation unifiée pour tous les modules
export function ModuleContainer({ 
  children, 
  title, 
  description, 
  icon,
  decorationCount = 2
}: ModuleContainerProps) {
  return (
    <motion.div
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      className="relative"
    >
      <NetworkWatermark opacity={0.03} />
      
      {/* Décorations */}
      <NetworkElement 
        type="circle" 
        position="top-right" 
        opacity={0.04} 
        size="sm"
        isAnimated={true}
      />
      <NetworkElement 
        type="wave" 
        position="bottom-left" 
        opacity={0.04} 
        size="md" 
        isAnimated={true}
      />
      
      {decorationCount > 2 && (
        <NetworkElement 
          type="node" 
          position="bottom-right" 
          opacity={0.04} 
          size="sm"
          isAnimated={true}
        />
      )}
      
      {/* En-tête du module */}
      <motion.div 
        className="relative mb-5 pb-4 border-b border-gray-200"
        variants={headerTransition}
      >
        <div className="flex items-center gap-3 mb-2">
          <motion.div 
            className="bg-primary-100 p-1.5 rounded-lg"
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {icon}
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        </div>
        <p className="text-sm text-gray-600 max-w-3xl">
          {description}
        </p>
      </motion.div>
      
      {/* Contenu du module */}
      {children}
    </motion.div>
  );
}

// Composant pour les cartes avec animation unifiée
export function AnimatedCard({ 
  children, 
  className = "", 
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div 
      variants={cardTransition}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Composant pour les éléments qui apparaissent en décalé
export function StaggeredItem({
  children,
  index = 0
}: {
  children: React.ReactNode;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      {children}
    </motion.div>
  );
} 