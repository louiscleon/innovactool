import React, { useState } from 'react';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { NetworkElement } from '@/components/NetworkElements';
import { Globe, AlertCircle, Filter, ExternalLink } from 'lucide-react';
import { NewsData, NewsItem } from '@/services/api';
import { Tooltip } from '@/components/Tooltip';

interface NewsViewProps {
  newsData: NewsData | null;
  isLoading: boolean;
  error: string | null;
}

export const NewsView: React.FC<NewsViewProps> = ({
  newsData,
  isLoading,
  error
}) => {
  const [selectedImpact, setSelectedImpact] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  if (isLoading) {
    return (
      <Card size="sm" className="relative overflow-hidden">
        <div className="flex items-center gap-2 p-3 border-b border-gray-100">
          <Globe className="h-4 w-4 text-primary-500" />
          <h2 className="text-sm font-semibold text-gray-800">Actualité contextuelle</h2>
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
          <Globe className="h-4 w-4 text-primary-500" />
          <h2 className="text-sm font-semibold text-gray-800">Actualité contextuelle</h2>
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

  if (!newsData || !newsData.articles || newsData.articles.length === 0) {
    return (
      <Card size="sm" className="relative overflow-hidden">
        <div className="flex items-center gap-2 p-3 border-b border-gray-100">
          <Globe className="h-4 w-4 text-primary-500" />
          <h2 className="text-sm font-semibold text-gray-800">Actualité contextuelle</h2>
        </div>
        <div className="p-3 flex items-center justify-center h-32">
          <p className="text-sm text-gray-500">Aucune actualité disponible</p>
        </div>
      </Card>
    );
  }

  // Extraire tous les tags uniques
  const allTags = Array.from(
    new Set(
      newsData.articles.flatMap(article => article.tags || [])
    )
  );

  // Filtrer les articles selon l'impact et le tag sélectionnés
  const filteredArticles = newsData.articles.filter(article => {
    const matchesImpact = selectedImpact === 'ALL' || article.impact === selectedImpact;
    const matchesTag = !selectedTag || (article.tags && article.tags.includes(selectedTag));
    return matchesImpact && matchesTag;
  });

  // Fonction pour afficher le badge d'impact
  const renderImpactBadge = (impact: string) => {
    let color: 'success' | 'info' | 'gray';
    let label: string;
    
    switch (impact) {
      case 'HIGH':
        color = 'success';
        label = 'Impact fort';
        break;
      case 'MEDIUM':
        color = 'info';
        label = 'Impact moyen';
        break;
      default:
        color = 'gray';
        label = 'Impact faible';
    }
    
    return (
      <Badge color={color} variant="soft" size="xs">
        {label}
      </Badge>
    );
  };

  return (
    <Card size="sm" className="relative overflow-hidden">
      <NetworkElement 
        type="wave" 
        size="sm" 
        position="bottom-right" 
        color="primary" 
        opacity={0.04} 
      />
      
      <div className="flex items-center justify-between p-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-primary-500" />
          <h2 className="text-sm font-semibold text-gray-800">Actualité contextuelle</h2>
        </div>
        
        <Tooltip text="Données issues de l'analyse du web par IA">
          <div className="text-xs text-gray-500">
            Source: {newsData.source === 'PERPLEXITY_API' ? 'Perplexity API' : 'DW Mutualisé'}
          </div>
        </Tooltip>
      </div>
      
      <div className="p-3 border-b border-gray-100">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center mr-1">
            <Filter className="h-3.5 w-3.5 text-gray-500 mr-1" />
            <span className="text-xs text-gray-500">Filtrer:</span>
          </div>
          
          {/* Filtres d'impact */}
          <button 
            className={`px-2 py-0.5 rounded text-xs ${selectedImpact === 'ALL' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setSelectedImpact('ALL')}
          >
            Tous
          </button>
          <button 
            className={`px-2 py-0.5 rounded text-xs ${selectedImpact === 'HIGH' ? 'bg-success-50 text-success-700' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setSelectedImpact('HIGH')}
          >
            Impact fort
          </button>
          <button 
            className={`px-2 py-0.5 rounded text-xs ${selectedImpact === 'MEDIUM' ? 'bg-info-50 text-info-700' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setSelectedImpact('MEDIUM')}
          >
            Impact moyen
          </button>
        </div>
        
        {/* Tags */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {allTags.map(tag => (
              <button
                key={tag}
                className={`px-2 py-0.5 rounded-full text-xs border ${
                  selectedTag === tag 
                    ? 'border-primary-300 bg-primary-50 text-primary-700' 
                    : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                }`}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="divide-y divide-gray-100">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article, index) => (
            <div key={index} className="p-3">
              <div className="flex justify-between mb-1">
                <p className="text-xs text-gray-500">{article.date} • {article.source}</p>
                {renderImpactBadge(article.impact)}
              </div>
              
              <h3 className="text-sm font-medium text-gray-800 mb-1">{article.title}</h3>
              
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                {article.summary}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {article.tags && article.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="text-xs text-gray-500 hover:text-primary-600 cursor-pointer"
                      onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                
                {article.url && (
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-primary-600 hover:underline flex items-center"
                  >
                    Lire <ExternalLink className="h-3 w-3 ml-0.5" />
                  </a>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-3 flex items-center justify-center">
            <p className="text-sm text-gray-500">Aucune actualité ne correspond aux filtres sélectionnés</p>
          </div>
        )}
      </div>
      
      <div className="p-3 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center">
          <Badge color="success" variant="soft" size="xs" className="mr-2">
            Nouveau
          </Badge>
          <p className="text-xs text-gray-600">
            L'IA du DW mutualisé sélectionne les actualités pertinentes pour votre client et évalue leur impact potentiel.
          </p>
        </div>
      </div>
    </Card>
  );
}; 