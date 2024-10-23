import BetPanel from "./bet/betPanel"
import WofHeader from "./wofHeader/wofHeader"
import GameTimer from "./timerPanel/timerPanel"
import "./wheelOfFortune.css"
import ParticipantBetsPanel from "./participantBetsPanel/participantBetsPanel"

export default function WheelOfFortune() {
  return (
    <div className="wof-wrapper">
      <WofHeader></WofHeader>
      <GameTimer></GameTimer>
      <ParticipantBetsPanel></ParticipantBetsPanel>
      <BetPanel></BetPanel>
    </div>
  )
}
