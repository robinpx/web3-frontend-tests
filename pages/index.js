

import { Injected, WalletConnect } from '../components/wallet/Connectors'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import Web3 from "web3";
import { ethers } from "ethers";

export default function Home() {

  const { active, account, chainId, library, activate, deactivate } = useWeb3React()
  const [ balance, setBalance ] = useState("");

  let web3 = new Web3();

  async function connectInjected() {
    try {
      await activate(Injected)
    } catch (ex) {
      console.log(ex)
    }
  }

  async function connectWC() {
    try {
      await activate(WalletConnect)
    } catch (ex) {
      console.log(ex)
    }
  }

  async function disconnect() {
    try {
      deactivate()
    } catch (ex) {
      console.log(ex)
    }
  }

  async function checkWindow() {
    if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
      web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.enable();
        return true
      } catch(e) {
        return false
      }
   }
  }

  async function getBalance() {
    if (await !checkWindow()) {
      console.log("Must download MetaMask")
    }
    console.log("Getting balance...");
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    const bal = await web3.eth.getBalance(accounts[0])
    console.log(bal);
    const balETH = web3.utils.fromWei(bal, 'ether')
    console.log(balETH);
    setBalance(balETH);
  }

  async function getBalanceEthers() {
    if (await !checkWindow()) {
      console.log("Must download MetaMask")
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const accounts = await provider.send("eth_requestAccounts", []);
    console.log(accounts);
    console.log("Getting balance...");
    const bal = await provider.getBalance("ethers.eth")
    console.log(bal);
    const balETH = ethers.utils.formatEther(balance);
    console.log(balETH);
    setBalance(balETH);
  }

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (localStorage?.getItem('isInjConnected') === 'true') {
        try {
          await activate(Injected);
          localStorage.setItem('isInjConnected', true)
        } catch (ex) {
          console.log(ex)
        }
      }

      if (localStorage?.getItem('isWCConnected') === 'true') {
        try {
          await activate(WalletConnect);
          localStorage.setItem('isWCConnected', true)
        } catch (ex) {
          console.log(ex)
        }
      }
      getBalanceEthers();
    }
    connectWalletOnPageLoad()

  }, [activate, account, library, chainId])
  
  return (
    <div className={styles.container}>
      <p>Network ID: {chainId}</p>
      <button onClick={connectInjected}>Connect to MetaMask</button>
      <button onClick={connectWC}>Connect to WalletConnect</button>
      {active ? <span>Connected with <b>{account}</b></span> : <span>Not connected</span>}
      <br />
      {active ? <span>Balance is {balance} ETH</span> : <span>No balance</span>}
      <button onClick={disconnect}>Disconnect</button>
    </div>
  )
}
