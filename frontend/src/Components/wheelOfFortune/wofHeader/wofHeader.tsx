import { useEffect } from "react"
import "./wofHeader.css"
import { formatEther } from "ethers"
import { useWheelOfFortuneStore } from "../../../store/WheelOfFortuneStore"
import { useContractStore } from "../../../store/WalletStore"
import io from "socket.io-client"

const socket = io("http://localhost:5000")

export default function WofHeader() {
  const { totalPot, totalParticipants, setTotalPot, setTotalParticipants } = useWheelOfFortuneStore()
  const { browsContract } = useContractStore()

  useEffect(() => {
    const fetchTotals = async () => {
      if (browsContract) {
        const filter = browsContract.filters.TotalUpdate()
        const eventLogs = await browsContract.queryFilter(filter)
        const formattedEvents = eventLogs.map((event) => {
          const decoded = browsContract.interface.decodeEventLog("TotalUpdate", event.data, event.topics)
          return {
            newTotalPot: Number(formatEther(decoded[0])),
            participantCount: Number(decoded[1]),
          }
        })
        if (formattedEvents.length > 0) {
          const latestEvent = formattedEvents[formattedEvents.length - 1]
          setTotalPot(latestEvent.newTotalPot)
          setTotalParticipants(latestEvent.participantCount)
        }
      }
    }
    fetchTotals()
    const handleTotalUpdate = (newTotalPot: bigint, participantCount: bigint) => {
      setTotalPot(Number(formatEther(newTotalPot)))
      setTotalParticipants(Number(participantCount))
    }

    if (browsContract) browsContract.on("TotalUpdate", handleTotalUpdate)

    return () => {
      if (browsContract) browsContract.off("TotalUpdate", handleTotalUpdate)
    }
  }, [browsContract])

  return (
    <div className="wof-header-wrapper">
      <div className="total-wrapper">
        <span style={{ fontWeight: "bold" }}>Total pot:</span>
        <span>{totalPot ? `${totalPot} ETH` : "Loading..."}</span>
      </div>
      <div className="total-wrapper">
        <span style={{ fontWeight: "bold" }}>Total parcticipants:</span>
        <span>{totalParticipants ? totalParticipants : "Loading..."}</span>
      </div>
    </div>
  )
}
