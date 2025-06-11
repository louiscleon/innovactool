"use client";

import React from 'react';

interface FecTableProps {
  data: any[] | null;
  sensitiveColumns?: string[];
  title?: string;
}

export function FecTable({ data, sensitiveColumns = [], title = "Données brutes FEC" }: FecTableProps) {
  if (!data || data.length === 0 || !data[0]) {
    return (
      <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
        <h3 className="font-bold text-xl mb-4 text-primary">{title}</h3>
        <div className="text-center py-8 text-gray-500">
          Aucune donnée à afficher. Veuillez charger un fichier FEC.
        </div>
      </div>
    );
  }

  // Récupérer les en-têtes (première ligne)
  const headers = Object.keys(data[0]);

  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-bold text-xl text-primary">{title}</h3>
        <p className="text-sm text-gray-500">{data.length} lignes</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header, index) => (
                <th 
                  key={index} 
                  className="px-4 py-2 text-left font-semibold text-gray-700 border-b"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 50).map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                {headers.map((header, cellIndex) => (
                  <td 
                    key={cellIndex} 
                    className="px-4 py-2 border-b border-gray-100 whitespace-nowrap overflow-hidden text-ellipsis"
                    style={{ maxWidth: '200px' }}
                  >
                    {String(row[header] || '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {data.length > 50 && (
          <div className="p-4 text-center text-sm text-gray-500">
            Affichage limité aux 50 premières lignes sur {data.length} au total.
          </div>
        )}
      </div>
    </div>
  );
} 