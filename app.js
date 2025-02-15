// Config
const CONTRACT_ADDRESS = "0xF660448b409A440c2Ca97Eab20A0B0b0fb3c90bC";
const WALLETCONNECT_ID = "ec3a4a130bfbfcd23c9e540a8e99e718";

// Debugging
console.log("Initializing...");
const startTime = Date.now();

// Init Web3Modal
const web3Modal = new Web3Modal({
  projectId: WALLETCONNECT_ID,
  chains: [{
    chainId: 8453,
    name: "Base",
    currency: "ETH",
    rpcUrl: "https://mainnet.base.org",
    explorerUrl: "https://basescan.org"
  }],
  mobileWallets: [
    {
      id: "trust",
      name: "Trust Wallet",
      links: {
        native: "trust://",
        universal: "https://link.trustwallet.com"
      }
    }
  ],
  themeVariables: {
    '--wcm-accent-color': '#FF00FF',
    '--wcm-z-index': '9999'
  }
});

// Wallet Connection
async function connectWallet() {
  console.log("Connection started");
  try {
    const provider = await web3Modal.openModal();
    console.log("Provider:", provider);
    
    provider.on("accountsChanged", (accounts) => {
      console.log("Accounts changed:", accounts);
    });
    
    const ethersProvider = new ethers.providers.Web3Provider(provider);
    const signer = ethersProvider.getSigner();
    const address = await signer.getAddress();
    console.log("Connected address:", address);
    
    alert(`Successfully connected: ${address}`);
    
  } catch (error) {
    console.error("Connection error:", error);
    alert(`Error: ${error.message}`);
  }
  console.log("Connection flow completed");
}

// Bind click event
document.getElementById('connectBtn').addEventListener('click', () => {
  console.log("Button clicked");
  connectWallet();
});

// Performance check
console.log(`Initialization completed in ${Date.now() - startTime}ms`);
