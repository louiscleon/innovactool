import { EventEmitter } from 'events';
import { Agent, Message } from './base-agent';

interface ConscienceLogEntry {
  agent: string;
  timestamp: Date;
  entry: string;
}

export class Orchestrator extends EventEmitter {
  private agents: Map<string, Agent> = new Map();
  private conscienceLog: ConscienceLogEntry[] = [];

  constructor() {
    super();
  }

  /**
   * Register an agent with the orchestrator
   */
  registerAgent(agent: Agent): void {
    if (this.agents.has(agent.name)) {
      throw new Error(`Agent with name ${agent.name} already exists.`);
    }
    
    this.agents.set(agent.name, agent);
    
    // Listen for conscience log events
    agent.on('conscience-log', (entry: ConscienceLogEntry) => {
      this.logToConscienceJournal(entry);
    });
    
    // Listen for message sent events
    agent.on('message-sent', async (message: Message) => {
      this.emit('message', {
        from: agent.name,
        message
      });
    });
    
    this.logToConscienceJournal({
      agent: 'Orchestrator',
      timestamp: new Date(),
      entry: `Registered agent: ${agent.name} - ${agent.description}`
    });
  }

  /**
   * Send a message from one agent to another
   */
  async sendMessage(fromAgentName: string, toAgentName: string, content: string, metadata?: Record<string, any>): Promise<void> {
    const fromAgent = this.agents.get(fromAgentName);
    const toAgent = this.agents.get(toAgentName);
    
    if (!fromAgent) throw new Error(`Source agent ${fromAgentName} not found.`);
    if (!toAgent) throw new Error(`Target agent ${toAgentName} not found.`);
    
    const message: Message = {
      role: 'assistant',
      content,
      timestamp: new Date(),
      metadata: {
        ...metadata,
        from: fromAgentName
      }
    };
    
    this.logToConscienceJournal({
      agent: 'Orchestrator',
      timestamp: new Date(),
      entry: `Routing message from ${fromAgentName} to ${toAgentName}: ${content.substring(0, 100)}...`
    });
    
    await toAgent.receiveMessage(message);
  }

  /**
   * Send a user message to a specific agent
   */
  async sendUserMessage(toAgentName: string, content: string, metadata?: Record<string, any>): Promise<void> {
    const toAgent = this.agents.get(toAgentName);
    
    if (!toAgent) throw new Error(`Target agent ${toAgentName} not found.`);
    
    const message: Message = {
      role: 'user',
      content,
      timestamp: new Date(),
      metadata
    };
    
    this.logToConscienceJournal({
      agent: 'Orchestrator',
      timestamp: new Date(),
      entry: `Routing user message to ${toAgentName}: ${content.substring(0, 100)}...`
    });
    
    await toAgent.receiveMessage(message);
  }

  /**
   * List all registered agents
   */
  getAgents(): Array<{name: string, description: string}> {
    return Array.from(this.agents.values()).map(agent => ({
      name: agent.name,
      description: agent.description
    }));
  }

  /**
   * Get the conscience log
   */
  getConscienceLog(): ConscienceLogEntry[] {
    return [...this.conscienceLog];
  }

  /**
   * Log an entry to the conscience journal
   */
  private logToConscienceJournal(entry: ConscienceLogEntry): void {
    this.conscienceLog.push(entry);
    
    // Log to console
    console.log(`[${entry.timestamp.toISOString()}] ${entry.agent}: ${entry.entry}`);
    
    // Emit event
    this.emit('conscience-log', entry);
  }
} 