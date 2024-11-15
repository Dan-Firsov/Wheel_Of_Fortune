import { ChangeEvent, useEffect, useRef, useState } from "react"
import { PlaceBet } from "../../../utils/wheelOfForune/placeBet"
import "./betPanel.css"
import Input from "../../input/input"

export default function BetPanel() {
  const [value, setValue] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState("")
  const checkboxRef = useRef<HTMLInputElement | null>(null)
  const formContainerRef = useRef<HTMLDivElement | null>(null)

  const handleBet = async () => {
    try {
      if (value) {
        await PlaceBet(value)
        setErrorMessage("")
      } else {
        console.log("Please provide value.")
        setErrorMessage("Please provide value.")
      }
    } catch (error: any) {
      if (error.reason && error.reason.includes("Insufficient funds on balance")) {
        setErrorMessage("Insufficient funds on balance")
      }

      if (error.reason && error.reason.includes("No active game sessions")) {
        setErrorMessage("No active game sessions")
      }

      if (error.reason && error.reason.includes("Session already completed")) {
        setErrorMessage("Session already completed")
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
          <input id="lastname" className="input c-form__input" placeholder=" " autoComplete="off" type="text" value={value} onChange={handleValueChange} />
          <div className="cut"></div>
          <label htmlFor="lastname" className="placeholder">
            Enter value
          </label>

          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

          <label className="c-form__buttonLabel" htmlFor="checkbox">
            <button className="c-form__button" type="button" onClick={handleBet}>
              Bet
            </button>
          </label>
          <label className="c-form__toggle" htmlFor="checkbox" data-title="Place bet"></label>
        </form>
      </div>
    </div>
  )
}
