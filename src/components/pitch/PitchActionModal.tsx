
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { submitPitchAction } from '@/services/pitchActionService';

interface PitchActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  pitchId: string;
  companyName: string;
  action: 'shortlisted' | 'rejected' | 'forwarded';
}

const PitchActionModal: React.FC<PitchActionModalProps> = ({
  isOpen,
  onClose,
  pitchId,
  companyName,
  action
}) => {
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const actionLabels = {
    shortlisted: 'Shortlist',
    rejected: 'Reject',
    forwarded: 'Forward'
  };

  const actionDescriptions = {
    shortlisted: 'Mark this pitch as shortlisted for further consideration.',
    rejected: 'Mark this pitch as not a fit for your investment criteria.',
    forwarded: 'Forward this pitch to other investors in your network.'
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitPitchAction({
        pitchId,
        action,
        notes: notes.trim() || undefined
      });

      toast({
        title: 'Action completed successfully',
        description: `${companyName} has been ${action}.`,
      });

      onClose();
      setNotes('');
    } catch (error) {
      console.error('Error submitting action:', error);
      toast({
        title: 'Failed to submit action',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{actionLabels[action]} Pitch</DialogTitle>
          <DialogDescription>
            {actionDescriptions[action]}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <input
              id="company"
              value={companyName}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder={`Add any notes about your decision to ${action} this pitch...`}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : `${actionLabels[action]} Pitch`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PitchActionModal;
