import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contractConfig";

const joinRoom = async () => {
  if (!window.ethereum) return alert("Install MetaMask first!");

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

  const tx = await contract.join({ value: ethers.parseEther("0.01") });
  await tx.wait();
  alert("Joined successfully!");
};

<button onClick={joinRoom}>Join Room</button>;
