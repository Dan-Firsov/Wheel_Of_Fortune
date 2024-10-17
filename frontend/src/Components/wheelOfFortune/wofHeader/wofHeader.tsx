import { useEffect, useState } from "react"
import "./wofHeader.css"
import { useConnection, wofAddress } from "../../../store/WalletStore"
import { ethers, formatEther } from "ethers"
import { WheelOfFortuneABI } from "../../../assests/WheelOfFortuneABI"

interface EventData {
  newTotalPot: number
  participantCount: number
}

export default function WofHeader() {
  const [totalPot, setTotalPot] = useState<number>()
  const [totalParcticipants, setTotalParticipants] = useState<number>()
  const [events, setEvents] = useState<EventData[]>([])

  useEffect(() => {
    const fetchTotals = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(wofAddress, WheelOfFortuneABI, provider)

      const filter = contract.filters.TotalUpdate()
      const eventLogs = await contract.queryFilter(filter)

      const formattedEvents = eventLogs.map((event) => {
        const decoded = contract.interface.decodeEventLog("TotalUpdate", event.data, event.topics)

        return {
          newTotalPot: Number(formatEther(decoded[0])),
          participantCount: Number(decoded[1]),
        }
      })

      console.log("Fetched events:", formattedEvents)

      if (formattedEvents.length > 0) {
        const latestEvent = formattedEvents[formattedEvents.length - 1]
        setTotalPot(latestEvent.newTotalPot)
        setTotalParticipants(latestEvent.participantCount)
      }

      setEvents(formattedEvents)
    }
    fetchTotals()
  }, [totalPot, totalParcticipants])

  return (
    <div className="wof-header-wrapper">
      <div className="total-wrapper">
        <span style={{ fontWeight: "bold" }}>Total pot:</span>
        <span>{totalPot ? `${totalPot} ETH` : "Loading..."}</span>
      </div>
      <div className="total-wrapper">
        <span style={{ fontWeight: "bold" }}>Total parcticipants:</span>
        <span>{totalParcticipants ? totalParcticipants : "Loading..."}</span>
      </div>
    </div>
  )
}
