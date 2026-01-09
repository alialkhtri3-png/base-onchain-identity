import { useState } from "react";
import { ethers } from "ethers";

const DID = "did:web:alialkhtri3-png.github.io";
const EXPECTED_ADDRESS =
  "0x20d0c7b904deeb5d5b145cfc0bc095ebf4139b27".toLowerCase();

export default function App() {
  const [account, setAccount] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [status, setStatus] = useState("");
  const [network, setNetwork] = useState<string>("");

  async function connectWallet() {
    if (!(window as any).ethereum) {
      alert("MetaMask not found");
      return;
    }

    const provider = new ethers.BrowserProvider(
      (window as any).ethereum
    );

    const accounts = await provider.send("eth_requestAccounts", []);
    setAccount(accounts[0]);

    const net = await provider.getNetwork();
    setNetwork(net.name);
  }

  async function signMessage() {
    if (!account) return;

    const provider = new ethers.BrowserProvider(
      (window as any).ethereum
    );
    const signer = await provider.getSigner();

    const message = `I control ${DID}`;
    const signature = await signer.signMessage(message);

    const recovered = ethers.verifyMessage(message, signature);

    if (recovered.toLowerCase() === EXPECTED_ADDRESS) {
      setVerified(true);
      setStatus("✅ Ownership Verified");
    } else {
      setVerified(false);
      setStatus("❌ Verification Failed");
    }
  }

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Base Onchain Identity</h1>

      <p><b>DID:</b> {DID}</p>
      <p><b>Expected Address:</b> {EXPECTED_ADDRESS}</p>

      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <>
          <p><b>Connected:</b> {account}</p>
          <p><b>Network:</b> {network}</p>
          <button onClick={signMessage}>Sign & Verify</button>
        </>
      )}

      {status && <h2>{status}</h2>}
      {verified && <p>🔐 Identity successfully linked</p>}
    </div>
  );
}

