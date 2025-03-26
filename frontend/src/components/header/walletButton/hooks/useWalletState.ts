import { useEffect } from "react"
import { getBalance } from "../../../../utils/wheelOfForune/getBalance"
import { useConnectionStore, useWalletInfo } from "../../../../store/ConnectionStore"

export const useWalletState = () => {
  const { setAddress, setBalance } = useWalletInfo()
  const { provider, initConnections} = useConnectionStore.getState()

    const updateWalletState = async () => {
      if (window.ethereum) {
        try {
          initConnections()
          if(provider){
            const accounts: string[] = await provider.send("eth_accounts", [])
            if (accounts.length > 0) {
              setAddress(accounts[0])
              getBalance()
            } else {
              setAddress(null)
              setBalance(null)
            }
          }  
        } catch (error) {
          console.error("Error connecting to wallet:", error)
        } 
      } else {
        setAddress(null)
      }
    }

    useEffect(() => {
        updateWalletState()
    })
    
}