
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { formatTimeSince } from '@/utils/time';

export function useLastShower() {
  const { user } = useAuth();
  const [lastShowerTime, setLastShowerTime] = useState<Date | null>(null);
  const [timeSinceLastShower, setTimeSinceLastShower] = useState<string>('Never');

  useEffect(() => {
    if (!user) return;

    const fetchLastShower = async () => {
      const { data, error } = await supabase
        .from('shower_logs')
        .select('timestamp')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(1);

      if (!error && data && data[0]) {
        setLastShowerTime(new Date(data[0].timestamp));
      }
    };

    fetchLastShower();
  }, [user]);

  useEffect(() => {
    if (!lastShowerTime) return;

    const updateTimer = () => {
      const time = formatTimeSince(lastShowerTime);
      setTimeSinceLastShower(time);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [lastShowerTime]);

  return { timeSinceLastShower, lastShowerTime };
}
