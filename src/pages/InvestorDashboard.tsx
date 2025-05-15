
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Filter, Search, User } from 'lucide-react';
import { getPitches, Pitch, updatePitchStatus } from '@/services/pitchService';

const InvestorDashboard = () => {
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [filteredPitches, setFilteredPitches] = useState<Pitch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  // Get view from URL params or default to "all"
  const activeView = searchParams.get('view') || 'all';
  
  useEffect(() => {
    const loadPitches = async () => {
      try {
        const data = await getPitches();
        setPitches(data);
        setFilteredPitches(data);
      } catch (error) {
        console.error('Error loading pitches:', error);
        toast({
          variant: "destructive",
          title: "Failed to load pitches",
          description: "Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPitches();
  }, [toast]);
  
  useEffect(() => {
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
      const updatedPitch = await updatePitchStatus(id, status);
      setPitches(prev => 
        prev.map(pitch => pitch.id === id ? updatedPitch : pitch)
      );
      setFilteredPitches(prev => 
        prev.map(pitch => pitch.id === id ? updatedPitch : pitch)
      );
      
      const statusMessages = {
        shortlisted: "Pitch shortlisted successfully",
        rejected: "Pitch rejected successfully",
        forwarded: "Pitch forwarded successfully",
      };
      
      toast({
        title: statusMessages[status] || "Status updated",
        description: `${updatedPitch.companyName}'s pitch has been updated.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update status",
        description: "Please try again.",
      });
    }
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-500">Manage and track your incoming pitch submissions</p>
          </div>
          <div className="flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                className="pl-10 w-full md:w-80" 
                placeholder="Search pitches..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="ml-2">
              <Filter size={18} />
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all">
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
                <Card key={pitch.id} className="pitch-card overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{pitch.companyName}</CardTitle>
                        <CardDescription>{pitch.industry} • {pitch.location}</CardDescription>
                      </div>
                      {getStatusBadge(pitch.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
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
                    <Link to={`/pitch/${pitch.id}`}>
                      <Button size="sm">View Details</Button>
                    </Link>
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
                // Same card component as above
                <Card key={pitch.id} className="pitch-card overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{pitch.companyName}</CardTitle>
                        <CardDescription>{pitch.industry} • {pitch.location}</CardDescription>
                      </div>
                      {getStatusBadge(pitch.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
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
                    <Link to={`/pitch/${pitch.id}`}>
                      <Button size="sm">View Details</Button>
                    </Link>
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
                // Same card component as above
                <Card key={pitch.id} className="pitch-card overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{pitch.companyName}</CardTitle>
                        <CardDescription>{pitch.industry} • {pitch.location}</CardDescription>
                      </div>
                      {getStatusBadge(pitch.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
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
                    <Link to={`/pitch/${pitch.id}`}>
                      <Button size="sm">View Details</Button>
                    </Link>
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
                <Card key={pitch.id} className="pitch-card overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{pitch.companyName}</CardTitle>
                        <CardDescription>{pitch.industry} • {pitch.location}</CardDescription>
                      </div>
                      {getStatusBadge(pitch.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
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
                    <Link to={`/pitch/${pitch.id}`}>
                      <Button size="sm">View Details</Button>
                    </Link>
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
                <Card key={pitch.id} className="pitch-card overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{pitch.companyName}</CardTitle>
                        <CardDescription>{pitch.industry} • {pitch.location}</CardDescription>
                      </div>
                      {getStatusBadge(pitch.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
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
                    <Link to={`/pitch/${pitch.id}`}>
                      <Button size="sm">View Details</Button>
                    </Link>
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
    </MainLayout>
  );
};

export default InvestorDashboard;
