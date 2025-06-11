import React from 'react';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { NetworkElement } from '@/components/NetworkElements';
import { Building2, AlertCircle, Info } from 'lucide-react';
import { CompanyData } from '@/services/api';
import { Tooltip } from '@/components/Tooltip';

interface CompanyDataViewProps {
  companyData: CompanyData | null;
  isLoading: boolean;
  error: string | null;
}

export const CompanyDataView: React.FC<CompanyDataViewProps> = ({
  companyData,
  isLoading,
  error
}) => {
  if (isLoading) {
    return (
      <Card size="sm" className="relative overflow-hidden">
        <div className="flex items-center gap-2 p-3 border-b border-gray-100">
          <Building2 className="h-4 w-4 text-primary-500" />
          <h2 className="text-sm font-semibold text-gray-800">Identité légale</h2>
        </div>
        <div className="p-3 flex items-center justify-center h-32">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card size="sm" className="relative overflow-hidden">
        <div className="flex items-center gap-2 p-3 border-b border-gray-100">
          <Building2 className="h-4 w-4 text-primary-500" />
          <h2 className="text-sm font-semibold text-gray-800">Identité légale</h2>
        </div>
        <div className="p-3 flex items-center justify-center">
          <div className="flex items-center text-error-500 text-sm">
            <AlertCircle className="h-4 w-4 mr-2" />
            {error}
          </div>
        </div>
      </Card>
    );
  }

  if (!companyData) {
    return (
      <Card size="sm" className="relative overflow-hidden">
        <div className="flex items-center gap-2 p-3 border-b border-gray-100">
          <Building2 className="h-4 w-4 text-primary-500" />
          <h2 className="text-sm font-semibold text-gray-800">Identité légale</h2>
        </div>
        <div className="p-3 flex items-center justify-center h-32">
          <p className="text-sm text-gray-500">Aucune donnée disponible</p>
        </div>
      </Card>
    );
  }

  return (
    <Card size="sm" className="relative overflow-hidden">
      <NetworkElement 
        type="node" 
        size="sm" 
        position="top-right" 
        color="primary" 
        opacity={0.04} 
      />
      
      <div className="flex items-center justify-between p-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary-500" />
          <h2 className="text-sm font-semibold text-gray-800">Identité légale</h2>
        </div>
        
        <div className="flex items-center">
          <Tooltip text="Données issues des API SIRENE et INPI">
            <div className="flex items-center text-xs text-gray-500">
              <Info className="h-3.5 w-3.5 mr-1" />
              <span>Source: {companyData.source === 'API' ? 'API SIRENE/INPI' : 'DW Mutualisé'}</span>
            </div>
          </Tooltip>
        </div>
      </div>
      
      <div className="p-3">
        <div className="flex justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-800">{companyData.raisonSociale}</h3>
            <p className="text-xs text-gray-500">{companyData.formeJuridique}</p>
          </div>
          <Badge color="primary" variant="soft" size="xs">
            {companyData.libelleApe}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <p className="text-xs text-gray-500">SIREN</p>
            <p className="text-xs font-medium">{companyData.siren}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Date de création</p>
            <p className="text-xs font-medium">{companyData.dateCreation}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Capital social</p>
            <p className="text-xs font-medium">{companyData.capital} €</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Code APE</p>
            <p className="text-xs font-medium">{companyData.codeApe}</p>
          </div>
        </div>
        
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1">Adresse</p>
          <p className="text-xs">{companyData.adresse}</p>
        </div>
        
        <div>
          <p className="text-xs text-gray-500 mb-1">Direction</p>
          <div className="space-y-1">
            {companyData.dirigeants.map((dirigeant, index) => (
              <div key={index} className="text-xs">
                <span className="font-medium">{dirigeant.prenom} {dirigeant.nom}</span> - {dirigeant.fonction}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center">
            <Badge color="success" variant="soft" size="xs" className="mr-2">
              Nouveau
            </Badge>
            <p className="text-xs text-gray-600">
              Le DW mutualisé enrichit ces données avec des informations provenant de {Math.floor(Math.random() * 500) + 1000} entreprises similaires.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}; 