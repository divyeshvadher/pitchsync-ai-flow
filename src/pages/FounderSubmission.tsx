import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { createPitch } from "@/services/pitchService";
import { uploadPitchDeck, uploadPitchVideo } from "@/services/storageService";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";

const formSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  founderName: z.string().min(1, "Founder name is required"),
  email: z.string().email("Invalid email address"),
  industry: z.string().min(1, "Industry is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  fundingStage: z.string().min(1, "Funding stage is required"),
  fundingAmount: z.string().min(1, "Funding amount is required"),
  pitchDeckUrl: z.string().min(1, "Pitch deck is required").refine(
    (url) => url !== "/placeholder.svg",
    "Please upload a pitch deck"
  ),
  videoUrl: z.string().optional(),
  answer1: z.string().min(10, "Answer must be at least 10 characters"),
  answer2: z.string().min(10, "Answer must be at least 10 characters"),
  answer3: z.string().min(10, "Answer must be at least 10 characters"),
  answer4: z.string().min(10, "Answer must be at least 10 characters"),
  answer5: z.string().min(10, "Answer must be at least 10 characters"),
});

const industries = [
  "SaaS",
  "FinTech",
  "HealthTech",
  "EdTech",
  "E-commerce",
  "AI/ML",
  "CleanTech",
  "Logistics",
  "Consumer",
  "Gaming",
  "Hardware",
  "Other",
];

const fundingStages = [
  "Pre-seed",
  "Seed",
  "Series A",
  "Series B",
  "Series C+",
  "Bootstrapped",
];

const questions = [
  "What problem are you solving?",
  "What is your unique solution?",
  "What traction do you have?",
  "Tell us about your team.",
  "What are your growth projections?",
];

const FounderSubmission = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useIsMobile();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      founderName: profile?.name || "",
      email: user?.email || "",
      industry: "",
      location: "",
      description: "",
      fundingStage: "",
      fundingAmount: "",
      pitchDeckUrl: "/placeholder.svg", // Using placeholder for demo
      videoUrl: "",
      answer1: "",
      answer2: "",
      answer3: "",
      answer4: "",
      answer5: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      // Format answers into the expected structure for pitchService
      const answers = [
        { question: questions[0], answer: values.answer1 },
        { question: questions[1], answer: values.answer2 },
        { question: questions[2], answer: values.answer3 },
        { question: questions[3], answer: values.answer4 },
        { question: questions[4], answer: values.answer5 },
      ];

      // Create the pitch object in the format expected by the pitchService
      const pitchData = {
        companyName: values.companyName,
        founderName: values.founderName,
        email: values.email,
        industry: values.industry,
        location: values.location,
        description: values.description,
        fundingStage: values.fundingStage,
        fundingAmount: values.fundingAmount,
        pitchDeckUrl: values.pitchDeckUrl,
        videoUrl: values.videoUrl || undefined,
        answers: answers,
      };

      // Submit pitch using the service
      await createPitch(pitchData);

      toast({
        title: "Submission successful",
        description: "Your pitch has been submitted to investors.",
      });

      // Reset form
      form.reset();

      // Show success message and redirect to confirmation screen
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error: any) {
      console.error('Submission error:', error);
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: error.message || "There was an error submitting your pitch. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl md:text-2xl font-bold text-pitchsync-800">PitchSync</h1>
          </div>
          <div>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>Exit</Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 md:mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Submit Your Pitch</h1>
            <p className="text-gray-600">
              Complete the form below to submit your startup pitch to potential investors.
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
                  {/* Company Information Section */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Company Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter company name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Industry</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select industry" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className={isMobile ? "w-[calc(100vw-2rem)]" : ""}>
                                {industries.map((industry) => (
                                  <SelectItem key={industry} value={industry}>
                                    {industry}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input placeholder="City, Country" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Company Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Brief description of your company and what you do"
                                {...field}
                                rows={3}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Funding Information */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Funding Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <FormField
                        control={form.control}
                        name="fundingStage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Funding Stage</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select funding stage" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className={isMobile ? "w-[calc(100vw-2rem)]" : ""}>
                                {fundingStages.map((stage) => (
                                  <SelectItem key={stage} value={stage}>
                                    {stage}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="fundingAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Funding Amount</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. $500,000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Founder Information */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Founder Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <FormField
                        control={form.control}
                        name="founderName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Your email address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Pitch Materials */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Pitch Materials</h2>
                    <div className="grid grid-cols-1 gap-4 md:gap-6">
                      <FormField
                        control={form.control}
                        name="pitchDeckUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pitch Deck</FormLabel>
                            <FormControl>
                              <div className="flex flex-col md:flex-row md:items-center">
                                <Input
                                  type="file"
                                  className="hidden"
                                  id="pitchDeckInput"
                                  accept=".pdf"
                                  onChange={async (e) => {
                                    try {
                                      const file = e.target.files?.[0];
                                      if (!file) return;
                                      
                                      const url = await uploadPitchDeck(file);
                                      field.onChange(url);
                                      
                                      toast({
                                        title: "Upload successful",
                                        description: "Pitch deck uploaded successfully."
                                      });
                                    } catch (error: any) {
                                      toast({
                                        variant: "destructive",
                                        title: "Upload failed",
                                        description: error.message || "Failed to upload pitch deck."
                                      });
                                    }
                                  }}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => document.getElementById("pitchDeckInput")?.click()}
                                  className="w-full md:w-auto"
                                >
                                  Upload Pitch Deck
                                </Button>
                                <span className="mt-2 md:mt-0 md:ml-4 text-sm text-gray-500">
                                  {field.value && field.value !== "/placeholder.svg" ? "PDF uploaded" : "No file selected"}
                                </span>
                              </div>
                            </FormControl>
                            <FormDescription>
                              Upload your pitch deck (PDF format, max 10MB).
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="videoUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Video Introduction (Optional)</FormLabel>
                            <FormControl>
                              <div className="flex flex-col md:flex-row md:items-center">
                                <Input
                                  type="file"
                                  className="hidden"
                                  id="videoInput"
                                  accept=".mp4,.mov,.avi"
                                  onChange={async (e) => {
                                    try {
                                      const file = e.target.files?.[0];
                                      if (!file) return;
                                      
                                      const url = await uploadPitchVideo(file);
                                      field.onChange(url);
                                      
                                      toast({
                                        title: "Upload successful",
                                        description: "Video uploaded successfully."
                                      });
                                    } catch (error: any) {
                                      toast({
                                        variant: "destructive",
                                        title: "Upload failed",
                                        description: error.message || "Failed to upload video."
                                      });
                                    }
                                  }}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => document.getElementById("videoInput")?.click()}
                                  className="w-full md:w-auto"
                                >
                                  Upload Video
                                </Button>
                                <span className="mt-2 md:mt-0 md:ml-4 text-sm text-gray-500">
                                  {field.value ? "Video uploaded" : "No file selected"}
                                </span>
                              </div>
                            </FormControl>
                            <FormDescription>
                              Upload a 2-minute video introduction (MP4, MOV, or AVI, max 100MB).
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Founder Q&A */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Founder Q&A</h2>
                    <div className="space-y-4 md:space-y-6">
                      {questions.map((question, index) => (
                        <FormField
                          key={index}
                          control={form.control}
                          name={`answer${index + 1}` as "answer1" | "answer2" | "answer3" | "answer4" | "answer5"}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{question}</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Your answer"
                                  {...field}
                                  rows={3}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Pitch"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FounderSubmission;