// Care Plan API Client for React Frontend

const API_BASE_URL = 'http://localhost:8000';

export interface CarePlanRequest {
  assessment_id?: string;
  use_recent?: boolean;
}

export interface CarePlanResponse {
  success: boolean;
  care_plan?: any;
  assessment_id?: number;
  message: string;
}

export interface CarePlanSection {
  description: string;
  identified_need: string;
  planned_outcomes: string;
  how_to_achieve: string;
  level_of_need: string;
}

export interface CarePlanData {
  health_wellbeing: CarePlanSection;
  daily_living: CarePlanSection;
  risks_safeguarding: CarePlanSection;
  social_emotional: CarePlanSection;
  environment_lifestyle: CarePlanSection;
  advance_preferences: CarePlanSection;
  optional_areas: CarePlanSection;
}

export class CarePlanAPI {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  async generateCarePlanForRecent(): Promise<CarePlanResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/generate-care-plan/recent`);
      return await response.json();
    } catch (error) {
      console.error('Error generating care plan for recent assessment:', error);
      throw error;
    }
  }

  async generateCarePlanById(assessmentId: string): Promise<CarePlanResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/generate-care-plan/${assessmentId}`);
      return await response.json();
    } catch (error) {
      console.error(`Error generating care plan for assessment ${assessmentId}:`, error);
      throw error;
    }
  }

  async generateCarePlan(request: CarePlanRequest): Promise<CarePlanResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/generate-care-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      return await response.json();
    } catch (error) {
      console.error('Error generating care plan:', error);
      throw error;
    }
  }

  // Helper method to format care plan for display
  formatCarePlan(carePlan: any): CarePlanData | null {
    if (!carePlan || !carePlan.care_plans) {
      return null;
    }

    return carePlan.care_plans as CarePlanData;
  }
}

// Export a default instance
export const carePlanAPI = new CarePlanAPI();
