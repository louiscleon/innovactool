"use client";

import { useState } from 'react';
import { ChevronDown, FolderOpen, Users, CheckCircle } from 'lucide-react';
import { Card } from './Card';
import { useClient, Client } from './ClientContext';

interface ClientSelectorProps {
  onClientChange?: (clientId: string) => void;
}

export function ClientSelector({ onClientChange }: ClientSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { activeClient, setActiveClient, clientList } = useClient();

  // Gérer la sélection d'un client
  const handleSelectClient = (client: Client) => {
    setActiveClient(client);
    setIsOpen(false);
    
    if (onClientChange) {
      onClientChange(client.id);
    }
  };

  return (
    <div className="relative w-full">
      {/* Bouton de sélection du client actuel */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <FolderOpen size={16} className="text-primary-500 flex-shrink-0" />
          <span className="text-sm font-medium truncate">{activeClient.name}</span>
        </div>
        <ChevronDown size={14} className={`text-gray-500 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown pour la sélection d'un client */}
      {isOpen && (
        <Card 
          size="sm" 
          className="absolute top-full left-0 right-0 mt-1 z-50"
        >
          <div className="p-2 border-b border-gray-100">
            <p className="text-xs text-gray-500">Sélectionner un dossier client</p>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {clientList.map((client) => (
              <button
                key={client.id}
                className={`w-full flex items-center justify-between p-2 hover:bg-gray-50 text-left ${
                  activeClient.id === client.id ? 'bg-primary-50' : ''
                }`}
                onClick={() => handleSelectClient(client)}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <Users size={14} className={`${activeClient.id === client.id ? 'text-primary-500' : 'text-gray-500'} flex-shrink-0`} />
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium truncate">{client.name}</p>
                    <p className="text-xs text-gray-500 truncate">{client.sector}</p>
                  </div>
                </div>
                {activeClient.id === client.id && (
                  <CheckCircle size={14} className="text-primary-500 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}