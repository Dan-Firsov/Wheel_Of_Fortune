import { ethers } from "ethers"
import { create } from "zustand"

export const tokenAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"

export interface ConnectStore {
  provider: ethers.BrowserProvider | null
  signer: ethers.JsonRpcSigner | null
  address: string | null
}

export const useConnectDefaultState: ConnectStore = {
  provider: null,
  signer: null,
  address: null,
}
export const useConnect = create<ConnectStore>(() => useConnectDefaultState)

export const setConnection = (data: ConnectStore) =>
  useConnect.setState(() => {
    return data
  })
