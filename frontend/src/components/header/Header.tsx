import ConnectWalletButton from "../wallet/ConnectWalletButton"
import "./header.css"

export default function Header() {
  return (
    <div className="header-wraper">
      <div className="header-name">Wheel Of Fortune</div>
      <ConnectWalletButton />
    </div>
  )
}
