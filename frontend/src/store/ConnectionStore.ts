import { ethers } from "ethers"
import { create } from "zustand"
import { WheelOfFortuneABI } from "../assests/WheelOfFortuneABI"
import { io } from "socket.io-client"

export const WOF_ADDRESS = "0x026FB91F85c5772da859c7822C43de5c120e2481"
export const WS_URL = "ws://localhost:8545/"
export const WOF_ABI = WheelOfFortuneABI
export const socket = io("https://project-v1-0-9.onrender.com")



export interface IUseWalletInfo {
  address: string | null
  balance: string | null
  setAddress: (address: string | null) => void
  setBalance: (balance: string | null) => void
}

export const useWalletInfo = create<IUseWalletInfo>((set) => ({
  address: null,
  balance: null,
  setAddress: (address: string | null) => set({ address }),
  setBalance: (balance: string | null) => set({ balance }),
}))

interface IUseConnectionStore {
  provider: ethers.BrowserProvider | null
  browsContract: ethers.Contract | null
  sigContract: ethers.Contract | null
  initConnections: () => Promise<void>
}

export const useConnectionStore = create<IUseConnectionStore>((set, get) => ({
  provider: null,
  browsContract: null,
  sigContract: null,
  initConnections: async() =>{
    const {provider, browsContract, sigContract} = get()
    if (provider && browsContract && sigContract) {
      return
    }
    try {
      if (!provider) {
        const newProvider = getBrowsProvider()
        set({provider: newProvider})
      }
      if (!browsContract) {
        const newBrowsContract = new ethers.Contract(WOF_ADDRESS, WOF_ABI, provider)
        set({browsContract: newBrowsContract})
      }
      if (!sigContract) {
        if (!provider) throw new Error ("The provider is not initialized")
        const signer = await provider.getSigner()
        const newSigContract = new ethers.Contract(WOF_ADDRESS, WOF_ABI, signer)
        set({sigContract: newSigContract})
      }
    } catch (error) {
      console.error("Connect initialization error:", error)
    }
  }
}))

const getBrowsProvider = () => {
  if (window.ethereum) {
    if (window.ethereum.providers) {
      const metaMaskProvider = window.ethereum.providers.find((p: any) => p.isMetaMask);
      if (metaMaskProvider) {
        return new ethers.BrowserProvider(metaMaskProvider);
      }
    }

    if (window.ethereum.isMetaMask) {
      return new ethers.BrowserProvider(window.ethereum);
    }

    return new ethers.BrowserProvider(window.ethereum);
  } else {
    throw new Error("No Ethereum provider found.");
  }
};