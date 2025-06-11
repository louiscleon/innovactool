"use client";

import React, { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

interface FecUploaderProps {
  onUpload: (file: File) => void;
}

export function FecUploader({ onUpload }: FecUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const processFile = (file: File) => {
    setError(null);
    
    // Vérifier si c'est un .csv, .txt ou .xls(x)
    const validExtensions = ['.csv', '.txt', '.xls', '.xlsx'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      setError('Format de fichier non pris en charge. Veuillez utiliser un fichier .csv, .txt ou .xls(x)');
      return;
    }

    setFileName(file.name);
    setFileSize(formatFileSize(file.size));
    setFileType(file.type || fileExtension.substring(1).toUpperCase());
    onUpload(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card 
      variant={fileName ? "default" : "bordered"}
      className={`transition-all duration-300 ${
        isDragging 
          ? 'border-primary-400 bg-primary-50'
          : fileName 
            ? 'bg-white' 
            : 'hover:border-secondary-300'
      }`}
      size="sm"
    >
      <div
        className="text-center p-3"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept=".csv,.txt,.xls,.xlsx"
        />
        
        {fileName ? (
          <div className="flex flex-col items-center animate-fade-in">
            <div className="bg-success-50 p-2 rounded-full mb-2">
              <CheckCircle2 className="h-7 w-7 text-success-500" />
            </div>
            
            <h3 className="text-base font-bold text-gray-800 mb-1">
              Fichier chargé avec succès
            </h3>
            
            <div className="flex items-center justify-center mb-3">
              <FileText className="mr-1.5 h-4 w-4 text-primary-500" />
              <span className="text-sm font-medium text-gray-700">{fileName}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4 text-xs text-gray-500">
              <div>
                <p className="font-bold text-gray-700">Type</p>
                <p>{fileType}</p>
              </div>
              <div>
                <p className="font-bold text-gray-700">Taille</p>
                <p>{fileSize}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className={`transition-transform duration-500 ${isDragging ? 'scale-110' : 'scale-100'}`}>
              <div className="bg-secondary-50 p-3 rounded-full inline-block mb-3">
                <Upload className="h-8 w-8 text-secondary-400" />
              </div>
            </div>
            
            <h3 className="text-base font-bold text-gray-800 mb-1.5">
              Déposez votre fichier FEC ici
            </h3>
            
            <p className="text-xs text-gray-500 mb-4 max-w-md mx-auto">
              Faites glisser et déposez votre fichier, ou cliquez pour parcourir. 
              Formats acceptés : CSV (UTF-8), TXT, Excel.
            </p>
          </div>
        )}
        
        {error && (
          <div className="bg-error-50 text-error-700 p-2.5 rounded-lg mb-3 flex items-center animate-fade-in text-xs">
            <AlertCircle className="h-4 w-4 mr-1.5 flex-shrink-0" />
            {error}
          </div>
        )}
        
        <Button 
          variant={fileName ? "secondary" : "primary"} 
          onClick={handleButtonClick}
          type="button"
          size="sm"
        >
          {fileName ? 'Changer de fichier' : 'Parcourir les fichiers'}
        </Button>
      </div>
    </Card>
  );
} 