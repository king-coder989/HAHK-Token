
import React from 'react';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Games = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8 p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-purple-100">Active Games</h2>
          <Button className="bg-purple-600 hover:bg-purple-700">
            Create New Game
          </Button>
        </div>

        <div className="grid gap-6">
          <Card className="p-6 bg-black/40 border-purple-500/30">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold text-purple-100">Weekly Challenge</h3>
                <p className="text-purple-300 mt-1">Ends in 5 days</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-purple-100">2.5 ETH</p>
                <p className="text-purple-300">Total Pool</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="bg-purple-900/30 rounded-lg p-4">
                <p className="text-purple-200">5 participants</p>
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-purple-300">Your position: #2</span>
                  <span className="text-purple-300">7 showers logged</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Games;
