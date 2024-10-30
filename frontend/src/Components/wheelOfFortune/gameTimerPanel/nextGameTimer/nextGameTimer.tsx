import { useEffect, useState } from "react"
import { useContractStore } from "../../../../store/WalletStore"
import { CreateGame } from "../../../../utils/wheelOfForune/wofCreateGame"
import { useWheelOfFortuneStore } from "../../../../store/WheelOfFortuneStore"

export default function NextGameTimer() {
  const [remainingTime, setRemainingTime] = useState<number | null>(null)
  const { isGameFinished, setIsGameFinished, setWinner } = useWheelOfFortuneStore()
  const { browsContract } = useContractStore()

  useEffect(() => {
    const fetchNextGameStart = async () => {
      try {
        if (isGameFinished && browsContract) {
          const nextGameStartFilter = browsContract.filters.GameFinished()
          const nextGameStartLogs = await browsContract.queryFilter(nextGameStartFilter)
          const formattedNextGameStartEvents = nextGameStartLogs.map((event) => {
            const decoded = browsContract.interface.decodeEventLog("GameFinished", event.data, event.topics)
            return {
              nextGameStartAt: Number(decoded[0]),
            }
          })
          if (formattedNextGameStartEvents.length > 0) {
            const { nextGameStartAt } = formattedNextGameStartEvents[formattedNextGameStartEvents.length - 1]
            const currentTime = Math.floor(Date.now() / 1000)
            if (nextGameStartAt >= currentTime) {
              const timeleft = nextGameStartAt - currentTime
              startTimer(timeleft)
            }
          }
        }
      } catch (error) {
        console.error("Next game start event error:", error)
      }
    }

    fetchNextGameStart()

    const handleNextGameStart = (nextGameStartAt: number) => {
      const currentTime = Math.floor(Date.now() / 1000)
      const timeLeft = Number(nextGameStartAt) - currentTime
      startTimer(timeLeft)
    }

    if (browsContract) browsContract.on("GameFinished", handleNextGameStart)

    return () => {
      if (browsContract) browsContract.off("GameFinished", handleNextGameStart)
    }
  }, [browsContract])

  function startTimer(seconds: number) {
    let timeLeft = seconds
    const timerInterval = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(timerInterval)
        setRemainingTime(null)
        CreateGame()
        setIsGameFinished(false)
        setWinner("")
      } else {
        setRemainingTime(timeLeft - 1)
        timeLeft--
      }
    }, 1000)
  }

  return <div>{remainingTime !== null ? <span>Next game starts in: {remainingTime} seconds</span> : <span>Game is not over Timer</span>}</div>
}
