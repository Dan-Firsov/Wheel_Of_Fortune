import BetPanel from "./bet/betPanel"
import WofHeader from "./wofHeader/wofHeader"
import "./wheelOfFortune.css"
import ParticipantBetsPanel from "./participantBetsPanel/participantBetsPanel"
import GameSessionPanel from "./gameTimerPanel/gameSessionPanel"

export default function WheelOfFortune() {
  return (
    <div className="game-container">
      <div className="header">
        <WofHeader />
      </div>
      <div className="game-panel">
        <GameSessionPanel />
      </div>
      <div className="table">
        <ParticipantBetsPanel />
      </div>
      <div className="footer">
        <BetPanel />
      </div>
    </div>
  )
}
