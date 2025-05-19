import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Download, 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Briefcase, 
  DollarSign,
  FileText,
  Video
} from 'lucide-react';
import { getPitchById, Pitch, updatePitchStatus } from '@/services/pitchService';
import PitchActionButtons from '@/components/pitch/PitchActionButtons';

const PitchDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [pitch, setPitch] = useState<Pitch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pitchData, setPitchData] = useState<Pitch | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadPitch = async () => {
      if (!id) return;
      
      try {
        const data = await getPitchById(id);
        if (data) {
          setPitch(data);
          setPitchData(data);
        } else {
          toast({
            variant: "destructive",
            title: "Pitch not found",
            description: "The requested pitch could not be found.",
          });
          navigate('/dashboard');
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error loading pitch",
          description: "Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPitch();
  }, [id, navigate, toast]);
  
  const handleUpdateStatus = async (status: Pitch['status']) => {
    if (!pitch) return;
    
    try {
      const updatedPitch = await updatePitchStatus(pitch.id, status);
      setPitch(updatedPitch);
      
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
  
  const handleStatusChange = (newStatus: string) => {
    if (pitchData) {
      setPitchData({
        ...pitchData,
        status: newStatus as Pitch['status']
      });
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
  
  if (!pitch) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl font-bold mb-2">Pitch Not Found</h2>
          <p className="text-gray-500 mb-6">The requested pitch could not be found.</p>
          <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
        </div>
      </MainLayout>
    );
  }
  
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
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft size={18} />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{pitch.companyName}</h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline">{pitch.fundingStage}</Badge>
                <Badge variant="outline">{pitch.industry}</Badge>
                <Badge variant="outline">{pitch.location}</Badge>
                {getStatusBadge(pitch.status)}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Company and founder info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <User size={18} className="mr-2 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Founder</p>
                      <p className="font-medium">{pitch.founderName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Mail size={18} className="mr-2 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{pitch.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar size={18} className="mr-2 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Submitted on</p>
                      <p className="font-medium">{formatDate(pitch.createdAt)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin size={18} className="mr-2 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{pitch.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Briefcase size={18} className="mr-2 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Industry</p>
                      <p className="font-medium">{pitch.industry}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <DollarSign size={18} className="mr-2 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Funding Amount</p>
                      <p className="font-medium">{pitch.fundingAmount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Decision</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Button 
                      className="flex-1" 
                      onClick={() => handleUpdateStatus('shortlisted')}
                      variant={pitch.status === 'shortlisted' ? 'default' : 'outline'}
                      disabled={pitch.status === 'shortlisted'}
                    >
                      Shortlist
                    </Button>
                    <Button 
                      className="flex-1" 
                      onClick={() => handleUpdateStatus('rejected')}
                      variant={pitch.status === 'rejected' ? 'destructive' : 'outline'}
                      disabled={pitch.status === 'rejected'}
                    >
                      Reject
                    </Button>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    variant={pitch.status === 'forwarded' ? 'default' : 'outline'}
                    onClick={() => handleUpdateStatus('forwarded')}
                    disabled={pitch.status === 'forwarded'}
                  >
                    Forward to Team
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>AI Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">AI Score</p>
                    <div className="flex items-center">
                      <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${pitch.aiScore && pitch.aiScore >= 80 ? 'bg-green-500' : pitch.aiScore && pitch.aiScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${pitch.aiScore}%` }}
                        ></div>
                      </div>
                      <span className="ml-3 font-semibold">{pitch.aiScore}/100</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-2">AI Summary</p>
                    <p className="text-sm">{pitch.aiSummary}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right column - Pitch content */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="overflow-hidden">
                <CardHeader className="bg-gray-50 pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>Pitch Deck</CardTitle>
                    <Button variant="outline" size="sm">
                      <Download size={16} className="mr-2" />
                      Download
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="aspect-video bg-gray-100 flex items-center justify-center">
                    <div className="text-center p-6">
                      <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">Preview not available.</p>
                      <Button variant="link" className="mt-2">
                        <Download size={16} className="mr-2" />
                        Download Pitch Deck
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {pitch.videoUrl && (
                <Card className="overflow-hidden">
                  <CardHeader className="bg-gray-50">
                    <CardTitle>Video Intro</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="aspect-video bg-gray-100 flex items-center justify-center">
                      <div className="text-center p-6">
                        <Video size={48} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500">Video preview not available.</p>
                        <Button variant="link" className="mt-2">
                          <Download size={16} className="mr-2" />
                          Download Video
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <Card>
                <CardHeader>
                  <CardTitle>Company Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{pitch.description}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Founder Q&A</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {pitch.answers.map((item, index) => (
                      <div key={index}>
                        <h3 className="font-medium text-pitchsync-800 mb-1">{item.question}</h3>
                        <p className="text-gray-600">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Pitch Actions */}
        <div className="mt-8">
          <PitchActionButtons 
            pitch={pitch} 
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default PitchDetails;
