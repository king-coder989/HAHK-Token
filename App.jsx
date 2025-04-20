import React from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contractConfig";
import { logShower, slash, rewardClean, exit } from "./actions";

const App = () => {
  const joinRoom = async () => {
    if (!window.ethereum) return alert("Install MetaMask first!");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.join({ value: ethers.parseEther("0.01") });
      await tx.wait();
      alert("Joined successfully!");
    } catch (error) {
      console.error(error);
      alert("Join failed!");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🚿 HAHK Token Room</h1>
      <button onClick={joinRoom}>Join Room</button>
      <button onClick={logShower}>Log Shower</button>
      <button onClick={slash}>Slash</button>
      <button onClick={rewardClean}>Reward Clean</button>
      <button onClick={exit}>Exit Room</button>
    </div>
  );
};

export default App;
