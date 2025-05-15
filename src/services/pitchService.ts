
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

// Mock data for the demo
const mockPitches: Pitch[] = [
  {
    id: '1',
    companyName: 'EcoTech Solutions',
    founderName: 'Sarah Johnson',
    email: 'sarah@ecotech.co',
    industry: 'CleanTech',
    location: 'San Francisco, CA',
    pitchDeckUrl: '/placeholder.svg',
    videoUrl: 'https://example.com/video1',
    description: 'EcoTech Solutions is developing sustainable energy solutions for residential buildings.',
    fundingStage: 'Seed',
    fundingAmount: '$500,000',
    status: 'new',
    createdAt: '2025-05-10T10:30:00Z',
    answers: [
      { question: 'What problem are you solving?', answer: 'High energy costs and carbon emissions in residential buildings.' },
      { question: 'What is your unique solution?', answer: 'Patented solar integration system that reduces installation costs by 40%.' },
      { question: 'What traction do you have?', answer: '3 pilot projects with major developers, LOIs worth $2M.' },
      { question: 'Tell us about your team.', answer: 'Co-founders with solar engineering and construction backgrounds, previously at Tesla and Sunrun.' },
      { question: 'What are your growth projections?', answer: 'Targeting $5M ARR by end of next year with 30% profit margin.' },
    ],
    aiSummary: "EcoTech Solutions is developing a patented solar integration technology for residential buildings that reduces installation costs by 40%. The team has relevant experience from Tesla and Sunrun, with 3 pilot projects and $2M in LOIs. They're seeking $500K seed funding to scale operations.",
    aiScore: 82,
  },
  {
    id: '2',
    companyName: 'MediConnect',
    founderName: 'James Wilson',
    email: 'james@mediconnect.io',
    industry: 'HealthTech',
    location: 'Boston, MA',
    pitchDeckUrl: '/placeholder.svg',
    description: 'AI-powered platform connecting patients with specialists for virtual second opinions.',
    fundingStage: 'Pre-seed',
    fundingAmount: '$250,000',
    status: 'new',
    createdAt: '2025-05-12T14:20:00Z',
    answers: [
      { question: 'What problem are you solving?', answer: 'Difficulty accessing specialist medical opinions, especially in rural areas.' },
      { question: 'What is your unique solution?', answer: 'AI-powered platform that matches patients with specialists and facilitates virtual consultations.' },
      { question: 'What traction do you have?', answer: '500 users, partnership with a regional hospital network.' },
      { question: 'Tell us about your team.', answer: 'Co-founders with healthcare and technology backgrounds, previously at Athenahealth and Mass General Hospital.' },
      { question: 'What are your growth projections?', answer: 'Targeting 10,000 users by end of year, $1.2M in revenue next year.' },
    ],
    aiSummary: "MediConnect is an AI platform connecting patients with specialists for virtual second opinions, targeting rural areas with limited healthcare access. The founding team has healthcare and tech backgrounds from Athenahealth and MGH. With 500 users and a hospital partnership, they project 10,000 users by year-end and $1.2M revenue next year.",
    aiScore: 75,
  },
  {
    id: '3',
    companyName: 'SupplyChain.AI',
    founderName: 'Michael Chen',
    email: 'michael@supplychain.ai',
    industry: 'Logistics',
    location: 'Austin, TX',
    pitchDeckUrl: '/placeholder.svg',
    videoUrl: 'https://example.com/video3',
    description: 'AI-powered supply chain optimization platform reducing costs and carbon emissions.',
    fundingStage: 'Series A',
    fundingAmount: '$3,000,000',
    status: 'shortlisted',
    createdAt: '2025-05-08T09:15:00Z',
    answers: [
      { question: 'What problem are you solving?', answer: 'Supply chain inefficiencies leading to high costs and carbon emissions.' },
      { question: 'What is your unique solution?', answer: 'AI optimization engine that reduces transit times, costs, and emissions by analyzing millions of routes.' },
      { question: 'What traction do you have?', answer: '12 enterprise customers including two Fortune 500 companies, $1.2M ARR.' },
      { question: 'Tell us about your team.', answer: 'Founding team with logistics and AI background from Amazon and MIT.' },
      { question: 'What are your growth projections?', answer: 'Projecting $5M ARR next year with 70% gross margin.' },
    ],
    aiSummary: "SupplyChain.AI offers an AI platform that optimizes logistics to reduce costs and carbon emissions. Founded by ex-Amazon and MIT alumni, they have 12 enterprise customers including Fortune 500 clients, generating $1.2M ARR. They're seeking $3M Series A to scale their technology and target $5M ARR next year with 70% margins.",
    aiScore: 88,
  },
  {
    id: '4',
    companyName: 'FinLit',
    founderName: 'Emma Davis',
    email: 'emma@finlit.app',
    industry: 'FinTech',
    location: 'New York, NY',
    pitchDeckUrl: '/placeholder.svg',
    description: 'Mobile app teaching financial literacy to young adults through gamification.',
    fundingStage: 'Seed',
    fundingAmount: '$750,000',
    status: 'new',
    createdAt: '2025-05-14T16:45:00Z',
    answers: [
      { question: 'What problem are you solving?', answer: 'Lack of financial literacy among young adults leading to poor financial decisions.' },
      { question: 'What is your unique solution?', answer: 'Gamified mobile app that teaches financial concepts through interactive challenges and real-world scenarios.' },
      { question: 'What traction do you have?', answer: '25,000 active users, 4.8/5 app store rating, partnership with a major bank.' },
      { question: 'Tell us about your team.', answer: 'Former fintech product managers and financial advisors, backed by Y Combinator.' },
      { question: 'What are your growth projections?', answer: 'Targeting 100,000 users by EOY and $2M revenue next year through B2C and B2B channels.' },
    ],
    aiSummary: "FinLit is a gamified mobile app teaching financial literacy to young adults through interactive challenges. With 25,000 active users and a 4.8/5 rating, they've secured a major bank partnership. The Y Combinator-backed team has fintech and financial advisory experience and projects 100,000 users by year-end with $2M revenue next year via B2C and B2B channels.",
    aiScore: 79,
  }
];

// Simulated delay to mimic API call
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getPitches = async (): Promise<Pitch[]> => {
  await delay(800);
  return [...mockPitches];
};

export const getPitchById = async (id: string): Promise<Pitch | undefined> => {
  await delay(500);
  return mockPitches.find(pitch => pitch.id === id);
};

export const createPitch = async (pitch: Omit<Pitch, 'id' | 'status' | 'createdAt' | 'aiSummary' | 'aiScore'>): Promise<Pitch> => {
  await delay(1000);
  
  // Generate AI summary and score (in a real app, this would be done by an AI service)
  const aiSummary = `${pitch.companyName} is developing ${pitch.description} The founder is seeking ${pitch.fundingAmount} at ${pitch.fundingStage} stage.`;
  const aiScore = Math.floor(Math.random() * 30) + 65; // Random score between 65-95
  
  const newPitch: Pitch = {
    id: Math.random().toString(36).substr(2, 9),
    status: 'new',
    createdAt: new Date().toISOString(),
    aiSummary,
    aiScore,
    ...pitch
  };
  
  return newPitch;
};

export const updatePitchStatus = async (id: string, status: Pitch['status']): Promise<Pitch> => {
  await delay(500);
  const pitch = mockPitches.find(p => p.id === id);
  if (!pitch) {
    throw new Error(`Pitch with id ${id} not found`);
  }
  
  const updatedPitch = { ...pitch, status };
  return updatedPitch;
};
