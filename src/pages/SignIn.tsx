
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
import { useAuth } from "@/context/AuthContext";
import AnimatedBackground from "@/components/AnimatedBackground";

// Schema
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const SignIn = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      await signIn(values.email, values.password);
      toast({
        title: "Signed in successfully",
        description: "Welcome back to PitchSync!",
      });
      navigate("/dashboard");
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side illustration section */}
      <div className="hidden lg:flex w-1/2 bg-pitchsync-800 items-center justify-center p-12">
        <div className="max-w-md text-white text-center">
          <img
            src="/images/undraw_metrics_5v8d.svg"
            alt="Investment illustration"
            className="w-full mb-8"
          />
          <h1 className="text-4xl font-bold mb-4">Make better investment decisions with PitchSync</h1>
          <p className="text-lg text-pitchsync-200">
            Our AI-powered platform helps you manage your deal flow, score pitches, and collaborate with your team.
          </p>
        </div>
      </div>

      {/* Right side form section - now with animated background */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center px-6 py-12 relative overflow-hidden">
        <AnimatedBackground />

        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <h2 className="text-center text-3xl font-bold text-gray-400">Welcome back</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-primary hover:text-primary/80">
              Sign up
            </Link>
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-center text-m font-bold text-gray-900">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
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
                    <FormLabel className="text-center text-m font-bold text-gray-900">Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="ml-2 block text-sm text-gray-900 hover:text-primary">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <Button type="submit" className="w-full text-gray-900" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
