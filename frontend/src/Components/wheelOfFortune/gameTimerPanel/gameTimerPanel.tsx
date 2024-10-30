import FinishGameTimer from "./finishGameTimer/finishGametimer"
import ResultPanel from "./resultPanel/resultPanel"
import NextGameTimer from "./nextGameTimer/nextGameTimer"

export default function GameTimerPanel() {
  return (
    <div>
      <NextGameTimer></NextGameTimer>
      <ResultPanel></ResultPanel>
      <FinishGameTimer></FinishGameTimer>
    </div>
  )
}
