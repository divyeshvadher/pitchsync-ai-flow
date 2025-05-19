
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, X, Send, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updatePitchStatus, getPitchFounderUserId } from '@/services/pitchUpdate';
import { Pitch } from '@/services/types/pitch';

interface PitchActionButtonsProps {
  pitch: Pitch;
  onStatusChange?: (newStatus: string) => void;
}

const PitchActionButtons: React.FC<PitchActionButtonsProps> = ({ pitch, onStatusChange }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isInvestor = user?.role === 'investor';
  
  const handleStatusChange = async (status: Pitch['status']) => {
    try {
      await updatePitchStatus(pitch.id, status);
      toast({
        title: 'Status updated',
        description: `The pitch has been marked as ${status}.`,
      });
      
      if (onStatusChange) {
        onStatusChange(status);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error updating status',
        description: 'There was a problem updating the pitch status.',
        variant: 'destructive',
      });
    }
  };
  
  const handleMessageFounder = async () => {
    try {
      const founderUserId = await getPitchFounderUserId(pitch.id);
      if (founderUserId) {
        // Navigate to messages page with the founder's user ID
        navigate(`/messages?contact=${founderUserId}`);
      } else {
        toast({
          title: 'Cannot message founder',
          description: 'Could not find the founder information.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error getting founder ID:', error);
      toast({
        title: 'Error',
        description: 'There was a problem connecting with the founder.',
        variant: 'destructive',
      });
    }
  };
  
  if (!isInvestor) {
    return null;
  }
  
  return (
    <div className="flex flex-wrap gap-3">
      <Button 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={() => handleStatusChange('shortlisted')}
        disabled={pitch.status === 'shortlisted'}
      >
        <Check className="h-5 w-5 text-green-500" />
        <span>Shortlist</span>
      </Button>
      
      <Button 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={() => handleStatusChange('rejected')}
        disabled={pitch.status === 'rejected'}
      >
        <X className="h-5 w-5 text-red-500" />
        <span>Reject</span>
      </Button>
      
      <Button 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={() => handleStatusChange('forwarded')}
        disabled={pitch.status === 'forwarded'}
      >
        <Send className="h-5 w-5 text-blue-500" />
        <span>Forward to Team</span>
      </Button>
      
      <Button 
        variant="default" 
        className="flex items-center gap-2"
        onClick={handleMessageFounder}
      >
        <MessageCircle className="h-5 w-5" />
        <span>Message Founder</span>
      </Button>
    </div>
  );
};

export default PitchActionButtons;
