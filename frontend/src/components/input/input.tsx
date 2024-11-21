import { ChangeEvent } from "react"
import "./input.css"

interface InputProps {
  customClass?: string
  value: string
  onValueChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export default function Input({ value, onValueChange, customClass }: InputProps) {
  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value
    newValue = newValue.replace(",", ".")
    const regex = /^\d*\.?\d*$/
    if (regex.test(newValue)) {
      onValueChange(e)
    }
  }
  return (
    <div className={`input-container ${customClass || ""}`}>
      <input id="lastname" className="input" type="text" placeholder=" " autoComplete="off" value={value} onChange={handleValueChange} />
      <div className="cut"></div>
      <label htmlFor="lastname" className="placeholder">
        Enter value
      </label>
    </div>
  )
}
