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
  const [winnerActive, setWinnerActive] = useState(false)
  const [totalPot, setTotalPot] = useState<number | null>(null)
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
            const timeLeft = endsAt - currentTime
            if (timeLeft > 0) {
              setWinner(null)
              setRemainingTime(timeLeft)
              startTimer(timeLeft)
            }
          }
        }
      } catch (error) {
        console.error("Game started event error:", error)
      }
    }
    fetchGameStarted()

    const fetchGameResult = async () => {
      try {
        if (browsContract) {
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
            if (winnerAddress !== "0x0000000000000000000000000000000000000000") {
              setWinner(winnerAddress)
              setWinnerActive(true)
              setTotalPot(totalPot)
              setRemainingTime(null)
              fetchNextGameStart()
            }
          }
        }
      } catch (error) {
        console.error("Game result event error:", error)
      }
    }
    fetchGameResult()

    const fetchNextGameStart = async () => {
      try {
        if (browsContract) {
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
            const timeleft = nextGameStartAt - currentTime

            console.log("KOstyn mi tut", nextGameStartAt)
            nextGameTimer(timeleft)
          }
        }
      } catch (error) {
        console.error("Next game start event error:", error)
      }
    }
    const handleGameStarted = (endsAt: number) => {
      console.log("Real-time event GameStarted received:", endsAt)
      const currentTime = Math.floor(Date.now() / 1000)
      const timeLeft = endsAt - currentTime
      if (timeLeft > 0) {
        setWinner(null)
        setRemainingTime(timeLeft)
        startTimer(timeLeft)
      }
    }

    const handleGameResult = (winnerAddress: string, totalPot: bigint) => {
      console.log("Real-time event GameResult received:", winnerAddress, totalPot)
      setWinner(winnerAddress)
      setRemainingTime(null)
      let timeleft = 10
      const nextGameTimer = setInterval(() => {
        if (timeleft <= 0) {
          clearInterval(nextGameTimer)
          setWinner(null)
          setNextGameTime(null)
          CreateGame()
          setWinnerActive(false)
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

  function nextGameTimer(seconds: number) {
    let timeLeft = seconds

    const timerInterval = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(timerInterval)
        setWinner(null)
        setNextGameTime(null)
        CreateGame()
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
      ) : winnerActive ? (
        <>
          <span>
            Winner: {winner?.slice(0, 7) + "...." + winner?.slice(-6)}, Winning: {totalPot} ETH
          </span>
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
