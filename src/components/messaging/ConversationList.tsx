
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Conversation } from '@/services/types/message';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface ConversationListProps {
  conversations: Conversation[];
  isLoading: boolean;
  selectedConversationId?: string;
  onSelectConversation: (userId: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  isLoading,
  selectedConversationId,
  onSelectConversation
}) => {
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Conversations</CardTitle>
          <CardDescription>Your message threads</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Conversations</CardTitle>
        <CardDescription>Your message threads</CardDescription>
      </CardHeader>
      <CardContent>
        {conversations.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No conversations yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map(conversation => (
              <div
                key={conversation.userId}
                className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center gap-3 
                ${selectedConversationId === conversation.userId ? 'bg-accent' : 'hover:bg-muted'}`}
                onClick={() => onSelectConversation(conversation.userId)}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                  {conversation.userName.charAt(0).toUpperCase()}
                </div>
                
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-sm truncate">{conversation.userName}</h4>
                    {conversation.lastMessageDate && (
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(conversation.lastMessageDate), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground truncate max-w-[70%]">
                      {conversation.lastMessage?.content || 'No messages yet'}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <Badge className="ml-auto" variant="default">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-1">
                    {conversation.userRole}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConversationList;
