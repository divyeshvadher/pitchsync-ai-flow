
import React, { createContext, useState, useContext, useEffect } from 'react';

export type UserRole = 'investor' | 'founder' | null;

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
  isInvestor: boolean;
  isFounder: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock authentication for demo purposes
// In a real app, this would connect to your authentication service
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session in localStorage
    const storedUser = localStorage.getItem('pitchsync_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('pitchsync_user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    // In a real app, this would call your authentication API
    setLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock user based on email for demo purposes
    let mockUser: User;
    
    if (email.includes('investor')) {
      mockUser = {
        id: '1',
        email,
        name: 'Demo Investor',
        role: 'investor',
      };
    } else {
      mockUser = {
        id: '2',
        email,
        name: 'Demo Founder',
        role: 'founder',
      };
    }
    
    setUser(mockUser);
    localStorage.setItem('pitchsync_user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const signUp = async (email: string, password: string, name: string, role: UserRole): Promise<void> => {
    // In a real app, this would call your registration API
    setLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role,
    };
    
    setUser(mockUser);
    localStorage.setItem('pitchsync_user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('pitchsync_user');
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
    isInvestor: user?.role === 'investor',
    isFounder: user?.role === 'founder',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
