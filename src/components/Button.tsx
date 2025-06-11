"use client";

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'subtle' | 'text';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon,
  iconPosition = 'left',
  fullWidth = false,
  isLoading = false,
  className = '',
  ...props 
}: ButtonProps) {
  
  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3.5 py-2 text-sm',
    lg: 'px-4 py-2.5 text-base',
  };
  
  const variants = {
    primary: 'bg-primary-500 text-white shadow-sm hover:bg-primary-600 active:bg-primary-700 focus:ring-primary-300',
    secondary: 'bg-secondary-300 text-primary-700 shadow-sm hover:bg-secondary-400 active:bg-secondary-500 focus:ring-secondary-200',
    outline: 'border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 active:bg-gray-100 focus:ring-gray-200',
    subtle: 'bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300 focus:ring-gray-200',
    text: 'text-primary-600 hover:text-primary-700 active:text-primary-800 hover:bg-gray-50 focus:ring-primary-100',
  };

  const iconSizes = {
    xs: 'h-3 w-3',
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  // Base commune à tous les boutons
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed';
  
  return (
    <button 
      className={`
        ${base} 
        ${sizes[size]} 
        ${variants[variant]} 
        ${fullWidth ? 'w-full' : ''} 
        ${className}
      `}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg className={`animate-spin -ml-1 mr-1.5 ${iconSizes[size]}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {/* Icône alignée à gauche */}
      {icon && iconPosition === 'left' && !isLoading && (
        <span className={`inline-flex items-center justify-center mr-1.5 ${iconSizes[size]}`}>
          {icon}
        </span>
      )}
      
      {/* Contenu du bouton */}
      <span className="inline-flex items-center">{children}</span>
      
      {/* Icône alignée à droite */}
      {icon && iconPosition === 'right' && (
        <span className={`inline-flex items-center justify-center ml-1.5 ${iconSizes[size]}`}>
          {icon}
        </span>
      )}
    </button>
  );
} 