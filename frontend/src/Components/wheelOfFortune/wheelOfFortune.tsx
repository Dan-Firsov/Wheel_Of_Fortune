import BetPanel from "./bet/betPanel"
import WofHeader from "./wofHeader/wofHeader"
import "./wheelOfFortune.css"
import ParticipantBetsPanel from "./participantBetsPanel/participantBetsPanel"
import GameSessionPanel from "./gameTimerPanel/gameSessionPanel"

export default function WheelOfFortune() {
  return (
    <div className="wof-wrapper">
      <WofHeader />
      <GameSessionPanel />
      <ParticipantBetsPanel />
      <BetPanel />
    </div>
  )
}
