import BetPanel from './betPanel/betPanel';
import WofHeader from './wofHeader/wofHeader';
import styles from './wheelOfFortune.module.css';
import ParticipantBetsPanel from './participantBetsPanel/participantBetsPanel';
import GameSessionPanel from './gameSessionPanel/gameSessionPanel';
import { useEffect } from 'react';
import { useWheelOfFortuneStore } from '../../store/WheelOfFortuneStore';
import { updateGameState } from '../../utils/wheelOfForune/updateGameState';
import { socket } from '../../constants/api';

export default function WheelOfFortune() {
  const { setTotalPot, setTotalParticipants, setParticipants } =
    useWheelOfFortuneStore();

  useEffect(() => {
    updateGameState();
    socket.on('gameUpdate', (update) => {
      if (update.type === 'totalUpdate') {
        setParticipants(update.updatedParticipants);
        setTotalPot(update.totalUpdate.totalPot);
        setTotalParticipants(update.totalUpdate.participantCount);
      }
    });
    return () => {
      socket.off('gameUpdate');
    };
  }, []);

  return (
    <div className={styles.gameContainer}>
      <div className={styles.header}>
        <WofHeader />
      </div>
      <div className={styles.gamePanel}>
        <GameSessionPanel />
      </div>
      <div className={styles.table}>
        <ParticipantBetsPanel />
      </div>
      <div className={styles.footer}>
        <BetPanel />
      </div>
    </div>
  );
}
