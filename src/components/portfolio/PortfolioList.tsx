
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Pitch } from '@/services/types/pitch';

interface PortfolioListProps {
  portfolioPitches: Pitch[];
  isLoading: boolean;
}

const PortfolioList: React.FC<PortfolioListProps> = ({ portfolioPitches, isLoading }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Companies</CardTitle>
        <CardDescription>Companies you've shortlisted</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : !portfolioPitches.length ? (
          <div className="text-center py-8 text-muted-foreground">
            You haven't shortlisted any companies yet.
          </div>
        ) : (
          <div className="rounded-md border">
            <div className="grid grid-cols-5 font-medium p-4 border-b bg-muted/50">
              <div>Company</div>
              <div>Founder</div>
              <div>Industry</div>
              <div>Funding Stage</div>
              <div className="text-right">Amount</div>
            </div>
            {portfolioPitches.map((pitch) => (
              <div key={pitch.id} className="grid grid-cols-5 p-4 items-center hover:bg-muted/50 border-b last:border-0">
                <div className="font-medium">{pitch.companyName}</div>
                <div>{pitch.founderName}</div>
                <div>{pitch.industry || 'N/A'}</div>
                <div>{pitch.fundingStage || 'N/A'}</div>
                <div className="text-right">${parseFloat(pitch.fundingAmount || '0').toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PortfolioList;
