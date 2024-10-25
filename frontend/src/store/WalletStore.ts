import { ethers } from "ethers"
import { create } from "zustand"
import { WheelOfFortuneABI } from "../assests/WheelOfFortuneABI"

export const tokenAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"
export const wofAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"
export const WS_URL = "ws://127.0.0.1:8545/"

const WOF_ABI = WheelOfFortuneABI

let wsProvider: ethers.WebSocketProvider | null = null
let browsProvider: ethers.BrowserProvider | null = null

let wsContract: ethers.Contract | null = null
let browsContract: ethers.Contract | null = null
let sigContract: ethers.Contract | null = null

export function getWsProvider() {
  if (!wsProvider) {
    wsProvider = new ethers.WebSocketProvider(WS_URL)
  }
  return wsProvider
}

export function getBrowsProvider() {
  if (!browsProvider) {
    browsProvider = new ethers.BrowserProvider(window.ethereum)
  }
  return browsProvider
}

export function getWsContract() {
  if (!wsContract) {
    const wsProvider = getWsProvider()
    wsContract = new ethers.Contract(wofAddress, WOF_ABI, wsProvider)
  }
  return wsContract
}
export function getBrowsContract() {
  if (!browsContract) {
    const browsProvider = getBrowsProvider()
    browsContract = new ethers.Contract(wofAddress, WOF_ABI, browsProvider)
  }
  return browsContract
}
export async function getSigContract() {
  if (!sigContract) {
    const browsProvider = getBrowsProvider()
    const signer = await browsProvider.getSigner()
    sigContract = new ethers.Contract(wofAddress, WOF_ABI, signer)
  }
  return sigContract
}

export interface connectAddress {
  address: string | null
  setAddress: (address: string | null) => void
}

export const useAddress = create<connectAddress>((set) => ({
  address: null,
  setAddress: (address: string | null) => set({ address }),
}))
