import { ethers, formatEther } from "ethers"
import { useEffect, useState } from "react"
import { wofAddress } from "../../../store/WalletStore"
import { WheelOfFortuneABI } from "../../../assests/WheelOfFortuneABI"
import { useParticipantsState, usePotState } from "../../../store/WheelOfFortuneStore"

interface Participant {
  address: string
  bet: number
}

export default function ParticipantBetsPanel() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const { totalPot } = usePotState()
  const { totalParcticipants } = useParticipantsState()
  useEffect(() => {
    const fetchParticipants = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(wofAddress, WheelOfFortuneABI, provider)

      const filter = contract.filters.ParticipantsUpdated()
      const eventLogs = await contract.queryFilter(filter)

      const formattedEvents = eventLogs.map((event) => {
        const decoded = contract.interface.decodeEventLog("ParticipantsUpdated", event.data, event.topics)
        const addresses = decoded[0] as string[]
        console.log(addresses)
        const bets = decoded[1] as bigint[]
        console.log(bets)

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
    fetchParticipants()

    return () => {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(wofAddress, WheelOfFortuneABI, provider)
      contract.removeAllListeners("ParticipantsUpdated")
    }
  }, [participants])
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
