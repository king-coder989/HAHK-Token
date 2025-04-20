import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contractConfig";

export const logShower = async () => {
  if (!window.ethereum) return alert("Please install MetaMask");

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

  try {
    const tx = await contract.logShower();
    await tx.wait();
    alert("Shower event logged successfully!");
  } catch (error) {
    console.error(error);
    alert("Something went wrong while logging shower.");
  }
};
