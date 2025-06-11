import React from 'react';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { NetworkElement } from '@/components/NetworkElements';
import { Briefcase, AlertTriangle, Calendar, DollarSign, CheckCircle2, Clock, Users, ArrowRight } from 'lucide-react';

interface MissionRequirement {
  id: string;
  name: string;
  importance: 'essential' | 'recommended' | 'optional';
}

interface MissionStage {
  name: string;
  duration: string;
  description: string;
}

interface Signal {
  id: string;
  description: string;
  type: 'fiscal' | 'legal' | 'performance' | 'opportunity';
  severity: 'high' | 'medium' | 'low';
  confidence: number;
}

export interface MissionProposal {
  id: string;
  title: string;
  description: string;
  signalType: 'fiscal' | 'legal' | 'performance' | 'opportunity';
  confidence: number;
  benefits: string[];
  estimatedFees: {
    min: number;
    max: number;
  };
  timeline: {
    totalDuration: string;
    stages: MissionStage[];
  };
  requirements: MissionRequirement[];
  triggeredBy: Signal[];
  justification: string;
}

interface MissionProposalViewProps {
  mission: MissionProposal;
  onAdopt: (id: string) => void;
  isDetailed?: boolean;
}

const formatEuros = (amount: number) => {
  return amount.toLocaleString('fr-FR') + ' €';
};

export const MissionProposalView: React.FC<MissionProposalViewProps> = ({
  mission,
  onAdopt,
  isDetailed = false
}) => {
  return (
    <Card size="sm" className="relative overflow-hidden">
      <NetworkElement 
        type="connection" 
        size="sm" 
        position="top-right" 
        color="primary" 
        opacity={0.04} 
      />
      
      <div className="flex items-start p-3 border-b border-gray-100">
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <Briefcase className="h-4 w-4 text-primary-500 mr-1.5" />
            <h2 className="text-sm font-semibold text-gray-800">{mission.title}</h2>
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            <Badge 
              color={
                mission.signalType === 'fiscal' ? 'info' :
                mission.signalType === 'legal' ? 'secondary' :
                mission.signalType === 'performance' ? 'warning' :
                'success'
              }
              variant="soft" 
              size="xs"
            >
              {mission.signalType}
            </Badge>
            
            <Badge 
              color={
                mission.confidence >= 85 ? 'success' :
                mission.confidence >= 70 ? 'info' :
                'warning'
              }
              variant="soft" 
              size="xs"
            >
              {mission.confidence}% confiance
            </Badge>
          </div>
        </div>
        
        {!isDetailed && (
          <Button 
            size="xs" 
            variant="primary"
            onClick={() => onAdopt(mission.id)}
          >
            Adopter
          </Button>
        )}
      </div>
      
      <div className="p-3">
        <div className="mb-3">
          <p className="text-xs text-gray-600">{mission.description}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <div className="flex items-center mb-1">
              <DollarSign className="h-3.5 w-3.5 text-success-500 mr-1" />
              <p className="text-xs font-medium text-gray-700">Honoraires estimés</p>
            </div>
            <p className="text-xs text-gray-600">
              {formatEuros(mission.estimatedFees.min)} à {formatEuros(mission.estimatedFees.max)}
            </p>
          </div>
          
          <div>
            <div className="flex items-center mb-1">
              <Calendar className="h-3.5 w-3.5 text-primary-500 mr-1" />
              <p className="text-xs font-medium text-gray-700">Durée</p>
            </div>
            <p className="text-xs text-gray-600">{mission.timeline.totalDuration}</p>
          </div>
        </div>
        
        <div className="mb-3">
          <div className="flex items-center mb-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-success-500 mr-1" />
            <p className="text-xs font-medium text-gray-700">Bénéfices client</p>
          </div>
          <ul className="text-xs text-gray-600 list-disc pl-5 space-y-0.5">
            {mission.benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>
        
        {isDetailed && (
          <>
            <div className="mb-3">
              <div className="flex items-center mb-1">
                <Users className="h-3.5 w-3.5 text-primary-500 mr-1" />
                <p className="text-xs font-medium text-gray-700">Compétences requises</p>
              </div>
              <div className="flex flex-wrap gap-1">
                {mission.requirements.map(req => (
                  <Badge 
                    key={req.id}
                    color={
                      req.importance === 'essential' ? 'primary' :
                      req.importance === 'recommended' ? 'info' :
                      'secondary'
                    }
                    variant="soft" 
                    size="xs"
                  >
                    {req.name}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="mb-3">
              <div className="flex items-center mb-1">
                <Clock className="h-3.5 w-3.5 text-primary-500 mr-1" />
                <p className="text-xs font-medium text-gray-700">Étapes clés</p>
              </div>
              <div className="ml-2 space-y-2">
                {mission.timeline.stages.map((stage, index) => (
                  <div key={index} className="pl-3 border-l-2 border-primary-100">
                    <p className="text-xs font-medium text-gray-700">{stage.name} <span className="font-normal text-gray-500">({stage.duration})</span></p>
                    <p className="text-xs text-gray-600">{stage.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-3">
              <div className="flex items-center mb-1">
                <AlertTriangle className="h-3.5 w-3.5 text-warning-500 mr-1" />
                <p className="text-xs font-medium text-gray-700">Signaux déclencheurs</p>
              </div>
              <div className="space-y-1.5">
                {mission.triggeredBy.map(signal => (
                  <div key={signal.id} className="bg-gray-50 p-1.5 rounded text-xs border border-gray-100">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-700">{signal.description}</p>
                      <Badge 
                        color={
                          signal.severity === 'high' ? 'error' :
                          signal.severity === 'medium' ? 'warning' :
                          'info'
                        }
                        variant="soft" 
                        size="xs"
                      >
                        {signal.severity}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex items-center mb-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-info-500 mr-1" />
                <p className="text-xs font-medium text-gray-700">Justification</p>
              </div>
              <p className="text-xs text-gray-600 italic border-l-2 border-info-100 pl-2">
                {mission.justification}
              </p>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button 
                size="sm" 
                variant="primary"
                onClick={() => onAdopt(mission.id)}
              >
                Générer une lettre de mission
                <ArrowRight className="ml-1" size={14} />
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};