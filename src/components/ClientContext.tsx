"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Définition du type Client
export interface Client {
  id: string;
  name: string;
  sector: string;
  status: string;
  siren?: string;
  email?: string;
}

// Données fictives des clients
export const mockClients: Client[] = [
  { id: '1', name: 'InfoTech Solution', sector: 'Informatique', status: 'active', siren: '123456789', email: 'louis@cleon.app' },
  { id: '2', name: 'BioMed Research', sector: 'Santé', status: 'active', siren: '987654321' },
  { id: '3', name: 'EcoVert Énergie', sector: 'Énergie', status: 'active', siren: '456789123' },
  { id: '4', name: 'Construx BTP', sector: 'Construction', status: 'inactive', siren: '789123456' },
  { id: '5', name: 'InnoFinance', sector: 'Finance', status: 'active', siren: '654321987' },
];

// Structure du contexte
interface ClientContextType {
  activeClient: Client;
  setActiveClient: (client: Client) => void;
  clientList: Client[];
}

// Création du contexte avec une valeur par défaut
const ClientContext = createContext<ClientContextType>({
  activeClient: mockClients[0],
  setActiveClient: () => {},
  clientList: mockClients
});

// Hook personnalisé pour utiliser le contexte
export const useClient = () => useContext(ClientContext);

// Provider qui encapsule l'application
export function ClientProvider({ children }: { children: ReactNode }) {
  const [activeClient, setActiveClient] = useState<Client>(mockClients[0]);
  
  // Charger le client actif depuis localStorage si disponible
  useEffect(() => {
    const savedClientId = localStorage.getItem('active-client-id');
    if (savedClientId) {
      const client = mockClients.find(c => c.id === savedClientId);
      if (client) {
        setActiveClient(client);
      }
    }
  }, []);

  // Sauvegarder le client actif dans localStorage quand il change
  useEffect(() => {
    localStorage.setItem('active-client-id', activeClient.id);
  }, [activeClient]);

  return (
    <ClientContext.Provider value={{ 
      activeClient, 
      setActiveClient, 
      clientList: mockClients 
    }}>
      {children}
    </ClientContext.Provider>
  );
} 