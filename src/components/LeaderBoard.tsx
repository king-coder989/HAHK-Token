
import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type ProfileWithShowers = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  hygiene_score: number;
  shower_count: number;
  last_shower: string | null;
};

export const LeaderBoard = () => {
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<ProfileWithShowers[]>([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            id, 
            username, 
            avatar_url, 
            hygiene_score
          `)
          .order('hygiene_score', { ascending: false })
          .limit(5);

        if (error) throw error;

        // For each profile, get their shower count and last shower
        const profilesWithShowers = await Promise.all(
          data.map(async (profile) => {
            // Get shower count
            const { count, error: countError } = await supabase
              .from('shower_logs')
              .select('id', { count: 'exact', head: true })
              .eq('user_id', profile.id);
            
            if (countError) throw countError;

            // Get last shower time
            const { data: showers, error: showersError } = await supabase
              .from('shower_logs')
              .select('timestamp')
              .eq('user_id', profile.id)
              .order('timestamp', { ascending: false })
              .limit(1);
            
            if (showersError) throw showersError;

            // Format relative time
            let lastShower = null;
            if (showers && showers.length > 0) {
              const date = new Date(showers[0].timestamp);
              
              // Basic relative time formatting
              const now = new Date();
              const diffMs = now.getTime() - date.getTime();
              const diffMins = Math.round(diffMs / 60000);
              const diffHours = Math.round(diffMins / 60);
              const diffDays = Math.round(diffHours / 24);
              
              if (diffMins < 60) {
                lastShower = `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
              } else if (diffHours < 24) {
                lastShower = `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
              } else {
                lastShower = `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
              }
            }

            return {
              ...profile,
              shower_count: count || 0,
              last_shower: lastShower,
            };
          })
        );

        setProfiles(profilesWithShowers);
      } catch (error: any) {
        console.error("Error fetching leaderboard:", error);
        toast.error(error.message || "Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  return (
    <Card className="shower-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-6 h-6 text-purple-400" />
        <h3 className="text-2xl font-bold text-purple-100">Cleanliness Leaderboard</h3>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500 border-opacity-50"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {profiles.length === 0 ? (
            <p className="text-center text-purple-300 py-4">No shower records yet. Be the first!</p>
          ) : (
            profiles.map((profile, index) => (
              <div 
                key={profile.id}
                className={`p-4 rounded-lg transition-all duration-300 hover:scale-[1.02] ${
                  index === 0 ? 'bg-purple-600/30 border border-purple-500/50' :
                  index === 1 ? 'bg-purple-600/20 border border-purple-500/30' :
                  'bg-purple-600/10 border border-purple-500/20'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-mono text-purple-200">{profile.username || `User ${profile.id.substring(0, 6)}`}</p>
                    <p className="text-sm text-purple-300">
                      {profile.last_shower ? `Last shower: ${profile.last_shower}` : 'No showers yet'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-100">{profile.shower_count}</p>
                    <p className="text-sm text-purple-300">showers</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </Card>
  );
};
