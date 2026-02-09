import React, { useState } from 'react';
import { 
  GraduationCap, 
  Bell, 
  User, 
  Menu, 
  X,
  Calendar,
  BookOpen,
  BarChart3,
  Files,
  Brain
} from 'lucide-react';
import { Button } from '../ui/Button';

interface NavbarProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  onAuthModalOpen: (type: 'login' | 'signup') => void;
  user?: any;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSection,
  onSectionChange,
  onAuthModalOpen,
  user
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCount] = useState(3);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'ai-scheduler', label: 'AI Scheduler', icon: Brain },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'resources', label: 'Resources', icon: Files },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <header className="bg-gray-800/95 backdrop-blur-xl shadow-lg sticky top-0 z-40 border-b border-gray-700/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-600 p-2 rounded-xl shadow-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Smart<span className="text-emerald-500">Ed</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
                      : 'text-slate-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 rounded-xl hover:bg-gray-700 transition-colors">
              <Bell className="w-5 h-5 text-slate-300" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* User Profile or Auth */}
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAuthModalOpen('login')}
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  onClick={() => onAuthModalOpen('signup')}
                >
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-700 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-slate-300" />
              ) : (
                <Menu className="w-5 h-5 text-slate-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-700 animate-in slide-in-from-top duration-200">
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentSection === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSectionChange(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
            
            {!user && (
              <div className="flex flex-col space-y-2 mt-4 px-4">
                <Button
                  variant="ghost"
                  onClick={() => {
                    onAuthModalOpen('login');
                    setMobileMenuOpen(false);
                  }}
                  className="justify-center"
                >
                  Login
                </Button>
                <Button
                  onClick={() => {
                    onAuthModalOpen('signup');
                    setMobileMenuOpen(false);
                  }}
                  className="justify-center"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;