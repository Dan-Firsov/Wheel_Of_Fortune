import { ethers, formatEther } from "ethers"
import { useEffect, useState } from "react"
import { useContractStore, WOF_ABI, WOF_ADDRESS } from "../../../store/WalletStore"
import { WheelOfFortuneABI } from "../../../assests/WheelOfFortuneABI"
import { SpinWheel } from "../../../utils/wheelOfForune/wofSpinWheel"
import { CreateGame } from "../../../utils/wheelOfForune/wofCreateGame"

export default function GameTimer() {
  const [remainingTime, setRemainingTime] = useState<number | null>(null)
  const [nextGameTime, setNextGameTime] = useState<number | null>(null)
  const [winner, setWinner] = useState<string | null>(null)
  const [gameActive, setGameActive] = useState(false)
  const { browsContract } = useContractStore()

  useEffect(() => {
    const fetchGameEvents = async () => {
      try {
        if (browsContract) {
          const gameStartedFilter = browsContract.filters.GameStarted()
          const gameResultFilter = browsContract.filters.GameResult()

          const gameStartedLogs = await browsContract.queryFilter(gameStartedFilter)
          const gameResultLogs = await browsContract.queryFilter(gameResultFilter)

          const formattedGameStartedEvents = gameStartedLogs.map((event) => {
            const decoded = browsContract.interface.decodeEventLog("GameStarted", event.data, event.topics)
            return { endsAt: Number(decoded[0]) }
          })

          const formattedGameResultEvents = gameResultLogs.map((event) => {
            const decoded = browsContract.interface.decodeEventLog("GameResult", event.data, event.topics)
            return {
              winnerAddress: String(decoded[0]),
              totalPot: Number(formatEther(decoded[1])),
              participants: decoded[2],
            }
          })

          if (formattedGameStartedEvents.length > 0) {
            const { endsAt } = formattedGameStartedEvents[formattedGameStartedEvents.length - 1]
            const currentTime = Math.floor(Date.now() / 1000)
            const timeLeft = endsAt - currentTime

            if (timeLeft > 0) {
              setGameActive(true)
              setWinner(null)
              setRemainingTime(timeLeft)
              startTimer(timeLeft)
            }
          }

          if (formattedGameResultEvents.length > 0) {
            const { winnerAddress } = formattedGameResultEvents[formattedGameResultEvents.length - 1]

            setWinner(winnerAddress)
            setGameActive(false)
            setRemainingTime(null)
            let timeleft = 10
            const nextGameTimer = setInterval(() => {
              if (timeleft <= 0 && !gameActive) {
                clearInterval(nextGameTimer)
                setWinner(null)
                setNextGameTime(null)
                CreateGame()
              } else {
                setNextGameTime(timeleft - 1)
                timeleft--
              }
            }, 1000)
          }
        }
      } catch (error) {
        console.error("Ошибка при получении событий:", error)
      }
    }

    fetchGameEvents()

    const handleGameStarted = (endsAt: number) => {
      const currentTime = Math.floor(Date.now() / 1000)
      const timeLeft = endsAt - currentTime

      if (timeLeft > 0) {
        setGameActive(true)
        setWinner(null)
        setRemainingTime(timeLeft)
        startTimer(timeLeft)
      }
    }

    const handleGameResult = (winnerAddress: string, totalPot: bigint) => {
      setWinner(winnerAddress)
      setGameActive(false)
      setRemainingTime(null)

      let timeleft = 10
      const nextGameTimer = setInterval(() => {
        if (timeleft <= 0 && !gameActive) {
          clearInterval(nextGameTimer)
          setWinner(null)
          setNextGameTime(null)
          CreateGame()
        } else {
          setNextGameTime(timeleft - 1)
          timeleft--
        }
      }, 1000)
    }

    if (browsContract) browsContract.on("GameStarted", handleGameStarted)
    if (browsContract) browsContract.on("GameResult", handleGameResult)

    return () => {
      if (browsContract) browsContract.off("GameStarted", handleGameStarted)
      if (browsContract) browsContract.off("GameResult", handleGameResult)
    }
  }, [browsContract])

  function startTimer(seconds: number) {
    let timeLeft = seconds

    const timerInterval = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(timerInterval)
        SpinWheel()
      } else {
        setRemainingTime(timeLeft - 1)
        timeLeft--
      }
    }, 1000)
  }

  return (
    <div>
      {remainingTime !== null ? (
        <span>Timer: {remainingTime} seconds left</span>
      ) : winner ? (
        <>
          <span>Winner: {winner}</span>
          {nextGameTime !== null && (
            <div>
              <span>Next game starts in: {nextGameTime} seconds</span>
            </div>
          )}
        </>
      ) : (
        <span>Waiting for participants</span>
      )}
    </div>
  )
}
