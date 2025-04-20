
import React from 'react';
import { Bath } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const HeroSection = () => {
  const handleLogShower = () => {
    // TODO: Implement blockchain interaction
    console.log("Logging shower...");
  };

  return (
    <div className="relative overflow-hidden rounded-lg p-8 mb-12 shower-card">
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <Bath className="w-12 h-12 text-purple-400" />
          <h2 className="text-4xl font-bold text-glow">Prove Your Cleanliness</h2>
        </div>
        <p className="text-xl mb-6 text-purple-200">
          Stake ETH, log your showers, and claim your reward for being the cleanest roommate!
        </p>
        <div className="flex gap-4">
          <Button 
            onClick={handleLogShower}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
          >
            Log Shower
          </Button>
          <Button 
            variant="outline"
            className="border-purple-500 text-purple-400 hover:bg-purple-500/20 px-8 py-6 text-lg rounded-full"
          >
            Stake ETH
          </Button>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm -z-10" />
    </div>
  );
};
