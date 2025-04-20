
import React from 'react';
import { ShowerHead } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, signOut } = useAuth();

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
          
          <div>
            {user ? (
              <Button 
                variant="ghost" 
                onClick={signOut}
                className="text-purple-300 hover:text-white hover:bg-purple-800/30"
              >
                Sign Out
              </Button>
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
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};
