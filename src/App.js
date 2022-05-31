import { useEffect, useState } from 'react';
import './App.css';
import contract from './contracts/NFTCollectible.json';
import { ethers } from 'ethers';


const contractAddress = "0x424BC911D6D5f8fD24337318deab93E004716c11"
const abi = contract;

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);


  const checkWalletIsConnected = async () => {
    const { ethereum } = window;
    console.log(window);

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

  const mintNftHandler = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        console.log(abi);
        const nftContract = new ethers.Contract(contractAddress, abi, signer);
        console.log(nftContract);

        console.log("Start Airdrop");
        // let nftTxn = await nftContract.mintNFTs(1, { value: ethers.utils.parseEther("0.01") });
        let nftTxn = await nftContract.airdrop("0x06597ee1c914EF04a4DC77eD305C264Fb4B9899B", 1);
        console.log("Mining... please wait");
        await nftTxn.wait();
        console.log(`Done: ${nftTxn.hash}`);
      } else {
        console.log("ETH OBJ does not exist");
      }
    } catch (err) {
      console.log(err);
    }
  }

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