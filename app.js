// Config
const CONTRACT_ADDRESS = "0xF660448b409A440c2Ca97Eab20A0B0b0fb3c90bC";
const WALLETCONNECT_ID = "ec3a4a130bfbfcd23c9e540a8e99e718";

// Init Web3Modal
const web3Modal = new Web3Modal.default({
    projectId: WALLETCONNECT_ID,
    chains: [{
        chainId: 8453,
        name: "Base Mainnet",
        currency: "ETH",
        rpcUrl: "https://mainnet.base.org"
    }]
});

// Timer
function updateTimer() {
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setHours(now.getHours() + 1);
    nextHour.setMinutes(0, 0, 0);
    
    const diff = nextHour - now;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    document.getElementById('timer').textContent = 
        `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
}

setInterval(updateTimer, 1000);
updateTimer();

// Wallet Connection
document.getElementById('connectBtn').addEventListener('click', async () => {
    try {
        const provider = await web3Modal.connect();
        const ethersProvider = new ethers.providers.Web3Provider(provider);
        const signer = ethersProvider.getSigner();
        const address = await signer.getAddress();
        
        document.getElementById('connectBtn').textContent = 
            `${address.slice(0,6)}...${address.slice(-4)}`;
        document.getElementById('status').innerHTML = 
            `<p class="neon-green">Connected! You can now play.</p>`;
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
});
