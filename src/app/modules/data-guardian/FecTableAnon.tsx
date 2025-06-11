import React from 'react';
import { FecTable } from './FecTable';

interface FecTableAnonProps {
  data: any[] | null;
  sensitiveColumns?: string[];
}

export function FecTableAnon({ data, sensitiveColumns = [] }: FecTableAnonProps) {
  return (
    <FecTable 
      data={data} 
      sensitiveColumns={sensitiveColumns}
      title="Données anonymisées"
    />
  );
} 