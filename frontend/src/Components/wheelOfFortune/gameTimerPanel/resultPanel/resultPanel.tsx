import { spawn } from "child_process"
import { useEffect, useState } from "react"
import { useContractStore } from "../../../../store/WalletStore"
import { formatEther } from "ethers"
import { useWheelOfFortuneStore } from "../../../../store/WheelOfFortuneStore"

export default function ResultPanel() {
  const { totalPot, isGameFinished, winner, setTotalPot, setWinner } = useWheelOfFortuneStore()
  const { browsContract } = useContractStore()

  useEffect(() => {
    const fetchGameResult = async () => {
      try {
        if (isGameFinished && browsContract) {
          const gameResultFilter = browsContract.filters.GameResult()
          const gameResultLogs = await browsContract.queryFilter(gameResultFilter)
          const formattedGameResultEvents = gameResultLogs.map((event) => {
            const decoded = browsContract.interface.decodeEventLog("GameResult", event.data, event.topics)
            return {
              winnerAddress: String(decoded[0]),
              totalPot: Number(formatEther(decoded[1])),
              participants: decoded[2],
            }
          })
          if (formattedGameResultEvents.length > 0) {
            const { winnerAddress, totalPot } = formattedGameResultEvents[formattedGameResultEvents.length - 1]
            setWinner(winnerAddress)
            setTotalPot(totalPot)
          }
        }
      } catch (error) {
        console.error("Game result event error:", error)
      }
    }
    fetchGameResult()

    const handleGameResult = (winnerAddress: string, totalPot: bigint) => {
      console.log("Ручка дернула результат", winnerAddress, totalPot)
      setWinner(winnerAddress)
      setTotalPot(Number(formatEther(totalPot)))
    }

    if (browsContract) browsContract.on("GameResult", handleGameResult)

    return () => {
      if (browsContract) browsContract.off("GameResult", handleGameResult)
    }
  }, [browsContract])

  return (
    <div>
      {winner ? (
        <span>
          Winner: {winner?.slice(0, 7) + "...." + winner?.slice(-6)}, Winning: {totalPot} ETH{" "}
        </span>
      ) : (
        <span>Game is not over Result</span>
      )}
    </div>
  )
}
