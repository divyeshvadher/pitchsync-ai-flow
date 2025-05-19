import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, 
  PieChart, 
  Notebook, 
  BarChart3, 
  MessageCircle, 
  UserCog, 
  Menu, 
  X, 
  ChevronRight, 
  ChevronLeft,
  PlusCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import UnreadMessagesBadge from '@/components/messaging/UnreadMessagesBadge';

// Define the navigation items
const navItems = [
  { 
    path: '/deals', 
    label: 'Deal Flow', 
    icon: LineChart 
  },
  { 
    path: '/portfolio', 
    label: 'My Portfolio', 
    icon: PieChart 
  },
  { 
    path: '/notes', 
    label: 'Saved Notes', 
    icon: Notebook 
  },
  { 
    path: '/analytics', 
    label: 'Analytics', 
    icon: BarChart3 
  },
  { 
    path: '/messages', 
    label: 'Messages',
    icon: MessageCircle,
    badge: UnreadMessagesBadge
  },
  { 
    path: '/settings', 
    label: 'Profile & Settings', 
    icon: UserCog 
  }
];

type InvestorNavigationProps = {
  profile?: {
    name?: string;
    role?: string;
  } | null;
  signOut: () => Promise<void>;
};

const InvestorNavigation: React.FC<InvestorNavigationProps> = ({ profile, signOut }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const isLargeScreen = typeof window !== 'undefined' ? window.innerWidth >= 1024 : false;

  const toggleNav = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const closeMobileMenu = () => {
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  // Desktop sidebar 
  const desktopSidebar = (
    <div 
      className={`hidden lg:flex flex-col h-screen ${isExpanded ? 'w-64' : 'w-20'} 
                bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out`}
    >
      {/* Header with logo */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {isExpanded ? (
          <div className="flex flex-col">
            <span className="text-neon-purple font-bold font-mono text-xl">PITCH<span className="text-white">SYNC</span></span>
            <span className="text-[10px] text-sidebar-foreground/70 -mt-1">INVESTOR PORTAL</span>
          </div>
        ) : (
          <span className="text-neon-purple font-bold font-mono text-xl">PS</span>
        )}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleNav}
          className="text-white hover:text-white hover:bg-sidebar-accent"
        >
          {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </Button>
      </div>
      
      {/* Navigation links */}
      <nav className="flex-1 p-2 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => 
                  `flex items-center p-2 rounded-md transition-all duration-200
                  ${isActive ? 'bg-sidebar-accent text-neon-purple' : 'text-sidebar-foreground hover:bg-sidebar-accent'}`
                }
                onClick={closeMobileMenu}
              >
                <div className={`${isExpanded ? 'mr-3' : 'mx-auto'} h-5 w-5 relative`}>
                  <item.icon className="h-5 w-5" />
                  {item.badge && <item.badge />}
                </div>
                {isExpanded && <span className="font-mono tracking-wide">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Submit Deal button */}
      <div className="p-4 border-t border-sidebar-border">
        <Button 
          variant="default" 
          className={`w-full bg-neon-blue hover:bg-neon-blue/80 text-white
                    ${isExpanded ? 'flex justify-center' : 'p-2'}`}
        >
          <PlusCircle className={`${isExpanded ? 'mr-2' : ''} h-5 w-5`} />
          {isExpanded && <span>Submit Deal</span>}
        </Button>
      </div>
      
      {/* User profile and logout */}
      <div className="p-4 border-t border-sidebar-border">
        {isExpanded ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center text-white">
                {profile?.name ? profile.name.charAt(0).toUpperCase() : '?'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-sidebar-foreground">{profile?.name || 'User'}</p>
                <p className="text-xs text-sidebar-foreground/70">{profile?.role || 'Investor'}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={signOut}
              className="text-sidebar-foreground hover:text-white hover:bg-sidebar-accent"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center text-white">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : '?'}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={signOut}
              className="text-sidebar-foreground hover:text-white hover:bg-sidebar-accent"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  // Mobile menu toggle button
  const mobileMenuToggle = (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={toggleNav}
      className="flex lg:hidden text-white hover:text-white hover:bg-sidebar-accent fixed top-4 left-4 z-50 border border-white/10"
    >
      {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
    </Button>
  );

  // Mobile drawer menu
  const mobileDrawer = (
    <AnimatePresence>
      {mobileMenuOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            className="fixed inset-0 bg-black/80 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobileMenu}
          />
          
          {/* Drawer */}
          <motion.div
            className="fixed inset-y-0 left-0 max-w-xs w-full bg-sidebar z-50 lg:hidden flex flex-col"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ ease: "easeOut", duration: 0.25 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
              <div className="flex flex-col">
                <span className="text-neon-purple font-bold font-mono text-xl">PITCH<span className="text-white">SYNC</span></span>
                <span className="text-[10px] text-sidebar-foreground/70 -mt-1">INVESTOR PORTAL</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={closeMobileMenu}
                className="text-white hover:text-white hover:bg-sidebar-accent"
              >
                <X size={18} />
              </Button>
            </div>
            
            {/* Navigation links */}
            <nav className="flex-1 p-4 overflow-y-auto">
              <ul className="space-y-3">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <NavLink 
                      to={item.path} 
                      className={({ isActive }) => 
                        `flex items-center p-3 rounded-md transition-all duration-200
                        ${isActive ? 'bg-sidebar-accent text-neon-purple' : 'text-sidebar-foreground hover:bg-sidebar-accent'}`
                      }
                      onClick={closeMobileMenu}
                    >
                      <div className="mr-3 h-5 w-5 relative">
                        <item.icon className="h-5 w-5" />
                        {item.badge && <item.badge />}
                      </div>
                      <span className="font-mono tracking-wide">{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
            
            {/* Submit Deal button */}
            <div className="p-4 border-t border-sidebar-border">
              <Button 
                variant="default" 
                className="w-full bg-neon-blue hover:bg-neon-blue/80 text-white flex justify-center"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                <span>Submit Deal</span>
              </Button>
            </div>
            
            {/* User profile */}
            <div className="p-4 border-t border-sidebar-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center text-white">
                    {profile?.name ? profile.name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-sidebar-foreground">{profile?.name || 'User'}</p>
                    <p className="text-xs text-sidebar-foreground/70">{profile?.role || 'Investor'}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={signOut}
                  className="text-sidebar-foreground hover:text-white hover:bg-sidebar-accent"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {desktopSidebar}
      {mobileMenuToggle}
      {mobileDrawer}
    </>
  );
};

export default InvestorNavigation;
