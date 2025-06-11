"use client";

import React from 'react';

interface CardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  variant?: 'default' | 'bordered' | 'elevated' | 'glass' | 'flat';
  interactive?: boolean;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  isHoverable?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Card({ 
  title, 
  description,
  children, 
  variant = 'default',
  interactive = false,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  icon,
  footer,
  isHoverable = false,
  size = 'md'
}: CardProps) {
  
  const variants = {
    default: 'bg-white shadow-soft',
    bordered: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-medium',
    glass: 'glass-effect shadow-soft border border-white/20',
    flat: 'bg-gray-50',
  };

  const sizes = {
    sm: {
      card: 'rounded-lg',
      header: 'p-3',
      body: 'px-3 pb-3',
      footer: 'px-3 py-2',
      title: 'text-sm',
      description: 'text-xs'
    },
    md: {
      card: 'rounded-xl',
      header: 'p-4',
      body: 'px-4 pb-4',
      footer: 'px-4 py-3',
      title: 'text-base',
      description: 'text-xs'
    },
    lg: {
      card: 'rounded-xl',
      header: 'p-5',
      body: 'px-5 pb-5',
      footer: 'px-5 py-4',
      title: 'text-lg',
      description: 'text-sm'
    }
  };
  
  const baseCard = `${sizes[size].card} overflow-hidden transition-all duration-200 ${variants[variant]}`;
  const interactiveClasses = interactive ? 'cursor-pointer' : '';
  const hoverClasses = isHoverable ? 'hover:shadow-medium hover:-translate-y-1' : '';
  
  return (
    <div className={`${baseCard} ${interactiveClasses} ${hoverClasses} ${className}`}>
      {(title || icon) && (
        <div className={`flex items-start ${sizes[size].header} ${headerClassName}`}>
          {icon && <div className="flex-shrink-0 mr-2.5">{icon}</div>}
          <div className="flex-1 min-w-0">
            {title && <h3 className={`${sizes[size].title} font-semibold text-gray-900 line-clamp-1`}>{title}</h3>}
            {description && <p className={`mt-0.5 ${sizes[size].description} text-gray-500 line-clamp-2`}>{description}</p>}
          </div>
        </div>
      )}
      
      <div className={`${(title || icon) ? sizes[size].body : sizes[size].header} ${bodyClassName}`}>
        {children}
      </div>
      
      {footer && (
        <div className={`${sizes[size].footer} bg-gray-50 border-t border-gray-100`}>
          {footer}
        </div>
      )}
    </div>
  );
} 