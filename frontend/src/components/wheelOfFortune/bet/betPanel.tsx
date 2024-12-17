import { ChangeEvent, useEffect, useRef, useState } from "react"
import { PlaceBet } from "../../../utils/wheelOfForune/placeBet"
import styles from "./betPanel.module.css"
import { WithdrawBet } from "../../../utils/wheelOfForune/withdrawBet"
import Button from "../../buttons/button/Button"
import Input from "../../input/Input"

enum ErrorMsg {
  PROVIDEVALUE = "Please provide value.",
  LOWBALANCE = "Insufficient funds on balance",
  NOACTIVEGAME = "No active game sessions",
  SESSIONCOMPLETED = "Session already completed",
  LOWBETBALANCE = "Insufficient bet balance",
  NOTPLACEDBET = "You have not placed any bets",
  GAMESTARTED = "Game has started",
}

export default function BetPanel() {
  const [value, setValue] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [errorVisible, setErrorVisible] = useState(false)

  const checkboxRef = useRef<HTMLInputElement | null>(null)
  const formContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleBet = async () => {
    try {
      if (value) {
        await PlaceBet(value)
        setValue("")
        setErrorMessage("")
      } else {
        console.log(ErrorMsg.PROVIDEVALUE)
        handleError(ErrorMsg.PROVIDEVALUE)
      }
    } catch (error: any) {
      const errorReason = error.reason || ""

      switch (true) {
        case errorReason.includes(ErrorMsg.LOWBALANCE):
          handleError(ErrorMsg.LOWBALANCE)
          break
        case errorReason.includes(ErrorMsg.NOACTIVEGAME):
          handleError(ErrorMsg.NOACTIVEGAME)
          break
        case errorReason.includes(ErrorMsg.SESSIONCOMPLETED):
          handleError(ErrorMsg.SESSIONCOMPLETED)
          break
        default:
          console.error("Unexpected error:", error)
      }
    }
  }

  const handleRemoveBet = async () => {
    try {
      if (value) {
        await WithdrawBet(value)
        setValue("")
        setErrorMessage("")
      } else {
        console.log(ErrorMsg.PROVIDEVALUE)
        handleError(ErrorMsg.PROVIDEVALUE)
      }
    } catch (error: any) {
      const errorReason = error.reason || ""

      switch (true) {
        case errorReason.includes(ErrorMsg.LOWBETBALANCE):
          handleError(ErrorMsg.LOWBETBALANCE)
          break
        case errorReason.includes(ErrorMsg.NOACTIVEGAME):
          handleError(ErrorMsg.NOACTIVEGAME)
          break
        case errorReason.includes(ErrorMsg.NOTPLACEDBET):
          handleError(ErrorMsg.NOTPLACEDBET)
          break
        case errorReason.includes(ErrorMsg.GAMESTARTED):
          handleError(ErrorMsg.GAMESTARTED)
          break
        default:
          console.error("Unexpected error:", error)
      }
    }
  }

  const handleError = (errorMsg: string) => {
    setErrorMessage(errorMsg)
    setErrorVisible(true)
    setTimeout(() => {
      setErrorVisible(false)
    }, 2000)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (checkboxRef.current?.checked && formContainerRef.current && !formContainerRef.current.contains(event.target as Node)) {
      checkboxRef.current.checked = false
    }
  }
  return (
    <div className={styles.betPanelWrapper}>
      <input className={styles.betPanelCheckbox} type="checkbox" id="checkbox" ref={checkboxRef} />
      <div className={styles.betPanelFormContainer} ref={formContainerRef}>
        <form className={styles.betPanelForm}>
          <Input
            customCutClass={styles.cutBet}
            customInputClass={`${styles.inputBet} ${styles.betPanelFormInput} `}
            customPlaceholderClass={styles.placeholderBet}
            customContainerClass={styles.betPanelWrapper}
            value={value}
            onValueChange={(e) => setValue(e)}
          ></Input>
          {errorMessage && <p className={`${styles.errorBet} ${errorVisible ? styles.visible : ""}`}>{errorMessage}</p>}
          <label className={styles.betPanelFormButtonLabel} htmlFor="checkbox">
            <Button customClass={styles.betPanelFormButton} onClick={handleBet}>
              Bet
            </Button>
            <Button customClass={styles.betPanelFormButtonRemove} onClick={handleRemoveBet}>
              X
            </Button>
          </label>
          <label className={styles.betPanelFormToggle} htmlFor="checkbox" data-title="Place bet"></label>
        </form>
      </div>
    </div>
  )
}
