
import React from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { User, Trophy, Droplets } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8 p-4">
        <Card className="p-6 bg-black/40 border-purple-500/30">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <User className="h-12 w-12" />
            </Avatar>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-purple-100">{user?.email}</h2>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-200">Level 1</span>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-200">0 Showers</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 bg-black/40 border-purple-500/30">
            <h3 className="text-xl font-semibold text-purple-100 mb-4">Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-purple-200">Current Streak</span>
                <span className="text-purple-100 font-mono">0 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-200">Longest Streak</span>
                <span className="text-purple-100 font-mono">0 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-200">Total ETH Earned</span>
                <span className="text-purple-100 font-mono">0 ETH</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-black/40 border-purple-500/30">
            <h3 className="text-xl font-semibold text-purple-100 mb-4">Recent Activity</h3>
            <div className="text-center py-8 text-purple-300">
              No recent activity
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
