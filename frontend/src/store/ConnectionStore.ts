import { ethers } from "ethers"
import { create } from "zustand"
import { getBrowsProvider } from "../utils/initBrowsProvider"
import { WheelOfFortuneABI } from "../assests/WheelOfFortuneABI"
import { io } from "socket.io-client"

export const WOF_ADDRESS = "0x026FB91F85c5772da859c7822C43de5c120e2481"
export const WS_URL = "ws://localhost:8545/"
export const WOF_ABI = WheelOfFortuneABI
export const socket = io("https://project-v1-0-9.onrender.com")

export interface connectWallet {
  address: string | null
  balance: string | null
  setAddress: (address: string | null) => void
  setBalance: (balance: string | null) => void
}

export const useWallet = create<connectWallet>((set) => ({
  address: null,
  balance: null,
  setAddress: (address: string | null) => set({ address }),
  setBalance: (balance: string | null) => set({ balance }),
}))

interface IUseContractStore {
  browsContract: ethers.Contract | null
  sigContract: ethers.Contract | null
  setBrowsContract: () => void
  setSigContract: () => Promise<void>
}



const getBrowsContract = () => {
  const provider = getBrowsProvider()
  const browsContract = new ethers.Contract(WOF_ADDRESS, WOF_ABI, provider)
  return browsContract
}
const getSigContract = async (): Promise<ethers.Contract | null> => {
  const provider = getBrowsProvider()
  const signer = await provider.getSigner()
  if (signer) {
    const sigContract = new ethers.Contract(WOF_ADDRESS, WOF_ABI, signer)
    return sigContract
  } else {
    return null
  }
}

export const useContractStore = create<IUseContractStore>((set) => ({
  browsContract: null,
  sigContract: null,
  setBrowsContract: () =>
    set((state) => {
      if (!state.browsContract) {
        const browsContract = getBrowsContract()
        return { ...state, browsContract }
      }
      return state
    }),
  setSigContract: async () => {
    const sigContract = await getSigContract()
    set((state) => ({ ...state, sigContract }))
  },
}))
