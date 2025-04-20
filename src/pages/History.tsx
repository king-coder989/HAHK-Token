
import React from 'react';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Droplets } from 'lucide-react';
import { formatTimeSince } from '@/utils/time';

const History = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8 p-4">
        <h2 className="text-2xl font-bold text-purple-100">Shower History 🚿</h2>

        <div className="space-y-4">
          <Card className="p-4 bg-black/40 border-purple-500/30">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-600/20 rounded-full">
                <Droplets className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-purple-100 font-semibold">Shower Logged 🛁</p>
                <p className="text-purple-300 text-sm">Today at 8:30 AM</p>
              </div>
              <div className="text-right">
                <p className="text-purple-100">+10 points</p>
                <p className="text-purple-300 text-sm">Streak: 1 🔥</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default History;
