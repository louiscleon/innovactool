import React, { useState } from 'react';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { NetworkElement } from '@/components/NetworkElements';
import { FileText, AlertCircle, Check, ChevronDown, ChevronUp, Info, FileCheck } from 'lucide-react';

interface ODEntry {
  account: string;
  label: string;
  debit?: number;
  credit?: number;
}

export interface ODProposal {
  id: string;
  description: string;
  date: string;
  entries: ODEntry[];
  justification: string;
  anomalyId: string;
  impact: {
    balance_sheet?: string;
    income_statement?: string;
    tax?: string;
  };
  reference?: string;
}

interface CorrectionODProposalProps {
  od: ODProposal;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const formatEuros = (amount?: number) => {
  if (amount === undefined) return '';
  return amount.toLocaleString('fr-FR') + ' €';
};

export const CorrectionODProposal: React.FC<CorrectionODProposalProps> = ({
  od,
  onApprove,
  onReject
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const totalDebit = od.entries.reduce((sum, entry) => sum + (entry.debit || 0), 0);
  const totalCredit = od.entries.reduce((sum, entry) => sum + (entry.credit || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;
  
  return (
    <Card size="sm" className="relative overflow-hidden">
      <NetworkElement 
        type="connection" 
        size="sm" 
        position="top-right" 
        color="primary" 
        opacity={0.04} 
      />
      
      <div className="flex items-center justify-between p-3 border-b border-gray-100">
        <div className="flex items-center">
          <FileText className="h-4 w-4 text-primary-500 mr-2" />
          <h2 className="text-sm font-semibold text-gray-800">Proposition d'OD</h2>
        </div>
        {!isBalanced && (
          <Badge color="error" variant="soft" size="xs">
            <AlertCircle className="h-3 w-3 mr-1" />
            Non équilibrée
          </Badge>
        )}
      </div>
      
      <div className="p-3">
        <div className="flex justify-between mb-2">
          <h3 className="text-xs font-semibold text-gray-800">{od.description}</h3>
          <span className="text-xs text-gray-500">{od.date}</span>
        </div>
        
        <div className="mb-3 bg-gray-50 p-2 rounded border border-gray-100">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-gray-600">
            <div className="w-12">Compte</div>
            <div className="flex-1 ml-2">Libellé</div>
            <div className="w-24 text-right">Débit</div>
            <div className="w-24 text-right">Crédit</div>
          </div>
          
          <div className="space-y-1">
            {od.entries.map((entry, index) => (
              <div key={index} className="flex items-center text-xs text-gray-800">
                <div className="w-12 font-medium">{entry.account}</div>
                <div className="flex-1 ml-2 truncate">{entry.label}</div>
                <div className="w-24 text-right">{formatEuros(entry.debit)}</div>
                <div className="w-24 text-right">{formatEuros(entry.credit)}</div>
              </div>
            ))}
            
            <div className="flex items-center text-xs font-medium text-gray-800 border-t border-gray-200 pt-1 mt-1">
              <div className="w-12"></div>
              <div className="flex-1 ml-2">Total</div>
              <div className="w-24 text-right">{formatEuros(totalDebit)}</div>
              <div className="w-24 text-right">{formatEuros(totalCredit)}</div>
            </div>
          </div>
        </div>
        
        <button 
          className="flex items-center text-xs text-primary-600 hover:text-primary-700 mb-3"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <ChevronUp size={14} className="mr-1" />
              Masquer la justification
            </>
          ) : (
            <>
              <ChevronDown size={14} className="mr-1" />
              Afficher la justification
            </>
          )}
        </button>
        
        {isExpanded && (
          <div className="mb-3 text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
            <div className="flex items-center mb-1">
              <Info size={14} className="text-info-500 mr-1" />
              <span className="font-medium">Justification</span>
            </div>
            <p className="mb-2">{od.justification}</p>
            
            {od.impact && (
              <div>
                <div className="font-medium mb-1">Impact:</div>
                <ul className="list-disc pl-4 space-y-0.5">
                  {od.impact.balance_sheet && (
                    <li>Bilan: {od.impact.balance_sheet}</li>
                  )}
                  {od.impact.income_statement && (
                    <li>Compte de résultat: {od.impact.income_statement}</li>
                  )}
                  {od.impact.tax && (
                    <li>Fiscal: {od.impact.tax}</li>
                  )}
                </ul>
              </div>
            )}
            
            {od.reference && (
              <div className="mt-2 pt-1 border-t border-gray-200">
                <div className="font-medium flex items-center">
                  <FileCheck size={12} className="text-primary-500 mr-1" />
                  Référence: 
                </div>
                <p>{od.reference}</p>
              </div>
            )}
          </div>
        )}
        
        <div className="flex justify-end space-x-2">
          <Button 
            size="xs" 
            variant="outline" 
            onClick={() => onReject(od.id)}
          >
            Rejeter
          </Button>
          <Button 
            size="xs" 
            variant="primary"
            disabled={!isBalanced}
            onClick={() => onApprove(od.id)}
          >
            <Check size={14} className="mr-1" />
            Approuver l'OD
          </Button>
        </div>
      </div>
    </Card>
  );
}; 