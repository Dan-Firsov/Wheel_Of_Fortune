import { useWheelOfFortuneStore } from '../../../store/WheelOfFortuneStore';
import styles from './participantBetsPanel.module.css';

export default function ParticipantBetsPanel() {
  const { totalPot, participants } = useWheelOfFortuneStore();

  return (
    <div className={styles.participantsWrapper}>
      {participants.length === 0 ? (
        <table className={styles.participantsTable}>
          <tbody className={styles.participantsTbody}>
            <tr>
              <td
                colSpan={4}
                className={`${styles.participantsTd} ${styles.waitingCell}`}
              >
                Waiting for participants...
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <table className={styles.participantsTable}>
          <thead className={styles.participantsThead}>
            <tr>
              <th className={styles.participantsTh}>Participants</th>
              <th className={styles.participantsTh}>Address</th>
              <th className={styles.participantsTh}>Bet</th>
              <th className={styles.participantsTh}>Chance</th>
            </tr>
          </thead>
          <tbody className={styles.participantsTbody}>
            {participants.map((participant, index) => {
              const winChance = (participant.bet / totalPot) * 100;

              return (
                <tr key={index}>
                  <td className={styles.participantsTd}>{index + 1}</td>
                  <td className={styles.participantsTd}>
                    {participant.address?.slice(0, 7) +
                      '....' +
                      participant.address?.slice(-6)}
                  </td>
                  <td className={styles.participantsTd}>{participant.bet}</td>
                  <td className={styles.participantsTd}>
                    {winChance.toFixed(2)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
