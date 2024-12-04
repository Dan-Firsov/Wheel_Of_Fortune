import React, { forwardRef } from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  customClass?: string
  children: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ children, onClick, customClass = "", ...rest }, ref) => {
  return (
    <button ref={ref} onClick={onClick} className={customClass} {...rest}>
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button
