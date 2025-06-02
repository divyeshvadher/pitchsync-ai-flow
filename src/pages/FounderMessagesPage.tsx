import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import ConversationList from '@/components/messaging/ConversationList';
import MessageThreadView from '@/components/messaging/MessageThreadView';
import { getUserConversations, getConversationMessages, sendMessage } from '@/services/messageService';
import { supabase } from '@/integrations/supabase/client';

const FounderMessagesPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  
  // Check if there's a contact parameter in the URL
  useEffect(() => {
    const contactParam = searchParams.get('contact');
    if (contactParam) {
      setSelectedContactId(contactParam);
    }
  }, [searchParams]);
  
  // Get all conversations
  const {
    data: conversations,
    isLoading: isLoadingConversations,
    refetch: refetchConversations
  } = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: () => user?.id ? getUserConversations(user.id) : Promise.resolve([]),
    enabled: !!user?.id
  });
  
  // Get messages for the selected conversation
  const {
    data: messages,
    isLoading: isLoadingMessages,
    refetch: refetchMessages
  } = useQuery({
    queryKey: ['messages', user?.id, selectedContactId],
    queryFn: () => {
      if (!user?.id || !selectedContactId) return Promise.resolve([]);
      return getConversationMessages(user.id, selectedContactId);
    },
    enabled: !!user?.id && !!selectedContactId
  });

  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('messages_channel')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${user.id}`
      }, () => {
        // Invalidate and refetch queries when a new message arrives
        refetchConversations();
        if (selectedContactId) {
          refetchMessages();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, selectedContactId, refetchConversations, refetchMessages]);

  // Handle conversation selection
  const handleSelectConversation = (contactId: string) => {
    setSelectedContactId(contactId);
  };

  // Handle sending a new message
  const handleSendMessage = async (content: string) => {
    if (!user?.id || !selectedContactId) return;
    
    try {
      await sendMessage(user.id, selectedContactId, content);
      await refetchMessages();
      await refetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Failed to send message',
        description: 'Please try again',
        variant: 'destructive'
      });
    }
  };

  // Find the selected contact information
  const selectedContact = conversations?.find(c => c.userId === selectedContactId);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Messages</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-[calc(100vh-240px)]">
          {/* Conversations List */}
          <div className="md:col-span-1">
            <ConversationList
              conversations={conversations || []}
              isLoading={isLoadingConversations}
              selectedConversationId={selectedContactId || undefined}
              onSelectConversation={handleSelectConversation}
            />
          </div>
          
          {/* Message Thread */}
          <div className="md:col-span-2">
            <MessageThreadView
              contactName={selectedContact?.userName || ''}
              contactRole={selectedContact?.userRole || ''}
              messages={messages || []}
              isLoading={isLoadingMessages}
              onSendMessage={handleSendMessage}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default FounderMessagesPage;
