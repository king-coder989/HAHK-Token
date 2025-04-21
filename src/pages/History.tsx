
import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Droplets, Award, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ShowerLog } from '@/types/database';
import { toast } from 'sonner';
import { formatTimeSince } from '@/utils/time';

interface ShowerLogWithStreak {
  id: string;
  timestamp: string;
  streak: number;
  points: number;
}

const History = () => {
  const { user } = useAuth();
  const [showerLogs, setShowerLogs] = useState<ShowerLogWithStreak[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchShowerHistory();
  }, [user]);

  const fetchShowerHistory = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('shower_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false });

      if (error) throw error;

      // Add streak and points calculation
      const logsWithStreak = (data || []).map((log, index, array) => {
        const streak = index + 1; // Simple streak calculation
        const points = 10 * streak; // Points increase with streak
        
        return {
          ...log,
          streak,
          points
        };
      });

      setShowerLogs(logsWithStreak);
    } catch (error: any) {
      console.error("Error fetching shower history:", error);
      toast.error("Failed to load your hygiene ledger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8 p-4">
        <h2 className="text-2xl font-bold text-transparent bg-premium-gradient bg-clip-text">
          Hygiene Ledger 📜
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-teal-glow"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {showerLogs.length === 0 ? (
              <Card className="p-8 text-center bg-black/40 border-purple-500/30">
                <Droplets className="w-12 h-12 text-teal-glow mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-purple-100 mb-2">No Shower Records</h3>
                <p className="text-purple-300">Log your first shower to start building your hygiene reputation.</p>
              </Card>
            ) : (
              showerLogs.map((log) => (
                <Card key={log.id} className="p-4 bg-space-overlay border-space-accent/20 backdrop-blur-xl">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-premium-gradient bg-opacity-10 rounded-full">
                      <Droplets className="w-6 h-6 text-teal-glow" />
                    </div>
                    <div className="flex-1">
                      <p className="text-space-accent font-semibold">Clean Verification ✓</p>
                      <div className="flex items-center gap-2 text-space-accent/60 text-sm">
                        <Calendar className="w-3 h-3" />
                        <p>{new Date(log.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-teal-glow font-mono">+{log.points} points</p>
                      <div className="flex items-center justify-end gap-1 text-space-accent/60 text-sm">
                        <Award className="w-3 h-3" />
                        <p>Streak: {log.streak} 🔥</p>
                      </div>
                    </div>
                  </div>
                  
                  {log.streak >= 7 && (
                    <div className="mt-3 p-3 rounded bg-premium-gradient bg-opacity-5 border border-violet-end/20">
                      <p className="text-sm text-teal-glow flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Scent Certificate NFT Unlocked! 🏆
                      </p>
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default History;
