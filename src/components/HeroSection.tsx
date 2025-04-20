
import React, { useState, useRef } from 'react';
import { ShowerHead, Trophy } from 'lucide-react';
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
    <div className="relative overflow-hidden rounded-lg p-8 mb-12 backdrop-blur-xl bg-space-overlay border border-space-accent/20">
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <ShowerHead className="w-12 h-12 text-teal-glow" />
          <h2 className="text-4xl font-bold bg-premium-gradient bg-clip-text text-transparent">
            Your Hygiene is Your Reputation 💎
          </h2>
        </div>
        <p className="text-xl mb-2 text-space-accent/80">
          Hygiene Credit Score: <span className="text-teal-glow font-mono">742/800</span>
        </p>
        <p className="text-lg mb-6 text-space-accent/60 font-mono">
          Last verified: {timeSinceLastShower}
        </p>
        
        {!user ? (
          <Link to="/auth">
            <Button className="bg-teal-glow text-space hover:bg-teal-glow/90 px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-teal-glow/20">
              Verify Your Elite Status 💫
            </Button>
          </Link>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleLogShower}
              disabled={loading || !wallet}
              className="bg-premium-gradient hover:opacity-90 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-violet-end/20"
            >
              {loading ? 'Minting...' : 'Mint Your Clean NFT 🛁✨'}
            </Button>
            
            {!wallet ? (
              <Button 
                onClick={handleConnectWallet}
                disabled={loading}
                variant="outline"
                className="border-space-accent/20 text-space-accent hover:bg-space-overlay px-8 py-6 text-lg rounded-full"
              >
                <Trophy className="w-5 h-5 mr-2" /> Verify Your Elite Status
              </Button>
            ) : (
              <Button 
                variant="outline"
                className="border-space-accent/20 text-space-accent hover:bg-space-overlay px-8 py-6 text-lg rounded-full"
              >
                Connected: {wallet.substring(0, 6)}...{wallet.substring(wallet.length - 4)}
              </Button>
            )}
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-premium-gradient opacity-5 -z-10" />
      <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3" />
    </div>
  );
};
