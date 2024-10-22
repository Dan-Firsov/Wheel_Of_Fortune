import { ethers } from "ethers"
import { wofAddress } from "../../../store/WalletStore"
import { WheelOfFortuneABI } from "../../../assests/WheelOfFortuneABI"
import { useEffect, useState } from "react"

export default function GameTimer() {
  const [remainingTime, setRemainingTime] = useState<number | null>(null)

  useEffect(() => {
    const fetchEvent = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(wofAddress, WheelOfFortuneABI, provider)

      const filter = contract.filters.GameStarted()
      const eventLogs = await contract.queryFilter(filter)

      if (eventLogs.length > 0) {
        const event = eventLogs[0]
        const decoded = contract.interface.decodeEventLog("GameStarted", event.data, event.topics)
        const endTime = Number(decoded[0])

        const currentTime = Math.floor(Date.now() / 1000)
        const timeLeft = endTime - currentTime
        console.log(timeLeft)

        if (timeLeft > 0) {
          console.log(remainingTime)
          setRemainingTime(timeLeft)
          startTimer(timeLeft)
        }
      }
    }
    const intervalId = setInterval(fetchEvent, 1000)

    function startTimer(seconds: number) {
      let timeLeft = seconds

      const timerId = setInterval(() => {
        if (timeLeft <= 0) {
          clearInterval(timerId)
          clearInterval(timerId)
          console.log("Игра завершена")
        } else {
          setRemainingTime(timeLeft - 1)
          timeLeft--
        }
      }, 1000)
    }
    fetchEvent()
    return () => {
      clearInterval(intervalId)
    }
  }, [])

  return (
    <div>
      <span>{remainingTime !== null ? `Timer: ${remainingTime}` : "Waiting for game to start..."}</span>
    </div>
  )
}
