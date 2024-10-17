import BetPanel from "./bet/betPanel"
import WofHeader from "./wofHeader/wofHeader"
import "./wheelOfFortune.css"
import ParticipantBetsPanel from "./participantBetsPanel/participantBetsPanel"

export default function WheelOfFortune() {
  return (
    <div className="wof-wrapper">
      <WofHeader></WofHeader>
      <ParticipantBetsPanel></ParticipantBetsPanel>
      <BetPanel></BetPanel>
    </div>
  )
}
