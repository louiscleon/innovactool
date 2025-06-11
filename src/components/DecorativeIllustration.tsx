"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from '@/components/AnimatedImports';

type IllustrationSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type IllustrationEffect = 'none' | 'float' | 'pulse' | 'rotate';

interface DecorativeIllustrationProps {
  name: string;
  size?: IllustrationSize;
  className?: string;
  opacity?: number;
  effect?: IllustrationEffect;
  fullColor?: boolean;
}

// Mapping des tailles en valeurs de pixels
const sizesMap = {
  xs: 40,
  sm: 64,
  md: 96,
  lg: 128,
  xl: 160,
};

// Animations pour les effets
const effectVariants = {
  none: {},
  float: {
    y: [0, -10, 0],
    transition: { 
      repeat: Infinity, 
      duration: 3,
      ease: "easeInOut" 
    }
  },
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: { 
      repeat: Infinity, 
      duration: 2,
      ease: "easeInOut" 
    }
  },
  rotate: {
    rotate: [0, 5, 0, -5, 0],
    transition: { 
      repeat: Infinity, 
      duration: 5,
      ease: "easeInOut" 
    }
  }
};

// Liste des illustrations sûres à utiliser
const safeIllustrations = [
  '02', '03', '04', '05', '06', '07', '08', '10',
  '11', '12', '13', '14', '15', '16', '17', '18',
  '19', '20', '21', '22', '23', '24', '25'
];

// Illustrations problématiques à remplacer systématiquement
const problematicIllustrations = ['01', '09', '149-09'];

// Illustrations de remplacement en cas d'image interdite ou invalide
const fallbackIllustration = '13';

export function DecorativeIllustration({ 
  name, 
  size = 'md', 
  className = '',
  opacity = 0.8,
  effect = 'none',
  fullColor = false
}: DecorativeIllustrationProps) {
  // Vérifier si le nom est valide et n'est pas une image interdite
  let safeName = name || fallbackIllustration;
  
  // Vérification plus stricte pour filtrer toutes les variantes des images problématiques
  if ((name && problematicIllustrations.some(img => name.includes(img))) || 
      (name && name.length === 2 && !safeIllustrations.includes(name))) {
    safeName = fallbackIllustration;
  }
  
  const fileName = safeName.includes('.svg') ? safeName : `Sans titre - 1-${safeName}.svg`;
  const imagePath = `/ressources/${fileName}`;
  
  // Dimensions en pixels selon la taille
  const dimension = sizesMap[size];
  
  return (
    <motion.div 
      className={`relative overflow-hidden ${className}`}
      style={{ opacity: fullColor ? 1 : opacity }}
      animate={effect !== 'none' ? effectVariants[effect] : {}}
    >
      <Image
        src={imagePath}
        alt="Illustration décorative"
        width={dimension}
        height={dimension}
        className={`object-contain ${fullColor ? 'filter-none' : 'opacity-80'}`}
      />
    </motion.div>
  );
}

// Composant qui ajoute plusieurs illustrations en grille
export function IllustrationGrid({
  illustrations = ['07', '02', '03', '04'],
  size = 'sm',
  className = '',
  gap = 2,
  fullColor = true
}: {
  illustrations: string[];
  size?: IllustrationSize;
  className?: string;
  gap?: number;
  fullColor?: boolean;
}) {
  // Filtrer les illustrations problématiques
  const safeIllustrations = illustrations.map(num => {
    if (!num || problematicIllustrations.some(img => num.includes(img))) {
      return fallbackIllustration; // Utiliser une image de remplacement sûre
    }
    return num;
  });

  return (
    <div className={`grid grid-cols-2 gap-${gap} ${className}`}>
      {safeIllustrations.map((num, index) => (
        <DecorativeIllustration
          key={index}
          name={num}
          size={size}
          fullColor={fullColor}
          effect={index % 2 === 0 ? 'pulse' : 'float'}
        />
      ))}
    </div>
  );
}

// Composant qui ajoute plusieurs illustrations aléatoires
export function RandomIllustrations({
  count = 3,
  baseOpacity = 0.6,
  className = '',
  size = 'sm',
  fullColor = false
}: {
  count?: number;
  baseOpacity?: number;
  className?: string;
  size?: IllustrationSize;
  fullColor?: boolean;
}) {
  // Générer des nombres aléatoires parmi les illustrations sûres
  const generateRandomNumbers = (count: number) => {
    const numbers = [];
    
    for (let i = 0; i < count; i++) {
      // Choisir une illustration aléatoire parmi la liste des illustrations sûres
      const randomIndex = Math.floor(Math.random() * safeIllustrations.length);
      numbers.push(safeIllustrations[randomIndex]);
    }
    return numbers;
  };
  
  const randomIllustrations = generateRandomNumbers(count);
  
  return (
    <div className={`relative ${className}`}>
      {randomIllustrations.map((num, index) => {
        // Assurer une bonne répartition des positions pour éviter les superpositions
        const sectionSize = 100 / Math.ceil(Math.sqrt(count));
        const section = index % Math.ceil(Math.sqrt(count));
        const row = Math.floor(index / Math.ceil(Math.sqrt(count)));
        
        const randomPosition = {
          top: `${row * sectionSize + Math.floor(Math.random() * (sectionSize * 0.6))}%`,
          left: `${section * sectionSize + Math.floor(Math.random() * (sectionSize * 0.6))}%`,
          opacity: fullColor ? 1 : baseOpacity - (index * 0.05), // Diminuer l'opacité progressivement
          transform: `rotate(${Math.floor(Math.random() * 360)}deg)`,
        };
        
        return (
          <div
            key={index}
            className="absolute"
            style={randomPosition}
          >
            <DecorativeIllustration
              name={num}
              size={size}
              opacity={randomPosition.opacity}
              fullColor={fullColor}
              effect={index % 3 === 0 ? 'pulse' : 'none'}
            />
          </div>
        );
      })}
    </div>
  );
} 