import BetPanel from "./bet/betPanel"
import WofHeader from "./wofHeader/wofHeader"
import "./wheelOfFortune.css"
import ParticipantBetsPanel from "./participantBetsPanel/participantBetsPanel"
import GameTimerPanel from "./gameTimerPanel/gameTimerPanel"

export default function WheelOfFortune() {
  return (
    <div className="wof-wrapper">
      <WofHeader></WofHeader>
      <GameTimerPanel></GameTimerPanel>
      <ParticipantBetsPanel></ParticipantBetsPanel>
      <BetPanel></BetPanel>
    </div>
  )
}
