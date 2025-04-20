import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contractConfig";

const getContract = async () => {
  if (!window.ethereum) throw new Error("MetaMask not found");

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

export const slash = async () => {
  try {
    const contract = await getContract();
    const tx = await contract.slash();
    await tx.wait();
    alert("User has been slashed!");
  } catch (err) {
    console.error(err);
    alert("Slash failed.");
  }
};

export const rewardClean = async () => {
  try {
    const contract = await getContract();
    const tx = await contract.rewardClean();
    await tx.wait();
    alert("Cleanliness rewarded!");
  } catch (err) {
    console.error(err);
    alert("Reward failed.");
  }
};

export const exit = async () => {
  try {
    const contract = await getContract();
    const tx = await contract.exit();
    await tx.wait();
    alert("Exited room successfully!");
  } catch (err) {
    console.error(err);
    alert("Exit failed.");
  }
};
