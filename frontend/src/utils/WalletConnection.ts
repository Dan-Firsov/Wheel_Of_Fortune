import { initConnections } from "./initConnections"
import { connectSepoliaNetwork } from "./NetworkConnection"

export const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      const userChoice = window.confirm("Wallet is not installed. Would you like to install MetaMask?")
      if (userChoice) {
        window.open("https://metamask.io/download.html", "_blank")
      } else {
        console.log("User chose not to install MetaMask.")
      }
      return
    }
    initConnections()
    const isNetworkReady = await connectSepoliaNetwork()
    if (!isNetworkReady) {
      console.error("Failed to switch to the required network.")
      return
    }

  } catch (error) {
    console.error("Error connecting wallet:", error)
  }
}
