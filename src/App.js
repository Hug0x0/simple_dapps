import { useEffect, useState } from 'react';
import './App.css';
import contract from './contracts/NFTCollectible.json';
import { ethers } from 'ethers';
import csvFile from './assets/user.csv';
import Papa from 'papaparse';


const contractAddress = "0x189E915A61281631e8eFa5C60bc9fA27dFE47212"
const abi = contract;

function App() {
  var result;
  var result2;
  fetch( csvFile )
        .then( response => response.text() )
        .then( responseText => {
            // -- parse csv
            result = Papa.parse(responseText);
            result2 = result.data;
            console.log('data:', result.data.length);
            console.log(result.data[0].toString());
        });


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

  const mintNftHandler = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = new ethers.Wallet("your_private_key_string", provider);
        //const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, abi, signer);

        // fetch( csvFile )
        // .then( response => response.text() )
        // .then( responseText => {
        //     // -- parse csv
        //     result = Papa.parse(responseText);
        //     console.log('data:', result.data.length);
        // });
        for(let i=0; i < result.data.length; i++) {
          console.log("Start Airdrop");
          let airdropTxn = await nftContract.airdrop(`${result2[i].toString()}`, 1);
          console.log("Airdrop coming... please wait");
          await airdropTxn.wait();
          console.log(`https://rinkeby.etherscan.io/tx/${airdropTxn.hash}`);
        }
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