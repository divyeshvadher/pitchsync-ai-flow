
import { supabase } from '@/integrations/supabase/client';
import { Profile } from './types/profile';

// Get all founders that an investor can message
export const getAllFounders = async (): Promise<Profile[]> => {
  try {
    console.log('=== FETCHING ALL FOUNDERS ===');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, role')
      .eq('role', 'founder')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching founders:', error);
      throw error;
    }

    console.log('Founders found:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Error in getAllFounders:', error);
    throw error;
  }
};

// Get all investors that a founder can message
export const getAllInvestors = async (): Promise<Profile[]> => {
  try {
    console.log('=== FETCHING ALL INVESTORS ===');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, role')
      .eq('role', 'investor')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching investors:', error);
      throw error;
    }

    console.log('Investors found:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Error in getAllInvestors:', error);
    throw error;
  }
};

// Search users by name
export const searchUsers = (users: Profile[], searchTerm: string): Profile[] => {
  if (!searchTerm.trim()) {
    return users;
  }
  
  const lowercaseSearch = searchTerm.toLowerCase();
  return users.filter(user => 
    user.name?.toLowerCase().includes(lowercaseSearch)
  );
};
