import React from 'react';
import Image from 'next/image';

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface BrandDecorationProps {
  type?: 'logo' | 'logotext' | 'icon';
  size?: Size;
  variant?: 'colored' | 'white' | 'dark';
  className?: string;
}

// Mapping des tailles pour chaque type
const sizeMapping = {
  logo: {
    xs: { width: 60, height: 60 },
    sm: { width: 80, height: 80 },
    md: { width: 120, height: 120 },
    lg: { width: 160, height: 160 },
    xl: { width: 240, height: 240 },
  },
  logotext: {
    xs: { width: 80, height: 20 },
    sm: { width: 120, height: 30 },
    md: { width: 180, height: 45 },
    lg: { width: 240, height: 60 },
    xl: { width: 320, height: 80 },
  },
  icon: {
    xs: { width: 24, height: 24 },
    sm: { width: 32, height: 32 },
    md: { width: 48, height: 48 },
    lg: { width: 64, height: 64 },
    xl: { width: 96, height: 96 },
  }
};

export function BrandDecoration({
  type = 'logo',
  size = 'md',
  variant = 'colored',
  className = '',
}: BrandDecorationProps) {
  // Déterminer le fichier source en fonction du type et de la variante
  let src = '/ressources/logo.svg';
  
  if (type === 'logotext') {
    src = variant === 'white' ? '/ressources/logoblanc.svg' : '/ressources/logo.svg';
  }
  
  const dimensions = sizeMapping[type][size];
  
  return (
    <div className={`relative inline-block ${className}`}>
      <Image
        src={src}
        alt="Logo Innovac'tool"
        width={dimensions.width}
        height={dimensions.height}
        className="object-contain"
      />
    </div>
  );
} 