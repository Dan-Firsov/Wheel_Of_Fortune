import { ChangeEvent, useEffect, useRef, useState } from "react"
import { PlaceBet } from "../../../utils/wheelOfForune/placeBet"
import "./betPanel.css"
import { WithdrawBet } from "../../../utils/wheelOfForune/withdrawBet"

export default function BetPanel() {
  const [value, setValue] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState("")
  const [errorVisible, setErrorVisible] = useState(false)

  const checkboxRef = useRef<HTMLInputElement | null>(null)
  const formContainerRef = useRef<HTMLDivElement | null>(null)

  const handleBet = async () => {
    try {
      if (value) {
        await PlaceBet(value)
        setValue("")
        setErrorMessage("")
      } else {
        console.log("Please provide value.")
        setErrorMessage("Please provide value.")
        setErrorVisible(true)
        setTimeout(() => {
          setErrorVisible(false)
        }, 2000)
      }
    } catch (error: any) {
      if (error.reason && error.reason.includes("Insufficient funds on balance")) {
        setErrorMessage("Insufficient funds on balance")
        setErrorVisible(true)
        setTimeout(() => {
          setErrorVisible(false)
        }, 2000)
      }

      if (error.reason && error.reason.includes("No active game sessions")) {
        setErrorMessage("No active game sessions")
        setErrorVisible(true)
        setTimeout(() => {
          setErrorVisible(false)
        }, 2000)
      }

      if (error.reason && error.reason.includes("Session already completed")) {
        setErrorMessage("Session already completed")
        setErrorVisible(true)
        setTimeout(() => {
          setErrorVisible(false)
        }, 2000)
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
        setErrorMessage("Please provide value.")
        setErrorVisible(true)
        setTimeout(() => {
          setErrorVisible(false)
        }, 2000)
      }
    } catch (error: any) {
      if (error.reason && error.reason.includes("Insufficient bet balance")) {
        setErrorMessage("Insufficient bet balance")
        setErrorVisible(true)
        setTimeout(() => {
          setErrorVisible(false)
        }, 2000)
      }

      if (error.reason && error.reason.includes("No active game sessions")) {
        setErrorMessage("No active game sessions")
        setErrorVisible(true)
        setTimeout(() => {
          setErrorVisible(false)
        }, 2000)
      }
      if (error.reason && error.reason.includes("You have not placed any bets")) {
        setErrorMessage("You have not placed any bets")
        setErrorVisible(true)
        setTimeout(() => {
          setErrorVisible(false)
        }, 2000)
      }

      if (error.reason && error.reason.includes("Game has started")) {
        setErrorMessage("Game has started")
        setErrorVisible(true)
        setTimeout(() => {
          setErrorVisible(false)
        }, 2000)
      }
    }
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (checkboxRef.current?.checked && formContainerRef.current && !formContainerRef.current.contains(event.target as Node)) {
      checkboxRef.current.checked = false
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

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
          <input id="lastname" className="input-bet c-form__input" placeholder=" " autoComplete="off" type="text" value={value} onChange={handleValueChange} />
          <div className="cut-bet"></div>
          <label htmlFor="lastname" className="placeholder-bet">
            Enter value
          </label>
          {errorMessage && <p className={`error-bet ${errorVisible ? "visible" : ""}`}>{errorMessage}</p>}
          <label className="c-form__buttonLabel" htmlFor="checkbox">
            <button className="c-form__button" type="button" onClick={handleBet}>
              Bet
            </button>

            <button className="c-form__button_remove" type="button" onClick={handleRemoveBet}>
              X
            </button>
          </label>
          <label className="c-form__toggle" htmlFor="checkbox" data-title="Place bet"></label>
        </form>
      </div>
    </div>
  )
}
