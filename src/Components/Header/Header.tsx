import ConnectWalletButton from "../ConnectWalletButton/ConnectWalletButton"
import "./Header.css"

export default function Header() {
  return (
    <div className="container">
      <div>Абстрактный хедер</div>
      <ConnectWalletButton></ConnectWalletButton>
    </div>
  )
}
