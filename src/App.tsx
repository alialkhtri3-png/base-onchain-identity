import { useState } from "react";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const DID = "did:pkh:eip155:8453:0x20d0c7b904deeb5d5b145cfc0bc095ebf4139b27";

function App() {
  const [account, setAccount] = useState<string>("");
  const [signature, setSignature] = useState<string>("");
  const [verified, setVerified] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const message = account
    ? `I am Ali Alkhtri.
I am verifying ownership of my onchain identity.

DID: ${DID}
Wallet: ${account}`
    : "";

  // 🔌 Connect Wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask غير مثبت");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      setSignature("");
      setVerified(null);
    } catch (err) {
      console.error(err);
    }
  };

  // ✍️ Sign Identity
  const signMessage = async () => {
    try {
      if (!window.ethereum || !account) return;

      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const sig = await signer.signMessage(message);

      setSignature(sig);
      setVerified(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify Signature
  const verifySignature = () => {
    try {
      if (!signature || !account) return;

      const recovered = ethers.verifyMessage(message, signature);
      const isValid =
        recovered.toLowerCase() === account.toLowerCase();

      setVerified(isValid);
    } catch (err) {
      console.error(err);
      setVerified(false);
    }
  };

  return (
    <div
      style={{
        padding: 40,
        fontFamily: "system-ui, sans-serif",
        maxWidth: 720,
        margin: "0 auto",
      }}
    >
      <h1>🔐 Base Onchain Identity</h1>

      <p>
        <b>DID:</b><br />
        <code>{DID}</code>
      </p>

      {!account && (
        <button onClick={connectWallet}>
          Connect Wallet
        </button>
      )}

      {account && (
        <>
          <p>
            <b>Connected Wallet:</b><br />
            <code>{account}</code>
          </p>

          <button onClick={signMessage} disabled={loading}>
            {loading ? "Signing..." : "Sign Identity"}
          </button>

          {signature && (
            <>
              <p>
                <b>Signature:</b>
              </p>
              <textarea
                readOnly
                value={signature}
                style={{ width: "100%", height: 120 }}
              />

              <button onClick={verifySignature}>
                Verify Signature
              </button>
            </>
          )}

          {verified !== null && (
            <h3>
              {verified
                ? "✅ Identity Verified (DID Owner)"
                : "❌ Verification Failed"}
            </h3>
          )}
        </>
      )}
    </div>
  );
}

export default App;
