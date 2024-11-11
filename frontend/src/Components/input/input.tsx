import { ChangeEvent } from "react"
import styles from "./input.module.css"

interface InputProps {
  className?: string
  value: string
  onValueChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export default function Input({ value, onValueChange }: InputProps) {
  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    const regex = /^\d*\.?\d*$/
    if (regex.test(newValue)) {
      onValueChange(e)
    }
  }
  return (
    <div>
      <input className={styles.customInput} type="text" placeholder="Enter value" value={value} onChange={handleValueChange} />
    </div>
  )
}
