
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUnreadMessageCount } from '@/services/messageService';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

const UnreadMessagesBadge: React.FC = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    if (!user?.id) return;
    
    const fetchUnreadCount = async () => {
      const count = await getUnreadMessageCount(user.id);
      setUnreadCount(count);
    };
    
    fetchUnreadCount();
    
    // Set up real-time subscription for new messages
    const channel = supabase
      .channel('unread_messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${user.id}`
      }, () => {
        fetchUnreadCount();
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${user.id}`
      }, () => {
        fetchUnreadCount();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);
  
  if (unreadCount === 0) {
    return null;
  }
  
  return (
    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
      {unreadCount > 99 ? '99+' : unreadCount}
    </Badge>
  );
};

export default UnreadMessagesBadge;
