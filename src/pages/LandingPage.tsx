
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-pitchsync-800">PitchSync</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/signin" className="text-sm font-medium">Sign In</Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center bg-gradient-to-br from-white to-blue-50">
        <div className="container mx-auto px-4 py-16 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-5xl font-bold text-pitchsync-800 mb-6">
              Streamline your investment process
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              PitchSync helps early-stage investors organize, prioritize, and track startup pitch submissions with powerful AI assistance.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button size="lg" asChild>
                <Link to="/signup?role=investor">Sign up as Investor</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/submit">Submit Your Startup</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center md:justify-end">
            <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Latest Pitches</h3>
                  <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full">AI-Scored</span>
                </div>
                <div className="space-y-4">
                  {[
                    { name: "EcoTech Solutions", category: "CleanTech", score: 82 },
                    { name: "MediConnect", category: "HealthTech", score: 75 },
                    { name: "SupplyChain.AI", category: "Logistics", score: 88 },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center p-3 border rounded-md">
                      <div className="w-10 h-10 rounded-full bg-pitchsync-100 flex items-center justify-center text-pitchsync-600 font-medium">
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
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-pitchsync-100 rounded-lg flex items-center justify-center text-pitchsync-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Analysis</h3>
              <p className="text-gray-600">Automatically summarize pitch decks and score submissions based on your investment criteria.</p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-pitchsync-100 rounded-lg flex items-center justify-center text-pitchsync-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Collaborative Workflow</h3>
              <p className="text-gray-600">Shortlist, reject, or forward deals to team members or other investors with ease.</p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-pitchsync-100 rounded-lg flex items-center justify-center text-pitchsync-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Deal Flow Management</h3>
              <p className="text-gray-600">Advanced search, tagging, and filtering to stay organized and make better investment decisions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-pitchsync-800 text-white py-12">
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
                  <li><a href="#" className="text-pitchsync-200 hover:text-white">Features</a></li>
                  <li><a href="#" className="text-pitchsync-200 hover:text-white">Pricing</a></li>
                  <li><a href="#" className="text-pitchsync-200 hover:text-white">Testimonials</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-pitchsync-200 hover:text-white">About</a></li>
                  <li><a href="#" className="text-pitchsync-200 hover:text-white">Blog</a></li>
                  <li><a href="#" className="text-pitchsync-200 hover:text-white">Careers</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Support</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-pitchsync-200 hover:text-white">Help Center</a></li>
                  <li><a href="#" className="text-pitchsync-200 hover:text-white">Contact Us</a></li>
                  <li><a href="#" className="text-pitchsync-200 hover:text-white">Privacy Policy</a></li>
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
