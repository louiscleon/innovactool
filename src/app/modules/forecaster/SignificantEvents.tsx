'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Calendar, ArrowRight, Link as LinkIcon, ExternalLink, AlertTriangle, TrendingUp, TrendingDown, Info, HelpCircle } from 'lucide-react';
import { Tooltip } from '@/components/Tooltip';

export interface Event {
  date: string;
  event: string;
  impact: 'positive' | 'negative' | 'neutral';
  description?: string;
  source?: string;
  probability?: number;
  financial_impact?: string;
  url?: string;
}

interface SignificantEventsProps {
  events: Event[];
  companyName?: string;
  industryName?: string;
}

export default function SignificantEvents({ 
  events, 
  companyName = 'InfoTech Solutions',
  industryName = 'Programmation informatique'
}: SignificantEventsProps) {
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');

  const getImpactColor = (impact: 'positive' | 'negative' | 'neutral') => {
    switch (impact) {
      case 'positive': return 'text-success-600 bg-success-50 border-success-100';
      case 'negative': return 'text-error-600 bg-error-50 border-error-100';
      case 'neutral': return 'text-primary-600 bg-primary-50 border-primary-100';
    }
  };

  const getImpactIcon = (impact: 'positive' | 'negative' | 'neutral') => {
    switch (impact) {
      case 'positive': return <TrendingUp className="w-4 h-4 text-success-500" />;
      case 'negative': return <TrendingDown className="w-4 h-4 text-error-500" />;
      case 'neutral': return <Activity className="w-4 h-4 text-primary-500" />;
    }
  };

  const getImpactText = (impact: 'positive' | 'negative' | 'neutral') => {
    switch (impact) {
      case 'positive': return 'Impact positif';
      case 'negative': return 'Impact négatif';
      case 'neutral': return 'Impact neutre';
    }
  };

  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(event => event.impact === filter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <div className="flex items-center">
          <Activity className="w-5 h-5 text-primary-500 mr-2" />
          <h3 className="text-sm font-medium text-gray-700">Événements significatifs</h3>
          <Tooltip text={`Événements qui pourraient impacter les projections financières de ${companyName} dans les prochains trimestres. Ces éléments ont été pris en compte dans les scénarios.`}>
            <HelpCircle size={14} className="ml-1.5 text-gray-400" />
          </Tooltip>
        </div>
        
        <div className="flex items-center space-x-1 text-xs">
          <button 
            className={`px-2 py-1 rounded-md transition-colors ${filter === 'all' ? 'bg-gray-100 text-gray-700 font-medium' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setFilter('all')}
          >
            Tous
          </button>
          <button 
            className={`px-2 py-1 rounded-md transition-colors ${filter === 'positive' ? 'bg-success-50 text-success-700 font-medium' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setFilter('positive')}
          >
            Positifs
          </button>
          <button 
            className={`px-2 py-1 rounded-md transition-colors ${filter === 'negative' ? 'bg-error-50 text-error-700 font-medium' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setFilter('negative')}
          >
            Négatifs
          </button>
          <button 
            className={`px-2 py-1 rounded-md transition-colors ${filter === 'neutral' ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setFilter('neutral')}
          >
            Neutres
          </button>
        </div>
      </div>
      
      <div className="p-4 relative">
        {/* Ligne temporelle verticale */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-100"></div>
        
        {filteredEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-gray-50 rounded-full">
                <AlertTriangle className="w-6 h-6 text-gray-400" />
              </div>
            </div>
            <p>Aucun événement {filter !== 'all' ? `à impact ${filter}` : ''} n'a été identifié</p>
          </div>
        ) : (
          <div className="space-y-4 relative">
            {filteredEvents.map((event, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="pl-8 relative"
              >
                {/* Indicator on timeline */}
                <div className={`absolute left-[-5px] top-1 w-4 h-4 rounded-full border-2 border-white ${event.impact === 'positive' ? 'bg-success-100' : event.impact === 'negative' ? 'bg-error-100' : 'bg-gray-200'}`}></div>
                
                {/* Card */}
                <div 
                  className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setExpandedEvent(expandedEvent === index ? null : index)}
                >
                  {/* Header */}
                  <div className="flex justify-between items-start p-3 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="w-3.5 h-3.5 text-gray-500 mr-1.5" />
                        <span className="text-xs font-medium">{event.date}</span>
                      </div>
                      <div className={`rounded-full px-2 py-0.5 text-xs ${getImpactColor(event.impact)} flex items-center`}>
                        {getImpactIcon(event.impact)}
                        <span className="ml-1">{getImpactText(event.impact)}</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      {event.probability ? (
                        <div className="flex items-center">
                          <span>Probabilité: {event.probability}%</span>
                          <ArrowRight className="w-3 h-3 mx-1" />
                        </div>
                      ) : null}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-3">
                    <h4 className="text-sm font-medium text-gray-800 mb-1">{event.event}</h4>
                    
                    {/* Only show financial impact preview if not expanded */}
                    {expandedEvent !== index && event.financial_impact && (
                      <div className="text-xs text-gray-600 flex items-center mt-1">
                        <Info className="w-3.5 h-3.5 text-gray-400 mr-1" />
                        <span>Impact financier estimé: {event.financial_impact}</span>
                      </div>
                    )}
                    
                    {/* Expanded content */}
                    {expandedEvent === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                        className="mt-2 space-y-3 text-xs"
                      >
                        {event.description && (
                          <div className="pt-2 pb-3 border-b border-gray-100">
                            <p className="text-gray-600 leading-relaxed">{event.description}</p>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-3">
                          {event.financial_impact && (
                            <div className="p-2 bg-gray-50 rounded border border-gray-100">
                              <div className="text-gray-500 mb-1">Impact financier</div>
                              <div className="font-medium text-gray-900">{event.financial_impact}</div>
                            </div>
                          )}
                          
                          {event.probability && (
                            <div className="p-2 bg-gray-50 rounded border border-gray-100">
                              <div className="text-gray-500 mb-1">Probabilité</div>
                              <div className="font-medium text-gray-900">{event.probability}%</div>
                            </div>
                          )}
                        </div>
                        
                        {event.source && (
                          <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-100">
                            <div className="text-gray-500">Source: {event.source}</div>
                            {event.url && (
                              <a 
                                href={event.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-primary-600 hover:text-primary-700 flex items-center"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Plus d'infos
                                <ExternalLink className="w-3 h-3 ml-1" />
                              </a>
                            )}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 flex items-center justify-between">
        <span>Impact sur la projection: <span className="font-medium">pris en compte</span></span>
        <span>Secteur: {industryName}</span>
      </div>
    </motion.div>
  );
} 