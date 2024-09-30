import ConnectWalletButton from "../connectWalletButton/ConnectWalletButton"
import "./Header.css"

export default function Header() {
  return (
    <div className="container">
      <div>Абстрактный хедер</div>
      <ConnectWalletButton></ConnectWalletButton>
    </div>
  )
}
