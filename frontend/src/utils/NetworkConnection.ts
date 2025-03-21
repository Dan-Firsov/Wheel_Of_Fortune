import { ethers } from "ethers"
import { getBrowsProvider } from "./initBrowsProvider"

export const connectSepoliaNetwork = async (): Promise<boolean> => {
  const sepoliaChainId = "0xaa36a7"

  if (!window.ethereum) {
    throw new Error("Wallet is not installed.")
  }

  const provider = getBrowsProvider()


  try {
    const currentChainId = ethers.toQuantity((await provider.getNetwork()).chainId)
    if (currentChainId === sepoliaChainId) {
      console.log("Already connected to Sepolia.")
      return true
    }

    await provider.send("wallet_switchEthereumChain",[{ chainId: sepoliaChainId }])
    console.log("Network successfully switched to Sepolia.")
    return true
  } catch (error: any) {
    if (error.code === 4902) {
      try {
        await provider.send("wallet_addEthereumChain",[
            {
              chainId: sepoliaChainId,
              chainName: "Sepolia Testnet",
              nativeCurrency: {
                name: "Sepolia ETH",
                symbol: "ETH",
                decimals: 18,
              },
              rpcUrls: ["https://rpc.sepolia.org"],
              blockExplorerUrls: ["https://sepolia.etherscan.io"],
            },
          ])
        console.log("Sepolia network added and switched.")
        return true
      } catch (addError) {
        console.error("Error when adding the Sepolia network:", addError)
      }
    } else {
      console.error("Error when switching network:", error)
    }
  }
  return false
}
