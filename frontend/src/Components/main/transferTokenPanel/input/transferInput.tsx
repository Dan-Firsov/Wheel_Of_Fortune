import { ChangeEvent } from "react"

interface TransferInputProps {
  recipient: string
  value: string
  onRecipientChange: (e: ChangeEvent<HTMLInputElement>) => void
  onValueChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export default function TransferInput({ recipient, value, onRecipientChange, onValueChange }: TransferInputProps) {
  const handleRecipientChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    const regex = /^[a-zA-Z0-9\s]*$/
    if (regex.test(newValue)) {
      onRecipientChange(e)
    }
  }

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    const regex = /^\d*$/
    if (regex.test(newValue)) {
      onValueChange(e)
    }
  }
  return (
    <div>
      <input type="text" placeholder="Enter recipient address" value={recipient} onChange={handleRecipientChange} />
      <input type="text" placeholder="Enter value" value={value} onChange={handleValueChange} />
    </div>
  )
}
