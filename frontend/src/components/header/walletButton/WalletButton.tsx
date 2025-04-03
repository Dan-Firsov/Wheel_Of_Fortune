import styles from './walletButton.module.css';
import Button from '../../../shared/common/button/Button';
import UserCard from './userCard/UserCard';
import { useWalletConnection } from '../../../shared/hooks/useWalletConnection';
import { useUserCardVisibility } from './useUserCardVisibility';
import { useAccount } from 'wagmi';

export default function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connectMetaMask } = useWalletConnection();
  const { isVisible, isAnimating, toggleUserCard, buttonRef, userCardRef } =
    useUserCardVisibility();

  const handleToggleUserCard = () =>
    address ? toggleUserCard() : connectMetaMask();

  return (
    <div className={styles.connectWalletWraper}>
      <Button
        ref={buttonRef}
        customClass={`${styles.connectButton} ${
          isAnimating ? styles.active : ''
        }`}
        onClick={handleToggleUserCard}
      >
        <span>
          {isConnected ? (
            `${address?.slice(0, 5) + '...' + address?.slice(-4)}`
          ) : (
            <span style={{ fontWeight: 'bold' }}>Connect Wallet</span>
          )}
        </span>
      </Button>
      {isVisible && (
        <UserCard userCardRef={userCardRef} isAnimating={isAnimating} />
      )}
    </div>
  );
}
