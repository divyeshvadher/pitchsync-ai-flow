
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, X, Send, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getPitchFounderUserId } from '@/services/pitchUpdate';
import { submitPitchAction } from '@/services/pitchActionService';
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
      console.log('=== PITCH ACTION BUTTON CLICKED ===');
      console.log('Status:', status, 'Pitch ID:', pitch.id);
      
      const result = await submitPitchAction({
        pitchId: pitch.id,
        action: status as 'shortlisted' | 'rejected' | 'forwarded'
      });
      
      console.log('=== PITCH ACTION RESULT ===');
      console.log('Result:', result);
      
      if (result.success) {
        let description = `The pitch has been marked as ${status}.`;
        
        if (result.emailSent) {
          description += ' The founder has been notified via email.';
        } else if (result.emailError) {
          description += ` Note: Email notification failed (${result.emailError}).`;
        } else {
          description += ' Note: Email notification status unknown.';
        }
        
        toast({
          title: 'Status updated',
          description,
          variant: result.emailSent ? 'default' : 'destructive'
        });
        
        if (onStatusChange) {
          onStatusChange(status);
        }
      }
    } catch (error) {
      console.error('=== PITCH ACTION BUTTON ERROR ===');
      console.error('Error updating status:', error);
      toast({
        title: 'Error updating status',
        description: error instanceof Error ? error.message : 'There was a problem updating the pitch status.',
        variant: 'destructive',
      });
    }
  };
  
  const handleMessageFounder = async () => {
    try {
      console.log('=== MESSAGE FOUNDER CLICKED ===');
      console.log('Pitch ID:', pitch.id);
      console.log('Current user:', user?.id, user?.role);
      
      // Use the pitch's user_id directly if available, otherwise fetch it
      let founderUserId = pitch.userId;
      
      if (!founderUserId) {
        console.log('No direct user_id, fetching founder user ID...');
        founderUserId = await getPitchFounderUserId(pitch.id);
      }
      
      console.log('Founder User ID:', founderUserId);
      
      if (founderUserId) {
        // Navigate to messages page with the founder's user ID
        const messagesPath = user?.role === 'investor' ? '/messages' : '/founder-messages';
        navigate(`${messagesPath}?contact=${founderUserId}`);
        
        toast({
          title: 'Opening conversation',
          description: `Starting conversation with ${pitch.companyName} founder.`,
          variant: 'default',
        });
      } else {
        toast({
          title: 'Cannot message founder',
          description: 'Could not find the founder information.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('=== MESSAGE FOUNDER ERROR ===');
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
