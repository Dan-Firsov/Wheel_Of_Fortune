import React, { forwardRef } from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  customClass?: string
  children: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ children, customClass = "", ...rest }, ref) => {
  return (
    <button ref={ref} className={customClass} {...rest}>
      {children}
    </button>
  )
})

export default Button
