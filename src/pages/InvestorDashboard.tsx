
import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Filter, Search, User } from 'lucide-react';
import { getPitches, Pitch, updatePitchStatus } from '@/services/pitchService';
import { useIsMobile } from '@/hooks/use-mobile';

const InvestorDashboard = () => {
  const [filteredPitches, setFilteredPitches] = useState<Pitch[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  // Get view from URL params or default to "all"
  const activeTab = searchParams.get('tab') || 'all';

  const { data: pitches, isLoading } = useQuery({
    queryKey: ['investorPitches'],
    queryFn: getPitches,
  });

  // Set up real-time subscription
  useEffect(() => {
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
          queryClient.invalidateQueries({ queryKey: ['investorPitches'] });
        }
      )
      .subscribe();

    return () => {
      // Unsubscribe when component unmounts
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Update filtered pitches when pitches data changes or search query changes
  useEffect(() => {
    if (!pitches) {
      setFilteredPitches([]);
      return;
    }

    if (searchQuery.trim() === '') {
      setFilteredPitches(pitches);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = pitches.filter(
      pitch =>
        pitch.companyName.toLowerCase().includes(query) ||
        pitch.founderName.toLowerCase().includes(query) ||
        pitch.industry.toLowerCase().includes(query) ||
        pitch.location.toLowerCase().includes(query) ||
        pitch.description.toLowerCase().includes(query)
    );
    setFilteredPitches(filtered);
  }, [searchQuery, pitches]);

  const handleUpdateStatus = async (id: string, status: Pitch['status']) => {
    try {
      await updatePitchStatus(id, status);

      const statusMessages = {
        shortlisted: "Pitch shortlisted successfully",
        rejected: "Pitch rejected successfully",
        forwarded: "Pitch forwarded successfully",
      };

      toast({
        title: statusMessages[status] || "Status updated",
        description: `Pitch has been ${status}.`,
      });

      // No need to manually update the state as the real-time subscription will handle it
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        variant: "destructive",
        title: "Failed to update status",
        description: "Please try again.",
      });
    }
  };

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  const getStatusBadge = (status: Pitch['status']) => {
    switch (status) {
      case 'shortlisted':
        return <Badge className="bg-teal-500">Shortlisted</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'forwarded':
        return <Badge className="bg-blue-500">Forwarded</Badge>;
      default:
        return <Badge variant="outline">New</Badge>;
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">Investor Dashboard</h1>
            <p className="text-muted-foreground mt-1">Track, filter, and act on startup pitches in real-time.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-[280px]">
              <Search className="absolute left-3 top-2.5 text-muted-foreground" size={18} />
              <Input
                placeholder="Search companies, industries..."
                className="pl-10 rounded-md border border-gray-300 shadow-sm focus-visible:ring-1 focus-visible:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-1">
              <Filter size={16} />
              Filters
            </Button>
          </div>
        </div>


        <div className={isMobile ? "overflow-x-auto -mx-4 px-4" : ""}>
          <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className={isMobile ? "min-w-[600px]" : ""}>
            <TabsList className="mb-6 flex-wrap bg-muted p-1 rounded-md shadow-inner">
              <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
              <TabsTrigger value="new" className="flex-1">New</TabsTrigger>
              <TabsTrigger value="shortlisted" className="flex-1">Shortlisted</TabsTrigger>
              <TabsTrigger value="rejected" className="flex-1">Rejected</TabsTrigger>
              <TabsTrigger value="forwarded" className="flex-1">Forwarded</TabsTrigger>
            </TabsList>


            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPitches.map(pitch => (
                  <Card className="bg-white dark:bg-muted border border-border dark:border-muted-foreground transition-all duration-200">
                    <CardHeader className="pb-2 border-b">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl font-semibold">{pitch.companyName}</CardTitle>
                          <CardDescription className="text-sm text-muted-foreground">
                            {pitch.industry} • {pitch.location}
                          </CardDescription>
                        </div>
                        {getStatusBadge(pitch.status)}
                      </div>
                    </CardHeader>

                    <CardContent className="flex-grow space-y-4 pt-4">
                      <p className="text-sm text-gray-600 line-clamp-3">{pitch.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <User className="text-muted-foreground" size={16} />
                          <span className="text-gray-700">{pitch.founderName}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs px-2">
                          {pitch.fundingStage}
                        </Badge>
                      </div>
                    </CardContent>

                    <div className="bg-muted px-6 py-3 border-t flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">AI Score: <strong>{pitch.aiScore}</strong></span>
                      <Button size="sm" variant="link" onClick={() => navigate(`/pitch/${pitch.id}`)}>View Details</Button>
                    </div>

                    <CardFooter className="flex justify-between pt-4 border-t">
                      <Button
                        variant={pitch.status === 'shortlisted' ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => handleUpdateStatus(pitch.id, 'shortlisted')}
                        disabled={pitch.status === 'shortlisted'}
                      >
                        Shortlist
                      </Button>
                      <Button
                        variant={pitch.status === 'rejected' ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => handleUpdateStatus(pitch.id, 'rejected')}
                        disabled={pitch.status === 'rejected'}
                      >
                        Reject
                      </Button>
                      <Button
                        variant={pitch.status === 'forwarded' ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => handleUpdateStatus(pitch.id, 'forwarded')}
                        disabled={pitch.status === 'forwarded'}
                      >
                        Forward
                      </Button>
                    </CardFooter>
                  </Card>

                ))}
              </div>

              {filteredPitches.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center text-muted-foreground">
                  <img src="public\images\undraw_not-found_6bgl.svg" alt="No results" className="w-32 h-32" />
                  <h3 className="text-xl font-semibold">No pitches found</h3>
                  <p className="text-sm">Try a different search or reset your filters</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="new" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPitches.filter(p => p.status === 'new').map(pitch => (
                  <Card key={pitch.id} className="pitch-card overflow-hidden flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{pitch.companyName}</CardTitle>
                          <CardDescription>{pitch.industry} • {pitch.location}</CardDescription>
                        </div>
                        {getStatusBadge(pitch.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2 flex-grow">
                      <p className="text-sm text-gray-500 mb-4 line-clamp-3">{pitch.description}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-pitchsync-100 flex items-center justify-center text-pitchsync-600 text-xs mr-2">
                            <User size={14} />
                          </div>
                          <span>{pitch.founderName}</span>
                        </div>
                        <div>
                          <Badge variant="outline" className="bg-pitchsync-50 hover:bg-pitchsync-50">
                            {pitch.fundingStage}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                    <div className="px-6 py-2 bg-pitchsync-50 border-t flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-xs font-medium text-gray-500 mr-2">AI Score:</span>
                        <span className="text-sm font-semibold">{pitch.aiScore}</span>
                      </div>
                      <Button size="sm" onClick={() => navigate(`/pitch/${pitch.id}`)}>View Details</Button>
                    </div>
                    <CardFooter className="flex justify-between pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(pitch.id, 'shortlisted')}
                      >
                        Shortlist
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(pitch.id, 'rejected')}
                      >
                        Reject
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(pitch.id, 'forwarded')}
                      >
                        Forward
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {filteredPitches.filter(p => p.status === 'new').length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium">No new pitches found</h3>
                  <p className="text-gray-500 mt-2">All pitches have been processed</p>
                </div>
              )}
            </TabsContent>

            {/* Similar TabsContent for shortlisted, rejected, and forwarded tabs */}
            <TabsContent value="shortlisted" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPitches.filter(p => p.status === 'shortlisted').map(pitch => (
                  <Card key={pitch.id} className="pitch-card overflow-hidden flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{pitch.companyName}</CardTitle>
                          <CardDescription>{pitch.industry} • {pitch.location}</CardDescription>
                        </div>
                        {getStatusBadge(pitch.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2 flex-grow">
                      <p className="text-sm text-gray-500 mb-4 line-clamp-3">{pitch.description}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-pitchsync-100 flex items-center justify-center text-pitchsync-600 text-xs mr-2">
                            <User size={14} />
                          </div>
                          <span>{pitch.founderName}</span>
                        </div>
                        <div>
                          <Badge variant="outline" className="bg-pitchsync-50 hover:bg-pitchsync-50">
                            {pitch.fundingStage}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                    <div className="px-6 py-2 bg-pitchsync-50 border-t flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-xs font-medium text-gray-500 mr-2">AI Score:</span>
                        <span className="text-sm font-semibold">{pitch.aiScore}</span>
                      </div>
                      <Button size="sm" onClick={() => navigate(`/pitch/${pitch.id}`)}>View Details</Button>
                    </div>
                  </Card>
                ))}
              </div>

              {filteredPitches.filter(p => p.status === 'shortlisted').length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium">No shortlisted pitches</h3>
                  <p className="text-gray-500 mt-2">You haven't shortlisted any pitches yet</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="rejected" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPitches.filter(p => p.status === 'rejected').map(pitch => (
                  <Card key={pitch.id} className="pitch-card overflow-hidden flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{pitch.companyName}</CardTitle>
                          <CardDescription>{pitch.industry} • {pitch.location}</CardDescription>
                        </div>
                        {getStatusBadge(pitch.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2 flex-grow">
                      <p className="text-sm text-gray-500 mb-4 line-clamp-3">{pitch.description}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-pitchsync-100 flex items-center justify-center text-pitchsync-600 text-xs mr-2">
                            <User size={14} />
                          </div>
                          <span>{pitch.founderName}</span>
                        </div>
                        <div>
                          <Badge variant="outline" className="bg-pitchsync-50 hover:bg-pitchsync-50">
                            {pitch.fundingStage}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                    <div className="px-6 py-2 bg-pitchsync-50 border-t flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-xs font-medium text-gray-500 mr-2">AI Score:</span>
                        <span className="text-sm font-semibold">{pitch.aiScore}</span>
                      </div>
                      <Button size="sm" onClick={() => navigate(`/pitch/${pitch.id}`)}>View Details</Button>
                    </div>
                  </Card>
                ))}
              </div>

              {filteredPitches.filter(p => p.status === 'rejected').length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium">No rejected pitches</h3>
                  <p className="text-gray-500 mt-2">You haven't rejected any pitches yet</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="forwarded" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPitches.filter(p => p.status === 'forwarded').map(pitch => (
                  <Card key={pitch.id} className="pitch-card overflow-hidden flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{pitch.companyName}</CardTitle>
                          <CardDescription>{pitch.industry} • {pitch.location}</CardDescription>
                        </div>
                        {getStatusBadge(pitch.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2 flex-grow">
                      <p className="text-sm text-gray-500 mb-4 line-clamp-3">{pitch.description}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-pitchsync-100 flex items-center justify-center text-pitchsync-600 text-xs mr-2">
                            <User size={14} />
                          </div>
                          <span>{pitch.founderName}</span>
                        </div>
                        <div>
                          <Badge variant="outline" className="bg-pitchsync-50 hover:bg-pitchsync-50">
                            {pitch.fundingStage}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                    <div className="px-6 py-2 bg-pitchsync-50 border-t flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-xs font-medium text-gray-500 mr-2">AI Score:</span>
                        <span className="text-sm font-semibold">{pitch.aiScore}</span>
                      </div>
                      <Button size="sm" onClick={() => navigate(`/pitch/${pitch.id}`)}>View Details</Button>
                    </div>
                  </Card>
                ))}
              </div>

              {filteredPitches.filter(p => p.status === 'forwarded').length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium">No forwarded pitches</h3>
                  <p className="text-gray-500 mt-2">You haven't forwarded any pitches yet</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default InvestorDashboard;
