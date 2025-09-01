import type { AssessmentData, SectionKey } from '../../schema/assessment';
import { assessmentApi, attachmentApi, signatureApi } from '../supabase';

// Tool definitions for the AI agent
export interface Tool {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, unknown>;
    required: string[];
  };
  execute: (...args: unknown[]) => Promise<unknown>;
}

// Tool registry
export const tools: Tool[] = [
  {
    name: 'get_assessment',
    description: 'Retrieve the current assessment data for analysis',
    parameters: {
      type: 'object',
      properties: {
        assessmentId: {
          type: 'string',
          description: 'The ID of the assessment to retrieve'
        }
      },
      required: ['assessmentId']
    },
    execute: async (assessmentId: string) => {
      const assessment = await assessmentApi.getById(assessmentId);
      if (!assessment) {
        throw new Error('Assessment not found');
      }
      return assessment.data;
    }
  },

  {
    name: 'update_section',
    description: 'Update a specific section of the assessment with new data',
    parameters: {
      type: 'object',
      properties: {
        assessmentId: {
          type: 'string',
          description: 'The ID of the assessment to update'
        },
        sectionKey: {
          type: 'string',
          description: 'The section key to update (e.g., personalDetails, healthAndWellbeing)',
          enum: [
            'personalDetails',
            'basicDetails',
            'healthAndWellbeing',
            'dailyLiving',
            'risksAndSafeguarding',
            'socialEmotional',
            'environmentLifestyle',
            'advancePreferences',
            'optionalAreas',
            'signatures'
          ]
        },
        patch: {
          type: 'object',
          description: 'The data to update in the section'
        }
      },
      required: ['assessmentId', 'sectionKey', 'patch']
    },
    execute: async (assessmentId: string, sectionKey: SectionKey, patch: Partial<AssessmentData[SectionKey]>) => {
      const success = await assessmentApi.updateSection(assessmentId, sectionKey, patch);
      if (!success) {
        throw new Error('Failed to update section');
      }
      return { message: `Updated ${sectionKey} section successfully` };
    }
  },

  {
    name: 'validate_section',
    description: 'Validate a section of the assessment using Zod schemas',
    parameters: {
      type: 'object',
      properties: {
        sectionKey: {
          type: 'string',
          description: 'The section key to validate',
          enum: [
            'personalDetails',
            'basicDetails',
            'healthAndWellbeing',
            'dailyLiving',
            'risksAndSafeguarding',
            'socialEmotional',
            'environmentLifestyle',
            'advancePreferences',
            'optionalAreas',
            'signatures'
          ]
        }
      },
      required: ['sectionKey']
    },
    execute: async (sectionKey: SectionKey) => {
      // Import schemas dynamically to avoid circular dependencies
      const { assessmentDataSchema } = await import('../../schema/assessment');
      
      const sectionSchema = assessmentDataSchema.shape[sectionKey];
      if (!sectionSchema) {
        throw new Error(`Unknown section: ${sectionKey}`);
      }

      return {
        message: `Validation schema available for ${sectionKey}`,
        schema: sectionSchema.description || 'No description available'
      };
    }
  },

  {
    name: 'risk_summary',
    description: 'Generate a risk summary and score based on assessment data',
    parameters: {
      type: 'object',
      properties: {
        assessmentId: {
          type: 'string',
          description: 'The ID of the assessment to analyze'
        }
      },
      required: ['assessmentId']
    },
    execute: async (assessmentId: string) => {
      const assessment = await assessmentApi.getById(assessmentId);
      if (!assessment) {
        throw new Error('Assessment not found');
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
        riskScore,
        riskFactors,
        summary: `Risk assessment completed. Score: ${riskScore}/100. Key factors: ${riskFactors.join(', ')}`
      };
    }
  },

  {
    name: 'generate_pdf',
    description: 'Generate a PDF summary of the assessment',
    parameters: {
      type: 'object',
      properties: {
        assessmentId: {
          type: 'string',
          description: 'The ID of the assessment to generate PDF for'
        }
      },
      required: ['assessmentId']
    },
    execute: async (assessmentId: string) => {
      const assessment = await assessmentApi.getById(assessmentId);
      if (!assessment) {
        throw new Error('Assessment not found');
      }

      // TODO: Call actual PDF generation service
      // For now, simulate PDF generation
      const pdfUrl = `/api/generate-pdf/${assessmentId}`;
      
      // Update assessment with PDF URL
      await assessmentApi.updatePdfUrl(assessmentId, pdfUrl);

      return {
        message: 'PDF generated successfully',
        pdfUrl
      };
    }
  },

  {
    name: 'upload_attachment',
    description: 'Upload an attachment file for the assessment',
    parameters: {
      type: 'object',
      properties: {
        assessmentId: {
          type: 'string',
          description: 'The ID of the assessment to attach the file to'
        },
        kind: {
          type: 'string',
          description: 'The type of attachment (e.g., risk_assessment, dnacpr, respect, meds, poa, peep, other)'
        },
        file: {
          type: 'string',
          description: 'Base64 encoded file data'
        },
        fileName: {
          type: 'string',
          description: 'The name of the file'
        }
      },
      required: ['assessmentId', 'kind', 'file', 'fileName']
    },
    execute: async (assessmentId: string, kind: string, fileData: string, fileName: string) => {
      // Convert base64 to File object
      const byteCharacters = atob(fileData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const file = new File([byteArray], fileName, { type: 'application/octet-stream' });

      // Generate unique file path
      const timestamp = Date.now();
      const filePath = `${assessmentId}/${kind}_${timestamp}_${fileName}`;
      
      // TODO: Implement actual file upload to Supabase Storage
      // For now, just create the attachment record
      const attachment = await attachmentApi.create({
        assessment_id: assessmentId,
        kind,
        file_path: filePath,
        uploaded_by: 'current-user-id' // TODO: Get from auth context
      });

      if (!attachment) {
        throw new Error('Failed to create attachment record');
      }

      return {
        message: 'Attachment uploaded successfully',
        attachmentId: attachment.id,
        filePath
      };
    }
  },

  {
    name: 'get_attachments',
    description: 'Retrieve all attachments for an assessment',
    parameters: {
      type: 'object',
      properties: {
        assessmentId: {
          type: 'string',
          description: 'The ID of the assessment to get attachments for'
        }
      },
      required: ['assessmentId']
    },
    execute: async (assessmentId: string) => {
      const attachments = await attachmentApi.getByAssessment(assessmentId);
      return attachments;
    }
  },

  {
    name: 'get_signatures',
    description: 'Retrieve all signatures for an assessment',
    parameters: {
      type: 'object',
      properties: {
        assessmentId: {
          type: 'string',
          description: 'The ID of the assessment to get signatures for'
        }
      },
      required: ['assessmentId']
    },
    execute: async (assessmentId: string) => {
      const signatures = await signatureApi.getByAssessment(assessmentId);
      return signatures;
    }
  }
];

// Tool registry map for easy access
export const toolRegistry = new Map(tools.map(tool => [tool.name, tool]));

// Get tool by name
export function getTool(name: string): Tool | undefined {
  return toolRegistry.get(name);
}

// Get all available tool names
export function getAvailableTools(): string[] {
  return tools.map(tool => tool.name);
}

// Execute tool by name
export async function executeTool(name: string, ...args: unknown[]): Promise<unknown> {
  const tool = getTool(name);
  if (!tool) {
    throw new Error(`Unknown tool: ${name}`);
  }
  
  return await tool.execute(...args);
}

// Get tool schema for AI agent
export function getToolSchema(name: string) {
  const tool = getTool(name);
  if (!tool) {
    return null;
  }
  
  return {
    name: tool.name,
    description: tool.description,
    parameters: tool.parameters
  };
}

// Get all tool schemas
export function getAllToolSchemas() {
  return tools.map(tool => ({
    name: tool.name,
    description: tool.description,
    parameters: tool.parameters
  }));
}
