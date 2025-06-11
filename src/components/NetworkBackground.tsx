"use client";

import React, { useMemo } from 'react';
import { NetworkElement } from './NetworkElements';

type NetworkElementColor = 'primary' | 'secondary' | 'mixed';
type NetworkElementType = 'node' | 'connection' | 'circle' | 'wave';
type NetworkElementSize = 'sm' | 'md' | 'lg';

/**
 * Crée un arrière-plan subtil avec des éléments de réseau.
 * Version statique pour éviter les problèmes d'hydratation SSR/CSR.
 */
export function NetworkBackground({
  color = 'mixed',
  density = 'low',
  className = '',
}: {
  color?: NetworkElementColor;
  density?: 'low' | 'medium' | 'high';
  className?: string;
}) {
  // Vérification de sécurité pour les paramètres
  const safeColor = (color === 'primary' || color === 'secondary' || color === 'mixed') 
    ? color 
    : 'mixed';
    
  const safeDensity = (density === 'low' || density === 'medium' || density === 'high')
    ? density
    : 'low';
  
  // Éléments fixes pour éviter les problèmes d'hydratation
  const elements = useMemo(() => {
    // Nombre d'éléments selon la densité
    const counts = {
      low: 3,
      medium: 5,
      high: 8,
    };
    
    const count = counts[safeDensity];
    const types: NetworkElementType[] = ['node', 'connection', 'circle', 'wave'];
    const sizes: NetworkElementSize[] = ['sm', 'md', 'lg'];
    
    // Positions prédéfinies pour éviter les valeurs aléatoires qui causent des problèmes d'hydratation
    const positions = [
      { left: '5%', top: '10%', opacity: 0.03, rotate: 0 },
      { left: '85%', top: '15%', opacity: 0.04, rotate: 45 },
      { left: '20%', top: '75%', opacity: 0.03, rotate: 90 },
      { left: '60%', top: '35%', opacity: 0.05, rotate: 135 },
      { left: '75%', top: '80%', opacity: 0.04, rotate: 180 },
      { left: '40%', top: '20%', opacity: 0.03, rotate: 225 },
      { left: '15%', top: '45%', opacity: 0.05, rotate: 270 },
      { left: '65%', top: '70%', opacity: 0.04, rotate: 315 },
    ];
    
    return Array.from({ length: count }).map((_, i) => ({
      type: types[i % types.length],
      size: sizes[i % sizes.length],
      position: positions[i % positions.length],
      isAnimated: i % 3 === 0,
    }));
  }, [safeDensity]);
  
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {elements.map((el, i) => (
        <div 
          key={i}
          className="absolute" 
          style={{ 
            left: el.position.left, 
            top: el.position.top,
            opacity: el.position.opacity,
          }}
        >
          <NetworkElement
            type={el.type}
            color={safeColor}
            size={el.size}
            rotate={el.position.rotate}
            isAnimated={el.isAnimated}
          />
        </div>
      ))}
    </div>
  );
} 