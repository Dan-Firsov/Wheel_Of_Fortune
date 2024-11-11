import React, { useState } from "react"
import classes from "./Button.module.css"

interface ButtonProps {
  customClass?: string
  children: React.ReactNode
  onClick: () => Promise<void>
}

export default function Button({ children, onClick, customClass = "" }: ButtonProps) {
  const [isPressed, setPressed] = useState(false)

  const handleMouseDown = () => setPressed(true)
  const handleMouseUp = () => setPressed(false)

  return (
    <button onClick={onClick} className={`${classes.button} ${isPressed ? classes.pressed : ""} ${customClass}`} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
      {children}
    </button>
  )
}
