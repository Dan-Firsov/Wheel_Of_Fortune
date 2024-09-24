import React from "react"
import logo from "./logo.svg"
import "./App.css"
import Header from "./Components/Header"
import ConnectWallet from "./Components/ConnectWallet"
import { DiscoverWalletProviders } from "./Components/DiscoverWalletProviders"
function App() {
  return (
    <div className="App">
      <Header></Header>
      <ConnectWallet></ConnectWallet>
    </div>
  )
}

export default App
