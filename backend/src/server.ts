import express from "express"
import cors from "cors"
import http from "http"
import { Server as SocketIOServer } from "socket.io"
import { eventEmitter } from "./events/gameEvents"
import gameRoutes from "./routes/gameRoutes"
import { initializeEventSubscriptions } from "./config/eventSubscriptions"
import { initializeContract } from "./config/contract"

const app = express()
const server = http.createServer(app)
const io = new SocketIOServer(server, {
  cors: {
    origin: "https://0xwheeloffortune.netlify.app",
  },
})
const PORT = process.env.PORT || 5000

app.use(cors())
app.use("/api", gameRoutes)
app.get("/", (req, res) => {
  res.send("Server is running!")
})

initializeContract()
initializeEventSubscriptions()

io.on("connection", (socket) => {
  console.log("New client connected")

  socket.on("disconnect", () => {
    console.log("Client disconnected")
  })
})

eventEmitter.on("gameUpdate", (update) => {
  io.emit("gameUpdate", update)
})

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
