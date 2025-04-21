
import { logShowerOnChain, slashUser, rewardClean, exitRoom, joinRoom } from "./utils/ethereum";
import { logShower } from "./services/showerLogs";
import { toast } from "sonner";

export const handleLogShower = async (userId) => {
  try {
    if (!userId) {
      toast.error("Please sign in to log a shower");
      return false;
    }
    
    // First log to database
    const dbSuccess = await logShower(userId);
    if (!dbSuccess) {
      throw new Error("Failed to log shower to database");
    }
    
    // Then log to blockchain
    const blockchainSuccess = await logShowerOnChain();
    if (!blockchainSuccess) {
      // Continue anyway, but notify user
      toast.warning("Logged to database but blockchain update failed");
      return true;
    }
    
    toast.success("Shower verified on blockchain! 🚿✨");
    return true;
  } catch (err) {
    console.error(err);
    toast.error("Shower verification failed");
    return false;
  }
};

export const handleSlashUser = async () => {
  try {
    const success = await slashUser();
    if (!success) {
      throw new Error("Slash operation failed");
    }
    return true;
  } catch (err) {
    console.error(err);
    toast.error("Failed to slash user");
    return false;
  }
};

export const handleRewardClean = async () => {
  try {
    const success = await rewardClean();
    if (!success) {
      throw new Error("Reward operation failed");
    }
    return true;
  } catch (err) {
    console.error(err);
    toast.error("Failed to reward cleanliness");
    return false;
  }
};

export const handleExit = async () => {
  try {
    const success = await exitRoom();
    if (!success) {
      throw new Error("Exit operation failed");
    }
    return true;
  } catch (err) {
    console.error(err);
    toast.error("Failed to exit room");
    return false;
  }
};

export const handleJoinRoom = async () => {
  try {
    const success = await joinRoom();
    if (!success) {
      throw new Error("Join operation failed");
    }
    return true;
  } catch (err) {
    console.error(err);
    toast.error("Failed to join room");
    return false;
  }
};
