
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Search, Filter, Tag, Calendar, User, LogOut, Menu, ChevronRight } from 'lucide-react';
import Web3Background from './Web3Background';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { profile, signOut, isFounder, isInvestor } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative">
      <Web3Background />
      
      {/* Sidebar */}
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
                  className="group flex items-center p-2 text-sidebar-foreground rounded-md 
                           hover:bg-sidebar-accent transition-all duration-200"
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
                  className="group flex items-center p-2 text-sidebar-foreground rounded-md 
                           hover:bg-sidebar-accent transition-all duration-200"
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
                  className="group flex items-center p-2 text-sidebar-foreground rounded-md 
                           hover:bg-sidebar-accent transition-all duration-200"
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
                  className="group flex items-center p-2 text-sidebar-foreground rounded-md 
                           hover:bg-sidebar-accent transition-all duration-200"
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
                  className="group flex items-center p-2 text-sidebar-foreground rounded-md 
                           hover:bg-sidebar-accent transition-all duration-200"
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
                  className="group flex items-center p-2 text-sidebar-foreground rounded-md 
                           hover:bg-sidebar-accent transition-all duration-200"
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
                  className="group flex items-center p-2 text-sidebar-foreground rounded-md 
                           hover:bg-sidebar-accent transition-all duration-200"
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
      
      {/* Main content */}
      <main className="flex-1 overflow-y-auto scrollbar-none p-6 md:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
