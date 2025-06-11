"use client";

import React from 'react';

type NetworkElementColor = 'primary' | 'secondary' | 'mixed';
type NetworkElementSize = 'xs' | 'sm' | 'md' | 'lg';
type NetworkElementType = 'node' | 'connection' | 'circle' | 'wave';

interface NetworkElementProps {
  type?: NetworkElementType;
  color?: NetworkElementColor;
  size?: NetworkElementSize;
  className?: string;
  opacity?: number;
  rotate?: number;
  position?: string;
  isAnimated?: boolean;
}

/**
 * Composant qui crée des éléments visuels inspirés du réseau de manière subtile et élégante
 */
export function NetworkElement({
  type = 'node',
  color = 'primary',
  size = 'sm',
  className = '',
  opacity = 0.08,
  rotate = 0,
  position = 'top-right',
  isAnimated = false,
}: NetworkElementProps) {
  // Déterminer les tailles CSS en fonction de la prop size
  const sizeClasses = {
    xs: 'w-8 h-8',
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-40 h-40',
  };

  // Positions prédéfinies
  const positions = {
    'top-right': 'top-0 right-0',
    'top-left': 'top-0 left-0',
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'center-right': 'top-1/2 -translate-y-1/2 right-0',
    'center-left': 'top-1/2 -translate-y-1/2 left-0',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  } as const;

  // Couleurs principales et secondaires
  const colors = {
    primary: {
      main: '#72acd1',
      light: '#a5cbe4',
      dark: '#4a8cb8',
    },
    secondary: {
      main: '#aa2b37',
      light: '#d16e78',
      dark: '#7d1e28',
    },
    mixed: {
      main: 'url(#mixed-gradient)',
      light: 'url(#mixed-gradient-light)',
      dark: 'url(#mixed-gradient-dark)',
    }
  };

  // Vérification de sécurité pour la couleur
  const safeColor = (color === 'primary' || color === 'secondary' || color === 'mixed') 
    ? color 
    : 'primary';

  // Vérification de sécurité pour le type
  const safeType = (type === 'node' || type === 'connection' || type === 'circle' || type === 'wave')
    ? type
    : 'node';

  // Animation pour chaque type d'élément
  const animations = isAnimated ? {
    node: (
      <animate 
        attributeName="r" 
        values="5;6;5" 
        dur="3s" 
        repeatCount="indefinite" 
      />
    ),
    connection: (
      <animate 
        attributeName="stroke-width" 
        values="1;1.5;1" 
        dur="3s" 
        repeatCount="indefinite" 
      />
    ),
    circle: (
      <animate 
        attributeName="r" 
        values="10;12;10" 
        dur="3s" 
        repeatCount="indefinite" 
      />
    ),
    wave: (
      <animate 
        attributeName="stroke-width" 
        values="0.5;1;0.5" 
        dur="3s" 
        repeatCount="indefinite" 
      />
    )
  } : {};

  // Définir les SVGs pour chaque type d'élément
  const elements = {
    node: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
        <defs>
          <linearGradient id="mixed-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#72acd1" />
            <stop offset="100%" stopColor="#aa2b37" />
          </linearGradient>
          <linearGradient id="mixed-gradient-light" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a5cbe4" />
            <stop offset="100%" stopColor="#d16e78" />
          </linearGradient>
          <linearGradient id="mixed-gradient-dark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4a8cb8" />
            <stop offset="100%" stopColor="#7d1e28" />
          </linearGradient>
        </defs>
        <path 
          d="M50,50 m-18,0 a18,18 0 1,0 36,0 a18,18 0 1,0 -36,0" 
          fill="none" 
          stroke={safeColor === 'mixed' ? colors.primary.main : colors[safeColor].main} 
          strokeWidth="1" 
        />
        <circle 
          cx="50" 
          cy="50" 
          r="5" 
          fill={safeColor === 'mixed' ? colors.secondary.main : colors[safeColor].main} 
        >
          {isAnimated && animations.node}
        </circle>
      </svg>
    ),
    connection: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
        <defs>
          <linearGradient id="mixed-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#72acd1" />
            <stop offset="100%" stopColor="#aa2b37" />
          </linearGradient>
          <linearGradient id="mixed-gradient-light" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a5cbe4" />
            <stop offset="100%" stopColor="#d16e78" />
          </linearGradient>
          <linearGradient id="mixed-gradient-dark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4a8cb8" />
            <stop offset="100%" stopColor="#7d1e28" />
          </linearGradient>
        </defs>
        <path 
          d="M10,30 C30,10 70,10 90,30" 
          fill="none" 
          stroke={safeColor === 'mixed' ? colors.primary.main : colors[safeColor].main} 
          strokeWidth="1"
        >
          {isAnimated && animations.connection}
        </path>
        <path 
          d="M10,70 C30,90 70,90 90,70" 
          fill="none" 
          stroke={safeColor === 'mixed' ? colors.secondary.main : colors[safeColor].main} 
          strokeWidth="1"
        >
          {isAnimated && animations.connection}
        </path>
        <circle cx="10" cy="30" r="3" fill={safeColor === 'mixed' ? colors.primary.main : colors[safeColor].main} />
        <circle cx="90" cy="30" r="3" fill={safeColor === 'mixed' ? colors.primary.main : colors[safeColor].main} />
        <circle cx="10" cy="70" r="3" fill={safeColor === 'mixed' ? colors.secondary.main : colors[safeColor].main} />
        <circle cx="90" cy="70" r="3" fill={safeColor === 'mixed' ? colors.secondary.main : colors[safeColor].main} />
      </svg>
    ),
    circle: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
        <defs>
          <linearGradient id="mixed-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#72acd1" />
            <stop offset="100%" stopColor="#aa2b37" />
          </linearGradient>
          <linearGradient id="mixed-gradient-light" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a5cbe4" />
            <stop offset="100%" stopColor="#d16e78" />
          </linearGradient>
          <linearGradient id="mixed-gradient-dark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4a8cb8" />
            <stop offset="100%" stopColor="#7d1e28" />
          </linearGradient>
        </defs>
        <circle 
          cx="50" 
          cy="50" 
          r="10" 
          stroke={safeColor === 'mixed' ? colors.primary.main : colors[safeColor].main} 
          strokeWidth="0.75" 
          fill="none"
        >
          {isAnimated && animations.circle}
        </circle>
        <circle 
          cx="50" 
          cy="50" 
          r="15" 
          stroke={safeColor === 'mixed' ? colors.secondary.main : colors[safeColor].light} 
          strokeWidth="0.5" 
          fill="none"
        >
          {isAnimated && animations.circle}
        </circle>
        <circle 
          cx="50" 
          cy="50" 
          r="20" 
          stroke={safeColor === 'mixed' ? colors.primary.main : colors[safeColor].dark} 
          strokeWidth="0.25" 
          fill="none"
        >
          {isAnimated && animations.circle}
        </circle>
      </svg>
    ),
    wave: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
        <defs>
          <linearGradient id="mixed-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#72acd1" />
            <stop offset="100%" stopColor="#aa2b37" />
          </linearGradient>
          <linearGradient id="mixed-gradient-light" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a5cbe4" />
            <stop offset="100%" stopColor="#d16e78" />
          </linearGradient>
          <linearGradient id="mixed-gradient-dark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4a8cb8" />
            <stop offset="100%" stopColor="#7d1e28" />
          </linearGradient>
        </defs>
        <path 
          d="M0,35 C10,25 20,45 30,35 C40,25 50,45 60,35 C70,25 80,45 90,35 C100,25 110,45 120,35" 
          fill="none" 
          stroke={safeColor === 'mixed' ? colors.primary.main : colors[safeColor].main} 
          strokeWidth="0.75"
        >
          {isAnimated && animations.wave}
        </path>
        <path 
          d="M0,50 C10,40 20,60 30,50 C40,40 50,60 60,50 C70,40 80,60 90,50 C100,40 110,60 120,50" 
          fill="none" 
          stroke={safeColor === 'mixed' ? colors.secondary.main : colors[safeColor].light} 
          strokeWidth="0.5"
        >
          {isAnimated && animations.wave}
        </path>
        <path 
          d="M0,65 C10,55 20,75 30,65 C40,55 50,75 60,65 C70,55 80,75 90,65 C100,55 110,75 120,65" 
          fill="none" 
          stroke={safeColor === 'mixed' ? colors.primary.main : colors[safeColor].dark} 
          strokeWidth="0.25"
        >
          {isAnimated && animations.wave}
        </path>
      </svg>
    ),
  };

  const positionClasses = position in positions ? positions[position as keyof typeof positions] : '';

  return (
    <div 
      className={`absolute ${positionClasses} ${sizeClasses[size]} ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {elements[safeType]}
    </div>
  );
}

/**
 * Composant décoratif qui ajoute des éléments de réseau subtils à un conteneur
 */
export function NetworkDecoration({ 
  children,
  className = '',
  elements = 2,
  color = 'primary',
}: { 
  children: React.ReactNode;
  className?: string;
  elements?: number;
  color?: NetworkElementColor;
}) {
  // Types d'éléments à utiliser
  const types: NetworkElementType[] = ['node', 'connection', 'circle', 'wave'];
  
  // Tailles disponibles
  const sizes: NetworkElementSize[] = ['xs', 'sm', 'md'];
  
  // Positions disponibles
  const positions = [
    'top-right',
    'bottom-left',
    'top-left',
    'bottom-right',
  ];

  return (
    <div className={`relative ${className}`}>
      {Array.from({ length: elements }).map((_, i) => (
        <NetworkElement
          key={i}
          type={types[i % types.length]}
          color={color}
          size={sizes[i % sizes.length]}
          position={positions[i % positions.length]}
          opacity={0.05 + (i * 0.01)}
          rotate={i * 45}
        />
      ))}
      {children}
    </div>
  );
} 