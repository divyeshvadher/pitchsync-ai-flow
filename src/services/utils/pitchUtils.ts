
import { Pitch } from '../types/pitch';

// Helper function to transform database records to Pitch interface
export const transformDatabasePitchToPitch = (pitch: any): Pitch => {
  const problemStatement = pitch.problem_statement || '';
  const solution = pitch.solution_description || '';
  const traction = pitch.traction || '';
  const team = pitch.team_description || '';
  const growth = pitch.growth_projections || '';
  
  // Construct answers from the database fields
  const answers = [
    { question: 'What problem are you solving?', answer: problemStatement },
    { question: 'What is your unique solution?', answer: solution },
    { question: 'What traction do you have?', answer: traction },
    { question: 'Tell us about your team.', answer: team },
    { question: 'What are your growth projections?', answer: growth }
  ];
  
  // Extract founder name from profiles
  const founderName = pitch.profiles ? pitch.profiles.name || 'Unknown Founder' : 'Unknown Founder';
  
  // Get email from auth.users through a join or use an empty string if not available
  // This would require a proper join in the query that fetches the pitch data
  const founderEmail = pitch.founder_email || '';

  return {
    id: pitch.id,
    companyName: pitch.company_name,
    founderName: founderName,
    email: founderEmail,
    industry: pitch.industry || '',
    location: pitch.location || '',
    description: pitch.company_description || '',
    fundingStage: pitch.funding_stage || '',
    fundingAmount: String(pitch.funding_amount || '0'),
    pitchDeckUrl: pitch.pitch_deck_url || '/placeholder.svg',
    videoUrl: pitch.intro_video_url,
    status: pitch.status as Pitch['status'] || 'new',
    createdAt: pitch.created_at || new Date().toISOString(),
    answers,
    aiSummary: `${pitch.company_name} is developing ${pitch.company_description} The founder is seeking ${pitch.funding_amount} at ${pitch.funding_stage} stage.`,
    aiScore: pitch.ai_score || Math.floor(Math.random() * 30) + 65,
  };
};

// Helper function to extract answers for database fields
export const extractAnswersForDatabase = (pitch: Omit<Pitch, 'id' | 'status' | 'createdAt' | 'aiSummary' | 'aiScore'>) => {
  const problemStatement = pitch.answers.find(a => a.question.includes('problem'))?.answer || '';
  const solution = pitch.answers.find(a => a.question.includes('unique solution'))?.answer || '';
  const traction = pitch.answers.find(a => a.question.includes('traction'))?.answer || '';
  const team = pitch.answers.find(a => a.question.includes('team'))?.answer || '';
  const growth = pitch.answers.find(a => a.question.includes('growth'))?.answer || '';

  return {
    problem_statement: problemStatement,
    solution_description: solution,
    traction: traction,
    team_description: team,
    growth_projections: growth
  };
};
