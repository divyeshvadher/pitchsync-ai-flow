
import { useState } from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Search, Filter, Tag, Calendar, User, LogOut } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSignOut = async () => {
    await signOut();
    navigate('/signin');
  };

  return (
    <div className="flex h-screen w-full bg-background">
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-sidebar h-screen flex flex-col`}>
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          {sidebarOpen ? (
            <span className="text-white font-bold text-xl">PitchSync</span>
          ) : (
            <span className="text-white font-bold text-xl">PS</span>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white hover:text-white hover:bg-sidebar-accent"
          >
            {sidebarOpen ? '←' : '→'}
          </Button>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link 
                to="/dashboard" 
                className="flex items-center p-2 text-sidebar-foreground rounded-md hover:bg-sidebar-accent"
              >
                <LayoutDashboard size={20} className="mr-3" />
                {sidebarOpen && <span>Dashboard</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/dashboard?view=search" 
                className="flex items-center p-2 text-sidebar-foreground rounded-md hover:bg-sidebar-accent"
              >
                <Search size={20} className="mr-3" />
                {sidebarOpen && <span>Search</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/dashboard?view=filter" 
                className="flex items-center p-2 text-sidebar-foreground rounded-md hover:bg-sidebar-accent"
              >
                <Filter size={20} className="mr-3" />
                {sidebarOpen && <span>Filter</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/dashboard?view=tags" 
                className="flex items-center p-2 text-sidebar-foreground rounded-md hover:bg-sidebar-accent"
              >
                <Tag size={20} className="mr-3" />
                {sidebarOpen && <span>Tags</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/dashboard?view=calendar" 
                className="flex items-center p-2 text-sidebar-foreground rounded-md hover:bg-sidebar-accent"
              >
                <Calendar size={20} className="mr-3" />
                {sidebarOpen && <span>Calendar</span>}
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t border-sidebar-border">
          {sidebarOpen ? (
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                {profile?.name ? profile.name.charAt(0).toUpperCase() : '?'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-sidebar-foreground">{profile?.name || 'User'}</p>
                <p className="text-xs text-sidebar-foreground opacity-70">{profile?.role || 'Guest'}</p>
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
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
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
      
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
