import TransferTokenPanel from "./transferTokenPanel/transferTokenPanel"
import DepositPanel from "../wheelOfFortune/deposit/depositPanel"
import WithdrawPanel from "../wheelOfFortune/withdraw/withdrawPanel"
import BetPanel from "../wheelOfFortune/bet/betPanel"

export default function Main() {
  return (
    <div className="container">
      <DepositPanel></DepositPanel>
      <WithdrawPanel></WithdrawPanel>
    </div>
  )
}
