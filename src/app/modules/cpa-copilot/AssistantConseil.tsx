"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCcw, Bot, Database, Server, ChevronDown, Activity, Code, FilePieChart } from 'lucide-react';
import { Button } from '@/components/Button';
import { NetworkElement } from '@/components/NetworkElements';
import { Card } from '@/components/Card';
import { AnimatedElement } from '@/components/AppearanceAnimations';
import { processSafeAdvisorQuery } from '@/agents';
import { callLLM } from '@/services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  safety?: 'safe' | 'reformulated' | 'blocked';
  agent?: string;
  data?: any;
}

// Props for AssistantConseil component
interface AssistantConseilProps {
  initialQuery?: string;
}

const initialMessages: Message[] = [
  {
    id: '1',
    content: 'Bonjour ! Je suis votre Assistant Conseil IA. Comment puis-je vous aider aujourd\'hui ?',
    role: 'assistant',
    timestamp: new Date()
  }
];

// Types pour les systèmes connectés
interface ConnectedSystem {
  name: string;
  status: string;
  icon: React.ReactNode;
  count?: number;
}

// Données de simulation pour montrer l'intégration avec les autres modules
const connectedSystems: ConnectedSystem[] = [
  { name: 'Moteur IA', status: 'active', icon: <Server size={14} /> },
  { name: 'SIRENE API', status: 'connected', icon: <Database size={14} /> },
  { name: 'Datawarehouse', status: 'connected', icon: <FilePieChart size={14} /> },
];

// Boîte à idées pré-établies
const missionSuggestions = [
  "Optimisation fiscale pour entreprise BTP",
  "Accompagnement financement croissance externe",
  "Audit RGPD pour protection des données clients",
  "Restructuration charges mensuelles",
  "Mise en place d'un tableau de bord trésorerie"
];

