import { useEffect, useState } from "react"
import { useContractStore } from "../../../../store/WalletStore"
import { SpinWheel } from "../../../../utils/wheelOfForune/wofSpinWheel"
import { useWheelOfFortuneStore } from "../../../../store/WheelOfFortuneStore"

export default function FinishGameTimer() {
  const [remainingTime, setRemainingTime] = useState<number | null>(null)
  const { setIsGameFinished } = useWheelOfFortuneStore()
  const { browsContract } = useContractStore()

  useEffect(() => {
    const fetchGameStarted = async () => {
      try {
        if (browsContract) {
          const gameStartedFilter = browsContract.filters.GameStarted()
          const gameStartedLogs = await browsContract.queryFilter(gameStartedFilter)
          const formattedGameStartedEvents = gameStartedLogs.map((event) => {
            const decoded = browsContract.interface.decodeEventLog("GameStarted", event.data, event.topics)
            return { endsAt: Number(decoded[0]) }
          })
          if (formattedGameStartedEvents.length > 0) {
            const { endsAt } = formattedGameStartedEvents[formattedGameStartedEvents.length - 1]
            const currentTime = Math.floor(Date.now() / 1000)
            if (endsAt >= currentTime) {
              const timeLeft = endsAt - currentTime
              if (timeLeft > 0) {
                setRemainingTime(timeLeft)
                startTimer(timeLeft)
              }
            } else {
              setRemainingTime(null)
            }
          }
        }
      } catch (error) {
        console.error("Game started event error:", error)
      }
    }
    fetchGameStarted()

    const handleGameStarted = (endsAt: number) => {
      const currentTime = Math.floor(Date.now() / 1000)
      const timeLeft = Number(endsAt) - currentTime
      if (timeLeft > 0) {
        setRemainingTime(timeLeft)
        startTimer(timeLeft)
      }
    }

    if (browsContract) browsContract.on("GameStarted", handleGameStarted)

    return () => {
      if (browsContract) browsContract.off("GameStarted", handleGameStarted)
    }
  }, [browsContract])

  function startTimer(seconds: number) {
    console.log("Timer started")
    let timeLeft = seconds + 1
    const timerInterval = setInterval(() => {
      if (timeLeft <= 0) {
        debugger
        clearInterval(timerInterval)
        setRemainingTime(null)
        SpinWheel()
        setIsGameFinished(true)
      } else {
        setRemainingTime(timeLeft - 1)
        timeLeft--
      }
    }, 1000)
  }

  return <div>{remainingTime !== null ? <span>Timer: {remainingTime} seconds left</span> : <span>Waiting for participants</span>}</div>
}
