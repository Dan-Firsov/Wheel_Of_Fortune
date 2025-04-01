import { WagmiProvider } from "wagmi"
import "./App.css"
import Footer from "./components/footer/Footer"
import Header from "./components/header/Header"
import Main from "./components/main/Main"
import { config } from "./wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <WagmiProvider config={config}>
    <div className="app">
      <Header />
      <Main />
      <Footer />
    </div>
    </WagmiProvider>
    </QueryClientProvider>
  )
}

export default App
