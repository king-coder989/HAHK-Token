
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ShowerLog } from "@/types/database";

export const logShower = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('shower_logs')
      .insert([{ user_id: userId }]);
    
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error("Error logging shower:", error);
    toast.error(error.message || "Failed to log shower");
    return false;
  }
};

export const getRecentShowers = async () => {
  try {
    const { data, error } = await supabase
      .from('shower_logs')
      .select(`
        id,
        timestamp,
        profiles (username, avatar_url, hygiene_score)
      `)
      .order('timestamp', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    return data as (ShowerLog & { profiles: { username: string | null, avatar_url: string | null, hygiene_score: number } })[];
  } catch (error: any) {
    console.error("Error fetching recent showers:", error);
    toast.error(error.message || "Failed to fetch shower logs");
    return [];
  }
};
