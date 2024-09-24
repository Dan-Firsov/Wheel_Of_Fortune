import Button from "./Button/Button"
import detectEthereumProvider from "@metamask/detect-provider"

export default function ConnectWallet() {
  const connectMetaMask = async () => {
    const provider = await detectEthereumProvider({
      mustBeMetaMask: true,
    })
    if (provider) {
      // console.log("Metamask is install")
    } else console.error("Please install Metamask")
  }

  return <Button onClick={() => connectMetaMask()}>Connect Wallet</Button>
}
