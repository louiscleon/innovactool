"use client";

import React from 'react';
import { Building2, MapPin, Users, Phone, Mail, Globe, Calendar, CreditCard, FileText, Award, ExternalLink } from 'lucide-react';
import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { NetworkElement } from './NetworkElements';
import { ClientInfo } from '@/services/clientDataService';
import { Tooltip } from './Tooltip';

interface ClientDetailViewProps {
  client: ClientInfo;
  className?: string;
  showActions?: boolean;
}

export const ClientDetailView: React.FC<ClientDetailViewProps> = ({
  client,
  className = '',
  showActions = true
}) => {
  // Formater un numéro SIREN avec des espaces
  const formatSiren = (siren: string) => {
    if (!siren) return '';
    return siren.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
  };

  // Formater une date au format français
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      return dateStr;
    }
  };

  // Formater un montant en euros
  const formatEuros = (amount: number) => {
    if (amount === undefined || amount === null) return '';
    return amount.toLocaleString('fr-FR') + ' €';
  };

  return (
    <Card className={`relative overflow-hidden ${className}`} size="sm">
      <NetworkElement 
        type="node" 
        size="sm" 
        position="bottom-right" 
        color="primary" 
        opacity={0.04} 
      />
      
      <div className="flex items-center justify-between p-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary-500" />
          <h2 className="text-sm font-semibold text-gray-800">Identité légale</h2>
        </div>
        
        <Badge color="primary" variant="soft" size="xs">
          {client.sector_code}
        </Badge>
      </div>
      
      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{client.name}</h3>
          <p className="text-sm text-gray-500">{client.legal_form}</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex items-start mb-3">
              <div className="mt-0.5 mr-2 text-gray-400">
                <MapPin size={16} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-700 mb-0.5">Adresse</p>
                <p className="text-sm text-gray-600">{client.address}</p>
              </div>
            </div>
            
            <div className="flex items-start mb-3">
              <div className="mt-0.5 mr-2 text-gray-400">
                <Users size={16} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-700 mb-0.5">Employés</p>
                <p className="text-sm text-gray-600">{client.employees || 'Non renseigné'}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="mt-0.5 mr-2 text-gray-400">
                <Calendar size={16} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-700 mb-0.5">Date de création</p>
                <p className="text-sm text-gray-600">{formatDate(client.creation_date)}</p>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-start mb-3">
              <div className="mt-0.5 mr-2 text-gray-400">
                <FileText size={16} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-700 mb-0.5">SIREN</p>
                <p className="text-sm text-gray-600">{formatSiren(client.siren)}</p>
              </div>
            </div>
            
            <div className="flex items-start mb-3">
              <div className="mt-0.5 mr-2 text-gray-400">
                <CreditCard size={16} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-700 mb-0.5">Capital social</p>
                <p className="text-sm text-gray-600">{formatEuros(client.capital)}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="mt-0.5 mr-2 text-gray-400">
                <Award size={16} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-700 mb-0.5">Secteur d'activité</p>
                <Tooltip text={`Code APE: ${client.sector_code}`}>
                  <p className="text-sm text-gray-600">{client.sector_name}</p>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-700 mb-2">Direction</p>
          <div className="space-y-2">
            {client.directors.map((director, index) => (
              <div key={index} className="bg-gray-50 p-2 rounded-md">
                <div className="text-sm font-medium">{director.name}</div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{director.role}</span>
                  {director.since && (
                    <span className="text-xs text-gray-500">Depuis {formatDate(director.since)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {showActions && (
          <div className="flex gap-2 border-t border-gray-100 pt-4">
            <Button 
              variant="outline" 
              size="xs" 
              className="flex-1"
              icon={<Globe size={14} />}
            >
              Site web
            </Button>
            <Button 
              variant="outline" 
              size="xs" 
              className="flex-1"
              icon={<FileText size={14} />}
            >
              Documents
            </Button>
            <Button 
              variant="primary" 
              size="xs" 
              className="flex-1"
              icon={<ExternalLink size={14} />}
            >
              Infogreffe
            </Button>
          </div>
        )}
        
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center">
            <Badge color="success" variant="soft" size="xs" className="mr-2">
              Nouveau
            </Badge>
            <p className="text-xs text-gray-600">
              Le DW mutualisé enrichit ces données avec des informations provenant de 1160 entreprises similaires.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}; 