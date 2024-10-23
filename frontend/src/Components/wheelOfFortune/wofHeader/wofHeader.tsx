import { useEffect, useState } from "react"
import "./wofHeader.css"
import { wofAddress } from "../../../store/WalletStore"
import { ethers, formatEther, formatUnits } from "ethers"
import { WheelOfFortuneABI } from "../../../assests/WheelOfFortuneABI"
import { useParticipantsState, usePotState } from "../../../store/WheelOfFortuneStore"

export default function WofHeader() {
  const { totalPot, setTotalPot } = usePotState()
  const { totalParticipants, setTotalParticipants } = useParticipantsState()

  useEffect(() => {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const contract = new ethers.Contract(wofAddress, WheelOfFortuneABI, provider)

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
