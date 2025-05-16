
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import AnimatedBackground from "@/components/AnimatedBackground";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  firmName: z.string().optional(),
  investmentFocus: z.string().optional(),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const SignUpInvestor = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      firmName: "",
      investmentFocus: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      // Store investment details in user metadata for profile creation
      await signUp(values.email, values.password, values.name, "investor");
      toast({
        title: "Account created successfully",
        description: "Welcome to PitchSync!",
      });

      toast({
        title: "Verification required",
        description: "Please check your email to verify your account before signing in.",
      });

      navigate('/signin');
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side illustration section */}
      <div className="hidden lg:flex w-1/2 bg-pitchsync-800 items-center justify-center p-12">
        <div className="max-w-md text-center text-white">
          <img
            src="/images/undraw_metrics_5v8d.svg"
            alt="Investment illustration"
            className="w-full h-auto mb-8"
          />
          <h1 className="text-2xl font-bold mb-4">Join the PitchSync network</h1>
          <p className="text-base text-pitchsync-200">
            Create your investor account to discover, evaluate and invest in promising startups.
          </p>
        </div>
      </div>

      {/* Right side form section */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8 relative overflow-hidden">
        <AnimatedBackground />
        
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-3xl font-bold text-gray-900">Create your Investor account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/signin" className="font-medium text-primary hover:text-primary/80">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="firmName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Firm Name (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your firm name" {...field} />
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
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="investmentFocus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Investment Focus (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What industries or stages do you focus on?" 
                        className="resize-none h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Create a password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Investor account"}
              </Button>
              
              <div className="text-center mt-4">
                <Link to="/signup/founder" className="text-sm text-gray-600 hover:text-primary">
                  Sign up as a Founder instead
                </Link>
              </div>
            </form>
          </Form>

          <p className="mt-6 text-center text-sm text-gray-500">
            By signing up, you agree to our{" "}
            <a href="#" className="font-medium text-primary hover:text-primary/80">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="font-medium text-primary hover:text-primary/80">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpInvestor;
