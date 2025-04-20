
import React from 'react';
import { Users } from 'lucide-react';
import { Card } from '@/components/ui/card';

type Participant = {
  address: string;
  showers: number;
  lastShower: string;
};

const mockParticipants: Participant[] = [
  { address: "0x1234...5678", showers: 5, lastShower: "2 hours ago" },
  { address: "0x8765...4321", showers: 3, lastShower: "1 day ago" },
  { address: "0x9876...1234", showers: 1, lastShower: "3 days ago" },
];

export const LeaderBoard = () => {
  return (
    <Card className="shower-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-6 h-6 text-purple-400" />
        <h3 className="text-2xl font-bold text-purple-100">Cleanliness Leaderboard</h3>
      </div>
      <div className="space-y-4">
        {mockParticipants.map((participant, index) => (
          <div 
            key={participant.address}
            className={`p-4 rounded-lg transition-all duration-300 hover:scale-[1.02] ${
              index === 0 ? 'bg-purple-600/30 border border-purple-500/50' :
              index === 1 ? 'bg-purple-600/20 border border-purple-500/30' :
              'bg-purple-600/10 border border-purple-500/20'
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-mono text-purple-200">{participant.address}</p>
                <p className="text-sm text-purple-300">Last shower: {participant.lastShower}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-100">{participant.showers}</p>
                <p className="text-sm text-purple-300">showers</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
