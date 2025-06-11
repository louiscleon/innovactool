"use client";

import React from 'react';

export function Loader({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative w-12 h-12">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-t-primary-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
      <div className="text-center">
        <Loader className="mb-4" />
        <p className="text-gray-600 text-sm animate-pulse">Chargement des données...</p>
      </div>
    </div>
  );
}

export function InlineLoader({ text = 'Chargement...' }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-6">
      <div className="w-4 h-4 border-2 border-t-primary-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mr-3"></div>
      <span className="text-sm text-gray-500">{text}</span>
    </div>
  );
} 