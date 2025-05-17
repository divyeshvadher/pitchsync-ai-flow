import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { getPitches } from '@/services/pitchGet';
import { Pitch } from '@/services/types';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, Send, Clock } from 'lucide-react';

const InvestorDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: pitches, isLoading, error } = useQuery<Pitch[]>({
    queryKey: ['allPitches'],
    queryFn: getPitches,
  });

  // Real-time subscription for all pitch changes
  useEffect(() => {
    const channel = supabase
      .channel('public:pitches')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'pitches'
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['allPitches'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const getPitchStatusIcon = (status: string) => {
    switch (status) {
      case 'shortlisted': return <Check className="h-4 w-4 text-green-500" />;
      case 'rejected': return <X className="h-4 w-4 text-red-500" />;
      case 'forwarded': return <Send className="h-4 w-4 text-blue-500" />;
      default: return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getPitchStatusText = (status: string) => {
    switch (status) {
      case 'shortlisted': return 'Shortlisted';
      case 'rejected': return 'Rejected';
      case 'forwarded': return 'Forwarded';
      default: return 'Under review';
    }
  };

  const getPitchStatusColor = (status: string) => {
    switch (status) {
      case 'shortlisted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'forwarded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h2 className="text-xl font-semibold text-red-500">Error loading pitches</h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Investor Dashboard</h1>
          <p className="text-gray-600 mt-1">Review startup pitches in real-time</p>
        </div>

        {pitches && pitches.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>All Pitches</CardTitle>
              <CardDescription>Showing all submitted pitches</CardDescription>
            </CardHeader>
            <div className="overflow-x-auto">
              <CardContent className={isMobile ? "px-2" : ""}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead className="hidden md:table-cell">Founder Email</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">AI Score</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pitches.map(pitch => (
                      <TableRow key={pitch.id}>
                        <TableCell className="font-medium">{pitch.companyName}</TableCell>
                        <TableCell className="hidden md:table-cell">{pitch.email || '—'}</TableCell>
                        <TableCell className="hidden md:table-cell">{new Date(pitch.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPitchStatusColor(pitch.status)}`}>
                            {getPitchStatusIcon(pitch.status)}
                            <span className="ml-1">{getPitchStatusText(pitch.status)}</span>
                          </span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{pitch.aiScore || 'N/A'}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" onClick={() => navigate(`/pitch/${pitch.id}`)}>
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </div>
          </Card>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold mb-2">No pitches available</h2>
            <p className="text-gray-600">Startups haven’t submitted pitches yet.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default InvestorDashboard;
