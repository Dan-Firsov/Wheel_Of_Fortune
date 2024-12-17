import { ChangeEvent, useEffect, useRef, useState } from "react"
import { PlaceBet } from "../../../utils/wheelOfForune/placeBet"
import "./betPanel.css"
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
    <div className="bet-panel-wrapper">
      <input className="bet-panel-checkbox" type="checkbox" id="checkbox" ref={checkboxRef} />
      <div className="bet-panel-formContainer" ref={formContainerRef}>
        <form className="bet-panel-form">
          <Input
            customCutClass="cut-bet"
            customInputClass="input-bet bet-panel-form__input"
            customPlaceholderClass="placeholder-bet"
            customContainerClass="bet-panel-wrapper"
            value={value}
            onValueChange={(e) => setValue(e)}
          ></Input>
          {errorMessage && <p className={`error-bet ${errorVisible ? "visible" : ""}`}>{errorMessage}</p>}
          <label className="bet-panel-form__buttonLabel" htmlFor="checkbox">
            <Button customClass="bet-panel-form__button" onClick={handleBet}>
              Bet
            </Button>
            <Button customClass="bet-panel-form__button_remove" onClick={handleRemoveBet}>
              X
            </Button>
          </label>
          <label className="bet-panel-form__toggle" htmlFor="checkbox" data-title="Place bet"></label>
        </form>
      </div>
    </div>
  )
}
