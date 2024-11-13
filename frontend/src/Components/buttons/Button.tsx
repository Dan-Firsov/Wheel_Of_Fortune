import React from "react"
import classes from "./Button.module.css"

interface ButtonProps {
  customClass?: string
  children: React.ReactNode
  onClick: () => void | Promise<void>
}

export default function Button({ children, onClick, customClass = "" }: ButtonProps) {
  return (
    <button onClick={onClick} className={customClass}>
      {children}
    </button>
  )
}
