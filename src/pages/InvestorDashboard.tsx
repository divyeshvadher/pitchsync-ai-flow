
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { getPitches } from '@/services/pitchGet';
import { Pitch } from '@/services/types/pitch';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, Send, Clock, Eye, Filter, SlidersHorizontal, Tag as TagIcon, FileText } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Tag } from '@/components/ui/tag';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { 
  COMMON_TAGS, 
  FUNDING_STAGES, 
  INDUSTRIES, 
  REGIONS, 
  addNoteToPitch, 
  addTagToPitch, 
  getNotesForPitch, 
  getTagsForPitch, 
  removeTagFromPitch,
  updateMultiplePitchesStatus
} from '@/services/investorService';

const InvestorDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // State for multi-selection and filters
  const [selectedPitches, setSelectedPitches] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [newNote, setNewNote] = useState('');
  const [currentPitchId, setCurrentPitchId] = useState<string | null>(null);
  const [pitchTags, setPitchTags] = useState<Record<string, any[]>>({});
  const [pitchNotes, setPitchNotes] = useState<Record<string, any[]>>({});
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [fundingStageFilter, setFundingStageFilter] = useState<string[]>([]);
  const [industryFilter, setIndustryFilter] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState<string[]>([]);
  const [minScore, setMinScore] = useState<number | null>(null);
  const [maxScore, setMaxScore] = useState<number | null>(null);
  const [tagFilters, setTagFilters] = useState<string[]>([]);

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

  // Load tags and notes for each pitch
  useEffect(() => {
    if (pitches) {
      const loadPitchData = async () => {
        const tagsData: Record<string, any[]> = {};
        const notesData: Record<string, any[]> = {};
        
        for (const pitch of pitches) {
          const tags = await getTagsForPitch(pitch.id);
          const notes = await getNotesForPitch(pitch.id);
          tagsData[pitch.id] = tags;
          notesData[pitch.id] = notes;
        }
        
        setPitchTags(tagsData);
        setPitchNotes(notesData);
      };
      
      loadPitchData();
    }
  }, [pitches]);

  const filteredPitches = pitches?.filter(pitch => {
    // Apply search query filter
    if (searchQuery && !pitch.companyName.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !pitch.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Apply funding stage filter
    if (fundingStageFilter.length > 0 && !fundingStageFilter.includes(pitch.fundingStage)) {
      return false;
    }
    
    // Apply industry filter
    if (industryFilter.length > 0 && !industryFilter.includes(pitch.industry)) {
      return false;
    }
    
    // Apply location filter
    if (locationFilter.length > 0 && !locationFilter.includes(pitch.location)) {
      return false;
    }
    
    // Apply AI score filter
    if (minScore !== null && (pitch.aiScore || 0) < minScore) {
      return false;
    }
    if (maxScore !== null && (pitch.aiScore || 0) > maxScore) {
      return false;
    }
    
    // Apply tag filters
    if (tagFilters.length > 0) {
      const pitchTagsArray = pitchTags[pitch.id] || [];
      const pitchTagNames = pitchTagsArray.map(tag => tag.name.toLowerCase());
      
      if (!tagFilters.some(tag => pitchTagNames.includes(tag.toLowerCase()))) {
        return false;
      }
    }
    
    return true;
  });

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

  const handleViewPitch = (pitchId: string) => {
    navigate(`/pitch/${pitchId}`);
  };

  const handleSelectPitch = (pitchId: string) => {
    setSelectedPitches(prev => {
      if (prev.includes(pitchId)) {
        return prev.filter(id => id !== pitchId);
      } else {
        return [...prev, pitchId];
      }
    });
  };

  const handleSelectAll = () => {
    if (filteredPitches?.length === selectedPitches.length) {
      setSelectedPitches([]);
    } else {
      setSelectedPitches(filteredPitches?.map(p => p.id) || []);
    }
  };

  const handleBulkAction = async (action: string) => {
    try {
      if (selectedPitches.length === 0) {
        toast({
          title: "No pitches selected",
          description: "Please select at least one pitch to perform this action.",
          variant: "destructive"
        });
        return;
      }

      await updateMultiplePitchesStatus(selectedPitches, action);
      
      toast({
        title: "Success",
        description: `Updated ${selectedPitches.length} pitches to ${action}.`,
        variant: "default"
      });
      
      // Clear selection and refetch
      setSelectedPitches([]);
      queryClient.invalidateQueries({ queryKey: ['allPitches'] });
    } catch (error) {
      toast({
        title: "Action failed",
        description: "There was an error processing your request.",
        variant: "destructive"
      });
    }
  };

  const handleAddTag = async (pitchId: string) => {
    if (!newTag.trim()) return;
    
    const tag = await addTagToPitch(pitchId, newTag.trim());
    if (tag) {
      setPitchTags(prev => ({
        ...prev,
        [pitchId]: [...(prev[pitchId] || []), tag]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = async (tagId: string, pitchId: string) => {
    const success = await removeTagFromPitch(tagId);
    if (success) {
      setPitchTags(prev => ({
        ...prev,
        [pitchId]: (prev[pitchId] || []).filter(tag => tag.id !== tagId)
      }));
    }
  };

  const handleAddNote = async () => {
    if (!currentPitchId || !newNote.trim()) return;
    
    const note = await addNoteToPitch(currentPitchId, newNote.trim());
    if (note) {
      setPitchNotes(prev => ({
        ...prev,
        [currentPitchId]: [...(prev[currentPitchId] || []), note]
      }));
      setNewNote('');
      setIsAddingNote(false);
      
      toast({
        title: "Note added",
        description: "Your note has been saved.",
        variant: "default"
      });
    }
  };

  const openAddNote = (pitchId: string) => {
    setCurrentPitchId(pitchId);
    setIsAddingNote(true);
  };

  const toggleTagFilter = (tag: string) => {
    setTagFilters(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const toggleFundingStageFilter = (stage: string) => {
    setFundingStageFilter(prev => 
      prev.includes(stage) 
        ? prev.filter(s => s !== stage) 
        : [...prev, stage]
    );
  };

  const toggleIndustryFilter = (industry: string) => {
    setIndustryFilter(prev => 
      prev.includes(industry) 
        ? prev.filter(i => i !== industry) 
        : [...prev, industry]
    );
  };

  const toggleLocationFilter = (location: string) => {
    setLocationFilter(prev => 
      prev.includes(location) 
        ? prev.filter(l => l !== location) 
        : [...prev, location]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFundingStageFilter([]);
    setIndustryFilter([]);
    setLocationFilter([]);
    setMinScore(null);
    setMaxScore(null);
    setTagFilters([]);
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
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Investor Dashboard</h1>
            <p className="text-gray-600 mt-1">Review startup pitches in real-time</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {/* Search input */}
            <div className="relative w-full md:w-auto">
              <Input
                type="text"
                placeholder="Search pitches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-[220px]"
              />
            </div>
            
            {/* Filter button */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                  {(fundingStageFilter.length > 0 || industryFilter.length > 0 || locationFilter.length > 0 || minScore !== null || maxScore !== null || tagFilters.length > 0) && (
                    <span className="ml-1 bg-primary text-primary-foreground w-5 h-5 rounded-full text-xs flex items-center justify-center">
                      {fundingStageFilter.length + industryFilter.length + locationFilter.length + (minScore !== null || maxScore !== null ? 1 : 0) + tagFilters.length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[300px] sm:w-[400px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filter Pitches</SheetTitle>
                  <SheetDescription>
                    Narrow down pitches based on your investment criteria
                  </SheetDescription>
                </SheetHeader>
                
                <div className="py-6 space-y-6">
                  {/* Funding Stage Filter */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Funding Stage</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {FUNDING_STAGES.map(stage => (
                        <div 
                          key={stage} 
                          onClick={() => toggleFundingStageFilter(stage)}
                          className={`px-3 py-1.5 rounded-md text-sm cursor-pointer transition-colors ${
                            fundingStageFilter.includes(stage) 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted hover:bg-muted/80'
                          }`}
                        >
                          {stage}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Industry Filter */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Industry</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {INDUSTRIES.map(industry => (
                        <div 
                          key={industry} 
                          onClick={() => toggleIndustryFilter(industry)}
                          className={`px-3 py-1.5 rounded-md text-sm cursor-pointer transition-colors ${
                            industryFilter.includes(industry) 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted hover:bg-muted/80'
                          }`}
                        >
                          {industry}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Region Filter */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Region</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {REGIONS.map(region => (
                        <div 
                          key={region} 
                          onClick={() => toggleLocationFilter(region)}
                          className={`px-3 py-1.5 rounded-md text-sm cursor-pointer transition-colors ${
                            locationFilter.includes(region) 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted hover:bg-muted/80'
                          }`}
                        >
                          {region}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* AI Score Range */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">AI Score Range</h3>
                    <div className="flex items-center gap-2">
                      <Input 
                        type="number" 
                        placeholder="Min" 
                        min={0} 
                        max={100}
                        value={minScore || ''}
                        onChange={(e) => setMinScore(e.target.value ? Number(e.target.value) : null)}
                        className="w-20"
                      />
                      <span>to</span>
                      <Input 
                        type="number" 
                        placeholder="Max" 
                        min={0} 
                        max={100}
                        value={maxScore || ''}
                        onChange={(e) => setMaxScore(e.target.value ? Number(e.target.value) : null)}
                        className="w-20"
                      />
                    </div>
                  </div>
                  
                  {/* Tag Filters */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {COMMON_TAGS.map(tag => (
                        <div 
                          key={tag} 
                          onClick={() => toggleTagFilter(tag)}
                          className={`px-3 py-1.5 rounded-md text-sm cursor-pointer transition-colors ${
                            tagFilters.includes(tag) 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted hover:bg-muted/80'
                          }`}
                        >
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={clearFilters}>Clear all</Button>
                    <Button onClick={() => setIsFilterOpen(false)}>Apply filters</Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            {/* Bulk actions dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  disabled={selectedPitches.length === 0}
                  className="flex items-center gap-1"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Bulk Actions</span>
                  {selectedPitches.length > 0 && (
                    <span className="ml-1 bg-primary text-primary-foreground w-5 h-5 rounded-full text-xs flex items-center justify-center">
                      {selectedPitches.length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleBulkAction('shortlisted')}>
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span>Shortlist Selected</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction('rejected')}>
                  <X className="h-4 w-4 mr-2 text-red-500" />
                  <span>Reject Selected</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction('forwarded')}>
                  <Send className="h-4 w-4 mr-2 text-blue-500" />
                  <span>Forward Selected</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {filteredPitches && filteredPitches.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>All Pitches</CardTitle>
              <CardDescription>Showing {filteredPitches.length} pitches</CardDescription>
            </CardHeader>
            <div className="overflow-x-auto">
              <CardContent className={isMobile ? "px-2" : ""}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">
                        <Checkbox
                          checked={filteredPitches.length > 0 && selectedPitches.length === filteredPitches.length}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead className="hidden md:table-cell">Founder Email</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">AI Score</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPitches.map(pitch => (
                      <TableRow key={pitch.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedPitches.includes(pitch.id)}
                            onCheckedChange={() => handleSelectPitch(pitch.id)}
                          />
                        </TableCell>
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
                          <div className="flex flex-wrap gap-1 max-w-[150px]">
                            {pitchTags[pitch.id]?.slice(0, 2).map(tag => (
                              <Tag key={tag.id} variant={tag.name.toLowerCase() as any}>
                                {tag.name}
                              </Tag>
                            ))}
                            {(pitchTags[pitch.id]?.length || 0) > 2 && (
                              <Tag>+{pitchTags[pitch.id].length - 2}</Tag>
                            )}
                            
                            {/* Add tag dialog */}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="icon" className="h-6 w-6 rounded-full">
                                  <TagIcon className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Tags for {pitch.companyName}</DialogTitle>
                                  <DialogDescription>
                                    Add tags to help organize your pitches
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {pitchTags[pitch.id]?.map(tag => (
                                      <Tag 
                                        key={tag.id} 
                                        variant={tag.name.toLowerCase() as any}
                                        removable
                                        onRemove={() => handleRemoveTag(tag.id, pitch.id)}
                                      >
                                        {tag.name}
                                      </Tag>
                                    ))}
                                    {pitchTags[pitch.id]?.length === 0 && (
                                      <p className="text-sm text-muted-foreground">No tags yet</p>
                                    )}
                                  </div>
                                  
                                  <div className="flex gap-2">
                                    <Input
                                      value={newTag}
                                      onChange={(e) => setNewTag(e.target.value)}
                                      placeholder="Add a new tag..."
                                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag(pitch.id)}
                                    />
                                    <Button onClick={() => handleAddTag(pitch.id)}>Add</Button>
                                  </div>
                                  
                                  <div>
                                    <h4 className="text-sm font-medium mb-2">Common tags</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {COMMON_TAGS.map(tag => (
                                        <Button
                                          key={tag}
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            setNewTag(tag);
                                            handleAddTag(pitch.id);
                                          }}
                                        >
                                          {tag}
                                        </Button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleViewPitch(pitch.id)}
                              className="flex items-center gap-1"
                            >
                              <Eye className="h-4 w-4" />
                              <span className="hidden sm:inline">View</span>
                            </Button>
                            
                            {/* Notes button */}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openAddNote(pitch.id)}
                              className="flex items-center gap-1"
                            >
                              <FileText className="h-4 w-4" />
                              <span className="hidden sm:inline">Note</span>
                            </Button>
                          </div>
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
            <p className="text-gray-600">No pitches match your current filters.</p>
            {(searchQuery || fundingStageFilter.length > 0 || industryFilter.length > 0 || locationFilter.length > 0 || minScore !== null || maxScore !== null || tagFilters.length > 0) && (
              <Button className="mt-4" onClick={clearFilters}>Clear filters</Button>
            )}
          </div>
        )}
      </div>
      
      {/* Add Note Dialog */}
      <Dialog open={isAddingNote} onOpenChange={setIsAddingNote}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
            <DialogDescription>
              {filteredPitches?.find(p => p.id === currentPitchId)?.companyName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {pitchNotes[currentPitchId || '']?.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Previous Notes</h3>
                <div className="max-h-[150px] overflow-y-auto space-y-2 border rounded-md p-3">
                  {pitchNotes[currentPitchId || '']?.map(note => (
                    <div key={note.id} className="text-sm border-b pb-2">
                      <p>{note.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(note.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Enter your note..."
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingNote(false)}>Cancel</Button>
            <Button onClick={handleAddNote}>Save Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default InvestorDashboard;
