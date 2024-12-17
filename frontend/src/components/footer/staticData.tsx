import styles from "./footer.module.css"

export const items = [
  {
    title: "Rules",
    content: (
      <ul className={styles.rulesList}>
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
      <div className={styles.textLeft}>
        You need test ETH in the Sepolia network to play. You can get it via:
        <br />
        <a className={styles.externalLink} href="https://sepolia-faucet.pk910.de/" target="_blank" rel="noopener noreferrer">
          Sepolia Faucet
        </a>
      </div>
    ),
  },
  {
    title: "Contacts",
    content: (
      <ul className={styles.contactList}>
        <li>
          LinkedIn:{" "}
          <a className={styles.externalLink} href="https://www.linkedin.com/in/daniel-firsov-8b13a7211/" target="_blank" rel="noopener noreferrer">
            Daniel Firsov
          </a>
        </li>
        <li>
          GitHub:{" "}
          <a className={styles.externalLink} href="https://github.com/Dan-Firsov" target="_blank" rel="noopener noreferrer">
            Dan-Firsov
          </a>
        </li>
        <li>Email: danfirsov.it@gmail.com</li>
        <li>
          Telegram:{" "}
          <a className={styles.externalLink} href="https://t.me/Firsov_2d" target="_blank" rel="noopener noreferrer">
            @Firsov_2d
          </a>
        </li>
      </ul>
    ),
  },
  {
    title: "About the Project",
    content: (
      <div className={styles.textLeft}>
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
