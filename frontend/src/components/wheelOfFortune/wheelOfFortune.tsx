import BetPanel from "./bet/betPanel"
import WofHeader from "./wofHeader/wofHeader"
import styles from "./wheelOfFortune.module.css"
import ParticipantBetsPanel from "./participantBetsPanel/participantBetsPanel"
import GameSessionPanel from "./gameTimerPanel/gameSessionPanel"

export default function WheelOfFortune() {
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
  )
}
