import { ethers } from "ethers"
import { create } from "zustand"
import { persist } from "zustand/middleware"

export const tokenAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"

export interface connectAddress {
  address: string | null
  setAddress: (address: string | null) => void
}

export interface connection {
  provider: ethers.BrowserProvider | null
  signer: ethers.JsonRpcSigner | null
  setConnection: (provider: ethers.BrowserProvider, signer: ethers.JsonRpcSigner) => void
}

export const useAddress = create(
  persist<connectAddress>(
    (set) => ({
      address: null,
      setAddress: (address: string | null) => set({ address }),
    }),
    {
      name: "connect-storage",
    }
  )
)

export const useConnection = create<connection>((set) => ({
  provider: null,
  signer: null,

  setConnection: (provider: ethers.BrowserProvider, signer: ethers.JsonRpcSigner) => set({ provider, signer }),
}))
