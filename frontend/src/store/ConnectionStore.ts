import { ethers } from "ethers"
import { create } from "zustand"
import { WheelOfFortuneABI } from "../assests/WheelOfFortuneABI"
import { io } from "socket.io-client"

export const tokenAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"
export const WOF_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3"
export const WS_URL = "ws://localhost:8545/"
export const WOF_ABI = WheelOfFortuneABI
export const socket = io("http://localhost:5000")

export interface connectAddress {
  address: string | null
  setAddress: (address: string | null) => void
}

export const useAddress = create<connectAddress>((set) => ({
  address: null,
  setAddress: (address: string | null) => set({ address }),
}))

interface IUseContractStore {
  browsContract: ethers.Contract | null
  sigContract: ethers.Contract | null
  setBrowsContract: () => void
  setSigContract: () => Promise<void>
}

const getBrowsContract = () => {
  const provider = new ethers.BrowserProvider(window.ethereum)
  const browsContract = new ethers.Contract(WOF_ADDRESS, WOF_ABI, provider)
  return browsContract
}
const getSigContract = async (): Promise<ethers.Contract | null> => {
  const provider = new ethers.BrowserProvider(window.ethereum)
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
