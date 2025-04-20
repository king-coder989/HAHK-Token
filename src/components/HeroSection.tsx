import React, { useState, useRef } from 'react';
import { ShowerHead } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { logShower } from '@/services/showerLogs';
import { connectWallet, logShowerOnChain } from '@/utils/ethereum';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useLastShower } from '@/hooks/useLastShower';

export const HeroSection = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState<string | null>(null);
  const { timeSinceLastShower } = useLastShower();
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleConnectWallet = async () => {
    setLoading(true);
    try {
      const address = await connectWallet();
      if (address) {
        setWallet(address);
        toast.success('Wallet connected!');
      } else {
        toast.error('Failed to connect wallet');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error connecting wallet');
    } finally {
      setLoading(false);
    }
  };

  const playShowerSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.error);
    }
  };

  const handleLogShower = async () => {
    if (!user) {
      toast.error('Please sign in to log a shower');
      return;
    }

    if (!wallet) {
      toast.error('Please connect your wallet first');
      return;
    }

    setLoading(true);
    try {
      console.log("Logging shower...");
      
      playShowerSound();
      
      const success = await logShower(user.id);
      if (!success) throw new Error('Failed to log shower to database');
      
      const onChainSuccess = await logShowerOnChain(wallet);
      if (!onChainSuccess) throw new Error('Failed to log shower to blockchain');
      
      toast.success('Shower logged successfully! 🚿');
    } catch (error: any) {
      toast.error(error.message || 'Error logging shower');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-lg p-8 mb-12 shower-card">
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <ShowerHead className="w-12 h-12 text-purple-400" />
          <h2 className="text-4xl font-bold text-glow">Prove Your Cleanliness 🛁</h2>
        </div>
        <p className="text-xl mb-2 text-purple-200">
          Stake ETH, log your showers, and claim your reward for being the cleanest roommate! 🚿
        </p>
        <p className="text-lg mb-6 text-purple-300">
          Last shower: {timeSinceLastShower}
        </p>
        
        {!user ? (
          <Link to="/auth">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50">
              Sign In to Start 🚿
            </Button>
          </Link>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleLogShower}
              disabled={loading || !wallet}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
            >
              {loading ? 'Processing...' : 'Log Shower 🚿'}
            </Button>
            
            {!wallet ? (
              <Button 
                onClick={handleConnectWallet}
                disabled={loading}
                variant="outline"
                className="border-purple-500 text-purple-400 hover:bg-purple-500/20 px-8 py-6 text-lg rounded-full"
              >
                Connect Wallet
              </Button>
            ) : (
              <Button 
                variant="outline"
                className="border-purple-500 text-purple-400 hover:bg-purple-500/20 px-8 py-6 text-lg rounded-full"
              >
                Wallet: {wallet.substring(0, 6)}...{wallet.substring(wallet.length - 4)}
              </Button>
            )}
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm -z-10" />
      <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3" />
    </div>
  );
};
