import styles from './userCard.module.css';
import { WalletActionButton } from './walletActionButton/WalletActionButton';
import { useCopyToClipboard } from './hooks/useCopyToClipboard';
import { useWalletActions } from './hooks/useWalletActions';
import Input from '../../../../shared/common/input/Input';
import Button from '../../../../shared/common/button/Button';
import useContractBalance from '../../../../shared/hooks/useContractBalance';

interface IUserCard {
  userCardRef: React.RefObject<HTMLDivElement | null>;
  isAnimating: boolean;
}

const UserCard = ({ userCardRef, isAnimating }: IUserCard) => {
  const {
    depositAmount,
    setDepositAmount,
    withdrawAmount,
    setWithdrawAmount,
    errorMessageDep,
    errorMessageWith,
    errorVisibleDep,
    errorVisibleWith,
    handleDeposit,
    handleWithdraw,
  } = useWalletActions();
  const { isCopied, handleCopy } = useCopyToClipboard();
  const { address, balance } = useContractBalance();

  return (
    <div
      ref={userCardRef}
      className={`${styles.userCard} ${isAnimating ? styles.visible : ''}`}
    >
      <h3>Wallet</h3>
      <div className={styles.addressContainer}>
        <p className={styles.address} onClick={() => handleCopy(address)}>
          {address}
        </p>
        {isCopied && (
          <span className={styles.copyMessage}>Address copied!</span>
        )}
      </div>
      <p className={styles.balance}>
        Balance: {balance ? <span>{balance}</span> : <span>0</span>} ETH
      </p>
      <div className={styles.actions}>
        <div className={styles.actionsItem}>
          <Input
            customContainerClass={styles.userCardInput}
            value={depositAmount}
            onValueChange={(e) => setDepositAmount(e)}
          ></Input>
          {errorMessageDep && (
            <p
              className={`${styles.error} ${
                errorVisibleDep ? styles.visible : ''
              }`}
            >
              {errorMessageDep}
            </p>
          )}
          <WalletActionButton onClick={handleDeposit} />
        </div>

        <div className={styles.actionsItem}>
          <Input
            customContainerClass={styles.userCardInput}
            value={withdrawAmount}
            onValueChange={(e) => setWithdrawAmount(e)}
          />
          {errorMessageWith && (
            <p
              className={`${styles.error} ${
                errorVisibleWith ? styles.visible : ''
              }`}
            >
              {errorMessageWith}
            </p>
          )}
          <Button customClass={styles.buttonWithdraw} onClick={handleWithdraw}>
            Withdraw
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
