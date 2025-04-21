
import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Game, GameParticipant } from '@/types/database';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Skull, Trophy, Crown, Calendar, Users, AlertTriangle } from 'lucide-react';

type GameWithParticipants = Game & {
  participants_count: number;
  user_position?: number;
  user_status?: string;
  days_remaining: number;
};

const Games = () => {
  const { user } = useAuth();
  const [games, setGames] = useState<GameWithParticipants[]>([]);
  const [loading, setLoading] = useState(true);
  const [newGameName, setNewGameName] = useState('');
  const [newGameDescription, setNewGameDescription] = useState('');
  const [newGamePrize, setNewGamePrize] = useState('');
  const [newGameEndDate, setNewGameEndDate] = useState('');
  const [newGameType, setNewGameType] = useState<'stink_war' | 'nft_badges'>('stink_war');
  const [isCreatingGame, setIsCreatingGame] = useState(false);

  useEffect(() => {
    fetchGames();
  }, [user]);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const { data: gamesData, error } = await supabase
        .from('games')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;

      const gamesWithDetails = await Promise.all((gamesData || []).map(async (game) => {
        // Get participant count
        const { count: participantsCount } = await supabase
          .from('game_participants')
          .select('*', { count: 'exact', head: true })
          .eq('game_id', game.id);

        // Get user position if logged in
        let userPosition;
        let userStatus;
        
        if (user) {
          const { data: participants } = await supabase
            .from('game_participants')
            .select('*')
            .eq('game_id', game.id)
            .order('score', { ascending: false });
          
          if (participants) {
            const userParticipant = participants.find(p => p.user_id === user.id);
            if (userParticipant) {
              userStatus = userParticipant.status;
              userPosition = participants.findIndex(p => p.user_id === user.id) + 1;
            }
          }
        }

        // Calculate days remaining
        const endDate = new Date(game.end_date);
        const now = new Date();
        const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        return {
          ...game,
          participants_count: participantsCount || 0,
          user_position: userPosition,
          user_status: userStatus,
          days_remaining: daysRemaining
        };
      }));

      setGames(gamesWithDetails);
    } catch (error: any) {
      console.error("Error fetching games:", error);
      toast.error("Failed to load games");
    } finally {
      setLoading(false);
    }
  };

  const joinGame = async (gameId: string) => {
    if (!user) {
      toast.error("Please sign in to join a game");
      return;
    }

    try {
      const { error } = await supabase
        .from('game_participants')
        .insert({
          game_id: gameId,
          user_id: user.id,
          status: 'active',
          score: 0
        });

      if (error) {
        if (error.code === '23505') { // Unique violation
          toast.error("You've already joined this game");
        } else {
          throw error;
        }
      } else {
        toast.success("Joined game successfully!");
        fetchGames();
      }
    } catch (error: any) {
      console.error("Error joining game:", error);
      toast.error(error.message || "Failed to join game");
    }
  };

  const createGame = async () => {
    if (!user) {
      toast.error("Please sign in to create a game");
      return;
    }

    if (!newGameName || !newGameDescription || !newGameEndDate || !newGamePrize) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setIsCreatingGame(true);
      
      const endDate = new Date(newGameEndDate);
      if (endDate <= new Date()) {
        toast.error("End date must be in the future");
        return;
      }

      const { error } = await supabase
        .from('games')
        .insert({
          name: newGameName,
          description: newGameDescription,
          prize_pool: parseFloat(newGamePrize),
          end_date: endDate.toISOString(),
          game_type: newGameType,
          created_by: user.id
        });

      if (error) throw error;

      toast.success("Game created successfully!");
      setNewGameName('');
      setNewGameDescription('');
      setNewGamePrize('');
      setNewGameEndDate('');
      fetchGames();
    } catch (error: any) {
      console.error("Error creating game:", error);
      toast.error(error.message || "Failed to create game");
    } finally {
      setIsCreatingGame(false);
    }
  };

  const getGameIcon = (gameType: string) => {
    switch(gameType) {
      case 'stink_war':
        return <Skull className="w-5 h-5 text-teal-glow" />;
      case 'nft_badges':
        return <Trophy className="w-5 h-5 text-teal-glow" />;
      default:
        return <Crown className="w-5 h-5 text-teal-glow" />;
    }
  };

  const getGameTitle = (gameType: string) => {
    switch(gameType) {
      case 'stink_war':
        return "The Purification Protocol";
      case 'nft_badges':
        return "NFT Badges of Glory/Shame";
      default:
        return "Unknown Game";
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8 p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-transparent bg-premium-gradient bg-clip-text">
            Elite Clean Games 👑
          </h2>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-premium-gradient hover:opacity-90">
                Create New Game
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-space-overlay border-space-accent/20">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-transparent bg-premium-gradient bg-clip-text">
                  Create a New Hygiene Game
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-space-accent mb-1 block">Game Name</label>
                  <Input
                    value={newGameName}
                    onChange={(e) => setNewGameName(e.target.value)}
                    className="bg-black/20 border-space-accent/20 text-space-accent"
                    placeholder="Enter game name"
                  />
                </div>
                
                <div>
                  <label className="text-space-accent mb-1 block">Description</label>
                  <Input
                    value={newGameDescription}
                    onChange={(e) => setNewGameDescription(e.target.value)}
                    className="bg-black/20 border-space-accent/20 text-space-accent"
                    placeholder="Enter game description"
                  />
                </div>
                
                <div>
                  <label className="text-space-accent mb-1 block">Prize Pool (ETH)</label>
                  <Input
                    value={newGamePrize}
                    onChange={(e) => setNewGamePrize(e.target.value)}
                    type="number"
                    step="0.01"
                    min="0"
                    className="bg-black/20 border-space-accent/20 text-space-accent"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="text-space-accent mb-1 block">End Date</label>
                  <Input
                    value={newGameEndDate}
                    onChange={(e) => setNewGameEndDate(e.target.value)}
                    type="date"
                    className="bg-black/20 border-space-accent/20 text-space-accent"
                  />
                </div>
                
                <div>
                  <label className="text-space-accent mb-1 block">Game Type</label>
                  <div className="flex gap-2">
                    <Button 
                      type="button"
                      onClick={() => setNewGameType('stink_war')}
                      className={`flex-1 ${newGameType === 'stink_war' 
                        ? 'bg-premium-gradient' 
                        : 'bg-space-overlay border border-space-accent/20'}`}
                    >
                      <Skull className="mr-2" /> Stink War
                    </Button>
                    <Button 
                      type="button"
                      onClick={() => setNewGameType('nft_badges')}
                      className={`flex-1 ${newGameType === 'nft_badges' 
                        ? 'bg-premium-gradient' 
                        : 'bg-space-overlay border border-space-accent/20'}`}
                    >
                      <Trophy className="mr-2" /> NFT Badges
                    </Button>
                  </div>
                </div>
                
                <Button 
                  onClick={createGame}
                  disabled={isCreatingGame}
                  className="w-full bg-premium-gradient hover:opacity-90 mt-4"
                >
                  {isCreatingGame ? 'Creating...' : 'Create Game'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-teal-glow"></div>
          </div>
        ) : (
          <div className="grid gap-6">
            {games.length === 0 ? (
              <Card className="p-8 bg-black/40 border-purple-500/30 text-center">
                <AlertTriangle className="w-12 h-12 text-teal-glow mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-space-accent mb-2">No Active Games</h3>
                <p className="text-space-accent/60">Be the first to create a hygiene game challenge!</p>
              </Card>
            ) : (
              games.map((game) => (
                <Card key={game.id} className="p-6 bg-black/40 border-purple-500/30">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      {getGameIcon(game.game_type)}
                      <div>
                        <h3 className="text-xl font-semibold text-teal-glow">{game.name}</h3>
                        <p className="text-space-accent/80 text-sm">{getGameTitle(game.game_type)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-transparent bg-premium-gradient bg-clip-text">{game.prize_pool} ETH</p>
                      <p className="text-space-accent/60 text-sm">Liquidity Pool</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <p className="text-space-accent/80">{game.description}</p>
                    
                    <div className="flex flex-wrap gap-4 mt-2">
                      <div className="flex items-center gap-2 text-space-accent/60">
                        <Calendar className="w-4 h-4" />
                        <span>{game.days_remaining > 0 ? `Ends in ${game.days_remaining} days` : 'Ended'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-space-accent/60">
                        <Users className="w-4 h-4" />
                        <span>{game.participants_count} participants</span>
                      </div>
                    </div>
                    
                    <div className="bg-space-overlay/30 rounded-lg p-4 mt-3">
                      {game.user_position ? (
                        <div className="flex justify-between text-sm">
                          <span className="text-space-accent">Your position: #{game.user_position}</span>
                          <span className="text-teal-glow font-mono">Status: {game.user_status}</span>
                        </div>
                      ) : (
                        <div className="flex justify-end">
                          <Button 
                            onClick={() => joinGame(game.id)}
                            className="bg-teal-glow text-space hover:bg-teal-glow/90"
                          >
                            Join Game
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Games;
