import React from "react"

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
