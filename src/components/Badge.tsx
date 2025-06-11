"use client";

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'filled' | 'outline' | 'soft' | 'dot';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'gray';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export function Badge({ 
  children, 
  variant = 'default', 
  color = 'gray',
  size = 'sm',
  className = '',
  icon
}: BadgeProps) {
  const colorSchemes = {
    primary: {
      default: 'bg-primary-100 text-primary-800 ring-1 ring-inset ring-primary-200',
      filled: 'bg-primary-500 text-white',
      outline: 'text-primary-700 ring-1 ring-inset ring-primary-600/20',
      soft: 'bg-primary-50 text-primary-700',
      dot: 'text-primary-700',
    },
    secondary: {
      default: 'bg-secondary-100 text-secondary-800 ring-1 ring-inset ring-secondary-200',
      filled: 'bg-secondary-400 text-white',
      outline: 'text-secondary-700 ring-1 ring-inset ring-secondary-600/20',
      soft: 'bg-secondary-50 text-secondary-700',
      dot: 'text-secondary-700',
    },
    success: {
      default: 'bg-success-100 text-success-800 ring-1 ring-inset ring-success-200',
      filled: 'bg-success-500 text-white',
      outline: 'text-success-700 ring-1 ring-inset ring-success-600/20',
      soft: 'bg-success-50 text-success-700',
      dot: 'text-success-700',
    },
    warning: {
      default: 'bg-warning-100 text-warning-800 ring-1 ring-inset ring-warning-200',
      filled: 'bg-warning-500 text-white',
      outline: 'text-warning-700 ring-1 ring-inset ring-warning-600/20',
      soft: 'bg-warning-50 text-warning-700',
      dot: 'text-warning-700',
    },
    error: {
      default: 'bg-error-100 text-error-800 ring-1 ring-inset ring-error-200',
      filled: 'bg-error-500 text-white',
      outline: 'text-error-700 ring-1 ring-inset ring-error-600/20',
      soft: 'bg-error-50 text-error-700',
      dot: 'text-error-700',
    },
    info: {
      default: 'bg-info-100 text-info-800 ring-1 ring-inset ring-info-200',
      filled: 'bg-info-500 text-white',
      outline: 'text-info-700 ring-1 ring-inset ring-info-600/20',
      soft: 'bg-info-50 text-info-700',
      dot: 'text-info-700',
    },
    gray: {
      default: 'bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-200',
      filled: 'bg-gray-500 text-white',
      outline: 'text-gray-600 ring-1 ring-inset ring-gray-500/20',
      soft: 'bg-gray-50 text-gray-700',
      dot: 'text-gray-600',
    },
  };

  // Vérifier si la couleur est valide, sinon utiliser 'gray' comme fallback
  const validColor = (color && colorSchemes[color]) ? color : 'gray';
  // Vérifier si la variante est valide, sinon utiliser 'default' comme fallback
  const validVariant = (variant && colorSchemes[validColor][variant]) ? variant : 'default';

  const sizes = {
    xs: 'text-[10px] px-1 py-0.5 leading-none',
    sm: 'text-xs px-1.5 py-0.5 leading-none',
    md: 'text-sm px-2 py-0.5',
  };

  const base = 'inline-flex items-center font-medium rounded-full transition-colors whitespace-nowrap';
  
  // Pour le style avec un point (dot)
  if (validVariant === 'dot') {
    return (
      <span className={`inline-flex items-center ${sizes[size]} ${colorSchemes[validColor][validVariant]} ${className}`}>
        <span className={`mr-1 h-1.5 w-1.5 rounded-full bg-current`}></span>
        {children}
      </span>
    );
  }
  
  return (
    <span className={`${base} ${sizes[size]} ${colorSchemes[validColor][validVariant]} ${className}`}>
      {icon && <span className="mr-0.5 -ml-0.5">{icon}</span>}
      {children}
    </span>
  );
} 