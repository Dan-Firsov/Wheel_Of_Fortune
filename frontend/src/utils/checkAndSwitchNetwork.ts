export const checkAndSwitchNetwork = async (): Promise<boolean> => {
  const requiredChainId = "0xaa36a7"

  if (!window.ethereum) {
    throw new Error("MetaMask is not installed.")
  }

  try {
    const currentChainId = await window.ethereum.request({ method: "eth_chainId" })
    if (currentChainId === requiredChainId) {
      console.log("Already connected to Sepolia.")
      return true
    }

    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: requiredChainId }],
    })
    console.log("Network successfully switched to Sepolia.")
    return true
  } catch (error: any) {
    if (error.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: requiredChainId,
              chainName: "Sepolia Testnet",
              nativeCurrency: {
                name: "Sepolia ETH",
                symbol: "ETH",
                decimals: 18,
              },
              rpcUrls: ["https://rpc.sepolia.org"],
              blockExplorerUrls: ["https://sepolia.etherscan.io"],
            },
          ],
        })
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
