
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Search, Filter, Tag, Calendar, 
  User, LogOut, Menu, ChevronRight, X 
} from 'lucide-react';
import Web3Background from './Web3Background';
import { useIsMobile } from '@/hooks/use-mobile';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { profile, signOut, isFounder, isInvestor } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSignOut = async () => {
    await signOut();
  };

  // Close mobile menu when navigating to a new page
  const handleNavigation = (path: string) => {
    if (isMobile) {
      setMobileMenuOpen(false);
    }
    navigate(path);
  };

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
                    onClick={() => handleNavigation('/dashboard')}
                  >
                    <LayoutDashboard size={20} className="mr-3 text-neon-purple" />
                    <span className="font-mono tracking-wide">DASHBOARD</span>
                  </Button>
                </li>
                <li>
                  <Button 
                    variant="ghost"
                    className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                    onClick={() => handleNavigation('/dashboard?view=search')}
                  >
                    <Search size={20} className="mr-3 text-neon-blue" />
                    <span className="font-mono tracking-wide">SEARCH</span>
                  </Button>
                </li>
                <li>
                  <Button 
                    variant="ghost"
                    className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                    onClick={() => handleNavigation('/dashboard?view=filter')}
                  >
                    <Filter size={20} className="mr-3 text-neon-cyan" />
                    <span className="font-mono tracking-wide">FILTER</span>
                  </Button>
                </li>
                <li>
                  <Button 
                    variant="ghost"
                    className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                    onClick={() => handleNavigation('/dashboard?view=tags')}
                  >
                    <Tag size={20} className="mr-3 text-neon-green" />
                    <span className="font-mono tracking-wide">TAGS</span>
                  </Button>
                </li>
                <li>
                  <Button 
                    variant="ghost"
                    className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                    onClick={() => handleNavigation('/dashboard?view=calendar')}
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
                    onClick={() => handleNavigation('/dashboard')}
                  >
                    <LayoutDashboard size={20} className="mr-3 text-neon-purple" />
                    <span className="font-mono tracking-wide">DASHBOARD</span>
                  </Button>
                </li>
                <li>
                  <Button 
                    variant="ghost"
                    className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                    onClick={() => handleNavigation('/submit')}
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
      {!isMobile && (
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
            {isInvestor ? (
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
                    to="/dashboard?view=search" 
                    className={`group flex items-center p-2 text-sidebar-foreground rounded-md 
                              hover:bg-sidebar-accent transition-all duration-200
                              ${location.search === '?view=search' ? 'bg-sidebar-accent' : ''}`}
                  >
                    <Search size={20} className="mr-3 text-neon-blue group-hover:text-neon-cyan transition-colors" />
                    {sidebarOpen && (
                      <span className="font-mono tracking-wide">SEARCH</span>
                    )}
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/dashboard?view=filter" 
                    className={`group flex items-center p-2 text-sidebar-foreground rounded-md 
                              hover:bg-sidebar-accent transition-all duration-200
                              ${location.search === '?view=filter' ? 'bg-sidebar-accent' : ''}`}
                  >
                    <Filter size={20} className="mr-3 text-neon-cyan group-hover:text-neon-purple transition-colors" />
                    {sidebarOpen && (
                      <span className="font-mono tracking-wide">FILTER</span>
                    )}
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/dashboard?view=tags" 
                    className={`group flex items-center p-2 text-sidebar-foreground rounded-md 
                              hover:bg-sidebar-accent transition-all duration-200
                              ${location.search === '?view=tags' ? 'bg-sidebar-accent' : ''}`}
                  >
                    <Tag size={20} className="mr-3 text-neon-green group-hover:text-neon-cyan transition-colors" />
                    {sidebarOpen && (
                      <span className="font-mono tracking-wide">TAGS</span>
                    )}
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/dashboard?view=calendar" 
                    className={`group flex items-center p-2 text-sidebar-foreground rounded-md 
                              hover:bg-sidebar-accent transition-all duration-200
                              ${location.search === '?view=calendar' ? 'bg-sidebar-accent' : ''}`}
                  >
                    <Calendar size={20} className="mr-3 text-neon-pink group-hover:text-neon-cyan transition-colors" />
                    {sidebarOpen && (
                      <span className="font-mono tracking-wide">CALENDAR</span>
                    )}
                  </Link>
                </li>
              </ul>
            ) : (
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/dashboard" 
                    className={`group flex items-center p-2 text-sidebar-foreground rounded-md 
                              hover:bg-sidebar-accent transition-all duration-200
                              ${location.pathname === '/dashboard' ? 'bg-sidebar-accent' : ''}`}
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
            )}
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
