"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Shield, Download, FileText, Lock, AlertCircle, X } from 'lucide-react';

interface RgpdPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  filename: string;
  score: number;
  sensitiveColumnsCount: number;
  originalRowCount: number;
  anonymizedRowCount: number;
}

export const RgpdPreviewModal: React.FC<RgpdPreviewModalProps> = ({
  isOpen,
  onClose,
  filename,
  score,
  sensitiveColumnsCount,
  originalRowCount,
  anonymizedRowCount
}) => {
  if (!isOpen) return null;

  const getScoreColor = () => {
    if (score > 90) return 'success';
    if (score > 70) return 'info';
    if (score > 50) return 'warning';
    return 'error';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto shadow-xl"
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary-500" />
            <h2 className="text-lg font-bold text-gray-800">Rapport d'anonymisation RGPD</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="text-xs font-medium text-gray-500 mb-1">Fichier analysé</h3>
              <p className="text-sm font-semibold">{filename}</p>
              <p className="text-xs text-gray-500">{originalRowCount} lignes de données</p>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="text-xs font-medium text-gray-500 mb-1">Score de conformité</h3>
              <div className="flex items-center">
                <Badge color={getScoreColor()} variant="soft" size="sm" className="mr-2">
                  {score}/100
                </Badge>
                <span className="text-xs text-gray-600">
                  {score > 90 ? 'Excellent' : score > 70 ? 'Bon' : score > 50 ? 'Acceptable' : 'Risqué'}
                </span>
              </div>
            </div>
          </div>
          
          <Card className="mb-4" size="sm">
            <div className="p-3">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Colonnes sensibles identifiées</h3>
              
              <div className="bg-warning-50 border border-warning-100 rounded-lg p-2 mb-3">
                <div className="flex items-start">
                  <AlertCircle className="h-3.5 w-3.5 text-warning-500 mr-1.5 mt-0.5 flex-shrink-0" />
                  <p className="text-warning-700 text-xs">
                    Ces colonnes contiennent potentiellement des données à caractère personnel ou sensibles selon le RGPD.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center p-1.5 bg-gray-50 border border-gray-200 rounded text-xs mb-3">
                <Lock className="h-3 w-3 text-warning-500 mr-1.5" />
                <span className="text-gray-700">{sensitiveColumnsCount} colonnes sensibles détectées</span>
              </div>
            </div>
          </Card>
          
          <Card className="mb-4" size="sm">
            <div className="p-3">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Techniques d'anonymisation</h3>
              
              <div className="grid grid-cols-1 gap-2">
                <div className="bg-gray-50 p-2 rounded-lg">
                  <div className="flex items-center">
                    <Badge color="success" variant="soft" size="xs" className="mr-1.5">
                      Masquage
                    </Badge>
                    <span className="text-xs text-gray-600">
                      Conservation partielle (ex: Ab****45)
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-2 rounded-lg">
                  <div className="flex items-center">
                    <Badge color="primary" variant="soft" size="xs" className="mr-1.5">
                      Hachage
                    </Badge>
                    <span className="text-xs text-gray-600">
                      Transformation cryptographique (ex: h3f7a9d2e)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="mb-4" size="sm">
            <div className="p-3">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Recommandations RGPD</h3>
              
              <ul className="text-xs text-gray-600 space-y-1.5 pl-5 list-disc">
                <li>Conserver ce rapport avec le FEC anonymisé pour documenter la conformité</li>
                <li>Réaliser une analyse annuelle des flux de données personnelles</li>
                <li>Mettre à jour la cartographie des données et le registre des traitements</li>
                <li>Former les collaborateurs aux bonnes pratiques RGPD</li>
              </ul>
            </div>
          </Card>
          
          <div className="flex justify-end mt-4 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onClose}
            >
              Fermer
            </Button>
            
            <Button 
              variant="primary" 
              size="sm"
              className="flex items-center gap-1.5"
            >
              <FileText className="h-3.5 w-3.5" />
              <Download className="h-3.5 w-3.5" />
              Télécharger PDF
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}; 