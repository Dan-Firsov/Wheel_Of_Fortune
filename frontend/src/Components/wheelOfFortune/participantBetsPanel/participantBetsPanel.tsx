import { ethers, formatEther } from "ethers"
import { useEffect, useState } from "react"
import { useContractStore, WOF_ABI, WOF_ADDRESS } from "../../../store/WalletStore"
import { usePotState } from "../../../store/WheelOfFortuneStore"

interface Participant {
  address: string
  bet: number
}

export default function ParticipantBetsPanel() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const { totalPot } = usePotState()
  const { browsContract } = useContractStore()

  useEffect(() => {
    const fetchParticipants = async () => {
      if (browsContract) {
        const filter = browsContract.filters.ParticipantsUpdated()
        const eventLogs = await browsContract.queryFilter(filter)
        const formattedEvents = eventLogs.map((event) => {
          const decoded = browsContract.interface.decodeEventLog("ParticipantsUpdated", event.data, event.topics)
          const addresses = decoded[0] as string[]
          const bets = decoded[1] as bigint[]

          return addresses.map((address, index) => ({
            address,
            bet: Number(formatEther(bets[index])),
          }))
        })
        if (formattedEvents.length > 0) {
          const latestEvent = formattedEvents[formattedEvents.length - 1]
          latestEvent.sort((a, b) => b.bet / totalPot - a.bet / totalPot)
          setParticipants(latestEvent)
        }
      }
    }
    fetchParticipants()
    const handleParticipantsUpdate = (addresses: string[], bets: bigint[]) => {
      const updatedParticipants = addresses.map((address, index) => ({
        address,
        bet: Number(formatEther(bets[index])),
      }))
      updatedParticipants.sort((a, b) => b.bet / totalPot - a.bet / totalPot)
      setParticipants(updatedParticipants)
    }

    if (browsContract) browsContract.on("ParticipantsUpdated", handleParticipantsUpdate)

    return () => {
      if (browsContract) browsContract.off("ParticipantsUpdated", handleParticipantsUpdate)
    }
  }, [browsContract])
  return (
    <div>
      <h3>Participants:</h3>
      <ol>
        {participants.map((participant, index) => {
          const winChance = (participant.bet / totalPot) * 100

          return (
            <li key={index}>
              Address: {participant.address?.slice(0, 7) + "...." + participant.address?.slice(-6)}, Bet: {participant.bet}, Chance: {winChance.toFixed(2)}%
            </li>
          )
        })}
      </ol>
    </div>
  )
}
