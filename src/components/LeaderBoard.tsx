
import React, { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Database, Profile } from '@/types/database';

type ProfileWithShowers = Profile & {
  shower_count: number;
  last_shower: string | null;
  tier: 'bronze' | 'silver' | 'gold';
};

const getTierBadge = (count: number) => {
  if (count >= 10) return '🥇';
  if (count >= 5) return '🥈';
  return '🥉';
};

export const LeaderBoard = () => {
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<ProfileWithShowers[]>([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('hygiene_score', { ascending: false })
          .limit(5);

        if (profilesError) throw profilesError;

        const profilesWithShowers = await Promise.all(
          (profilesData || []).map(async (profile) => {
            const { count } = await supabase
              .from('shower_logs')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', profile.id);

            const { data: lastShower } = await supabase
              .from('shower_logs')
              .select('timestamp')
              .eq('user_id', profile.id)
              .order('timestamp', { ascending: false })
              .limit(1);

            const showerCount = count || 0;
            
            return {
              ...profile,
              shower_count: showerCount,
              last_shower: lastShower?.[0]?.timestamp || null,
              tier: showerCount >= 10 ? 'gold' : showerCount >= 5 ? 'silver' : 'bronze'
            };
          })
        );

        setProfiles(profilesWithShowers);
      } catch (error: any) {
        console.error("Error fetching leaderboard:", error);
        toast.error("Failed to load the Clean Elite");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  return (
    <Card className="backdrop-blur-xl bg-space-overlay border-space-accent/20 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-6 h-6 text-teal-glow" />
        <h3 className="text-2xl font-bold bg-premium-gradient bg-clip-text text-transparent">
          The Clean Elite
        </h3>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-teal-glow"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {profiles.length === 0 ? (
            <p className="text-center text-space-accent/60 py-4">No verified cleaners yet. Be the first!</p>
          ) : (
            profiles.map((profile, index) => (
              <div 
                key={profile.id}
                className={`p-4 rounded-lg transition-all duration-300 hover:scale-[1.02] backdrop-blur-md ${
                  index === 0 ? 'bg-premium-gradient bg-opacity-20 border border-violet-end/50' :
                  index === 1 ? 'bg-space-overlay border border-space-accent/30' :
                  'bg-space-overlay/60 border border-space-accent/20'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-mono text-teal-glow flex items-center gap-2">
                      {getTierBadge(profile.shower_count)}
                      {profile.username || `Anon ${profile.id.substring(0, 6)}`}
                    </p>
                    <p className="text-sm text-space-accent/60">
                      {profile.last_shower ? 
                        `Last verified: ${new Date(profile.last_shower).toLocaleDateString()}` : 
                        'No verifications yet'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-transparent bg-premium-gradient bg-clip-text">
                      {profile.shower_count}
                    </p>
                    <p className="text-sm text-space-accent/60">verifications</p>
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
