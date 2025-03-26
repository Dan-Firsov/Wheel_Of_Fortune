import { useEffect} from "react"
import { useConnectionStore } from "../../../../store/ConnectionStore"
import { getBalance } from "../../../../utils/wheelOfForune/getBalance"

const EVENTS = ["Deposit","Withdraw","BetPlaced","WithdrawBet","GameResult",]


export default function useBalanceUpdates() {
    const { browsContract } = useConnectionStore()    

    useEffect(() => {
      if (browsContract) {
        EVENTS.forEach(event => browsContract.on(event,getBalance))
      }
      return () => {
        if (browsContract) {
          EVENTS.forEach(event => browsContract.off(event,getBalance))
        }
  
      }
    }, [browsContract])
}