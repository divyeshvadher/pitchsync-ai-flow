
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/MainLayout';
import { Check, X, Clock, BarChart3, PlusCircle } from 'lucide-react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pitch, getPitches } from '@/services/pitchService';
import { useIsMobile } from '@/hooks/use-mobile';

const FounderDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  const { data: pitches, isLoading: isPitchesLoading, error: pitchesError } = useQuery({
    queryKey: ['founderPitches', user?.id],
    queryFn: async () => {
      const allPitches = await getPitches();
      return allPitches.filter(pitch => pitch.email === user?.email);
    },
    enabled: !!user?.id,
  });

  // Set up real-time subscription
  useEffect(() => {
    if (!user?.id) return;

    // Subscribe to changes on the pitches table
    const channel = supabase
      .channel('public:pitches')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pitches'
        },
        () => {
          // Invalidate and refetch pitches when changes occur
          queryClient.invalidateQueries({ queryKey: ['founderPitches', user?.id] });
        }
      )
      .subscribe();

    return () => {
      // Unsubscribe when component unmounts
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  const getPitchStatusIcon = (status: string) => {
    switch (status) {
      case 'shortlisted': return <Check className="h-5 w-5 text-green-500" />;
      case 'rejected': return <X className="h-5 w-5 text-red-500" />;
      default: return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getPitchStatusText = (status: string) => {
    switch (status) {
      case 'shortlisted': return 'Shortlisted';
      case 'rejected': return 'Rejected';
      case 'forwarded': return 'Forwarded to team';
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

  if (isPitchesLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  if (pitchesError) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h2 className="text-xl font-semibold text-red-500">Error loading pitches</h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </MainLayout>
    );
  }

  const recentPitches = pitches
    ? [...pitches].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3)
    : [];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 md:p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">🎯 Founder Dashboard</h1>
            <p className="text-gray-600 mt-1">Track your startup pitches and stay in the loop</p>
          </div>
          <Button onClick={() => navigate('/submit')} className="mt-4 md:mt-0">
            <PlusCircle className="mr-2 h-5 w-5" /> Submit New Pitch
          </Button>
        </div>


        {pitches && pitches.length > 0 ? (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
              <Card className="transition-transform hover:scale-[1.02]">
                <CardHeader className="bg-blue-50 pb-3 flex flex-row items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <BarChart3 className="text-blue-600 w-5 h-5" />
                  </div>
                  <CardTitle className="text-md">Total Pitches</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-4xl font-bold text-blue-800">{pitches.length}</p>
                </CardContent>
              </Card>


              <Card>
                <CardHeader className="bg-green-50 pb-3">
                  <CardTitle className="text-lg">Shortlisted</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-3xl md:text-4xl font-bold">{pitches.filter(p => p.status === 'shortlisted').length}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-yellow-50 pb-3">
                  <CardTitle className="text-lg">Under Review</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-3xl md:text-4xl font-bold">{pitches.filter(p => p.status === 'new').length}</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="mb-6 md:mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest 3 pitches submitted</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentPitches.map(pitch => (
                    <div
                      key={pitch.id}
                      className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-semibold">{pitch.companyName}</h3>
                          <p className="text-sm text-gray-500">Submitted on {new Date(pitch.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPitchStatusColor(pitch.status)}`}>
                          {getPitchStatusIcon(pitch.status)}
                          <span className="ml-1">{getPitchStatusText(pitch.status)}</span>
                        </span>
                      </div>
                    </div>

                  ))}
                </CardContent>
              </Card>
            </div>

            {/* All Pitches Table */}
            <Card className="mb-6 md:mb-8 overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle>Your Pitches</CardTitle>
                <CardDescription>Overview of all submitted pitches</CardDescription>
              </CardHeader>
              <div className="overflow-x-auto">
                <CardContent className={isMobile ? "px-2" : ""}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[30%] md:w-auto">Company</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden md:table-cell">AI Score</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pitches.map(pitch => (
                        <TableRow key={pitch.id}
                          className="hover:bg-gray-50 transition-colors">
                          <TableCell className="font-medium">{pitch.companyName}</TableCell>
                          <TableCell className="hidden md:table-cell">{new Date(pitch.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPitchStatusColor(pitch.status)}`}>
                              {getPitchStatusIcon(pitch.status)}
                              <span className="ml-1">{getPitchStatusText(pitch.status)}</span>
                            </span>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{pitch.aiScore || 'N/A'}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" onClick={() => navigate(`/pitch/${pitch.id}`)}>
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

            {/* Investor Feedback */}
            {pitches.some(p => p.status === 'shortlisted') && (
              <Card>
                <CardHeader>
                  <CardTitle>Investor Feedback</CardTitle>
                  <CardDescription>Feedback on shortlisted pitches</CardDescription>
                </CardHeader>
                <CardContent>
                  {pitches
                    .filter(p => p.status === 'shortlisted')
                    .map(pitch => (
                      <div key={`feedback-${pitch.id}`} className="mb-4 p-5 border-l-4 border-green-500 bg-green-50 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-green-700">{pitch.companyName}</h3>
                        <p className="text-sm text-gray-700 mt-1 italic">
                          "Your pitch was shortlisted! An investor will contact you soon for further discussion."
                        </p>
                      </div>

                    ))}
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <div className="text-center py-16 md:py-20">
            <img src="public\images\undraw_processing_bto8.svg" alt="No Pitches" className="h-32 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold mb-2">No pitches submitted yet</h2>
            <p className="text-gray-600 mb-4">Start your journey by submitting your first pitch.</p>
            <Button onClick={() => navigate('/submit')}>
              <PlusCircle className="mr-2 h-5 w-5" /> Submit a Pitch
            </Button>
          </div>

        )}
      </div>
    </MainLayout>
  );
};

export default FounderDashboard;
