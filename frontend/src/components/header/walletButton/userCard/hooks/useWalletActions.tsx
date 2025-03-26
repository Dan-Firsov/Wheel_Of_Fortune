import { useState } from "react"
import { deposit } from "../../../../../utils/wheelOfForune/deposit"
import { withdraw } from "../../../../../utils/wheelOfForune/withdraw"

export const useWalletActions = () => {
      const [depositAmount, setDepositAmount] = useState("")
      const [withdrawAmount, setWithdrawAmount] = useState("")
      const [errorMessageDep, setErrorMessageDep] = useState("")
      const [errorMessageWith, setErrorMessageWith] = useState("")
      const [errorVisibleDep, setErrorvisibleDep] = useState(false)
      const [errorVisibleWith, setErrorvisibleWith] = useState(false)

        const handleDeposit = async () => {
          try {
            if (depositAmount) {
              await deposit(depositAmount)
              setDepositAmount("")
              setErrorMessageDep("")
            } else {
              console.log("Please provide value.")
              setErrorMessageDep("Please provide value.")
              setErrorvisibleDep(true)
              setTimeout(() => {
                setErrorvisibleDep(false)
              }, 2000)
            }
          } catch (error: any) {
            console.error("Deposit error:", error)
            if (error.reason && error.reason.includes("insufficient funds")) {
              setErrorMessageDep("insufficient funds")
            }
          }
        }

          const handleWithdraw = async () => {
            try {
              if (withdrawAmount) {
                await withdraw(withdrawAmount)
                setWithdrawAmount("")
                setErrorMessageWith("")
                setErrorvisibleWith(false)
              } else {
                console.log("Please provide value.")
                setErrorMessageWith("Please provide value.")
                setErrorvisibleWith(true)
                setTimeout(() => {
                  setErrorvisibleWith(false)
                }, 3000)
              }
            } catch (error: any) {
              if (error.reason && error.reason.includes("Insufficient funds on balance")) {
                setErrorMessageWith("Insufficient funds on balance")
                setErrorvisibleWith(true)
                setTimeout(() => {
                  setErrorvisibleWith(false)
                }, 3000)
              } else {
                setErrorMessageWith("Error during withdrawal")
                setErrorvisibleWith(true)
                setTimeout(() => {
                  setErrorvisibleWith(false)
                }, 3000)
              }
            }
          }

          return {
            depositAmount,setDepositAmount,
            withdrawAmount,setWithdrawAmount,
            errorMessageDep,errorMessageWith,errorVisibleDep,errorVisibleWith,
            handleDeposit,handleWithdraw,
          }
            
}