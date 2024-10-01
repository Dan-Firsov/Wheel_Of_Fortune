import React, { useState } from "react"
import classes from "./WalletButton.module.css"

interface ButtonProps {
  children: React.ReactNode
  onClick: () => Promise<void>
}

export default function Button({ children, onClick }: ButtonProps) {
  const [isPressed, setPressed] = useState(false)

  const handleMouseDown = () => setPressed(true)
  const handleMouseUp = () => setPressed(false)

  return (
    <button onClick={onClick} className={isPressed ? `${classes.button} ${classes.pressed}` : classes.button} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
      {children}
    </button>
  )
}