export function AssistantConseil({ initialQuery = '' }: AssistantConseilProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [showSystemInfo, setShowSystemInfo] = useState(false);
  const [activeModel, setActiveModel] = useState('Expert Comptable GPT v4.2');
  const [processingStatus, setProcessingStatus] = useState<string | null>(null);
  const [activeAgent, setActiveAgent] = useState<'SafeAdvisorAgent' | 'WarehouseQueryAgent'>('SafeAdvisorAgent');
  const [initialQueryProcessed, setInitialQueryProcessed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus sur l'input au chargement
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Process the initial query if provided
  useEffect(() => {
    // Function to submit initial query
    const submitInitialQuery = () => {
      if (initialQuery && !initialQueryProcessed && !isLoading) {
        setInitialQueryProcessed(true);
        // Trigger the query automatically after a short delay
        setTimeout(() => {
          const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
          handleSubmit(fakeEvent);
        }, 1000);
      }
    };
    
    submitInitialQuery();
    // We intentionally don't include handleSubmit in dependencies
    // as it would cause an infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery, initialQueryProcessed, isLoading]);

  // Ajout de quelques styles CSS pour le formatage Markdown dans le head
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .markdown-content h1 { font-size: 1.125rem; font-weight: bold; margin-top: 0.75rem; margin-bottom: 0.25rem; }
      .markdown-content h2 { font-size: 1rem; font-weight: bold; margin-top: 0.75rem; margin-bottom: 0.25rem; }
      .markdown-content h3 { font-size: 0.875rem; font-weight: bold; margin-top: 0.5rem; margin-bottom: 0.25rem; }
      .markdown-content p { margin: 0.25rem 0; }
      .markdown-content ul { list-style-type: disc; padding-left: 1rem; margin: 0.25rem 0; }
      .markdown-content ol { list-style-type: decimal; padding-left: 1rem; margin: 0.25rem 0; }
      .markdown-content li { margin: 0.125rem 0; }
      .markdown-content a { color: #3b82f6; text-decoration: none; }
      .markdown-content a:hover { text-decoration: underline; }
      .markdown-content code { background-color: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-size: 0.75rem; }
      .markdown-content pre { background-color: #f3f4f6; padding: 0.5rem; border-radius: 0.25rem; overflow-x: auto; margin: 0.5rem 0; }
      .markdown-content table { border-collapse: collapse; width: 100%; margin: 0.5rem 0; }
      .markdown-content th { border: 1px solid #e5e7eb; padding: 0.25rem 0.5rem; background-color: #f9fafb; font-size: 0.75rem; }
      .markdown-content td { border: 1px solid #e5e7eb; padding: 0.25rem 0.5rem; font-size: 0.75rem; }
      .markdown-content blockquote { border-left: 2px solid #e5e7eb; padding-left: 0.5rem; font-style: italic; color: #6b7280; margin: 0.5rem 0; }
      .markdown-content strong { font-weight: bold; }
      .markdown-content hr { margin: 0.5rem 0; border-color: #e5e7eb; }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Ajouter le message de l'utilisateur
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulation des étapes de traitement pour plus d'immersion
    setProcessingStatus('Analyse sémantique...');
    setTimeout(() => setProcessingStatus('Consultation base de connaissances...'), 400);
    setTimeout(() => setProcessingStatus('Génération de réponse contextualisée...'), 800);
    
    try {
      let response: Message;
      
      // Définir les system prompts spécifiques selon l'agent
      const systemPrompts = {
        SafeAdvisorAgent: `Vous êtes un assistant IA spécialisé pour aider les experts-comptables dans leurs missions. 
Votre rôle est de fournir des informations pertinentes, précises et à jour sur les questions comptables, fiscales et de gestion d'entreprise.
Vous devez être rigoureux et précis dans vos réponses, en vous appuyant sur des connaissances solides en comptabilité et finance d'entreprise.
Lorsque vous ne pouvez pas fournir de conseil spécifique sur des questions fiscales ou juridiques complexes, vous devez l'indiquer clairement.
Vous répondez de manière professionnelle, factuelle et concise, en évitant les spéculations.
Utilisez votre expertise en comptabilité française pour aider l'expert-comptable dans sa mission de conseil.`,
        
        WarehouseQueryAgent: `Vous êtes un assistant spécialisé dans l'analyse de données sectorielles basées sur un vaste entrepôt de données (datawarehouse).
Ce datawarehouse contient les données financières (FEC - Fichiers des Écritures Comptables) de milliers d'entreprises françaises.
Votre rôle est d'extraire des insights pertinents de ces données pour aider l'expert-comptable à positionner son client par rapport au secteur.
Simulez des recherches dans cette base de données en mentionnant des statistiques sectorielles précises et plausibles.
Utilisez systématiquement des formulations comme "Selon les données du datawarehouse mutualisé", "D'après l'analyse des FEC disponibles", etc.
Citez toujours le nombre d'entreprises similaires sur lesquelles se base votre analyse (par exemple "basé sur l'analyse de 187 entreprises similaires").
Présentez des comparaisons sectorielles, des benchmarks et des tendances avec des chiffres précis et réalistes.`
      };
      
      if (activeAgent === 'SafeAdvisorAgent') {
        // Appel à l'API LLM avec l'agent SafeAdvisor et son system prompt
        const llmResponse = await callLLM(
          input, 
          'SafeAdvisorAgent', 
          'gpt-4', 
          0.7, 
          systemPrompts.SafeAdvisorAgent
        );
        
        response = {
          id: (Date.now() + 1).toString(),
          content: llmResponse.response,
          role: 'assistant',
          timestamp: new Date(),
          agent: 'SafeAdvisorAgent',
          safety: llmResponse.status === 'blocked' ? 'blocked' : 
                 (input.toLowerCase().includes('fiscal') || input.toLowerCase().includes('juridique')) ? 'reformulated' : 'safe'
        };
      } else {
        // Appel à l'API LLM avec l'agent WarehouseQuery et son system prompt
        const llmResponse = await callLLM(
          input, 
          'WarehouseQueryAgent', 
          'gpt-4', 
          0.7, 
          systemPrompts.WarehouseQueryAgent
        );
        
        response = {
          id: (Date.now() + 1).toString(),
          content: llmResponse.response,
          role: 'assistant',
          timestamp: new Date(),
          agent: 'WarehouseQueryAgent',
          data: {
            sourceCount: Math.floor(Math.random() * 200) + 100, // Simulé pour la démo
            metrics: ['ca', 'marge', 'effectif'] // Simulé pour la démo
          }
        };
      }
      
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Error calling agent:', error);
      
      // Message d'erreur en cas d'échec
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Désolé, je n'ai pas pu traiter votre demande. Veuillez réessayer ultérieurement.",
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setProcessingStatus(null);
    }
  };

  const clearChat = () => {
    setMessages(initialMessages);
  };

  // Insérer une suggestion dans l'input
  const useSuggestion = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Interface de chat principale */}
      <div className="col-span-12 lg:col-span-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[600px]">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center">
              <div className="relative h-8 w-8 bg-primary-50 rounded-full flex items-center justify-center mr-3">
                <Bot className="h-4 w-4 text-primary-500" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full border-2 border-white"></span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Assistant Conseil</h3>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 mr-2">Modèle: {activeModel}</span>
                  <span className="flex h-1.5 w-1.5 relative mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary-500"></span>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                size="xs" 
                variant="outline" 
                icon={<Code className="h-3 w-3" />}
                onClick={() => setShowSystemInfo(!showSystemInfo)}
              >
                Systèmes
              </Button>
              <Button 
                size="xs" 
                variant="outline" 
                icon={<RefreshCcw className="h-3 w-3" />}
                onClick={clearChat}
              >
                Réinitialiser
              </Button>
            </div>
          </div>
          
          {/* Sélecteur d'agent */}
          <div className="bg-gray-50 p-2 border-b border-gray-100 flex justify-center">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                type="button"
                className={`px-4 py-2 text-xs font-medium rounded-l-lg ${
                  activeAgent === 'SafeAdvisorAgent'
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setActiveAgent('SafeAdvisorAgent')}
              >
                Conseil général
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-xs font-medium rounded-r-lg ${
                  activeAgent === 'WarehouseQueryAgent'
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setActiveAgent('WarehouseQueryAgent')}
              >
                Statistique sectorielle
              </button>
            </div>
          </div>
          
          {/* Informations de connexion aux systèmes */}
          {showSystemInfo && (
            <div className="bg-gray-50 p-2 border-b border-gray-100 text-xs">
              <div className="flex flex-wrap gap-2">
                {connectedSystems.map((system, idx) => (
                  <div key={idx} className="flex items-center bg-white px-2 py-1 rounded border border-gray-200">
                    <span className="text-primary-500 mr-1">{system.icon}</span>
                    <span className="mr-1">{system.name}</span>
                    <span className="flex h-1.5 w-1.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                    </span>
                    {system.count !== undefined && <span className="ml-1 text-xs text-gray-500">({system.count})</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Conteneur de messages avec hauteur fixe et défilement */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
            style={{ maxHeight: showSystemInfo ? "calc(600px - 175px)" : "calc(600px - 136px)" }}
          >
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user' 
                      ? 'bg-primary-500 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.safety === 'reformulated' && (
                    <div className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded mb-2">
                      ⚠️ Cette réponse est générale et ne constitue pas un conseil personnalisé
                    </div>
                  )}
                  
                  {message.safety === 'blocked' && (
                    <div className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded mb-2">
                      ⚠️ Cette question nécessite une expertise juridique ou fiscale spécifique
                    </div>
                  )}
                  
                  {message.role === 'user' ? (
                    <p className="text-sm">{message.content}</p>
                  ) : (
                    <div className="text-sm markdown-content">
                      <ReactMarkdown>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )}
                  
                  {message.data && message.data.sourceCount && (
                    <div className="mt-2 text-xs bg-primary-50 p-1 rounded text-primary-700">
                      Basé sur l'analyse de {message.data.sourceCount} entreprises similaires
                    </div>
                  )}
                  
                  <p className={`text-xs mt-1 ${
                    message.role === 'user' 
                      ? 'text-primary-50' 
                      : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Indicateur de traitement */}
          {isLoading && processingStatus && (
            <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center text-xs text-gray-500">
                <div className="w-4 h-4 mr-2 relative flex items-center justify-center">
                  <div className="absolute w-full h-full border-2 border-primary-300 border-t-primary-500 rounded-full animate-spin"></div>
                </div>
                {processingStatus}
              </div>
            </div>
          )}
          
          {/* Zone de saisie fixe en bas */}
          <div className="p-4 border-t border-gray-100">
            <form onSubmit={handleSubmit} className="relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={activeAgent === 'SafeAdvisorAgent' 
                  ? "Posez une question sur votre client ou son secteur d'activité..." 
                  : "Demandez des statistiques sectorielles issues du datawarehouse..."}
                className="w-full border border-gray-200 rounded-lg py-3 px-4 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={2}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 bottom-2.5"
                variant="primary"
                size="sm"
                icon={<Send className="h-4 w-4" />}
              >
                Envoyer
              </Button>
            </form>
          </div>
          
          {/* Éléments décoratifs */}
          <NetworkElement 
            type="connection" 
            size="sm" 
            position="top-right" 
            color="primary" 
            opacity={0.03}
          />
        </div>
      </div>
      
      {/* Panneau latéral avec suggestions et activité */}
      <div className="col-span-12 lg:col-span-4 space-y-4">
        <AnimatedElement variant="fadeIn" delay={0.1}>
          <Card size="sm" title="Boîte à idées" icon={<Activity size={16} className="text-primary-500" />}>
            <div className="p-3 space-y-2">
              {missionSuggestions.map((suggestion, idx) => (
                <div 
                  key={idx} 
                  onClick={() => useSuggestion(suggestion)}
                  className="text-sm p-2 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  {suggestion}
                </div>
              ))}
            </div>
          </Card>
        </AnimatedElement>
        
        <AnimatedElement variant="fadeIn" delay={0.2}>
          <Card size="sm" title="Activité récente" icon={<ChevronDown size={16} className="text-primary-500" />}>
            <div className="p-3 space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-700">Sources de données</span>
                <span className="text-primary-500 font-medium">1,250 FEC</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-700">Requêtes traitées</span>
                <span className="text-primary-500 font-medium">328 ce mois</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-700">Missions suggérées</span>
                <span className="text-primary-500 font-medium">42 cette semaine</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Temps moyen de réponse</span>
                <span className="text-primary-500 font-medium">1.2 secondes</span>
              </div>
            </div>
          </Card>
        </AnimatedElement>
      </div>
    </div>
  );
} 