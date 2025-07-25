import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  MessageSquareMore,
  Home,
  BookOpen,
  MessageCircle,
  FileText,
  Settings,
  BarChart3,
  PlusCircle,
  User,
  LogOut,
  X,
  Users,
  Bot,
  NotebookPen,
  Trophy,
  ChevronLeft,
  ChevronRight,
  FilePlus,
  BarChart2,
  Video
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  if (!user) return null;

  const studentMenuItems = [
    { icon: MessageSquareMore, label: "Dashboard", path: '/dashboard' },
    { icon: FilePlus, label: 'Assignments', path: '/assignments' },
    { icon: Home, label: 'Discussion Board', path: '/discussion' },
    { icon: Video, label: 'Meetings', path: '/meetings/student' },
    { icon: BookOpen, label: 'Resources', path: '/resources' },
    { icon: Bot, label: 'AI Teacher', path: '/chatbot' },
    { icon: NotebookPen, label: 'Notes', path: '/notes' },
    { icon: Trophy, label: 'Quizzes', path: '/quizzes' },
  ];

  const teacherMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: FilePlus, label: 'Assignments', path: '/assignments' },
    { icon: BarChart2, label: 'AI Grade Analysis', path: '/teacher-ai-grades' },
    { icon: Home, label: 'Discussion Board', path: '/discussion/teacher/discussion' },
    { icon: PlusCircle, label: 'Create Content', path: '/create' },
    { icon: Video, label: 'Meetings', path: '/meetings/teacher' },
    { icon: Bot, label: 'AI Assistant', path: '/chatbot' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  ];

  const menuItems = user.role === 'student' ? studentMenuItems : teacherMenuItems;

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    if (!window.confirm('Are you sure you want to log out?')) return;
    logout?.();
    navigate('/login');
    toast({ title: 'Success', description: 'Logged out successfully' });
  };

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col z-50',
          isOpen ? 'fixed left-0 top-0' : 'hidden lg:sticky lg:top-0 lg:block',
          isCollapsed ? 'w-20' : 'w-72'
        )}
      >
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <div className="flex items-center justify-between">
            {/* Logo and Collapse Button for Desktop */}
            <div className="flex items-center space-x-4 w-full">
              <div className="flex items-center space-x-2 cursor-pointer" onClick={handleLogoClick}>
                <img 
                  src="/favicon.ico" 
                  alt="LearnSphere Logo" 
                  className="w-8 h-8 object-contain"
                />
                {!isCollapsed && (
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    LearnSphere
                  </h1>
                )}
              </div>
              {/* Desktop collapse toggle */}
              <button 
                onClick={onToggleCollapse}
                className="hidden lg:block p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg ml-auto"
              >
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </button>
            </div>
            {/* Mobile close button */}
            <button 
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <button
                  key={item.path}
                  className={cn(
                    'w-full flex items-center text-left rounded-xl transition-all duration-200',
                    isCollapsed ? 'justify-center px-3 py-3' : 'space-x-3 px-4 py-3',
                    isActive 
                      ? 'bg-gradient-to-r from-[#0071c5] to-[#004494] text-white shadow-lg' 
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  )}
                  onClick={() => handleNavigation(item.path)}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span className="font-medium">{item.label}</span>}
                </button>
              );
            })}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 flex-shrink-0">
          {isCollapsed ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 bg-gradient-to-r from-[#0071c5] to-[#004494] rounded-full flex items-center justify-center text-white font-semibold">
                {getUserInitials(user.name || 'User')}
              </div>
              <div className="flex space-x-1">
                <button 
                  onClick={() => handleNavigation('/profile')}
                  className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
                  title="Settings"
                >
                  <Settings className="h-4 w-4 text-slate-500" />
                </button>
                <button 
                  onClick={handleLogout}
                  className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4 text-slate-500" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
              <div className="w-10 h-10 bg-gradient-to-r from-[#0071c5] to-[#004494] rounded-full flex items-center justify-center text-white font-semibold">
                {getUserInitials(user.name || 'User')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
              </div>
              <div className="flex space-x-1">
                <button 
                  onClick={() => handleNavigation('/profile')}
                  className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
                  title="Settings"
                >
                  <Settings className="h-4 w-4 text-slate-500" />
                </button>
                <button 
                  onClick={handleLogout}
                  className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4 text-slate-500" />
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;