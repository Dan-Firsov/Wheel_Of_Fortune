import { BigNumberish, ethers, formatEther } from "ethers"
import { useConnection, wofAddress } from "../../../store/WalletStore"
import { WheelOfFortuneABI } from "../../../assests/WheelOfFortuneABI"
import { useEffect, useState } from "react"
import { format } from "path"

export default function ParticipantBetsPanel() {
  const [players, setPlayers] = useState<{ address: string; bet: string; chance: string }[]>([])
  const { provider } = useConnection.getState()

  const contract = new ethers.Contract(wofAddress, WheelOfFortuneABI, provider)
  useEffect(() => {
    if (provider) {
      provider.on("ParticipantsUpdated", (participants: string[], bets: bigint[]) => {
        const totalBets = bets.reduce((acc, bet) => acc + bet, BigInt(0))

        const playerData = participants.map((participant, index) => {
          const betInEther = formatEther(bets[index])
          const chance = (Number(bets[index]) / Number(totalBets)) * 100
          return {
            address: participant,
            bet: betInEther,
            chance: chance.toFixed(2) + "%",
          }
        })
        setPlayers(playerData)
      })

      return () => {
        provider.removeAllListeners("ParticipantsUpdated")
      }
    }
  }, [provider])

  return (
    <div>
      {players.map((player, index) => (
        <div key={index} className="player">
          <span>{player.address}</span>
          <span>{player.bet} ETH</span>
          <span>{player.chance}</span>
        </div>
      ))}
    </div>
  )
}
