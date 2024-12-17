import { useState, useEffect } from "react"
import styles from "./footer.module.css"
import { items } from "./staticData"

export default function Footer() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(`.${styles.footerItem}`)) {
        setActiveIndex(null)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const toggleDropdown = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <div className={styles.footerWrapper}>
      {items.map((item, index) => (
        <div key={index} className={styles.footerItem}>
          <span onClick={() => toggleDropdown(index)} className={styles.footerTitle}>
            {item.title}
          </span>
          <div className={`${styles.footerDropdown} ${activeIndex === index ? styles.show : ""}`}>{item.content}</div>
        </div>
      ))}
    </div>
  )
}
