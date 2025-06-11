import { EventEmitter } from 'events';

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  metadata?: Record<string, any>;
}

export interface AgentConfig {
  name: string;
  description: string;
  systemPrompt: string;
  capabilities?: string[];
}

export abstract class Agent extends EventEmitter {
  name: string;
  description: string;
  systemPrompt: string;
  capabilities: string[];
  memory: Message[] = [];
  
  constructor(config: AgentConfig) {
    super();
    this.name = config.name;
    this.description = config.description;
    this.systemPrompt = config.systemPrompt;
    this.capabilities = config.capabilities || [];
  }

  /**
   * Receive a message from another agent or the orchestrator
   */
  async receiveMessage(message: Message): Promise<void> {
    this.memory.push(message);
    this.emit('message-received', message);
    
    // Log to conscience journal
    this.logToConscienceJournal(`${this.name} received: ${message.content.substring(0, 100)}...`);
  }

  /**
   * Send a message to another agent via the orchestrator
   */
  async sendMessage(content: string, metadata?: Record<string, any>): Promise<Message> {
    const message: Message = {
      role: 'assistant',
      content,
      timestamp: new Date(),
      metadata
    };
    
    this.memory.push(message);
    this.emit('message-sent', message);
    
    // Log to conscience journal
    this.logToConscienceJournal(`${this.name} sent: ${content.substring(0, 100)}...`);
    
    return message;
  }

  /**
   * Process the input and generate a response
   */
  abstract process(input: string): Promise<string>;

  /**
   * Log an event to the conscience journal for transparency
   */
  protected logToConscienceJournal(entry: string): void {
    this.emit('conscience-log', {
      agent: this.name,
      timestamp: new Date(),
      entry
    });
    
    // This would typically write to a file or database in a production system
    console.log(`[Conscience Journal] ${this.name}: ${entry}`);
  }
} 