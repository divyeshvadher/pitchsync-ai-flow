import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Briefcase, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="border-b sticky top-0 bg-white/95 backdrop-blur-sm z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-pitchsync-800">PitchSync</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/signin" className="text-sm font-medium hover:text-primary transition-colors">Sign In</Link>
            <Link
              to="/signup/founder"
              className="text-primary hover:text-primary/80"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white via-blue-50 to-pitchsync-50 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-pitchsync-800 leading-tight">
                Connect Startups with <span className="text-primary">Investors</span> That Matter
              </h1>
              <p className="text-xl text-gray-600">
                PitchSync helps founders showcase their vision and enables investors to discover 
                promising opportunities with AI-powered insights and streamlined workflows.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button asChild size="lg" className="px-8">
                  <Link to="/signup/founder">Sign up as a Founder</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="px-8">
                  <Link to="/signup/investor">Sign up as an Investor</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-full h-full bg-pitchsync-100 rounded-lg"></div>
                <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200 relative">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold">Today's Pitch Selection</h3>
                      <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full">AI-Scored</span>
                    </div>
                    <div className="space-y-4">
                      {[
                        { name: "EcoTech Solutions", category: "CleanTech", score: 82 },
                        { name: "MediConnect", category: "HealthTech", score: 75 },
                        { name: "SupplyChain.AI", category: "Logistics", score: 88 },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center p-3 border rounded-md hover:bg-gray-50 transition-colors">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                            {item.name.charAt(0)}
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.category}</p>
                          </div>
                          <div className="bg-pitchsync-50 text-pitchsync-700 px-2 py-1 rounded text-sm font-medium">
                            {item.score}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">How PitchSync Works</h2>
          
          <div className="grid lg:grid-cols-2 gap-16">
            {/* For Founders */}
            <div className="space-y-8">
              <div className="flex items-center justify-center">
                <h3 className="text-2xl font-semibold text-pitchsync-800 px-6 py-2 border-b-2 border-primary inline-block">
                  For Founders
                </h3>
              </div>
              
              <div className="space-y-8">
                {[
                  {
                    step: 1,
                    title: "Create Your Pitch",
                    description: "Upload your pitch deck, business metrics, and team information to showcase your startup."
                  },
                  {
                    step: 2,
                    title: "Get AI-Powered Insights",
                    description: "Receive feedback and optimization tips to make your pitch more attractive to potential investors."
                  },
                  {
                    step: 3,
                    title: "Connect With Investors",
                    description: "Get discovered by interested investors and track engagement with your pitch materials."
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-pitchsync-100 flex items-center justify-center font-semibold text-primary">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-pitchsync-800 mb-1">{item.title}</h4>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center pt-4">
                <Button asChild>
                  <Link to="/signup?role=founder">Start Your Founder Journey</Link>
                </Button>
              </div>
            </div>
            
            {/* For Investors */}
            <div className="space-y-8">
              <div className="flex items-center justify-center">
                <h3 className="text-2xl font-semibold text-pitchsync-800 px-6 py-2 border-b-2 border-primary inline-block">
                  For Investors
                </h3>
              </div>
              
              <div className="space-y-8">
                {[
                  {
                    step: 1,
                    title: "Discover Startups",
                    description: "Browse a curated selection of startups filtered by industry, stage, and investment criteria."
                  },
                  {
                    step: 2,
                    title: "Evaluate with AI Assistance",
                    description: "Review AI-powered analysis and scoring based on market trends and historical data."
                  },
                  {
                    step: 3,
                    title: "Manage Deal Flow",
                    description: "Organize pitches, schedule meetings, and collaborate with your team on investment decisions."
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-pitchsync-100 flex items-center justify-center font-semibold text-primary">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-pitchsync-800 mb-1">{item.title}</h4>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center pt-4">
                <Button asChild>
                  <Link to="/signup?role=investor">Join as an Investor</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Key Platform Features</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            PitchSync offers powerful tools for both founders and investors to streamline the funding process
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <CheckCircle className="h-8 w-8 text-primary" />,
                title: "AI-Powered Analysis",
                description: "Get intelligent insights and scoring to help evaluate pitches and startups more effectively."
              },
              {
                icon: <Briefcase className="h-8 w-8 text-primary" />,
                title: "Deal Flow Management",
                description: "Organize, prioritize and track pitch submissions with customizable workflows."
              },
              {
                icon: <Award className="h-8 w-8 text-primary" />,
                title: "Smart Matching",
                description: "Connect founders with investors based on industry focus, stage preferences, and investment criteria."
              },
            ].map((feature, idx) => (
              <Card key={idx} className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-pitchsync-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Investment Process?</h2>
          <p className="text-xl text-pitchsync-100 max-w-2xl mx-auto mb-8">
            Join PitchSync today and experience a smarter way to connect founders with the right investors.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" variant="default" className="bg-white text-pitchsync-800 hover:bg-white/90" asChild>
              <Link to="/signup">Create Your Account</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link to="/signin">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-pitchsync-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h2 className="text-2xl font-bold mb-4">PitchSync</h2>
              <p className="text-pitchsync-100 max-w-md">
                The modern platform for early-stage investors to manage their deal flow with AI assistance.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
              <div>
                <h3 className="text-lg font-semibold mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-pitchsync-200 hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="text-pitchsync-200 hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#" className="text-pitchsync-200 hover:text-white transition-colors">Testimonials</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-pitchsync-200 hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="text-pitchsync-200 hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="text-pitchsync-200 hover:text-white transition-colors">Careers</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Support</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-pitchsync-200 hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="text-pitchsync-200 hover:text-white transition-colors">Contact Us</a></li>
                  <li><a href="#" className="text-pitchsync-200 hover:text-white transition-colors">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-pitchsync-700 pt-8">
            <p className="text-pitchsync-300 text-center">© 2025 PitchSync. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
