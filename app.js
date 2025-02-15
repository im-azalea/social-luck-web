// Config
const CONTRACT_ADDRESS = "0xF660448b409A440c2Ca97Eab20A0B0b0fb3c90bC";
const WALLETCONNECT_ID = "ec3a4a130bfbfcd23c9e540a8e99e718";

// Init Web3Modal dengan config lengkap
const providerOptions = {
  walletconnect: {
    package: window.WalletConnectProvider,
    options: {
      rpc: {
        8453: "https://mainnet.base.org"
      }
    }
  }
};

const web3Modal = new Web3Modal({
  network: "base",
  cacheProvider: true,
  providerOptions,
  theme: "dark"
});

// Wallet Connection
document.getElementById('connectBtn').addEventListener('click', async () => {
  try {
    const provider = await web3Modal.connect();
    const ethersProvider = new ethers.providers.Web3Provider(provider);
    const signer = ethersProvider.getSigner();
    const address = await signer.getAddress();
    
    console.log("Connected address:", address);
    document.getElementById('connectBtn').textContent = `${address.slice(0,6)}...${address.slice(-4)}`;
    
    // Cek approval token
    const erc20 = new ethers.Contract(
      "0x2ED49c7CfD45018a80651C0D5637a5D42a6948cb",
      ["function allowance(address,address) view returns(uint256)"],
      signer
    );
    
    const allowance = await erc20.allowance(address, CONTRACT_ADDRESS);
    if(allowance.lt(ethers.utils.parseUnits("1000", 18))) {
      alert("You need to approve $SOCIAL tokens first");
    }
    
  } catch (error) {
    console.error("Connection error:", error);
    alert(`Error: ${error.message}`);
  }
});
