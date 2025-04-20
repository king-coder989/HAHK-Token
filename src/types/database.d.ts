
export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  hygiene_score: number;
  created_at: string;
}

export interface ShowerLog {
  id: string;
  user_id: string;
  timestamp: string;
  hygiene_points: number;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at'>;
        Update: Partial<Profile>;
      };
      shower_logs: {
        Row: ShowerLog;
        Insert: Omit<ShowerLog, 'id' | 'created_at'>;
        Update: Partial<ShowerLog>;
      };
    };
  };
}
