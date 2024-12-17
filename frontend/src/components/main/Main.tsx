import WheelOfFortune from "../wheelOfFortune/wheelOfFortune"
import styles from "./main.module.css"

export default function Main() {
  return (
    <div className={styles.mainWrapper}>
      <WheelOfFortune />
    </div>
  )
}
