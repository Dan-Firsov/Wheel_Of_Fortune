import { ethers } from "ethers"

export const getBrowsProvider = () => {
  if(window.ethereum.providers) {
    const provider = window.ethereum.providers.find((p: any) => p.isMetaMask)
    if(provider){
      return new ethers.BrowserProvider(provider)    
    }
  } else if(window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum)
  }
  throw new Error("No Ethereum provider found.")
}
