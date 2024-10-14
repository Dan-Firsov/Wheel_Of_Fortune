import { ChangeEvent } from "react"

interface TransferInputProps {
  value: string
  onValueChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export default function DepositInput({ value, onValueChange }: TransferInputProps) {
  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    const regex = /^\d*$/
    if (regex.test(newValue)) {
      onValueChange(e)
    }
  }
  return (
    <div>
      <input type="text" placeholder="Enter value" value={value} onChange={handleValueChange} />
    </div>
  )
}
