// founderDashboard.tsx

import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/MainLayout';
import { Check, X, Clock, BarChart3, PlusCircle } from 'lucide-react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Pitch } from '@/services/pitchService';

const FounderDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: pitches, isLoading: isPitchesLoading, error: pitchesError } = useQuery({
    queryKey: ['founderPitches', user?.id],
    queryFn: async () => {
      const { getPitches } = await import('@/services/pitchService');
      const allPitches = await getPitches();
      return allPitches.filter(pitch => pitch.email === user?.email);
    },
    enabled: !!user?.id,
  });

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
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Founder Dashboard</h1>
            <p className="text-gray-600">Track your pitches and stay updated</p>
          </div>
          <Button onClick={() => window.location.href = '/submit'}>
            <PlusCircle className="mr-2 h-5 w-5" /> Submit New Pitch
          </Button>
        </div>

        {pitches && pitches.length > 0 ? (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="bg-blue-50">
                  <CardTitle>Total Pitches</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-4xl font-bold">{pitches.length}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-green-50">
                  <CardTitle>Shortlisted</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-4xl font-bold">{pitches.filter(p => p.status === 'shortlisted').length}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-yellow-50">
                  <CardTitle>Under Review</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-4xl font-bold">{pitches.filter(p => p.status === 'new').length}</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest 3 pitches submitted</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentPitches.map(pitch => (
                    <div key={pitch.id} className="border rounded-lg p-4">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{pitch.companyName}</h3>
                          <p className="text-sm text-gray-500">Submitted on {new Date(pitch.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPitchStatusColor(pitch.status)}`}>
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
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Your Pitches</CardTitle>
                <CardDescription>Overview of all submitted pitches</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>AI Score</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pitches.map(pitch => (
                      <TableRow key={pitch.id}>
                        <TableCell>{pitch.companyName}</TableCell>
                        <TableCell>{new Date(pitch.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPitchStatusColor(pitch.status)}`}>
                            {getPitchStatusIcon(pitch.status)}
                            <span className="ml-1">{getPitchStatusText(pitch.status)}</span>
                          </span>
                        </TableCell>
                        <TableCell>{pitch.aiScore || 'N/A'}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => window.location.href = `/pitch/${pitch.id}`}>
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
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
                      <div key={`feedback-${pitch.id}`} className="mb-4 p-4 border rounded-lg">
                        <h3 className="font-semibold">{pitch.companyName}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Your pitch was shortlisted! An investor will contact you soon for further discussion.
                        </p>
                      </div>
                    ))}
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-semibold mb-2">No pitches submitted yet</h2>
            <p className="text-gray-600 mb-6">Start by submitting your first pitch to get feedback.</p>
            <Button onClick={() => window.location.href = '/submit'}>
              <PlusCircle className="mr-2 h-5 w-5" /> Submit a Pitch
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default FounderDashboard;
