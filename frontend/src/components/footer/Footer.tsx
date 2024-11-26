import React, { useState } from "react"
import "./footer.css"

export default function Footer() {
  const [activeIndex, setActiveIndex] = useState(null)

  const toggleDropdown = (index: any) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  const items = [
    {
      title: "Правила",
      content: "Здесь вы можете описать правила игры или использования сайта.",
    },
    {
      title: "Кран",
      content: "Вы можете использовать следующий кран для получения эфиров: https://faucet.example",
    },
    {
      title: "Контакты",
      content: "Напишите свои контакты: email@example.com, Telegram: @yourname.",
    },
    {
      title: "О проекте",
      content: "Добавьте описание вашего проекта или полезные ссылки.",
    },
  ]

  return (
    <div className="footer-wrapper">
      {items.map((item, index) => (
        <div key={index} className="footer-item">
          <span onClick={() => toggleDropdown(index)} className="footer-title">
            {item.title}
          </span>
          {activeIndex === index && (
            <div className="footer-dropdown">
              <p>{item.content}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
