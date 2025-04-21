
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
  verified: boolean;
}

export interface Game {
  id: string;
  name: string;
  description: string | null;
  prize_pool: number;
  start_date: string;
  end_date: string;
  game_type: 'stink_war' | 'nft_badges';
  created_at: string;
  created_by: string | null;
}

export interface GameParticipant {
  id: string;
  game_id: string;
  user_id: string;
  join_date: string;
  status: 'active' | 'eliminated' | 'winner';
  score: number;
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      shower_logs: {
        Row: ShowerLog;
        Insert: Omit<ShowerLog, 'id' | 'timestamp'> & { timestamp?: string };
        Update: Partial<Omit<ShowerLog, 'id'>>;
      };
      games: {
        Row: Game;
        Insert: Omit<Game, 'id' | 'created_at'>;
        Update: Partial<Omit<Game, 'id' | 'created_at'>>;
      };
      game_participants: {
        Row: GameParticipant;
        Insert: Omit<GameParticipant, 'id' | 'join_date'>;
        Update: Partial<Omit<GameParticipant, 'id' | 'game_id' | 'user_id'>>;
      };
    };
    Views: {};
    Functions: {};
  };
};
