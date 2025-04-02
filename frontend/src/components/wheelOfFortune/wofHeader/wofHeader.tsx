import styles from './wofHeader.module.css';
import { useWheelOfFortuneStore } from '../../../store/useWheelOfFortuneStore';

export default function WofHeader() {
  const { totalPot, totalParticipants } = useWheelOfFortuneStore();

  return (
    <div className={styles.wofHeaderWrapper}>
      {totalPot && totalParticipants ? (
        <>
          <div className={styles.totalWrapper}>
            <span style={{ fontWeight: 'bold' }}>Total pot:</span>
            <span>{`${totalPot} ETH`}</span>
          </div>
          <div className={styles.totalWrapper}>
            <span style={{ fontWeight: 'bold' }}>Total participants:</span>
            <span>{totalParticipants}</span>
          </div>
        </>
      ) : null}
    </div>
  );
}
