"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { GuideButton } from './GuideInteractif';

// Définir les couleurs et styles du thème
export const themeColors = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
};

// Contexte du thème
type ThemeContextType = {
  colors: typeof themeColors;
};

const ThemeContext = createContext<ThemeContextType>({
  colors: themeColors,
});

// Hook pour utiliser le thème
export const useTheme = () => useContext(ThemeContext);

// Propriétés du provider
interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Exposer les couleurs du thème via le contexte
  const themeValue = {
    colors: themeColors,
  };

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
      <GuideButton />
      
      {/* Classes CSS génériques pour standardiser l'apparence */}
      <style jsx global>{`
        :root {
          --color-primary: ${themeColors.primary[500]};
          --color-primary-hover: ${themeColors.primary[600]};
          --color-primary-light: ${themeColors.primary[100]};
          --color-secondary: ${themeColors.secondary[500]};
          --color-success: ${themeColors.success[500]};
          --color-warning: ${themeColors.warning[500]};
          --color-error: ${themeColors.error[500]};
        }
        
        /* Scrollbars personnalisés pour plus de cohérence */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: ${themeColors.secondary[100]};
        }
        
        ::-webkit-scrollbar-thumb {
          background: ${themeColors.secondary[300]};
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: ${themeColors.secondary[400]};
        }
        
        /* Correction du problème de dépassement */
        .page-container {
          max-height: calc(100vh - 120px);
          overflow-y: auto;
          padding-bottom: 2rem;
        }
      `}</style>
    </ThemeContext.Provider>
  );
} 