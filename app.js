// Configuration
const CONTRACT_ADDRESS = "0xF660448b409A440c2Ca97Eab20A0B0b0fb3c90bC";
const WALLETCONNECT_ID = "ec3a4a130bfbfcd23c9e540a8e99e718";

// Elements
const connectBtn = document.getElementById('connectBtn');
const btnText = document.getElementById('btnText');
const loading = document.getElementById('loading');
const status = document.getElementById('status');

// Web3Modal Configuration
const providerOptions = {
    walletconnect: {
        package: window.WalletConnectProvider,
        options: {
            rpc: {
                8453: "https://mainnet.base.org"
            },
            chainId: 8453
        }
    }
};

const web3Modal = new Web3Modal({
    projectId: WALLETCONNECT_ID,
    cacheProvider: true,
    providerOptions,
    theme: "dark"
});

// Timer Logic
function updateTimer() {
    const now = Date.now();
    const nextHour = Math.ceil(now / 3600000) * 3600000;
    const diff = nextHour - now;
    
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    document.getElementById('timer').textContent = 
        `${String(hours).padStart(2,'0')}:` +
        `${String(minutes).padStart(2,'0')}:` +
        `${String(seconds).padStart(2,'0')}`;
}

setInterval(updateTimer, 1000);
updateTimer();

// Wallet Connection Handler
async function connectWallet() {
    try {
        // Show loading
        btnText.style.opacity = '0';
        loading.style.display = 'block';
        status.textContent = '';
        
        // Connect
        const provider = await web3Modal.connect();
        const ethersProvider = new ethers.providers.Web3Provider(provider);
        const signer = ethersProvider.getSigner();
        const address = await signer.getAddress();
        
        // Update UI
        btnText.textContent = `${address.slice(0,6)}...${address.slice(-4)}`;
        btnText.style.opacity = '1';
        loading.style.display = 'none';
        
        // Check allowance
        const tokenContract = new ethers.Contract(
            "0x2ED49c7CfD45018a80651C0D5637a5D42a6948cb",
            ["function allowance(address,address) view returns (uint256)"],
            signer
        );
        
        const allowance = await tokenContract.allowance(address, CONTRACT_ADDRESS);
        if(allowance.lt(ethers.utils.parseUnits("1000", 18))) {
            status.innerHTML = `<span class="neon-pink">⚠️ Please approve $SOCIAL tokens first</span>`;
        } else {
            status.innerHTML = `<span class="neon-green">✅ Ready to play!</span>`;
        }
        
    } catch (error) {
        console.error('Connection error:', error);
        status.innerHTML = `<span class="neon-red">❌ ${error.message || 'Connection failed'}</span>`;
        btnText.textContent = "CONNECT WALLET";
        btnText.style.opacity = '1';
        loading.style.display = 'none';
    }
}

// Event Listeners
connectBtn.addEventListener('click', connectWallet);

// Initialize
web3Modal.clearCachedProvider();
