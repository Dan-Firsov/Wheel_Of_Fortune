import ConnectWalletButton from "../wallet/ConnectWalletButton"
import styles from "./header.module.css"

export default function Header() {
  return (
    <div className={styles.headerWrapper}>
      <div className={styles.headerName}>Wheel Of Fortune</div>
      <ConnectWalletButton />
    </div>
  )
}
