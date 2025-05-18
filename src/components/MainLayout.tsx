
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Search, Filter, Tag, Calendar, 
  User, LogOut, Menu, ChevronRight, X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Web3Background from './Web3Background';
import { useIsMobile } from '@/hooks/use-mobile';
import InvestorNavigation from './InvestorNavigation';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { profile, signOut, isFounder, isInvestor } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSignOut = async () => {
    await signOut();
  };

  // Use the new InvestorNavigation component for investors
  if (isInvestor) {
    return (
      <div className="flex h-screen w-full bg-background overflow-hidden relative">
        <Web3Background />
        <InvestorNavigation profile={profile} signOut={handleSignOut} />
        <main className={`flex-1 overflow-y-auto scrollbar-none p-6 md:p-6 lg:p-8 ${isMobile ? 'pt-24' : ''}`}>
          {children}
        </main>
      </div>
    );
  }

  // Continue using the existing layout for founders
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative">
      <Web3Background />
      
      {/* Mobile Header with Hamburger */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-sidebar glass-effect border-b border-sidebar-border p-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-neon-purple font-bold font-mono text-xl">PITCH<span className="text-white">SYNC</span></span>
            <span className="text-[10px] text-sidebar-foreground/70 ml-1">WEB3</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white hover:text-white hover:bg-sidebar-accent border border-white/10
                     hover:border-white/20 focus:outline-neon-purple/50"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </Button>
        </div>
      )}
      
      {/* Mobile Menu Overlay */}
      {isMobile && mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/80" onClick={() => setMobileMenuOpen(false)}></div>
      )}
      
      {/* Mobile Menu */}
      {isMobile && (
        <div className={`
          fixed top-[72px] right-0 z-40 h-[calc(100vh-72px)] w-64 
          transform transition-transform duration-300 ease-in-out
          bg-sidebar glass-effect 
          ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <nav className="flex-1 p-4">
            {isInvestor ? (
              <ul className="space-y-4">
                <li>
                  <Button 
                    variant="ghost"
                    className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LayoutDashboard size={20} className="mr-3 text-neon-purple" />
                    <span className="font-mono tracking-wide">DASHBOARD</span>
                  </Button>
                </li>
                <li>
                  <Button 
                    variant="ghost"
                    className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Search size={20} className="mr-3 text-neon-blue" />
                    <span className="font-mono tracking-wide">SEARCH</span>
                  </Button>
                </li>
                <li>
                  <Button 
                    variant="ghost"
                    className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Filter size={20} className="mr-3 text-neon-cyan" />
                    <span className="font-mono tracking-wide">FILTER</span>
                  </Button>
                </li>
                <li>
                  <Button 
                    variant="ghost"
                    className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Tag size={20} className="mr-3 text-neon-green" />
                    <span className="font-mono tracking-wide">TAGS</span>
                  </Button>
                </li>
                <li>
                  <Button 
                    variant="ghost"
                    className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Calendar size={20} className="mr-3 text-neon-pink" />
                    <span className="font-mono tracking-wide">CALENDAR</span>
                  </Button>
                </li>
              </ul>
            ) : (
              <ul className="space-y-4">
                <li>
                  <Button 
                    variant="ghost"
                    className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LayoutDashboard size={20} className="mr-3 text-neon-purple" />
                    <span className="font-mono tracking-wide">DASHBOARD</span>
                  </Button>
                </li>
                <li>
                  <Button 
                    variant="ghost"
                    className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Tag size={20} className="mr-3 text-neon-blue" />
                    <span className="font-mono tracking-wide">SUBMIT PITCH</span>
                  </Button>
                </li>
              </ul>
            )}
          </nav>
          
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-purple to-neon-blue 
                         flex items-center justify-center text-white shadow-neon">
                {profile?.name ? profile.name.charAt(0).toUpperCase() : '?'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-sidebar-foreground">{profile?.name || 'User'}</p>
                <p className="text-xs text-sidebar-foreground opacity-70 font-mono tracking-wide">{profile?.role || 'Guest'}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleSignOut}
                className="ml-auto text-sidebar-foreground hover:text-white hover:bg-sidebar-accent"
              >
                <LogOut size={18} />
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Desktop Sidebar */}
      {!isMobile && isFounder && (
        <div 
          className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out 
                   bg-sidebar z-50 h-screen flex flex-col glass-effect`}
        >
          <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
            <div className="flex items-center overflow-hidden">
              {sidebarOpen ? (
                <div className="flex flex-col">
                  <span className="text-neon-purple font-bold font-mono text-xl">PITCH<span className="text-white">SYNC</span></span>
                  <span className="text-[10px] text-sidebar-foreground/70 -mt-1">WEB3 VENTURE PLATFORM</span>
                </div>
              ) : (
                <span className="text-neon-purple font-bold font-mono text-xl">PS</span>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white hover:text-white hover:bg-sidebar-accent border border-white/10
                       hover:border-white/20 focus:outline-neon-purple/50"
            >
              {sidebarOpen ? <ChevronRight size={18} /> : <Menu size={18} />}
            </Button>
          </div>
          
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/dashboard" 
                  className={`group flex items-center p-2 text-sidebar-foreground rounded-md 
                            hover:bg-sidebar-accent transition-all duration-200
                            ${location.pathname === '/dashboard' && !location.search ? 'bg-sidebar-accent' : ''}`}
                >
                  <LayoutDashboard size={20} className="mr-3 text-neon-purple group-hover:text-neon-cyan transition-colors" />
                  {sidebarOpen && (
                    <span className="font-mono tracking-wide">DASHBOARD</span>
                  )}
                </Link>
              </li>
              <li>
                <Link 
                  to="/submit" 
                  className={`group flex items-center p-2 text-sidebar-foreground rounded-md 
                            hover:bg-sidebar-accent transition-all duration-200
                            ${location.pathname === '/submit' ? 'bg-sidebar-accent' : ''}`}
                >
                  <Tag size={20} className="mr-3 text-neon-blue group-hover:text-neon-cyan transition-colors" />
                  {sidebarOpen && (
                    <span className="font-mono tracking-wide">SUBMIT PITCH</span>
                  )}
                </Link>
              </li>
            </ul>
          </nav>
          
          <div className="p-4 border-t border-sidebar-border">
            {sidebarOpen ? (
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-purple to-neon-blue 
                             flex items-center justify-center text-white shadow-neon">
                  {profile?.name ? profile.name.charAt(0).toUpperCase() : '?'}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-sidebar-foreground">{profile?.name || 'User'}</p>
                  <p className="text-xs text-sidebar-foreground opacity-70 font-mono tracking-wide">{profile?.role || 'Guest'}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleSignOut}
                  className="ml-auto text-sidebar-foreground hover:text-white hover:bg-sidebar-accent"
                >
                  <LogOut size={18} />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-purple to-neon-blue 
                             flex items-center justify-center text-white shadow-neon">
                  {profile?.name ? profile.name.charAt(0).toUpperCase() : '?'}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleSignOut}
                  className="text-sidebar-foreground hover:text-white hover:bg-sidebar-accent"
                >
                  <LogOut size={18} />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Main content - with padding top on mobile for header */}
      <main className={`flex-1 overflow-y-auto scrollbar-none p-6 md:p-6 lg:p-8 ${isMobile ? 'pt-24' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
