import React, { useState, useEffect } from "react"
import "./footer.css"

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

  const items = [
    {
      title: "Rules",
      content: (
        <ul className="rules-list">
          <li>Connect your MetaMask crypto wallet.</li>
          <li>Get test ETH through the faucet in the "Faucet" section.</li>
          <li>Place a bet; the amount determines your chance of winning.</li>
          <li>Wait for the game to end and check if you've won.</li>
        </ul>
      ),
    },
    {
      title: "Faucet",
      content: (
        <div className="text-left">
          You need test ETH in the Sepolia network to play. You can get it via:
          <br />
          <a href="https://sepolia-faucet.pk910.de/" target="_blank" rel="noopener noreferrer">
            Sepolia Faucet
          </a>
        </div>
      ),
    },
    {
      title: "Contacts",
      content: (
        <ul className="contact-list">
          <li>
            LinkedIn:{" "}
            <a href="https://www.linkedin.com/in/daniel-firsov-8b13a7211/" target="_blank" rel="noopener noreferrer">
              Daniel Firsov
            </a>
          </li>
          <li>
            GitHub:{" "}
            <a href="https://github.com/Dan-Firsov" target="_blank" rel="noopener noreferrer">
              Dan-Firsov
            </a>
          </li>
          <li>Email: danfirsov.it@gmail.com</li>
          <li>
            Telegram:{" "}
            <a href="https://t.me/Firsov_2d" target="_blank" rel="noopener noreferrer">
              @Firsov_2d
            </a>
          </li>
        </ul>
      ),
    },
    {
      title: "About the Project",
      content: (
        <div className="text-left">
          The "Wheel of Fortune" project is an exciting game that allows users to test their luck by placing bets. Key features include:
          <ul>
            <li>Fair winner selection based on bet size.</li>
            <li>Simple and intuitive interface.</li>
            <li>Testing without using real funds.</li>
          </ul>
          This is a unique opportunity for users to explore blockchain technology and enjoy the thrill of gaming without risk!
        </div>
      ),
    },
  ]
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
