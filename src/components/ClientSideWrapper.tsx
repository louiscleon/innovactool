"use client";

import React, { useState, useEffect } from 'react';
import { ClientProvider } from './ClientContext';
import { Sidebar } from './Sidebar';
import ClientLayout from './ClientLayout';
import { ThemeProvider } from './ThemeProvider';

export function ClientSideWrapper({ children }: { children: React.ReactNode }) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  
  useEffect(() => {
    // Check localStorage for sidebar state on client-side
    const savedState = localStorage.getItem('sidebar-expanded');
    if (savedState) {
      setIsSidebarExpanded(savedState === 'true');
    }
    
    // Listen for changes to sidebar state
    const handleStorageChange = () => {
      const currentState = localStorage.getItem('sidebar-expanded');
      setIsSidebarExpanded(currentState === 'true');
    };
    
    // Custom event listener for sidebar toggle
    const handleSidebarToggle = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsSidebarExpanded(customEvent.detail.expanded);
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('sidebarToggle', handleSidebarToggle);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sidebarToggle', handleSidebarToggle);
    };
  }, []);

  return (
    <ThemeProvider>
      <ClientProvider>
        <div className="flex min-h-screen w-full">
          <Sidebar />
          <div 
            className={`flex-1 transition-all duration-300 ease-in-out ${
              isSidebarExpanded ? 'ml-64' : 'ml-16'
            }`}
          >
            <ClientLayout>
              {children}
            </ClientLayout>
          </div>
        </div>
      </ClientProvider>
    </ThemeProvider>
  );
} 