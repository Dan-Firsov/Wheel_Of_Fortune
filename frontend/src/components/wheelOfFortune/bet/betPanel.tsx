import { ChangeEvent, useEffect, useRef, useState } from "react"
import { PlaceBet } from "../../../utils/wheelOfForune/placeBet"
import "./betPanel.css"
import { WithdrawBet } from "../../../utils/wheelOfForune/withdrawBet"
import Button from "../../buttons/button/Button"
import Input from "../../input/Input"

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
        console.log("Please provide value.")
        handleError("Please provide value.")
      }
    } catch (error: any) {
      if (error.reason && error.reason.includes("Insufficient funds on balance")) {
        handleError("Insufficient funds on balance")
      }
      if (error.reason && error.reason.includes("No active game sessions")) {
        handleError("No active game sessions")
      }
      if (error.reason && error.reason.includes("Session already completed")) {
        handleError("Session already completed")
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
        console.log("Please provide value.")
        handleError("Please provide value.")
      }
    } catch (error: any) {
      if (error.reason && error.reason.includes("Insufficient bet balance")) {
        handleError("Insufficient bet balance")
      }
      if (error.reason && error.reason.includes("No active game sessions")) {
        handleError("No active game sessions")
      }
      if (error.reason && error.reason.includes("You have not placed any bets")) {
        handleError("You have not placed any bets")
      }
      if (error.reason && error.reason.includes("Game has started")) {
        handleError("Game has started")
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

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value
    newValue = newValue.replace(",", ".")
    const regex = /^\d*\.?\d*$/
    if (regex.test(newValue)) {
      setValue(newValue)
    }
  }
  return (
    <div className="bet-panel-wrapper">
      <input className="c-checkbox" type="checkbox" id="checkbox" ref={checkboxRef} />
      <div className="c-formContainer" ref={formContainerRef}>
        <form className="c-form">
          <Input
            customCutClass="cut-bet"
            customInputClass="input-bet c-form__input"
            customPlaceholderClass="placeholder-bet"
            customContainerClass="bet-panel-wrapper"
            value={value}
            onValueChange={(e) => setValue(e)}
          ></Input>
          {/* <input id="lastname" className="input-bet c-form__input" placeholder=" " autoComplete="off" type="text" value={value} onChange={handleValueChange} />
          <div className="cut-bet"></div>
          <label htmlFor="lastname" className="placeholder-bet">
            Enter value
          </label> */}
          {errorMessage && <p className={`error-bet ${errorVisible ? "visible" : ""}`}>{errorMessage}</p>}
          <label className="c-form__buttonLabel" htmlFor="checkbox">
            <Button customClass="c-form__button" onClick={handleBet}>
              Bet
            </Button>
            <Button customClass="c-form__button_remove" onClick={handleRemoveBet}>
              X
            </Button>
          </label>
          <label className="c-form__toggle" htmlFor="checkbox" data-title="Place bet"></label>
        </form>
      </div>
    </div>
  )
}
