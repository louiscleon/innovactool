import React from 'react';

type PatternVariant = 'circles' | 'nodes' | 'connections' | 'full';
type PatternColor = 'primary' | 'secondary' | 'mixed';

interface NetworkPatternProps {
  variant?: PatternVariant;
  color?: PatternColor;
  className?: string;
  opacity?: number;
  size?: 'sm' | 'md' | 'lg';
  rotate?: number;
}

/**
 * Composant qui affiche différents motifs du réseau comme éléments de design
 */
export function NetworkPattern({
  variant = 'circles',
  color = 'primary',
  className = '',
  opacity = 0.2,
  size = 'md',
  rotate = 0
}: NetworkPatternProps) {
  // Styles de taille
  const sizes = {
    sm: 'w-24 h-24',
    md: 'w-40 h-40',
    lg: 'w-64 h-64',
  };

  // Couleurs
  const colors = {
    primary: {
      main: '#72acd1',
      secondary: '#72acd1',
    },
    secondary: {
      main: '#aa2b37',
      secondary: '#aa2b37',
    },
    mixed: {
      main: '#72acd1',
      secondary: '#aa2b37',
    },
  };

  // Vérification de sécurité pour les paramètres
  const safeColor = (color === 'primary' || color === 'secondary' || color === 'mixed') 
    ? color 
    : 'primary';
    
  const safeVariant = (variant === 'circles' || variant === 'nodes' || variant === 'connections' || variant === 'full')
    ? variant
    : 'circles';

  // Différents SVGs selon la variante choisie
  const patterns = {
    circles: (
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
        <circle cx="40" cy="40" r="7" fill={colors[safeColor].main} />
        <circle cx="80" cy="30" r="5" fill={colors[safeColor].secondary} />
        <circle cx="120" cy="50" r="6" fill={colors[safeColor].main} />
        <circle cx="150" cy="20" r="8" fill={colors[safeColor].secondary} />
        <circle cx="170" cy="70" r="5" fill={colors[safeColor].main} />
        <circle cx="30" cy="100" r="6" fill={colors[safeColor].secondary} />
        <circle cx="80" cy="80" r="7" fill={colors[safeColor].main} />
        <circle cx="130" cy="110" r="5" fill={colors[safeColor].secondary} />
        <circle cx="170" cy="140" r="7" fill={colors[safeColor].main} />
        <circle cx="40" cy="150" r="8" fill={colors[safeColor].secondary} />
        <circle cx="90" cy="170" r="5" fill={colors[safeColor].main} />
        <circle cx="140" cy="160" r="6" fill={colors[safeColor].secondary} />
      </svg>
    ),
    nodes: (
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
        <path d="M40,40 m-15,0 a15,15 0 1,0 30,0 a15,15 0 1,0 -30,0" fill="none" stroke={colors[safeColor].main} strokeWidth="1.5" />
        <circle cx="40" cy="40" r="5" fill={colors[safeColor].main} />
        
        <path d="M140,50 m-15,0 a15,15 0 1,0 30,0 a15,15 0 1,0 -30,0" fill="none" stroke={colors[safeColor].secondary} strokeWidth="1.5" />
        <circle cx="140" cy="50" r="5" fill={colors[safeColor].secondary} />
        
        <path d="M70,120 m-15,0 a15,15 0 1,0 30,0 a15,15 0 1,0 -30,0" fill="none" stroke={colors[safeColor].main} strokeWidth="1.5" />
        <circle cx="70" cy="120" r="5" fill={colors[safeColor].main} />
        
        <path d="M160,140 m-15,0 a15,15 0 1,0 30,0 a15,15 0 1,0 -30,0" fill="none" stroke={colors[safeColor].secondary} strokeWidth="1.5" />
        <circle cx="160" cy="140" r="5" fill={colors[safeColor].secondary} />
      </svg>
    ),
    connections: (
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
        <path d="M40,40 L140,50" stroke={colors[safeColor].main} strokeWidth="1" />
        <path d="M140,50 L70,120" stroke={colors[safeColor].secondary} strokeWidth="1" />
        <path d="M70,120 L160,140" stroke={colors[safeColor].main} strokeWidth="1" />
        <path d="M40,40 L70,120" stroke={colors[safeColor].secondary} strokeWidth="1" />
        
        <circle cx="40" cy="40" r="4" fill={colors[safeColor].main} />
        <circle cx="140" cy="50" r="4" fill={colors[safeColor].secondary} />
        <circle cx="70" cy="120" r="4" fill={colors[safeColor].main} />
        <circle cx="160" cy="140" r="4" fill={colors[safeColor].secondary} />
      </svg>
    ),
    full: (
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
        {/* Connections */}
        <path d="M40,40 L140,50" stroke={colors[safeColor].main} strokeWidth="1" />
        <path d="M140,50 L70,120" stroke={colors[safeColor].secondary} strokeWidth="1" />
        <path d="M70,120 L160,140" stroke={colors[safeColor].main} strokeWidth="1" />
        <path d="M40,40 L70,120" stroke={colors[safeColor].secondary} strokeWidth="1" />
        <path d="M140,50 L160,140" stroke={colors[safeColor].main} strokeWidth="1" />
        
        {/* Nodes */}
        <path d="M40,40 m-10,0 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0" fill="none" stroke={colors[safeColor].main} strokeWidth="1" />
        <circle cx="40" cy="40" r="4" fill={colors[safeColor].main} />
        
        <path d="M140,50 m-10,0 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0" fill="none" stroke={colors[safeColor].secondary} strokeWidth="1" />
        <circle cx="140" cy="50" r="4" fill={colors[safeColor].secondary} />
        
        <path d="M70,120 m-10,0 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0" fill="none" stroke={colors[safeColor].main} strokeWidth="1" />
        <circle cx="70" cy="120" r="4" fill={colors[safeColor].main} />
        
        <path d="M160,140 m-10,0 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0" fill="none" stroke={colors[safeColor].secondary} strokeWidth="1" />
        <circle cx="160" cy="140" r="4" fill={colors[safeColor].secondary} />
        
        {/* Extra Circles */}
        <circle cx="100" cy="80" r="3" fill={colors[safeColor].main} />
        <circle cx="120" cy="100" r="2" fill={colors[safeColor].secondary} />
        <circle cx="60" cy="80" r="2" fill={colors[safeColor].secondary} />
        <circle cx="110" cy="140" r="3" fill={colors[safeColor].main} />
      </svg>
    ),
  };

  return (
    <div 
      className={`${sizes[size]} ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {patterns[safeVariant]}
    </div>
  );
}

/**
 * Composant qui génère un motif de réseau aléatoire couvrant tout un conteneur
 */
export function NetworkBackground({
  color = 'mixed',
  density = 'medium',
  className = '',
  opacity = 0.05,
}: {
  color?: PatternColor;
  density?: 'low' | 'medium' | 'high';
  className?: string;
  opacity?: number;
}) {
  const densityMap = {
    low: 5,
    medium: 10,
    high: 20,
  };
  
  const count = densityMap[density];
  
  // Générer des configurations aléatoires pour les patterns
  const patterns = Array.from({ length: count }, (_, i) => ({
    id: i,
    variant: ['circles', 'nodes', 'connections', 'full'][Math.floor(Math.random() * 4)] as PatternVariant,
    size: ['sm', 'md', 'lg'][Math.floor(Math.random() * 3)] as 'sm' | 'md' | 'lg',
    left: Math.floor(Math.random() * 90) + '%',
    top: Math.floor(Math.random() * 90) + '%',
    rotate: Math.floor(Math.random() * 360),
    opacity: (Math.random() * 0.1) + (opacity / 2),
    color: color === 'mixed' 
      ? ['primary', 'secondary', 'mixed'][Math.floor(Math.random() * 3)] as PatternColor
      : color,
  }));

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {patterns.map(pattern => (
        <div 
          key={pattern.id}
          className="absolute"
          style={{ 
            left: pattern.left, 
            top: pattern.top,
          }}
        >
          <NetworkPattern 
            variant={pattern.variant}
            color={pattern.color}
            size={pattern.size}
            opacity={pattern.opacity}
            rotate={pattern.rotate}
          />
        </div>
      ))}
    </div>
  );
}

/**
 * Extrait des fragments du SVG réseau original pour les réutiliser comme éléments de design
 */
export function NetworkFragment({
  fragment = 'circles',
  color = 'primary',
  className = '',
  opacity = 0.3,
  size = 'sm',
}: {
  fragment: 'circles' | 'nodes' | 'flow' | 'connectors';
  color?: PatternColor;
  className?: string;
  opacity?: number;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-40 h-40',
  };

  const colors = {
    primary: '#72acd1',
    secondary: '#aa2b37',
    mixed: 'url(#mixed-gradient)',
  };

  // Vérifications de sécurité
  const safeColor = (color === 'primary' || color === 'secondary' || color === 'mixed') 
    ? color 
    : 'primary';
    
  const safeFragment = (fragment === 'circles' || fragment === 'nodes' || fragment === 'flow' || fragment === 'connectors')
    ? fragment
    : 'circles';

  // Fragments extraits du SVG d'origine
  const fragments = {
    circles: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
        <defs>
          <linearGradient id="mixed-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#72acd1" />
            <stop offset="100%" stopColor="#aa2b37" />
          </linearGradient>
        </defs>
        <circle cx="30" cy="30" r="7" fill={colors[safeColor]} />
        <circle cx="70" cy="30" r="7" fill={colors[safeColor]} />
        <circle cx="30" cy="70" r="7" fill={colors[safeColor]} />
        <circle cx="70" cy="70" r="7" fill={colors[safeColor]} />
      </svg>
    ),
    nodes: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
        <defs>
          <linearGradient id="mixed-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#72acd1" />
            <stop offset="100%" stopColor="#aa2b37" />
          </linearGradient>
        </defs>
        <path d="M50,50 m-20,0 a20,20 0 1,0 40,0 a20,20 0 1,0 -40,0" fill="none" stroke={colors[safeColor]} strokeWidth="2" />
        <circle cx="50" cy="50" r="6" fill={colors[safeColor]} />
      </svg>
    ),
    flow: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
        <defs>
          <linearGradient id="mixed-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#72acd1" />
            <stop offset="100%" stopColor="#aa2b37" />
          </linearGradient>
        </defs>
        <path d="M20,20 C40,20 60,20 80,80" fill="none" stroke={colors[safeColor]} strokeWidth="2" />
        <circle cx="20" cy="20" r="4" fill={colors[safeColor]} />
        <circle cx="80" cy="80" r="4" fill={colors[safeColor]} />
      </svg>
    ),
    connectors: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
        <defs>
          <linearGradient id="mixed-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#72acd1" />
            <stop offset="100%" stopColor="#aa2b37" />
          </linearGradient>
        </defs>
        <path d="M20,20 L80,20" stroke={colors[safeColor]} strokeWidth="2" />
        <path d="M20,50 L80,50" stroke={colors[safeColor]} strokeWidth="2" />
        <path d="M20,80 L80,80" stroke={colors[safeColor]} strokeWidth="2" />
        <circle cx="20" cy="20" r="3" fill={colors[safeColor]} />
        <circle cx="80" cy="20" r="3" fill={colors[safeColor]} />
        <circle cx="20" cy="50" r="3" fill={colors[safeColor]} />
        <circle cx="80" cy="50" r="3" fill={colors[safeColor]} />
        <circle cx="20" cy="80" r="3" fill={colors[safeColor]} />
        <circle cx="80" cy="80" r="3" fill={colors[safeColor]} />
      </svg>
    ),
  };

  return (
    <div className={`${sizes[size]} ${className}`}>
      {fragments[safeFragment]}
    </div>
  );
} 