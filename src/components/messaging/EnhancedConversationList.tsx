
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Conversation } from '@/services/types/message';
import { Profile } from '@/services/types/profile';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, User } from 'lucide-react';

interface EnhancedConversationListProps {
  conversations: Conversation[];
  allUsers: Profile[];
  isLoading: boolean;
  selectedConversationId?: string;
  onSelectConversation: (userId: string) => void;
  userRole: 'founder' | 'investor';
}

const EnhancedConversationList: React.FC<EnhancedConversationListProps> = ({
  conversations,
  allUsers,
  isLoading,
  selectedConversationId,
  onSelectConversation,
  userRole
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) {
      return allUsers;
    }
    
    const lowercaseSearch = searchTerm.toLowerCase();
    return allUsers.filter(user => 
      user.name?.toLowerCase().includes(lowercaseSearch)
    );
  }, [allUsers, searchTerm]);

  // Create a map of existing conversations for quick lookup
  const conversationMap = useMemo(() => {
    const map = new Map();
    conversations.forEach(conv => {
      map.set(conv.userId, conv);
    });
    return map;
  }, [conversations]);

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Messages</CardTitle>
          <CardDescription>
            {userRole === 'investor' ? 'Connect with founders' : 'Connect with investors'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
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
        <CardTitle>Messages</CardTitle>
        <CardDescription>
          {userRole === 'investor' ? 'Connect with founders' : 'Connect with investors'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={`Search ${userRole === 'investor' ? 'founders' : 'investors'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* User List */}
          {filteredUsers.length === 0 ? (
            <div className="text-center py-10">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? 'No users found matching your search.' : `No ${userRole === 'investor' ? 'founders' : 'investors'} available.`}
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {filteredUsers.map(user => {
                const conversation = conversationMap.get(user.id);
                
                return (
                  <div
                    key={user.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center gap-3 
                    ${selectedConversationId === user.id ? 'bg-accent' : 'hover:bg-muted'}`}
                    onClick={() => onSelectConversation(user.id)}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    
                    <div className="flex-1 overflow-hidden">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-sm truncate">{user.name || 'Unknown User'}</h4>
                        {conversation?.lastMessageDate && (
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(conversation.lastMessageDate), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-muted-foreground truncate max-w-[70%]">
                          {conversation?.lastMessage?.content || 'Start a conversation'}
                        </p>
                        {conversation && conversation.unreadCount > 0 && (
                          <Badge className="ml-auto" variant="default">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-xs text-muted-foreground mt-1 capitalize">
                        {user.role}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedConversationList;
