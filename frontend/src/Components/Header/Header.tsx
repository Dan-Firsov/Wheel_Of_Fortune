import "./Header.css"
import ConnectWalletButton from "../wallet/сonnectWalletButton"

export default function Header() {
  return (
    <div className="header-wraper">
      <div className="header-name">Wheel Of Fortune</div>
      <ConnectWalletButton></ConnectWalletButton>
    </div>
  )
}
