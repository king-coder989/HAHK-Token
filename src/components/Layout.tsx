
import React from 'react';
import { ShowerHead, User, Trophy, History } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white">
      <header className="p-4 border-b border-purple-800/30">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <ShowerHead className="w-8 h-8 text-purple-400" />
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Proof of Hygiene
            </h1>
          </Link>
          
          <nav className="hidden md:flex items-center gap-4">
            <Link to="/games">
              <Button variant={isActive('/games') ? "secondary" : "ghost"}
                className="text-purple-300 hover:text-white hover:bg-purple-800/30">
                <Trophy className="w-4 h-4 mr-2" />
                Games
              </Button>
            </Link>
            <Link to="/history">
              <Button variant={isActive('/history') ? "secondary" : "ghost"}
                className="text-purple-300 hover:text-white hover:bg-purple-800/30">
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
            </Link>
            {user ? (
              <>
                <Link to="/profile">
                  <Button variant={isActive('/profile') ? "secondary" : "ghost"}
                    className="text-purple-300 hover:text-white hover:bg-purple-800/30">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={signOut}
                  className="text-purple-300 hover:text-white hover:bg-purple-800/30"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button 
                  variant="ghost"
                  className="text-purple-300 hover:text-white hover:bg-purple-800/30"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};
