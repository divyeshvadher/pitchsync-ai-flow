
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  pitchId?: string;
  content: string;
  createdAt: string;
  read: boolean;
  senderName?: string;
  senderRole?: string;
}

export interface Conversation {
  userId: string;
  userName: string;
  userRole: string;
  unreadCount: number;
  lastMessage?: Message;
  lastMessageDate?: string;
}
