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
      title: "Правила",
      content: (
        <ul className="rules-list">
          <li>Подключите ваш криптокошелек MetaMask.</li>
          <li>Получите тестовые ETH через кран в разделе "Кран".</li>
          <li>Сделайте ставку, размер которой определяет ваш шанс на победу.</li>
          <li>Дождитесь завершения игры и проверьте, выиграли ли вы.</li>
        </ul>
      ),
    },
    {
      title: "Кран",
      content: (
        <div className="text-left">
          Для игры вам понадобятся тестовые ETH в сети Sepolia. Вы можете получить их через:
          <br />
          <a href="https://sepolia-faucet.pk910.de/" target="_blank" rel="noopener noreferrer">
            Sepolia Faucet
          </a>
        </div>
      ),
    },
    {
      title: "Контакты",
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
      title: "О проекте",
      content: (
        <div className="text-left">
          Проект "Wheel of Fortune" — это захватывающая игра, которая позволяет пользователям испытать удачу, делая ставки. Основные особенности:
          <ul>
            <li>Честный выбор победителя на основе размера ставки.</li>
            <li>Простой и интуитивно понятный интерфейс.</li>
            <li>Возможность тестирования без использования реальных средств.</li>
          </ul>
          Это уникальная возможность для пользователей познакомиться с технологией блокчейна и испытать азарт без риска!
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
