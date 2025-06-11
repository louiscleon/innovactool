"use client";

import React, { createContext, useContext } from 'react';
import { cn } from '@/utils';

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

// Define TabsContextType
export interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

// Create and export the context
export const TabsContext = createContext<TabsContextType | null>(null);

// Export a hook for using the context
export function useTabsContext(): TabsContextType {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error("Tabs components must be used within a TabsProvider");
  }
  
  return context;
}

// This function is replaced by TabsProvider below
function TabsRoot({ value, onValueChange, className, children }: TabsProps) {
  return (
    <div className={cn("w-full", className)}>
      {children}
    </div>
  );
}

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

export function TabsList({ className, children }: TabsListProps) {
  return (
    <div className={cn("flex border-b border-gray-200", className)}>
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function TabsTrigger({ value, icon, className, children }: TabsTriggerProps) {
  // Use the custom hook to access context
  const { value: selectedValue, onValueChange } = useTabsContext();
  const isSelected = value === selectedValue;
  
  return (
    <button
      type="button"
      className={cn(
        "px-4 py-2 text-sm font-medium flex items-center gap-1.5 border-b-2 -mb-px",
        isSelected
          ? "text-primary-600 border-primary-500"
          : "text-gray-600 border-transparent hover:text-gray-800 hover:border-gray-300",
        className
      )}
      onClick={() => onValueChange(value)}
    >
      {icon && <span className={isSelected ? "text-primary-500" : "text-gray-400"}>{icon}</span>}
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export function TabsContent({ value, className, children }: TabsContentProps) {
  const { value: selectedValue } = useTabsContext();
  
  if (value !== selectedValue) {
    return null;
  }
  
  return (
    <div className={cn("animate-fade-in", className)}>
      {children}
    </div>
  );
}

// Define the TabsProvider component with the context
export function TabsProvider({ value, onValueChange, className, children }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn("w-full", className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

// Export TabsProvider as Tabs for simplified usage
export { TabsProvider as Tabs }; 