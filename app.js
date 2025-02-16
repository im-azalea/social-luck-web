// Konfigurasi
const CONTRACT_ADDRESS = "0xF660448b409A440c2Ca97Eab20A0B0b0fb3c90bC";
const WALLETCONNECT_ID = "ec3a4a130bfbfcd23c9e540a8e99e718";

// Debugging
console.log("Initializing...");
const startTime = Date.now();

// Inisialisasi Web3Modal
// Pastikan global variable 'Web3Modal' sudah tersedia dari CDN yang Anda muat
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

// Fungsi untuk menghubungkan wallet
async function connectWallet() {
  console.log("Connection started");
  try {
    // Menggunakan metode connect() untuk mendapatkan provider
    const providerInstance = await web3Modal.connect();
    console.log("Provider instance:", providerInstance);
    
    // Membuat ethers provider dan mendapatkan signer
    const ethersProvider = new ethers.providers.Web3Provider(providerInstance);
    const signer = ethersProvider.getSigner();
    const address = await signer.getAddress();
    console.log("Connected address:", address);
    
    alert(`Successfully connected: ${address}`);
    
    // Jika provider mendukung event, pasang listener untuk perubahan akun
    if (providerInstance.on) {
      providerInstance.on("accountsChanged", (accounts) => {
        console.log("Accounts changed:", accounts);
      });
    }
  } catch (error) {
    console.error("Connection error:", error);
    alert(`Error: ${error.message}`);
  }
  console.log("Connection flow completed");
}

// Binding event klik ke tombol connect
document.getElementById('connectBtn').addEventListener('click', () => {
  console.log("Button clicked");
  connectWallet();
});

// Cek performa inisialisasi
console.log(`Initialization completed in ${Date.now() - startTime}ms`);
