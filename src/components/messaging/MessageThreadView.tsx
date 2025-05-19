
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Message } from '@/services/types/message';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface MessageThreadProps {
  contactName: string;
  contactRole: string;
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (content: string) => Promise<void>;
}

const MessageThreadView: React.FC<MessageThreadProps> = ({
  contactName,
  contactRole,
  messages,
  isLoading,
  onSendMessage
}) => {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    setIsSending(true);
    try {
      await onSendMessage(newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  if (!contactName) {
    return (
      <Card className="h-full flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
          <p className="text-muted-foreground text-center">
            Choose a conversation from the list to start messaging
          </p>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-24 mt-1" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto">
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : ''}`}>
                <Skeleton className={`h-16 ${i % 2 === 0 ? 'w-2/3' : 'w-1/2'} rounded-lg`} />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
            {contactName.charAt(0).toUpperCase()}
          </div>
          <div>
            <CardTitle>{contactName}</CardTitle>
            <CardDescription>{contactRole}</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <h4 className="font-medium">No messages yet</h4>
            <p className="text-muted-foreground mt-1">
              Send a message to start the conversation
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map(message => {
              const isFromMe = message.senderId === user?.id;
              
              return (
                <div key={message.id} className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${isFromMe ? 'bg-primary text-primary-foreground' : 'bg-muted'} p-3 rounded-lg`}>
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {format(new Date(message.createdAt), 'h:mm a')}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t">
        <form onSubmit={handleSendMessage} className="w-full flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />
          <Button type="submit" size="icon" disabled={isSending || !newMessage.trim()}>
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default MessageThreadView;
