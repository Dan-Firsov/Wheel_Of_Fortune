import styles from './header.module.css';
import WalletButton from './walletButton/WalletButton123';

export default function Header() {
  return (
    <div className={styles.headerWrapper}>
      <div className={styles.headerName}>Wheel Of Fortune</div>
      <WalletButton />
    </div>
  );
}
