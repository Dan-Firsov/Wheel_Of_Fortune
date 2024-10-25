import { useEffect } from "react"
import "./wofHeader.css"
import { getBrowsContract, getWsContract, getWsProvider, wofAddress } from "../../../store/WalletStore"
import { ethers, formatEther } from "ethers"
import { useParticipantsState, usePotState } from "../../../store/WheelOfFortuneStore"
import { WheelOfFortuneABI } from "../../../assests/WheelOfFortuneABI"

export default function WofHeader() {
  const { totalPot, setTotalPot } = usePotState()
  const { totalParticipants, setTotalParticipants } = useParticipantsState()

  useEffect(() => {
    const contract = getWsContract()
    const fetchTotals = async () => {
      const filter = contract.filters.TotalUpdate()
      const eventLogs = await contract.queryFilter(filter)
      const formattedEvents = eventLogs.map((event) => {
        const decoded = contract.interface.decodeEventLog("TotalUpdate", event.data, event.topics)
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

    fetchTotals()

    const handleTotalUpdate = (newTotalPot: bigint, participantCount: bigint) => {
      console.log("Event received:", { newTotalPot, participantCount })
      setTotalPot(Number(formatEther(newTotalPot)))
      setTotalParticipants(Number(participantCount))
    }

    contract.on("TotalUpdate", handleTotalUpdate)

    return () => {
      contract.off("TotalUpdate", handleTotalUpdate)
    }
  }, [])

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
