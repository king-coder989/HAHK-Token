
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../contractConfig";
import { toast } from "sonner";

export const connectWallet = async (): Promise<string | null> => {
  try {
    if (!window.ethereum) {
      toast.error("MetaMask is not installed. Please install MetaMask to continue.");
      return null;
    }
    
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    
    if (accounts.length > 0) {
      // Check if we're on the correct network
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      console.log("Connected to network:", network.name);
    }
    
    return accounts[0];
  } catch (error: any) {
    console.error("Error connecting to wallet:", error);
    toast.error(error.message || "Error connecting to wallet");
    return null;
  }
};

export const isWalletConnected = async (): Promise<boolean> => {
  try {
    if (!window.ethereum) return false;
    
    const accounts = await window.ethereum.request({ 
      method: 'eth_accounts' 
    });
    
    return accounts.length > 0;
  } catch (error) {
    console.error("Error checking wallet connection:", error);
    return false;
  }
};

export const logShowerOnChain = async (address: string): Promise<boolean> => {
  if (!window.ethereum) {
    toast.error("MetaMask is not installed");
    return false;
  }
  
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    
    const tx = await contract.logShower();
    await tx.wait();
    
    console.log("Shower logged on blockchain successfully!");
    return true;
  } catch (error: any) {
    console.error("Error logging shower on chain:", error);
    toast.error(error.message || "Failed to log shower on blockchain");
    return false;
  }
};

export const joinRoom = async (): Promise<boolean> => {
  if (!window.ethereum) {
    toast.error("MetaMask is not installed");
    return false;
  }
  
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    
    const tx = await contract.join({ value: ethers.parseEther("0.01") });
    await tx.wait();
    
    toast.success("Joined room successfully!");
    return true;
  } catch (error: any) {
    console.error("Error joining room:", error);
    toast.error(error.message || "Failed to join room");
    return false;
  }
};

export const slashUser = async (): Promise<boolean> => {
  if (!window.ethereum) return false;
  
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    
    const tx = await contract.slashLazy();
    await tx.wait();
    
    toast.success("User has been slashed for poor hygiene!");
    return true;
  } catch (error: any) {
    console.error("Error slashing user:", error);
    toast.error(error.message || "Failed to slash user");
    return false;
  }
};

export const rewardClean = async (): Promise<boolean> => {
  if (!window.ethereum) return false;
  
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    
    const tx = await contract.rewardClean();
    await tx.wait();
    
    toast.success("Cleanliness rewarded!");
    return true;
  } catch (error: any) {
    console.error("Error rewarding clean:", error);
    toast.error(error.message || "Failed to reward cleanliness");
    return false;
  }
};

export const exitRoom = async (): Promise<boolean> => {
  if (!window.ethereum) return false;
  
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    
    const tx = await contract.exit();
    await tx.wait();
    
    toast.success("Exited room successfully!");
    return true;
  } catch (error: any) {
    console.error("Error exiting room:", error);
    toast.error(error.message || "Failed to exit room");
    return false;
  }
};
