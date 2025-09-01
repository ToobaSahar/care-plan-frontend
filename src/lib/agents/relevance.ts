import type { AssessmentData, SectionKey } from '../../schema/assessment';
import { assessmentApi } from '../supabase';

// Types for agent communication
export interface AgentMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  toolsUsed?: Record<string, unknown>;
}

export interface ToolCall {
  name: string;
  arguments: Record<string, unknown>;
}

export interface ToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

// Tool registry for the agent
export const toolRegistry = {
  // Get current assessment data
  async get_assessment(assessmentId: string): Promise<ToolResult> {
    try {
      const assessment = await assessmentApi.getById(assessmentId);
      if (!assessment) {
        return { success: false, error: 'Assessment not found' };
      }
      
      return { success: true, data: assessment.data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  },

  // Update a section of the assessment
  async update_section(
    assessmentId: string, 
    sectionKey: SectionKey, 
    patch: Partial<AssessmentData[SectionKey]>
  ): Promise<ToolResult> {
    try {
      const success = await assessmentApi.updateSection(assessmentId, sectionKey, patch);
      
      if (success) {
        return { 
          success: true, 
          data: { message: `Updated ${sectionKey} section successfully` } 
        };
      } else {
        return { success: false, error: 'Failed to update section' };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  },

  // Validate a section using Zod schemas
  async validate_section(sectionKey: SectionKey): Promise<ToolResult> {
    try {
      // Import schemas dynamically to avoid circular dependencies
      const { assessmentDataSchema } = await import('../../schema/assessment');
      
      // Get the specific section schema
      const sectionSchema = assessmentDataSchema.shape[sectionKey];
      if (!sectionSchema) {
        return { success: false, error: `Unknown section: ${sectionKey}` };
      }

      return { 
        success: true, 
        data: { 
          message: `Validation schema available for ${sectionKey}`,
          schema: sectionSchema.description || 'No description available'
        } 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  },

  // Generate risk summary and score
  async risk_summary(assessmentId: string): Promise<ToolResult> {
    try {
      const assessment = await assessmentApi.getById(assessmentId);
      if (!assessment) {
        return { success: false, error: 'Assessment not found' };
      }

      const data = assessment.data;
      let riskScore = 0;
      const riskFactors: string[] = [];

      // Analyze risks based on assessment data
      if (data.dailyLiving?.fallsRisk) {
        riskScore += 20;
        riskFactors.push('High falls risk');
      }

      if (data.dailyLiving?.personalCare === 'full_support') {
        riskScore += 15;
        riskFactors.push('Requires full personal care support');
      }

      if (data.healthAndWellbeing?.medication) {
        riskScore += 10;
        riskFactors.push('On medication requiring supervision');
      }

      if (data.advancePreferences?.dnacpr) {
        riskScore += 5;
        riskFactors.push('DNACPR in place');
      }

      if (data.risksAndSafeguarding?.safeguardingConcerns) {
        riskScore += 15;
        riskFactors.push('Safeguarding concerns identified');
      }

      // Cap risk score at 100
      riskScore = Math.min(riskScore, 100);

      return {
        success: true,
        data: {
          riskScore,
          riskFactors,
          summary: `Risk assessment completed. Score: ${riskScore}/100. Key factors: ${riskFactors.join(', ')}`
        }
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  },

  // Generate PDF summary
  async generate_pdf(assessmentId: string): Promise<ToolResult> {
    try {
      const assessment = await assessmentApi.getById(assessmentId);
      if (!assessment) {
        return { success: false, error: 'Assessment not found' };
      }

      // TODO: Call actual PDF generation service
      // For now, simulate PDF generation
      const pdfUrl = `/api/generate-pdf/${assessmentId}`;
      
      // Update assessment with PDF URL
      await assessmentApi.updatePdfUrl(assessmentId, pdfUrl);

      return {
        success: true,
        data: {
          message: 'PDF generated successfully',
          pdfUrl
        }
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  },

  // Upload attachment
  async upload_attachment(
    assessmentId: string,
    kind: string,
    file: File
  ): Promise<ToolResult> {
    try {
      // Generate unique file path
      const timestamp = Date.now();
      const filePath = `${assessmentId}/${kind}_${timestamp}_${file.name}`;
      
      // TODO: Implement actual file upload to Supabase Storage
      // Attachment API removed - returning mock success for now
      return {
        success: true,
        data: {
          message: 'Attachment upload simulated successfully',
          attachmentId: `mock-${Date.now()}`,
          filePath
        }
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
};

// Relevance AI client interface
export interface RelevanceAIClient {
  sendMessage(input: {
    assessmentId: string;
    text: string;
    context?: Record<string, unknown>;
    stream?: boolean;
  }): Promise<ReadableStream | { messages: AgentMessage[] }>;
}

// Mock implementation for development
export class MockRelevanceAI implements RelevanceAIClient {
  async sendMessage(input: {
    assessmentId: string;
    text: string;
    context?: Record<string, unknown>;
    stream?: boolean;
  }): Promise<ReadableStream | { messages: AgentMessage[] }> {
    const { assessmentId, text, stream = false } = input;

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simple keyword-based responses for demo
    let response = "I'm here to help with your assessment. How can I assist you today?";
    
    if (text.toLowerCase().includes('help') || text.toLowerCase().includes('assist')) {
      response = "I can help you with various tasks:\n- Prefill form fields\n- Validate sections\n- Generate risk summaries\n- Create PDF reports\n- Upload attachments\n\nWhat would you like me to help with?";
    } else if (text.toLowerCase().includes('validate') || text.toLowerCase().includes('check')) {
      response = "I can help validate any section of your assessment. Which section would you like me to check? You can specify sections like 'personal details', 'health and wellbeing', etc.";
    } else if (text.toLowerCase().includes('risk') || text.toLowerCase().includes('summary')) {
      response = "I can analyze your assessment data and generate a comprehensive risk summary with a risk score. Would you like me to do that now?";
    } else if (text.toLowerCase().includes('pdf') || text.toLowerCase().includes('report')) {
      response = "I can generate a PDF summary of your assessment. This will include all completed sections and can be downloaded or shared. Should I generate it now?";
    } else if (text.toLowerCase().includes('prefill') || text.toLowerCase().includes('fill')) {
      response = "I can help prefill form fields based on our conversation. What information would you like me to add to the form?";
    }

    const messages: AgentMessage[] = [
      {
        id: Date.now().toString(),
        role: 'user',
        content: text,
        timestamp: new Date().toISOString()
      },
      {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      }
    ];

    if (stream) {
      // Return a readable stream for streaming responses
      return new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder();
          
          // Simulate streaming by sending the response character by character
          let index = 0;
          const interval = setInterval(() => {
            if (index < response.length) {
              controller.enqueue(encoder.encode(response[index]));
              index++;
            } else {
              controller.close();
              clearInterval(interval);
            }
          }, 50);
        }
      });
    }

    return { messages };
  }
}

// Production Relevance AI client
export class RelevanceAIClient implements RelevanceAIClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_RELEVANCE_BASE_URL;
    this.apiKey = import.meta.env.VITE_RELEVANCE_API_KEY;

    if (!this.baseUrl || !this.apiKey) {
      throw new Error('Missing Relevance AI environment variables');
    }
  }

  async sendMessage(input: {
    assessmentId: string;
    text: string;
    context?: Record<string, unknown>;
    stream?: boolean;
  }): Promise<ReadableStream | { messages: AgentMessage[] }> {
    const { assessmentId, text, context, stream = false } = input;

    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          assessmentId,
          text,
          context,
          stream,
          tools: Object.keys(toolRegistry)
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (stream) {
        return response.body as ReadableStream;
      } else {
        const data = await response.json();
        return { messages: data.messages || [] };
      }
    } catch (error) {
      console.error('Error calling Relevance AI:', error);
      throw error;
    }
  }
}

// Export the appropriate client based on environment
export const relevanceAI = import.meta.env.DEV 
  ? new MockRelevanceAI() 
  : new RelevanceAIClient();

// Tool execution helper
export async function executeToolCall(toolCall: ToolCall): Promise<ToolResult> {
  const { name, arguments: args } = toolCall;
  
  if (name in toolRegistry) {
    const tool = toolRegistry[name as keyof typeof toolRegistry];
    if (typeof tool === 'function') {
      return await tool(...Object.values(args));
    }
  }
  
  return {
    success: false,
    error: `Unknown tool: ${name}`
  };
}
