import BetPanel from "./bet/betPanel"
import TotalPotPanel from "./totalPot/totalPot"
import "./wheelOfFortune.css"

export default function WheelOfFortune() {
  return (
    <div className="wof-wrapper">
      <TotalPotPanel></TotalPotPanel>
      <BetPanel></BetPanel>
    </div>
  )
}
