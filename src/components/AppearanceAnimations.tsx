"use client";

import React from 'react';
import { motion, AnimatePresence } from '@/components/AnimatedImports';

interface PageAnimationWrapperProps {
  children: React.ReactNode;
  transitionKey?: string;
}

// Animations unifiées à travers l'application
const pageVariants = {
  hidden: { 
    opacity: 0,
    y: 10
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0,
    y: -10,
    transition: { 
      duration: 0.2
    }
  }
};

/**
 * Ce composant enveloppe les pages pour leur donner un effet d'apparition uniforme
 */
export function PageAnimationWrapper({ 
  children, 
  transitionKey = 'page' 
}: PageAnimationWrapperProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={transitionKey}
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Éléments d'animation qui peuvent être ré-utilisés dans les modules
export const elementVariants = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  },
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', damping: 25, stiffness: 120 }
    }
  },
  slideRight: {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { type: 'spring', damping: 25, stiffness: 120 }
    }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: 'spring', damping: 25, stiffness: 120 }
    }
  }
};

/**
 * Composant pour animer un élément individuel
 */
export function AnimatedElement({ 
  children, 
  variant = 'fadeIn', 
  delay = 0,
  className = ''
}: { 
  children: React.ReactNode; 
  variant?: keyof typeof elementVariants; 
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      variants={elementVariants[variant]}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
} 