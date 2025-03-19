import { ethers } from "ethers"
import { useWallet, useContractStore } from "../store/ConnectionStore"
import { GetBalance } from "./wheelOfForune/getBalance"
import { checkAndSwitchNetwork } from "./checkAndSwitchNetwork"
import { getBrowsProvider } from "./initBrowsProvider"

export const connectWallet = async () => {
  const { setAddress } = useWallet.getState()
  const { setBrowsContract, setSigContract,  } = useContractStore.getState()

  try {
    if (!window.ethereum) {
      const userChoice = window.confirm("MetaMask is not installed. Would you like to install it?")
      if (userChoice) {
        window.open("https://metamask.io/download.html", "_blank")
      } else {
        console.log("User chose not to install MetaMask.")
      }
      return
    }

    const provider = getBrowsProvider()
    const signer = await provider.getSigner()
    const address = await signer.getAddress()
    
    await setBrowsContract()
    await setSigContract()
   
    setAddress(address)
    
    const isNetworkReady = await checkAndSwitchNetwork()
    if (!isNetworkReady) {
      console.error("Failed to switch to the required network.")
      return
    }

    GetBalance()
  } catch (error) {
    console.error("Error connecting wallet:", error)
  }
}
