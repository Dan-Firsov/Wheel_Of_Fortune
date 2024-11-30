import { useState, useEffect } from "react"
import "./footer.css"
import { items } from "./staticData"

export default function Footer() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".footer-item")) {
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
    <div className="footer-wrapper">
      {items.map((item, index) => (
        <div key={index} className="footer-item">
          <span onClick={() => toggleDropdown(index)} className="footer-title">
            {item.title}
          </span>
          <div className={`footer-dropdown ${activeIndex === index ? "show" : ""}`}>{item.content}</div>
        </div>
      ))}
    </div>
  )
}
