
export interface Pitch {
  id: string;
  companyName: string;
  founderName: string;
  email: string;
  industry: string;
  location: string;
  pitchDeckUrl: string;
  videoUrl?: string;
  description: string;
  fundingStage: string;
  fundingAmount: string;
  status: 'new' | 'shortlisted' | 'rejected' | 'forwarded';
  createdAt: string;
  answers: {
    question: string;
    answer: string;
  }[];
  aiSummary?: string;
  aiScore?: number;
}
