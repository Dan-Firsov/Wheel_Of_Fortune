import { ethers } from "ethers"
import { WildTokenABI } from "../../../../assests/WildTokenABI"
import { tokenAddress, useAddress, useConnection } from "../../../../store/WalletStore"
import { useEffect, useState } from "react"

export default function TransactionHistoryPanel() {
  const { signer } = useConnection.getState()
  const { address } = useAddress.getState()
  const [transactions, setTransactions] = useState<any[]>([])

  useEffect(() => {
    const fetchTransaction = async () => {
      if (signer && address) {
        const contract = new ethers.Contract(tokenAddress, WildTokenABI, signer)
        const filter = contract.filters.Transfer(address, null)
        const events = await contract.queryFilter(filter)

        const formattedEvents = events.map((event) => {
          const decoded = contract.interface.decodeEventLog("Transfer", event.data, event.topics)
          return {
            from: decoded[0],
            to: decoded[1],
            value: ethers.formatUnits(decoded[2], 18),
            hash: event.transactionHash,
          }
        })

        setTransactions((prev) => [...formattedEvents, ...prev])
      }
    }
    fetchTransaction()
  }, [signer, address])

  return (
    <div>
      <h3>Transaction History</h3>
      <ul>
        {transactions.map((tx, index) => (
          <li key={index}>
            From: {tx.from}, To: {tx.to}, Value: {tx.value}
          </li>
        ))}
      </ul>
    </div>
  )
}
