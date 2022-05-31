import { useEffect, useState } from 'react';
import './App.css';
import contract from './contracts/NFTCollectible.json';

const contractAddress = "0x456B834F5F3Df0fEB74E969821cd198E4e79a77f"
const abi = contract.abi;

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);


  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure u haze Metamask installed");
      return;
    } else {
      console.log("Wallet exists!")
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorize account: ", account);
      setCurrentAccount(account);
    } else {
      console.log("no authorized");

    }
  }

  const connectWalletHandler = async() => {
    const { ethereum } = window;
    if (!ethereum) {
      alert("Please install Metamask !");
    } 
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Found an account! Address", accounts[0]);
      console.log("tetst");
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err)
    }
  }

  const mintNftHandler = () => { }

  const connectWalletButton = () => {
    return (
      <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
        Connect Wallet
      </button>
    )
  }

  const mintNftButton = () => {
    return (
      <button onClick={mintNftHandler} className='cta-button mint-nft-button'>
        Mint NFT
      </button>
    )
  }

  useEffect(() => {
    checkWalletIsConnected();
  }, [])

  return (
    <div className='main-app'>
      <h1>PRESS BRO FAST</h1>
      <div>
      {currentAccount ? mintNftButton() : connectWalletButton()}
      </div>
    </div>
  )
}

export default App;