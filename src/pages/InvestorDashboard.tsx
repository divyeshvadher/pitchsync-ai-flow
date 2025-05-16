
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-500">Manage and track your incoming pitch submissions</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                className="pl-10 w-full sm:w-[250px] md:w-[300px]" 
                placeholder="Search pitches..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter size={18} />
            </Button>
          </div>
        </div>
        
        <div className={isMobile ? "overflow-x-auto -mx-4 px-4" : ""}>
          <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className={isMobile ? "min-w-[600px]" : ""}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Pitches</TabsTrigger>
              <TabsTrigger value="new">New</TabsTrigger>
              <TabsTrigger value="shortlisted">Shortlisted</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="forwarded">Forwarded</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPitches.map(pitch => (
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
                        disabled={pitch.status === 'shortlisted'}
                      >
                        Shortlist
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUpdateStatus(pitch.id, 'rejected')}
                        disabled={pitch.status === 'rejected'}
                      >
                        Reject
                      </Button>
                      <Button 
                        variant="outline" 
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
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium">No pitches found</h3>
                  <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
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
