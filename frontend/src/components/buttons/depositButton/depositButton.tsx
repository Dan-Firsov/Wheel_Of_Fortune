import React from "react"
import "./depositButton.css"
import { ReactComponent as MyIcon } from "./assets/wallet.svg"
import Button from "../button/Button"

interface DepositButtonProps {
  onClick: () => void
}

export const DepositButton: React.FC<DepositButtonProps> = ({ onClick }) => (
  <Button onClick={onClick} customClass="button">
    <span className="button__text">Deposit</span>
    <MyIcon />
  </Button>
)
