import { useEffect, useRef } from "react"
import styles from "./betPanel.module.css"
import Button from "../../../shared/button/Button"
import Input from "../../../shared/input/Input"
import { useBetActions } from "./useBetActions"

export default function BetPanel() {
  const {value, setValue, errorMessage, errorVisible, handleBet,handleRemoveBet} = useBetActions()
  const checkboxRef = useRef<HTMLInputElement | null>(null)
  const formContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleClickOutside = (event: MouseEvent) => {
    if (checkboxRef.current?.checked && formContainerRef.current && !formContainerRef.current.contains(event.target as Node)) {
      checkboxRef.current.checked = false
    }
  }

  return (
    <div className={styles.betPanelWrapper}>
      <input className={styles.betPanelCheckbox} type="checkbox" id="checkbox" ref={checkboxRef} />
      <div className={styles.betPanelFormContainer} ref={formContainerRef}>
        <form className={styles.betPanelForm} onSubmit={handleBet}>
          <Input
            customCutClass={styles.cutBet}
            customInputClass={`${styles.inputBet} ${styles.betPanelFormInput} `}
            customPlaceholderClass={styles.placeholderBet}
            customContainerClass={styles.betPanelWrapper}
            value={value}
            onValueChange={(e) => setValue(e)}
          ></Input>
          {errorMessage && <p className={`${styles.errorBet} ${errorVisible ? styles.visible : ""}`}>{errorMessage}</p>}
          <label className={styles.betPanelFormButtonLabel} htmlFor="checkbox">
            <Button customClass={styles.betPanelFormButton} onClick={handleBet}>
              Bet
            </Button>
            <Button customClass={styles.betPanelFormButtonRemove} onClick={handleRemoveBet}>
              X
            </Button>
          </label>
          <label className={styles.betPanelFormToggle} htmlFor="checkbox" data-title="Place bet"></label>
        </form>
      </div>
    </div>
  )
}
