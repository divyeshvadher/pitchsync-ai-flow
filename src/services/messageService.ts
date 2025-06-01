
import { supabase } from '@/integrations/supabase/client';
import { Message, Conversation } from './types/message';

// Get all conversations for a user
export const getUserConversations = async (userId: string): Promise<Conversation[]> => {
  try {
    // Get all messages where the user is either the sender or receiver
    const { data: messages, error } = await supabase
      .from('messages')
      .select(`
        id,
        sender_id,
        receiver_id,
        content,
        created_at,
        read,
        pitch_id
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Group by conversation (other user)
    const conversationsMap = new Map<string, Conversation>();
    
    for (const msg of messages || []) {
      // Determine if the other user is the sender or receiver
      const isUserSender = msg.sender_id === userId;
      const otherUserId = isUserSender ? msg.receiver_id : msg.sender_id;
      
      // Fetch other user data
      const { data: otherUserData } = await supabase
        .from('profiles')
        .select('name, role')
        .eq('id', otherUserId)
        .single();
      
      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, {
          userId: otherUserId,
          userName: otherUserData?.name || 'Unknown User',
          userRole: otherUserData?.role || 'Unknown',
          unreadCount: (!isUserSender && !msg.read) ? 1 : 0,
          lastMessage: {
            id: msg.id,
            senderId: msg.sender_id,
            receiverId: msg.receiver_id,
            pitchId: msg.pitch_id,
            content: msg.content,
            createdAt: msg.created_at,
            read: msg.read,
            senderName: otherUserData?.name,
            senderRole: otherUserData?.role
          },
          lastMessageDate: msg.created_at
        });
      } else if (!isUserSender && !msg.read) {
        // Increment unread count for messages not from the current user and not read
        const conversation = conversationsMap.get(otherUserId)!;
        conversation.unreadCount += 1;
      }
    }
    
    return Array.from(conversationsMap.values()).sort((a, b) => 
      new Date(b.lastMessageDate || '').getTime() - new Date(a.lastMessageDate || '').getTime()
    );
  } catch (error) {
    console.error('Error fetching user conversations:', error);
    throw error;
  }
};

// Get messages between two users
export const getConversationMessages = async (userId: string, otherUserId: string): Promise<Message[]> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        id,
        sender_id,
        receiver_id,
        pitch_id,
        content,
        created_at,
        read
      `)
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
      .order('created_at', { ascending: true });

    if (error) throw error;
    
    // Mark unread messages as read
    const unreadMessageIds = (data || [])
      .filter(msg => msg.receiver_id === userId && !msg.read)
      .map(msg => msg.id);
    
    if (unreadMessageIds.length > 0) {
      await supabase
        .from('messages')
        .update({ read: true })
        .in('id', unreadMessageIds);
    }
    
    // Get sender details for each message
    const messagesWithSenders = await Promise.all((data || []).map(async (msg) => {
      const { data: senderData } = await supabase
        .from('profiles')
        .select('name, role')
        .eq('id', msg.sender_id)
        .single();
      
      return {
        id: msg.id,
        senderId: msg.sender_id,
        receiverId: msg.receiver_id,
        pitchId: msg.pitch_id,
        content: msg.content,
        createdAt: msg.created_at,
        read: msg.read,
        senderName: senderData?.name,
        senderRole: senderData?.role
      };
    }));
    
    return messagesWithSenders;
  } catch (error) {
    console.error('Error fetching conversation messages:', error);
    throw error;
  }
};

// Send a new message
export const sendMessage = async (senderId: string, receiverId: string, content: string, pitchId?: string): Promise<Message> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        pitch_id: pitchId,
        content,
        read: false
      })
      .select()
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      senderId: data.sender_id,
      receiverId: data.receiver_id,
      pitchId: data.pitch_id,
      content: data.content,
      createdAt: data.created_at,
      read: data.read
    };
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Get total unread message count for a user
export const getUnreadMessageCount = async (userId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', userId)
      .eq('read', false);

    if (error) throw error;
    
    return count || 0;
  } catch (error) {
    console.error('Error getting unread message count:', error);
    return 0;
  }
};
