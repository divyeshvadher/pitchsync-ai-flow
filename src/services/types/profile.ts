import { UserRole } from '@/context/AuthContext';

export interface Profile {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile extends Profile {
  userId: string;
  userName: string;
  userRole: UserRole;
}

export interface ConversationProfile extends UserProfile {
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}