
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Forward } from 'lucide-react';
import PitchActionModal from './PitchActionModal';

interface PitchActionsButtonsProps {
  pitchId: string;
  companyName: string;
  currentStatus?: string;
}

const PitchActionsButtons: React.FC<PitchActionsButtonsProps> = ({
  pitchId,
  companyName,
  currentStatus
}) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    action: 'shortlisted' | 'rejected' | 'forwarded' | null;
  }>({
    isOpen: false,
    action: null
  });

  const openModal = (action: 'shortlisted' | 'rejected' | 'forwarded') => {
    setModalState({ isOpen: true, action });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, action: null });
  };

  // Don't show buttons if already actioned
  if (currentStatus && currentStatus !== 'new') {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="capitalize">Status: {currentStatus}</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => openModal('shortlisted')}
          className="text-green-600 hover:text-green-700 hover:bg-green-50"
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          Shortlist
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => openModal('rejected')}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <XCircle className="h-4 w-4 mr-1" />
          Reject
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => openModal('forwarded')}
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          <Forward className="h-4 w-4 mr-1" />
          Forward
        </Button>
      </div>

      {modalState.action && (
        <PitchActionModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          pitchId={pitchId}
          companyName={companyName}
          action={modalState.action}
        />
      )}
    </>
  );
};

export default PitchActionsButtons;
